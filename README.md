# NexusAI - AI Research Engine

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev)
[![LangChain](https://img.shields.io/badge/LangChain-0.2-1c3c3c?style=flat-square)](https://langchain.com)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70b-f55036?style=flat-square)](https://groq.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Full-Stack AI Research Engine with RAG · ReAct Agent · Hybrid Search · LangChain**

[Features](#features) · [Quick Start](#quick-start) · [API Reference](#api-reference) · [Deployment](#deployment) · [Troubleshooting](#troubleshooting)

</div>

---

## What is NexusAI?

NexusAI is a **production-ready, full-stack AI research engine** that lets you upload PDF documents and query them using a powerful AI pipeline. Every answer is grounded in your actual documents — with source file, page number, and text snippet returned alongside the response.

<!-- The system uses **Retrieval-Augmented Generation (RAG)** with hybrid BM25 + vector search, a **Groq-hosted Llama 3.3-70b** LLM for ultra-fast inference, **Google Generative AI embeddings**, and a clean React dashboard with chat-style interface, persistent sessions, and a dedicated web search page. -->

The system uses **Retrieval-Augmented Generation (RAG)** with hybrid BM25 + vector search, a **Groq-hosted Llama 3.3-70b** LLM for ultra-fast inference, **HuggingFace sentence-transformer embeddings (all-MiniLM-L6-v2)**, and a clean React dashboard with chat-style interface, persistent sessions, and a dedicated web search page. 

Built as a **portfolio project** to demonstrate real-world AI engineering skills across the complete stack.

---

## Features

### Core AI Features
- **Multi-Document RAG** — Upload and query multiple PDFs simultaneously with chunk-level retrieval
- **Hybrid Search** — BM25 keyword search (40%) + FAISS vector similarity (60%) ensemble
- **Groq LLM** — Llama 3.3-70b-versatile via Groq's free, ultra-fast inference API
<!-- - **Google Embeddings** — `embedding-001` model for high-quality semantic vectors -->
- **HuggingFace Embeddings** — `sentence-transformers/all-MiniLM-L6-v2` model for efficient semantic vector generation
- **Source Attribution** — Every answer includes source file, page number, and text snippet
- **Auto Document Summary** — Each PDF is automatically summarized on upload via Groq

### Application Features
- **Chat Sessions** — Full conversation history with session management in PostgreSQL
- **Continue Chats** — Click any previous chat in the sidebar to reload and continue
- **New Chat** — Start a fresh session with one click, indexed files are preserved
- **Web Search Page** — Dedicated page for live Serper API web search, completely independent from documents
- **Web Search History** — Sidebar switches to search history when Web Search page is active
- **Documents Page** — Separate navigation for all indexed files with AI summaries and delete option
- **Export Results** — Download any chat session as a text file
- **Delete Files** — Remove individual files and automatically rebuild the FAISS index

### Technical Features
- **FAISS Persistence** — Vector index saved to disk and reloaded on server startup
- **PostgreSQL** — Full persistence for files, chat sessions, and query history
- **SQLAlchemy ORM** — Auto table creation, zero manual SQL required
- **CORS Ready** — Configured for cross-origin frontend/backend communication
- **Dockerfile** — Container-ready for Render deployment

---

## Tech Stack

| Layer | Technology | Purpose | Detail |
|-------|-----------|---------|--------|
| 🤖 LLM | Groq · Llama 3.3-70b | Inference | Free · 500K tokens/day |
| 🧠 Embeddings | HuggingFace MiniLM | Semantic Vectors | Using sentence-transformers/all-MiniLM-L6-v2 |
| 🔗 Framework | LangChain 0.2 | Orchestration | RAG pipeline + tools |
| 📦 Vector DB | FAISS | Similarity search | Disk-persisted |
| 🔍 Retrieval | BM25 + Vector | Hybrid search | Ensemble 40% / 60% |
| 🗄 Database | PostgreSQL | Persistence | Sessions + history + files |
| 🔑 Isolation | UUID + `localStorage` | Anonymous sessions | No login, no passwords stored |
| ⚡ Backend | FastAPI + SQLAlchemy | API | Python 3.11 · Uvicorn |
| ⚛ Frontend | React 18 + Vite | UI | Tailwind CSS v4 |
| 🌐 Web Search | Serper API | Live search | Optional · 2500 free/mo |


<!-- | 🧠 Embeddings | Google embedding-001 | Vectors | Via Google Generative AI | -->
---

## Project Structure

```
rag-agent/
├── backend/
│   ├── main.py                     # FastAPI app + all API routes
│   ├── db/
│   │   ├── __init__.py
│   │   └── database.py             # SQLAlchemy models + DB init
│   ├── rag/
│   │   ├── __init__.py
│   │   ├── loader.py               # PyPDF loader + text splitter
│   │   ├── vectorstore.py          # FAISS build / load / save / reset
│   │   └── retriever.py            # Hybrid BM25 + vector retrieval
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── react_agent.py          # Groq LLM with document context
│   │   └── summarizer.py           # Auto PDF summarization on upload
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── search_tool.py          # Serper web search tool
│   │   └── sql_tool.py             # SQLAlchemy SQL query tool
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx                 # Complete dashboard UI (all pages)
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Global styles + keyframe animations
    │   └── lib/
    │       └── session.js          # Generates/persists the browser's session UUID
    ├── index.html                  # Google Fonts loaded here
    ├── vite.config.js              # Tailwind v4 via @tailwindcss/vite plugin
    └── package.json
```

---


## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check (no session required) |
| `GET` | `/health` | Session-scoped health check — files indexed, queries run, vector store status |
| `POST` | `/upload` | Upload PDFs · builds/appends to this session's FAISS index · auto-summarizes each file |
| `GET` | `/files` | List all files indexed in this session |
| `DELETE` | `/files/{id}` | Delete a file (must belong to this session) + rebuild FAISS index |
| `POST` | `/query` | RAG query · returns answer + sources + `chat_id` |
| `POST` | `/websearch` | Pure web search · documents are never consulted |
| `GET` | `/chats` | List all chat threads for this session, ordered by last update |
| `GET` | `/chats/{id}/messages` | Load full message history for a chat thread |
| `DELETE` | `/chats/{id}` | Delete a chat thread and all its messages |
| `GET` | `/history` | Get recent query history for this session |
| `DELETE` | `/history` | Clear all history and chats for this session |



> **Isolation note:** every read/write filters by `session_id` from the `X-Session-ID` header. Requests with a missing or malformed header are rejected with `400`. Requests for a file or chat ID that exists but belongs to a different session return `404`, not the other session's data.

> **Interactive docs:** `http://localhost:8000/docs` (Swagger UI auto-generated by FastAPI)

---

## Quick Start

### Prerequisites

- Python **3.11+**
- Node.js **18+**
- PostgreSQL running locally, or a free [Render PostgreSQL](https://render.com)
- [Groq API key](https://console.groq.com) — free, no credit card
- [Google API key](https://aistudio.google.com) — free tier available

### 1. Clone

```bash
git clone https://github.com/your-username/nexusai.git
cd nexusai
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/nexusai
FAISS_PATH=faiss_indexes
ALLOWED_ORIGINS=http://localhost:5173
SERPER_API_KEY=optional_serper_key_for_web_search
```

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE nexusai;"
```

Start the server:

```bash
uvicorn main:app --reload
```

Expected output:
```
✅ PostgreSQL tables ready
✅ FAISS index loaded from disk
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
npm run dev
```

Open **http://localhost:5173** — On first load, a session UUID is generated and stored in your browser's `localStorage` — this is what isolates your workspace from anyone else using the same deployed instance.

---

## Environment Variables

| Variable | Required | Where to Get | Notes |
|----------|----------|---------------|-------|
| `GROQ_API_KEY` | ✅ Backend | [console.groq.com](https://console.groq.com) | Free · no credit card |
| `DATABASE_URL` | ✅ Backend | Render / local PostgreSQL | Must start with `postgresql://` — no SQLite fallback |
| `FAISS_PATH` | No | — | Base folder for per-session indexes. Default: `faiss_indexes` |
| `ALLOWED_ORIGINS` | ✅ Backend | — | Comma-separated list of allowed frontend origins (CORS) |
| `SERPER_API_KEY` | No | [serper.dev](https://serper.dev) | Enables web search · 2500 free/mo |
| `HF_TOKEN` | Optional | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | Faster model downloads, higher rate limits |
| `VITE_API_URL` | ✅ Frontend | — | Your backend URL |

---

## How It Works
### Session Isolation
Browser loads app
    ↓
src/lib/session.js checks localStorage for "nexusai_session_id"
    ↓
None found → crypto.randomUUID() generated → saved to localStorage
    ↓
Every API request → X-Session-ID header attached automatically
    ↓
Backend validates header format (alphanumeric, 8-100 chars)
    ↓
All DB queries and FAISS lookups scoped to this session_id


### Upload Flow
```
PDF Upload(+ X-Session-ID header)
    ↓
PyPDFLoader → pages extracted
    ↓
RecursiveCharacterTextSplitter
    800 char chunks · 100 char overlap
    ↓
HuggingFace all-MiniLM-L6-v2
    384-dimensional semantic vectors
    ↓
FAISS index → saved to disk
PostgreSQL → filename, chunks, size, uploaded_at
Groq Llama 3.3 → auto-summary generated → saved to PostgreSQL
```

### Query Flow
```
User query
    ↓
Hybrid Retrieval
    ├── BM25Retriever          (40% weight) — keyword matching
    └── FAISS vector search    (60% weight) — semantic similarity
    ↓
EnsembleRetriever → top 4 most relevant chunks
    ↓
Groq Llama 3.3-70b + document context
    ↓
Structured answer with source attribution
    ↓
Saved to PostgreSQL (query_history + chat_sessions), tagged with session_id and chat_id
Returned to frontend with sources + chat_id
```

### Web Search Flow (Completely Separate)
```
Web Search query
    ↓
Serper API → live Google results
    ↓
Documents are NEVER consulted
    ↓
Results displayed in 2-column grid
History saved to sidebar search log
```

---

## Page Guide

| Page | Access | Description |
|------|--------|--------------|
| **Workspace** | Default | Left: PDF upload. Right: Chat-style RAG analysis. Stacks vertically on small screens |
| **Documents** | Sidebar nav | All files indexed in this session · AI summaries · chunk counts · delete option |
| **Web Search** | Sidebar nav | Full-width live web search · completely independent from documents |
| **Tech Stack** | Sidebar nav | Architecture overview of all components |
| **Chats** (sidebar) | Always visible (except on Web Search) | All saved chat threads for this session · click to continue · + New button |
| **Search History** (sidebar) | Web Search page | Replaces the Chats list while on the Web Search page · click an entry to replay its results |

---

## Free Tier Summary

| Service | Free Limit | Notes |
|---------|-----------|-------|
| Groq | 500K tokens/day · 30 req/min | No credit card needed |
| HuggingFace Embeddings | Unlimited, local | Runs on CPU via `sentence-transformers`, no API calls |
| Serper API | 2,500 searches/month | Optional, only used on the Web Search page |
| Render PostgreSQL | 1GB storage | Free tier |



---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `400 Missing or invalid X-Session-ID header` | Frontend not sending the header | Ensure `src/lib/session.js` exists and every `fetch` call goes through the `req()` helper that attaches `X-Session-ID` |
| Blank white page | Tailwind v4 misconfigured | Ensure `@tailwindcss/vite` is in `vite.config.js` as a plugin. Delete `tailwind.config.js` and `postcss.config.js` |
| `DATABASE_URL not set` error | Missing env variable | Add `DATABASE_URL=postgresql://...` to `.env` |
| `local.db` or `data.db` created | SQLite fallback triggered (old code path) | Ensure `DATABASE_URL` is correctly set — current `database.py` raises an error instead of falling back to SQLite |
| 0 chunks after upload | Metadata key mismatch | Ensure `loader.py` uses `original_names` and `main.py` matches by `f["name"]` |
| Temp path shown in sources | Old loader code | Pass `original_names` to `load_and_split_pdfs()` |
| FAISS not loading on restart | Missing flag | Add `allow_dangerous_deserialization=True` to `FAISS.load_local()` |
| "All uploaded documents already exist" | Re-uploading a filename already indexed in this session | Expected behavior — rename the file or delete the existing entry first if you want to re-index it |
| Web search returns no results | Missing Serper key | Get free key at [serper.dev](https://serper.dev) and add to `.env` |
| CORS error in browser | `ALLOWED_ORIGINS` doesn't match frontend URL | Set `ALLOWED_ORIGINS` to the exact origin (including protocol, no trailing slash) serving your frontend |
| One browser sees another's documents | Session ID collision or shared `localStorage` (e.g. same browser profile) | Each browser/profile gets its own UUID automatically; this should not happen under normal use — verify `X-Session-ID` differs between the two clients |

---


## License

MIT — free to use, modify, and deploy for personal and commercial projects.

---

<div align="center">


Built with LangChain · Groq · Google AI · FastAPI · React · PostgreSQL · FAISS

**[⬆ Back to top](#nexusai--ai-research-engine)**

</div>
