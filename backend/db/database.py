

# new  v3 - Adding chat session

# This update introduces the ChatSession model and links query history entries
# to chat sessions so the app can maintain multiple conversations separately.
# The session_id field in QueryHistory ties queries to a specific chat.
import os
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer,
    String, Text, DateTime, JSON, Float
)
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in .env")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    id          = Column(Integer, primary_key=True, index=True)
    filename    = Column(String(255), nullable=False)
    chunks      = Column(Integer, default=0)
    size_kb     = Column(Float, default=0.0)
    summary     = Column(Text, default="")        # ← NEW: auto-summary
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.filename,
            "chunks":      self.chunks,
            "size_kb":     self.size_kb,
            "summary":     self.summary,
            "uploaded_at": self.uploaded_at.isoformat(),
        }


class ChatSession(Base):                          # ← NEW
    __tablename__ = "chat_sessions"
    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(255), default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id":         self.id,
            "title":      self.title,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class QueryHistory(Base):
    __tablename__ = "query_history"
    id         = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, default=None)    # ← NEW: links to ChatSession
    query      = Column(Text, nullable=False)
    answer     = Column(Text)
    sources    = Column(JSON)
    web_results= Column(JSON)
    use_web    = Column(String(10), default="false")
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":          self.id,
            "session_id":  self.session_id,
            "query":       self.query,
            "answer":      self.answer,
            "sources":     self.sources,
            "web_results": self.web_results,
            "use_web":     self.use_web,
            "created_at":  self.created_at.isoformat(),
        }


def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ PostgreSQL tables ready")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()