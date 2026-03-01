from app.syna_ai.database import cursor

def get_risk_distribution():
    cursor.execute("""
        SELECT risk_level, COUNT(*) 
        FROM chats
        GROUP BY risk_level
    """)
    return dict(cursor.fetchall())


def get_mood_trend():
    cursor.execute("""
        SELECT DATE(created_at), AVG(mood_score)
        FROM moods
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
    """)
    return cursor.fetchall()


def get_peak_hours():
    cursor.execute("""
        SELECT STRFTIME('%H', created_at) AS hour, COUNT(*)
        FROM chats
        GROUP BY hour
        ORDER BY COUNT(*) DESC
        LIMIT 5
    """)
    return cursor.fetchall()
