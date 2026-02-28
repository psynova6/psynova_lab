from app.syna_ai.database import get_db

def save_mood(mood: int):
    """
    Store daily mood score (1–10).
    """
    conn, cursor = get_db()
    cursor.execute(
        "INSERT INTO moods (mood_score) VALUES (?)",
        (mood,)
    )
    conn.commit()


def get_recent_moods(limit: int = 7):
    """
    Fetch recent mood check-ins.
    """
    conn, cursor = get_db()
    cursor.execute(
        """
        SELECT mood_score, created_at
        FROM moods
        ORDER BY created_at DESC
        LIMIT ?
        """,
        (limit,)
    )
    return cursor.fetchall()
