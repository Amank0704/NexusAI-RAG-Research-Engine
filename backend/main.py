


#Update version 4
# removed document cross reference for websearch 
# (fix chunk counting + add delete endpoint)
# new update version 3 - Adding new end point 
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
import shutil
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from db.database import init_db, get_db, UploadedFile, QueryHistory, ChatSession
from rag.loader import load_and_split_pdfs
from rag.vectorstore import build_vectorstore, load_vectorstore, get_vectorstore
from rag.retriever import hybrid_search
from agents.react_agent import run_agent
from tools.search_tool import web_search as do_web_search
from agents.summarizer import summarize_document

load_dotenv()

app = FastAPI(title="Nexus RAG Agent API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()
    load_vectorstore()


# ── Schemas ───────────────────────────────────────────────────────────────────
class QueryRequest(BaseModel):
    query:      str
    use_web:    bool = False
    session_id: Optional[int] = None

class WebSearchRequest(BaseModel):
    query: str

class NewSessionRequest(BaseModel):
    title: Optional[str] = "New Chat"


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "Nexus RAG API running"}
@app.get("/health")
def health():
    return {"status": "healthy"}

# ── Upload ────────────────────────────────────────────────────────────────────
@app.post("/upload")
async def upload_pdfs(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
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

        build_vectorstore(docs)

        chunk_map = {}
        for doc in docs:
            src = doc.metadata.get("source", "")
            chunk_map[src] = chunk_map.get(src, 0) + 1

        saved = []
        for f in tmp_paths:
            chunks = chunk_map.get(f["name"], 0)

            # Auto-summarize
            file_docs = [d for d in docs if d.metadata.get("source") == f["name"]]
            summary = summarize_document(file_docs[:6])  # first 6 chunks

            record = UploadedFile(
                filename=f["name"],
                chunks=chunks,
                size_kb=round((f["size"] or 0) / 1024, 2),
                summary=summary,
            )
            db.add(record)
            db.flush()
            saved.append({**record.to_dict()})

        db.commit()
        return {"message": f"✅ Processed {len(files)} file(s)", "files": saved}

    finally:
        for f in tmp_paths:
            try: os.unlink(f["tmp"])
            except: pass


# ── Files ─────────────────────────────────────────────────────────────────────
@app.get("/files")
def list_files(db: Session = Depends(get_db)):
    files = db.query(UploadedFile).order_by(UploadedFile.uploaded_at.desc()).all()
    return {"files": [f.to_dict() for f in files]}


@app.delete("/files/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db)):
    record = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")
    filename = record.filename
    db.delete(record)
    db.commit()

    vs = get_vectorstore()
    if vs:
        try:
            all_docs = list(vs.docstore._dict.values())
            remaining = [d for d in all_docs if d.metadata.get("source") != filename]
            if remaining:
                build_vectorstore(remaining)
            else:
                from rag.vectorstore import _reset_vectorstore
                _reset_vectorstore()
        except Exception as e:
            print(f"⚠️ FAISS rebuild: {e}")

    return {"message": f"✅ Deleted '{filename}'"}


# ── Query (RAG) ───────────────────────────────────────────────────────────────
@app.post("/query")
async def query(req: QueryRequest, db: Session = Depends(get_db)):
    vs = get_vectorstore()
    if vs is None:
        raise HTTPException(status_code=400, detail="No documents uploaded yet.")

    # Auto-create session if none provided
    session_id = req.session_id
    if not session_id:
        session = ChatSession(title=req.query[:60])
        db.add(session)
        db.flush()
        session_id = session.id
    else:
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not session:
            session = ChatSession(title=req.query[:60])
            db.add(session)
            db.flush()
            session_id = session.id

    context = hybrid_search(req.query, vs)
    answer, sources, web_results = run_agent(req.query, context, use_web=req.use_web)

    record = QueryHistory(
        session_id=session_id,
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
        "session_id":  session_id,
    }


# ── Web Search ────────────────────────────────────────────────────────────────
@app.post("/websearch")
async def web_search_endpoint(req: WebSearchRequest, db: Session = Depends(get_db)):
    results = do_web_search(req.query)

   

    record = QueryHistory(
        session_id=None,
        query=req.query, answer="[Web Search]",
        sources=[], web_results=results,
        use_web="true",
    )
    db.add(record)
    db.commit()

    return {"results": results, "doc_context": []}


# ── Chat Sessions ──────────────────────────────────────────────────────────────
@app.post("/sessions")
def create_session(req: NewSessionRequest, db: Session = Depends(get_db)):
    session = ChatSession(title=req.title)
    db.add(session)
    db.commit()
    return session.to_dict()


@app.get("/sessions")
def list_sessions(db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).order_by(ChatSession.updated_at.desc()).all()
    return {"sessions": [s.to_dict() for s in sessions]}


@app.get("/sessions/{session_id}/messages")
def get_session_messages(session_id: int, db: Session = Depends(get_db)):
    messages = (
        db.query(QueryHistory)
        .filter(QueryHistory.session_id == session_id)
        .order_by(QueryHistory.created_at.asc())
        .all()
    )
    return {"messages": [m.to_dict() for m in messages]}


@app.delete("/sessions/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    db.query(QueryHistory).filter(QueryHistory.session_id == session_id).delete()
    db.query(ChatSession).filter(ChatSession.id == session_id).delete()
    db.commit()
    return {"message": "Session deleted"}


# ── History ───────────────────────────────────────────────────────────────────
@app.get("/history")
def get_history(limit: int = 20, db: Session = Depends(get_db)):
    rows = db.query(QueryHistory).order_by(QueryHistory.created_at.desc()).limit(limit).all()
    return {"history": [r.to_dict() for r in rows]}


@app.delete("/history")
def clear_history(db: Session = Depends(get_db)):
    db.query(QueryHistory).delete()
    db.query(ChatSession).delete()
    db.commit()
    return {"message": "History cleared"}