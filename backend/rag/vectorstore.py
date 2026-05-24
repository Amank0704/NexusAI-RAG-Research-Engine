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

import os
import shutil

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

FAISS_PATH = os.getenv("FAISS_PATH", "faiss_index")

_vectorstore = None
_embeddings = None


# EMBEDDINGS

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

# BUILD / APPEND VECTORSTORE
def build_vectorstore(docs):

    global _vectorstore

    embeddings = _get_embeddings()

    index_file = os.path.join(FAISS_PATH, "index.faiss")


    # LOAD EXISTING INDEX
    if os.path.exists(index_file):

        try:

            _vectorstore = FAISS.load_local(
                FAISS_PATH,
                embeddings,
                allow_dangerous_deserialization=True
            )
            print("✅ Existing FAISS loaded")

           
            # REMOVE DUPLICATE FILES
            existing_sources = set()

            for d in _vectorstore.docstore._dict.values():

                source = d.metadata.get("source")

                if source:
                    existing_sources.add(source)

            new_docs = [
                d for d in docs
                if d.metadata.get("source") not in existing_sources
            ]

            if not new_docs:

                print("⚠️ All uploaded documents already exist")
                return _vectorstore


            # APPEND NEW DOCS
            _vectorstore.add_documents(new_docs)

            print(f"➕ Added {len(new_docs)} new chunks")

        except Exception as e:

            print(f"⚠️ Error loading FAISS: {e}")

            print("🆕 Creating fresh FAISS index")

            _vectorstore = FAISS.from_documents(
                docs,
                embeddings
            )


    # CREATE NEW INDEX

    else:

        _vectorstore = FAISS.from_documents(
            docs,
            embeddings
        )

        print("🆕 New FAISS index created")


    # SAVE INDEX

    _vectorstore.save_local(FAISS_PATH)

    print("💾 FAISS index saved")
    print(f"📦 Total vectors in DB: {_vectorstore.index.ntotal}")

    return _vectorstore



# LOAD VECTORSTORE ON STARTUP

def load_vectorstore():

    global _vectorstore

    embeddings = _get_embeddings()

    index_file = os.path.join(FAISS_PATH, "index.faiss")

    if os.path.exists(index_file):

        try:

            _vectorstore = FAISS.load_local(
                FAISS_PATH,
                embeddings,
                allow_dangerous_deserialization=True
            )

            print(f"✅ FAISS index loaded from {FAISS_PATH}")
            print(f"📦 Total vectors: {_vectorstore.index.ntotal}")

        except Exception as e:

            print(f"⚠️ Could not load FAISS index: {e}")

    else:

        print("ℹ️ No existing FAISS index found")


# =========================================================
# GET VECTORSTORE
# =========================================================

def get_vectorstore():

    return _vectorstore

# =========================================================
# RESET VECTORSTORE
# =========================================================

def reset_vectorstore():

    global _vectorstore
    _vectorstore = None

    if os.path.exists(FAISS_PATH):

        shutil.rmtree(FAISS_PATH)

        print("🗑️ FAISS index deleted from disk")

    print("🗑️ Vectorstore cleared from memory")