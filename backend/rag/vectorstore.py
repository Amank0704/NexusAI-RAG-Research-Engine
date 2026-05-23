# used googe embedding model



# ── Updated version 2 ────────────────────────────────────────────────────────────────────
import os 
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
# from langchain_community.embeddings import HuggingFaceEmbeddings
FAISS_PATH = os.getenv("FAISS_PATH", "faiss_index")
_vectorstore = None


def _get_embeddings():
    return GoogleGenerativeAIEmbeddings(
    
        model="models/gemini-embedding-001",

        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )

#using huggingface 
# def _get_embeddings():
#     return HuggingFaceEmbeddings(
#         model_name="sentence-transformers/all-MiniLM-L6-v2",
#         model_kwargs={"device": "cpu"},
#         encode_kwargs={"normalize_embeddings": True},
#     )

def build_vectorstore(docs):
    global _vectorstore
    embeddings = _get_embeddings()
    _vectorstore = FAISS.from_documents(docs, embeddings)
    _vectorstore.save_local(FAISS_PATH)   # persist to disk
    print(f"💾 FAISS index saved — {len(docs)} chunks")   # new update v2
    return _vectorstore


def load_vectorstore():
    """Called on startup — reload index if it exists on disk."""
    global _vectorstore
    if os.path.exists(FAISS_PATH):
        try:
            embeddings = _get_embeddings()
            _vectorstore = FAISS.load_local(
                FAISS_PATH, embeddings, allow_dangerous_deserialization=True
            )
            print(f"✅ FAISS index loaded from {FAISS_PATH}")
        except Exception as e:
            print(f"⚠️  Could not load FAISS index: {e}")


def get_vectorstore():
    return _vectorstore


# new update version 2.0 - reset
def _reset_vectorstore():
    global _vectorstore
    _vectorstore = None
    print("🗑️  FAISS index cleared from memory")