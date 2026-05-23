



# ── Updated version 2 ────────────────────────────────────────────────────────────────────
import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)


def query_sql(sql: str):
    """Execute a read-only SQL query and return results as string."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql))
            rows = result.fetchall()
            return str(rows) if rows else "No results found."
    except Exception as e:
        return f"SQL Error: {str(e)}"