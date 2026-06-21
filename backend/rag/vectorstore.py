# # used googe embedding model

# # ── Updated version 2 ────────────────────────────────────────────────────────────────────
# import os 
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_community.vectorstores import FAISS
# # from langchain_community.embeddings import HuggingFaceEmbeddings
# FAISS_PATH = os.getenv("FAISS_PATH", "faiss_index")
# _vectorstore = None


# def _get_embeddings():
#     return GoogleGenerativeAIEmbeddings(
#         model="models/gemini-embedding-001",
#         google_api_key=os.getenv("GOOGLE_API_KEY"),
#     )

# #using huggingface 
# # def _get_embeddings():
# #     return HuggingFaceEmbeddings(
# #         model_name="sentence-transformers/all-MiniLM-L6-v2",
# #         model_kwargs={"device": "cpu"},
# #         encode_kwargs={"normalize_embeddings": True},
# #     )

# def build_vectorstore(docs):
#     global _vectorstore
#     embeddings = _get_embeddings()
#     _vectorstore = FAISS.from_documents(docs, embeddings)
#     _vectorstore.save_local(FAISS_PATH)   # persist to disk
#     print(f"💾 FAISS index saved — {len(docs)} chunks")   # new update v2
#     return _vectorstore


# def load_vectorstore():
#     """Called on startup — reload index if it exists on disk."""
#     global _vectorstore
#     if os.path.exists(FAISS_PATH):
#         try:
#             embeddings = _get_embeddings()
#             _vectorstore = FAISS.load_local(
#                 FAISS_PATH, embeddings, allow_dangerous_deserialization=True
#             )
#             print(f"✅ FAISS index loaded from {FAISS_PATH}")
#         except Exception as e:
#             print(f"⚠️  Could not load FAISS index: {e}")


# def get_vectorstore():
#     return _vectorstore


# # new update version 2.0 - reset
# def _reset_vectorstore():
#     global _vectorstore
#     _vectorstore = None
#     print("🗑️  FAISS index cleared from memory")






















# final update
# used hugging face embedding model
# import os
# import shutil

# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.vectorstores import FAISS

# FAISS_PATH = os.getenv("FAISS_PATH", "faiss_index")

# _vectorstore = None
# _embeddings = None


# # EMBEDDINGS

# def _get_embeddings():

#     global _embeddings
#     if _embeddings is None:

#         _embeddings = HuggingFaceEmbeddings(
#             model_name="sentence-transformers/all-MiniLM-L6-v2",
#             model_kwargs={"device": "cpu"},
#             encode_kwargs={"normalize_embeddings": True},
#         )

#         print("✅ HuggingFace embeddings loaded")

#     return _embeddings

# # def _get_embeddings():
# #     return GoogleGenerativeAIEmbeddings(
# #         model="models/gemini-embedding-001",
# #         google_api_key=os.getenv("GOOGLE_API_KEY"),
# #     )

# # BUILD / APPEND VECTORSTORE
# def build_vectorstore(docs):

#     global _vectorstore
#     embeddings = _get_embeddings()
#     index_file = os.path.join(FAISS_PATH, "index.faiss")


#     # LOAD EXISTING INDEX
#     if os.path.exists(index_file):

#         try:
#             _vectorstore = FAISS.load_local(
#                 FAISS_PATH,
#                 embeddings,
#                 allow_dangerous_deserialization=True
#             )
#             print("✅ Existing FAISS loaded")

           
#             # REMOVE DUPLICATE FILES
#             existing_sources = set()

#             for d in _vectorstore.docstore._dict.values():
#                 source = d.metadata.get("source")
#                 if source:
#                     existing_sources.add(source)

#             new_docs = [
#                 d for d in docs
#                 if d.metadata.get("source") not in existing_sources
#             ]

#             if not new_docs:

#                 print("⚠️ All uploaded documents already exist")
#                 return _vectorstore


#             # APPEND NEW DOCS
#             _vectorstore.add_documents(new_docs)

#             print(f"➕ Added {len(new_docs)} new chunks")

#         except Exception as e:

#             print(f"⚠️ Error loading FAISS: {e}")

#             print("🆕 Creating fresh FAISS index")

#             _vectorstore = FAISS.from_documents(
#                 docs,
#                 embeddings
#             )

#     else:
#         _vectorstore = FAISS.from_documents(
#             docs,
#             embeddings
#         )
#         print("🆕 New FAISS index created")


#     # SAVE INDEX

#     _vectorstore.save_local(FAISS_PATH)

#     print("💾 FAISS index saved")
#     print(f"📦 Total vectors in DB: {_vectorstore.index.ntotal}")

#     return _vectorstore



# # LOAD VECTORSTORE ON STARTUP

# def load_vectorstore():

#     global _vectorstore
#     embeddings = _get_embeddings()
#     index_file = os.path.join(FAISS_PATH, "index.faiss")
#     if os.path.exists(index_file):

#         try:

#             _vectorstore = FAISS.load_local(
#                 FAISS_PATH,
#                 embeddings,
#                 allow_dangerous_deserialization=True
#             )

#             print(f"✅ FAISS index loaded from {FAISS_PATH}")
#             print(f"📦 Total vectors: {_vectorstore.index.ntotal}")

#         except Exception as e:

#             print(f"⚠️ Could not load FAISS index: {e}")

#     else:

