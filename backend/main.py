
# v5 -updated latest
import os
import shutil
import tempfile
from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import re

from db.database import init_db, get_db, UploadedFile, QueryHistory, ChatSession
from rag.loader import load_and_split_pdfs
from rag.vectorstore import build_vectorstore, get_vectorstore, reset_vectorstore
from rag.retriever import hybrid_search
from agents.react_agent import run_agent
from agents.summarizer import summarize_document
from tools.search_tool import web_search as do_web_search

load_dotenv()

app = FastAPI(
    title="NexusAI API",
    description="NexusAI — AI RAG Research Engine (anonymous session isolation)",
    version="2.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-Session-ID"],
)


# ── Session ID validation ─────────────────────────────────────────────────────
SESSION_ID_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{8,100}$")

def get_session_id(x_session_id: str = Header(..., alias="X-Session-ID")) -> str:
    if not x_session_id or not SESSION_ID_PATTERN.match(x_session_id):
        raise HTTPException(status_code=400, detail="Missing or invalid X-Session-ID header.")
    return x_session_id


# ── Rate limiter — scoped by session_id ──────────────────────────────────────
_request_counts = defaultdict(list)

def rate_limit(session_id: str, max_requests: int = 30, window_minutes: int = 1):
    now = datetime.utcnow()
    win = now - timedelta(minutes=window_minutes)
    _request_counts[session_id] = [t for t in _request_counts[session_id] if t > win]
    if len(_request_counts[session_id]) >= max_requests:
        raise HTTPException(
            status_code=429,
            detail=f"Too many requests. Max {max_requests} per {window_minutes} min."
        )
    _request_counts[session_id].append(now)


@app.on_event("startup")
def on_startup():
    init_db()
    print("🚀 NexusAI API started — anonymous session mode")


class QueryRequest(BaseModel):
    query:   str
    use_web: bool = False
    chat_id: Optional[int] = None

class WebSearchRequest(BaseModel):
    query: str


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "NexusAI API running", "version": "2.0.0"}


