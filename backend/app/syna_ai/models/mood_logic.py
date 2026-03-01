from app.syna_ai.database import get_db

def save_mood(user_id: str, mood: int):
    """
    Store daily mood score (1–10) for a specific user.
    """
    conn, cursor = get_db()
    cursor.execute(
        "INSERT INTO moods (user_id, mood_score) VALUES (?, ?)",
        (user_id, mood)
    )
    conn.commit()


def get_recent_moods(user_id: str, limit: int = 7):
    """
    Fetch recent mood check-ins for a specific user.
    """
    conn, cursor = get_db()
    cursor.execute(
        """
        SELECT mood_score, created_at
        FROM moods
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
        """,
        (user_id, limit)
    )
    return cursor.fetchall()
