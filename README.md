# NexusAI — AI Research Engine

> Full-stack RAG application with ReAct Agent, Hybrid Search, LangChain, FastAPI, and React.  
> **Live demo ready** · Deployable on Render + Vercel 

---

## What is NexusAI?

NexusAI is a production-ready AI research engine that lets you upload PDF documents and query them using a powerful AI pipeline. Every answer is grounded in your actual documents — with source file, page number, and text snippet returned alongside the response.

Built as a portfolio project to demonstrate real-world AI engineering across the full stack.

---

## Features

- **Multi-Document RAG** — Upload multiple PDFs, query across all of them simultaneously
- **Hybrid Search** — BM25 keyword search (40%) + FAISS vector similarity (60%) ensemble
- **Groq LLM** — Llama 3.3-70b-versatile via Groq's free, ultra-fast inference API
- **Source Attribution** — Every answer includes source file, page number, and text snippet
- **Query History** — All queries and answers persisted to PostgreSQL
- **Web Search Tool** — Optional Serper API integration for live web results
- **SQL Tool** — Agent can query structured data via SQLAlchemy
- **Delete Documents** — Remove files and automatically rebuild the FAISS index
- **Persistent Storage** — FAISS index saved to disk + PostgreSQL for metadata

---

## Tech Stack

| Layer | Technology | Detail |
|-------|-----------|--------|
| LLM | Groq · Llama 3.3-70b | Free · ultra-fast inference |
| Framework | LangChain 0.2 | RAG pipeline + tools |
| Embeddings | HuggingFace MiniLM-L6-v2 | Local · no API cost |
| Vector DB | FAISS | Saved to disk |
| Retrieval | BM25 + Vector Ensemble | Hybrid 40/60 |
| Database | PostgreSQL | Render managed |
| Backend | FastAPI + SQLAlchemy | Python 3.11 |
| Frontend | React + Vite | Tailwind CSS v4 |
| Deploy BE | Render | Free tier |
| Deploy FE | Vercel | Free tier |

---

## Project Structure

```
rag-agent/
├── backend/
│   ├── main.py                  # FastAPI app + all routes
│   ├── db/
│   │   └── database.py          # SQLAlchemy models
│   ├── rag/
│   │   ├── loader.py            # PDF loading + chunking
│   │   ├── vectorstore.py       # FAISS build/load/save
│   │   └── retriever.py         # Hybrid BM25 + vector search
│   ├── agents/
│   │   └── react_agent.py       # Groq LLM + context call
│   │   └── summarizer.py
│   ├── tools/
│   │   ├── search_tool.py       # Serper web search
│   │   └── sql_tool.py          # SQLAlchemy SQL tool
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx              # Full dashboard UI
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js           # Tailwind v4 plugin
    └── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/upload` | Upload PDFs and build FAISS index |
| `POST` | `/query` | Run RAG query, returns answer + sources |
| `GET` | `/files` | List all indexed files |
| `DELETE` | `/files/{id}` | Delete file and rebuild index |
| `GET` | `/history` | Get query history |
| `DELETE` | `/history` | Clear all history |

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (local) or a free [Render PostgreSQL](https://render.com)
- [Groq API key](https://console.groq.com) (free)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`:

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/nexusai
FAISS_PATH=faiss_index
SERPER_API_KEY=optional
```

Run:

```bash
uvicorn main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
npm run dev
# UI available at http://localhost:5173
```

---

## Deployment

### Backend → Render

1. Push `backend/` to GitHub
2. [render.com](https://render.com) → **New Web Service** → connect repo
3. Set **Root Directory**: `backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Create a **New PostgreSQL** on Render → copy **Internal Database URL**
7. Add environment variables:
   ```
   GROQ_API_KEY=...
   DATABASE_URL=<internal postgres URL>
   FAISS_PATH=faiss_index
   ```
8. Deploy → copy your Render service URL

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. [vercel.com](https://vercel.com) → **New Project** → import repo
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. Deploy → your live URL is ready

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | From [console.groq.com](https://console.groq.com) — free |
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `FAISS_PATH` | No | Default: `faiss_index` |
| `SERPER_API_KEY` | No | Enables web search tool — [serper.dev](https://serper.dev) |
| `VITE_API_URL` | ✅ Frontend | Your Render backend URL |

---

## How It Works

```
User uploads PDF
       ↓
PyPDFLoader → RecursiveCharacterTextSplitter (800 chars, 100 overlap)
       ↓
HuggingFace MiniLM-L6-v2 → 384-dim vectors
       ↓
FAISS index (saved to disk) + PostgreSQL (file metadata)
       ↓
User submits query
       ↓
Hybrid retrieval: BM25 (40%) + Vector similarity (60%)
       ↓
Top-4 chunks → Groq Llama 3.3-70b → Structured answer
       ↓
Response: answer + sources + optional web results
       ↓
Saved to PostgreSQL query history
```

---

## Groq Free Tier Limits

| Limit | Value |
|-------|-------|
| Requests / minute | 30 |
| Tokens / minute | 6,000 |
| Tokens / day | 500,000 |
| Cost | **$0** |

---

## Resume / Portfolio Value

This project demonstrates:

- ✅ RAG pipeline design and implementation
- ✅ Vector embeddings and semantic search
- ✅ Hybrid retrieval (BM25 + cosine similarity)
- ✅ LLM integration via LangChain
- ✅ FastAPI with dependency injection and ORM
- ✅ PostgreSQL schema design and persistence
- ✅ React 18 with hooks and async state management
- ✅ Full-stack deployment (Render + Vercel)
- ✅ Docker containerization

---

## License

MIT — free to use, modify, and deploy.