@app.get("/health")
def health(
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    file_count  = db.query(UploadedFile).filter(UploadedFile.session_id == session_id).count()
    query_count = db.query(QueryHistory).filter(QueryHistory.session_id == session_id).count()
    vs = get_vectorstore(session_id)
    return {
        "status":        "healthy",
        "version":       "2.0.0",
        "session":       session_id[:8] + "…",
        "vector_store":  "loaded" if vs else "empty",
        "files_indexed": file_count,
        "total_queries": query_count,
    }


# ── Upload ────────────────────────────────────────────────────────────────────
@app.post("/upload")
async def upload_pdfs(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    rate_limit(session_id, max_requests=10, window_minutes=1)

    MAX_FILE_SIZE_MB = 10
    MAX_FILES        = 20

    if len(files) > MAX_FILES:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_FILES} files per upload.")

    for file in files:
        size_mb = (file.size or 0) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(status_code=400, detail=f"'{file.filename}' exceeds {MAX_FILE_SIZE_MB}MB.")

    tmp_paths = []

    try:
        for file in files:
            suffix = os.path.splitext(file.filename)[1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                shutil.copyfileobj(file.file, tmp)
                tmp_paths.append({"tmp": tmp.name, "name": file.filename, "size": file.size or 0})

        docs = load_and_split_pdfs(
            paths=[f["tmp"] for f in tmp_paths],
            original_names=[f["name"] for f in tmp_paths],
        )
        if not docs:
            raise HTTPException(status_code=400, detail="No text could be extracted.")

        # Build / append FAISS index scoped to this session
        build_vectorstore(session_id, docs)

        chunk_map = {}
        for doc in docs:
            src = doc.metadata.get("source", "")
            chunk_map[src] = chunk_map.get(src, 0) + 1

        saved = []
        for f in tmp_paths:
            chunks  = chunk_map.get(f["name"], 0)
            size_kb = round((f["size"] or 0) / 1024, 2)

            file_docs = [d for d in docs if d.metadata.get("source") == f["name"]]
            summary   = summarize_document(file_docs[:6])

            record = UploadedFile(
                session_id=session_id,
                filename=f["name"], chunks=chunks,
                size_kb=size_kb, summary=summary,
            )
            db.add(record)
            db.flush()
            saved.append(record.to_dict())

        db.commit()
        print(f"✅ [{session_id[:8]}…] Upload — {len(files)} files, {len(docs)} chunks")
        return {"message": f"✅ Processed {len(files)} file(s)", "files": saved}

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        for f in tmp_paths:
            try: os.unlink(f["tmp"])
            except: pass


# ── Files ─────────────────────────────────────────────────────────────────────
@app.get("/files")
def list_files(
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    files = (
        db.query(UploadedFile)
        .filter(UploadedFile.session_id == session_id)
        .order_by(UploadedFile.uploaded_at.desc())
        .all()
    )
    return {"files": [f.to_dict() for f in files]}


@app.delete("/files/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    record = db.query(UploadedFile).filter(
        UploadedFile.id == file_id,
        UploadedFile.session_id == session_id,   # ownership check
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="File not found.")

    filename = record.filename
    db.delete(record)
    db.commit()

    vs = get_vectorstore(session_id)
    if vs:
        try:
            all_docs  = list(vs.docstore._dict.values())
            remaining = [d for d in all_docs if d.metadata.get("source") != filename]
            if remaining:
                build_vectorstore(session_id, remaining)
            else:
                reset_vectorstore(session_id)
        except Exception as e:
            print(f"⚠️ FAISS rebuild warning: {e}")

    return {"message": f"✅ Deleted '{filename}'"}


# ── Query ─────────────────────────────────────────────────────────────────────
@app.post("/query")
async def query(
    req: QueryRequest,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    rate_limit(session_id, max_requests=20, window_minutes=1)

    vs = get_vectorstore(session_id)
    if vs is None:
        raise HTTPException(status_code=400, detail="No documents uploaded yet.")

    chat_id = req.chat_id
    if not chat_id:
        chat = ChatSession(session_id=session_id, title=req.query[:60])
        db.add(chat); db.flush()
        chat_id = chat.id
    else:
        chat = db.query(ChatSession).filter(
            ChatSession.id == chat_id,
            ChatSession.session_id == session_id,   # ownership check
        ).first()
        if not chat:
            chat = ChatSession(session_id=session_id, title=req.query[:60])
            db.add(chat); db.flush()
            chat_id = chat.id

    context = hybrid_search(req.query, vs)
    answer, sources, web_results = run_agent(req.query, context, use_web=req.use_web)

    record = QueryHistory(
        session_id=session_id,
        chat_id=chat_id,
        query=req.query, answer=answer,
        sources=sources, web_results=web_results,
        use_web=str(req.use_web),
    )
    db.add(record)
    db.commit()

    return {
        "answer":      answer,
        "sources":     sources,
        "web_results": web_results,
        "chat_id":     chat_id,
    }


# ── Web Search ────────────────────────────────────────────────────────────────
@app.post("/websearch")
async def web_search_endpoint(
    req: WebSearchRequest,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    rate_limit(session_id, max_requests=15, window_minutes=1)
    results = do_web_search(req.query)

    record = QueryHistory(
        session_id=session_id, chat_id=None,
        query=req.query, answer="[Web Search]",
        sources=[], web_results=results, use_web="true",
    )
    db.add(record)
    db.commit()

    return {"results": results, "doc_context": []}


# ── Chats ─────────────────────────────────────────────────────────────────────
@app.get("/chats")
def list_chats(
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    chats = (
        db.query(ChatSession)
        .filter(ChatSession.session_id == session_id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )
    return {"chats": [c.to_dict() for c in chats]}


@app.get("/chats/{chat_id}/messages")
def get_chat_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    chat = db.query(ChatSession).filter(
        ChatSession.id == chat_id,
        ChatSession.session_id == session_id,
    ).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")

    messages = (
        db.query(QueryHistory)
        .filter(
            QueryHistory.chat_id == chat_id,
            QueryHistory.session_id == session_id,
        )
        .order_by(QueryHistory.created_at.asc())
        .all()
    )
    return {"messages": [m.to_dict() for m in messages]}


@app.delete("/chats/{chat_id}")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    chat = db.query(ChatSession).filter(
        ChatSession.id == chat_id,
        ChatSession.session_id == session_id,
    ).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")

    db.query(QueryHistory).filter(QueryHistory.chat_id == chat_id).delete()
    db.delete(chat)
    db.commit()
    return {"message": "Chat deleted"}


# ── History ───────────────────────────────────────────────────────────────────
@app.get("/history")
def get_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    rows = (
        db.query(QueryHistory)
        .filter(QueryHistory.session_id == session_id)
        .order_by(QueryHistory.created_at.desc())
        .limit(limit)
        .all()
    )
    return {"history": [r.to_dict() for r in rows]}


@app.delete("/history")
def clear_history(
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
):
    db.query(QueryHistory).filter(QueryHistory.session_id == session_id).delete()
    db.commit()
    return {"message": "History cleared"}