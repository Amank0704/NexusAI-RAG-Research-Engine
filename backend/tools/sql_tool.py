# import sqlite3
# import os

# DB_PATH = "data.db"

# def init_db():
#     conn = sqlite3.connect(DB_PATH)
#     c = conn.cursor()
#     c.execute("""CREATE TABLE IF NOT EXISTS documents (
#         id INTEGER PRIMARY KEY,
#         title TEXT,
#         category TEXT,
#         created_at TEXT
#     )""")
#     c.execute("INSERT OR IGNORE INTO documents VALUES (1,'Research Paper A','AI','2024-01-01')")
#     c.execute("INSERT OR IGNORE INTO documents VALUES (2,'Report B','Finance','2024-02-15')")
#     conn.commit()
#     conn.close()

# init_db()

# def query_sql(sql: str):
#     try:
#         conn = sqlite3.connect(DB_PATH)
#         c = conn.cursor()
#         c.execute(sql)
#         rows = c.fetchall()
#         conn.close()
#         return str(rows) if rows else "No results found."
#     except Exception as e:
#         return f"SQL Error: {str(e)}"







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