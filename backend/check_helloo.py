import sqlite3
from pathlib import Path
import os

DB_PATH = Path(r"d:\Psynova integrated\psynova\backend\app\syna_ai\syna_internal.db")

def check_db():
    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}")
        return
        
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check for message "helloo"
        cursor.execute("SELECT id, user_id, role, message, risk_level, created_at FROM chats WHERE message LIKE '%helloo%'")
        chats = cursor.fetchall()
        print(f"\n--- Chats with 'helloo' ({len(chats)}) ---")
        for chat in chats:
            print(chat)
            
        conn.close()
    except Exception as e:
        print(f"Error checking DB: {e}")

if __name__ == "__main__":
    check_db()
