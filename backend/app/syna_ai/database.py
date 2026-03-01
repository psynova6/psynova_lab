import sqlite3
import threading
from pathlib import Path
import os
from contextlib import contextmanager

# Store DB in the syna_ai folder
DB_PATH = Path(os.path.dirname(__file__)) / "syna_internal.db"

_db_conn = None
_db_cursor = None
_db_lock = threading.RLock()


def _migrate_schema(cursor):
    """
    Add new role-based columns to existing tables without data loss.
    ALTER TABLE ADD COLUMN is a no-op if the column already exists (handled via try/except).
    """
    migrations = [
        # chats: add user_id and role columns
        "ALTER TABLE chats ADD COLUMN user_id TEXT",
        "ALTER TABLE chats ADD COLUMN role TEXT",
        # moods: add user_id
        "ALTER TABLE moods ADD COLUMN user_id TEXT",
        # journals: add user_id
        "ALTER TABLE journals ADD COLUMN user_id TEXT",
        # crisis_alerts: add user_id and role
        "ALTER TABLE crisis_alerts ADD COLUMN user_id TEXT",
        "ALTER TABLE crisis_alerts ADD COLUMN role TEXT",
    ]
    for stmt in migrations:
        try:
            cursor.execute(stmt)
        except Exception:
            # Column already exists — skip silently
            pass


@contextmanager
def get_db_context():
    """
    Context manager for SQLite DB access.
    Ensures that the connection and cursor are closed after use,
    preventing resource leaks on the event loop.
    """
    conn = sqlite3.connect(DB_PATH)
    try:
        # Ensure tables and migrations are up to date
        _init_db(conn.cursor())
        conn.commit()
        yield conn, conn.cursor()
    finally:
        conn.close()


def get_db():
    """
    Legacy get_db for compatibility; returns global connection/cursor.
    DEPRECATED: Use get_db_context() instead for thread-safe per-op connections.
    """
    global _db_conn, _db_cursor
    with _db_lock:
        if _db_conn is None:
            _db_conn = sqlite3.connect(DB_PATH, check_same_thread=False)
            _db_cursor = _db_conn.cursor()
            _init_db(_db_cursor)
            _db_conn.commit()

        return _db_conn, _db_cursor


def _init_db(cursor):
    """Initializes tables and runs migrations."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        role TEXT,
        message TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        mood_score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS journals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crisis_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        role TEXT,
        message TEXT NOT NULL,
        risk_source TEXT NOT NULL,
        alerted_psychologist BOOLEAN DEFAULT 0,
        alerted_psynova_team BOOLEAN DEFAULT 0,
        alerted_parents BOOLEAN DEFAULT 0,
        alerted_institution BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    _migrate_schema(cursor)