#         print("ℹ️ No existing FAISS index found")


# # GET VECTORSTORE

# def get_vectorstore():

#     return _vectorstore

# # RESET VECTORSTORE

# def reset_vectorstore():

#     global _vectorstore
#     _vectorstore = None
#     if os.path.exists(FAISS_PATH):
#         shutil.rmtree(FAISS_PATH)
#         print("🗑️ FAISS index deleted from disk")

#     print("🗑️ Vectorstore cleared from memory")










# v3 adding session isolation with google authentication

import os
import re
import shutil

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

FAISS_BASE = os.getenv("FAISS_PATH", "faiss_indexes")

# Per-session in-memory cache: { session_id: FAISS }
_vectorstores: dict = {}
_embeddings = None


# ── EMBEDDINGS ──────────────────────────────────────────────────────────────

def _get_embeddings():
    global _embeddings
    if _embeddings is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
        print("✅ HuggingFace embeddings loaded")
    return _embeddings

# def _get_embeddings():
#     return GoogleGenerativeAIEmbeddings(
#         model="models/gemini-embedding-001",
#         google_api_key=os.getenv("GOOGLE_API_KEY"),
#     )


# ── SESSION PATH HELPERS ─────────────────────────────────────────────────────

def _sanitize_session_id(session_id: str) -> str:
    """Prevent path traversal — only allow safe UUID-like characters."""
    cleaned = re.sub(r"[^a-zA-Z0-9_-]", "", session_id)
    if not cleaned or len(cleaned) > 100:
        raise ValueError("Invalid session_id")
    return cleaned


def _session_path(session_id: str) -> str:
    safe_id = _sanitize_session_id(session_id)
    return os.path.join(FAISS_BASE, safe_id)


# ── BUILD / APPEND VECTORSTORE (per session) ─────────────────────────────────

def build_vectorstore(session_id: str, docs):
    """Create, or append to, the FAISS index for this session."""
    embeddings = _get_embeddings()
    session_path = _session_path(session_id)
    index_file = os.path.join(session_path, "index.faiss")

    vectorstore = None

    # LOAD EXISTING INDEX FOR THIS SESSION
    if os.path.exists(index_file):
        try:
            vectorstore = FAISS.load_local(
                session_path,
                embeddings,
                allow_dangerous_deserialization=True
            )
            print(f"✅ Existing FAISS loaded — session={session_id[:8]}…")

            # REMOVE DUPLICATE FILES (dedupe by source within this session only)
            existing_sources = set()
            for d in vectorstore.docstore._dict.values():
                source = d.metadata.get("source")
                if source:
                    existing_sources.add(source)

            new_docs = [
                d for d in docs
                if d.metadata.get("source") not in existing_sources
            ]

            if not new_docs:
                print(f"⚠️ All uploaded documents already exist — session={session_id[:8]}…")
                _vectorstores[session_id] = vectorstore
                return vectorstore

            # APPEND NEW DOCS
            vectorstore.add_documents(new_docs)
            print(f"➕ Added {len(new_docs)} new chunks — session={session_id[:8]}…")

        except Exception as e:
            print(f"⚠️ Error loading FAISS: {e}")
            print(f"🆕 Creating fresh FAISS index — session={session_id[:8]}…")
            vectorstore = FAISS.from_documents(docs, embeddings)

    else:
        vectorstore = FAISS.from_documents(docs, embeddings)
        print(f"🆕 New FAISS index created — session={session_id[:8]}…")

    # SAVE INDEX
    os.makedirs(session_path, exist_ok=True)
    vectorstore.save_local(session_path)
    _vectorstores[session_id] = vectorstore

    print(f"💾 FAISS index saved — session={session_id[:8]}…")
    print(f"📦 Total vectors in DB: {vectorstore.index.ntotal}")

    return vectorstore


# ── LOAD VECTORSTORE ON DEMAND (per session) ─────────────────────────────────

def load_vectorstore(session_id: str):
    embeddings = _get_embeddings()
    session_path = _session_path(session_id)
    index_file = os.path.join(session_path, "index.faiss")

    if os.path.exists(index_file):
        try:
            vectorstore = FAISS.load_local(
                session_path,
                embeddings,
                allow_dangerous_deserialization=True
            )
            _vectorstores[session_id] = vectorstore
            print(f"✅ FAISS index loaded — session={session_id[:8]}…")
            print(f"📦 Total vectors: {vectorstore.index.ntotal}")
            return vectorstore

        except Exception as e:
            print(f"⚠️ Could not load FAISS index: {e}")
            return None
    else:
        print(f"ℹ️ No existing FAISS index found — session={session_id[:8]}…")
        return None


# ── GET VECTORSTORE (cache first, fallback to disk) ──────────────────────────

def get_vectorstore(session_id: str):
    if session_id not in _vectorstores:
        return load_vectorstore(session_id)
    return _vectorstores.get(session_id)


# ── RESET VECTORSTORE (per session) ──────────────────────────────────────────

def reset_vectorstore(session_id: str):
    _vectorstores.pop(session_id, None)
    session_path = _session_path(session_id)

    if os.path.exists(session_path):
        shutil.rmtree(session_path)
        print(f"🗑️ FAISS index deleted from disk — session={session_id[:8]}…")

    print(f"🗑️ Vectorstore cleared from memory — session={session_id[:8]}…")