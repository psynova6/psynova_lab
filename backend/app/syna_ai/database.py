import sqlite3
from pathlib import Path
import os

# Store DB in the syna_ai folder
DB_PATH = Path(os.path.dirname(__file__)) / "syna_internal.db"

_db_conn = None
_db_cursor = None

def get_db():
    global _db_conn, _db_cursor
    if _db_conn is None:
        _db_conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        _db_cursor = _db_conn.cursor()
        
        # -------------------------
        # TABLE INITIALIZATION (Lazy)
        # -------------------------
        _db_cursor.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        _db_cursor.execute("""
        CREATE TABLE IF NOT EXISTS moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mood_score INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        _db_cursor.execute("""
        CREATE TABLE IF NOT EXISTS journals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        _db_cursor.execute("""
        CREATE TABLE IF NOT EXISTS crisis_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            risk_source TEXT NOT NULL,
            alerted_psychologist BOOLEAN DEFAULT 0,
            alerted_psynova_team BOOLEAN DEFAULT 0,
            alerted_parents BOOLEAN DEFAULT 0,
            alerted_institution BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        _db_conn.commit()
        
    return _db_conn, _db_cursor
