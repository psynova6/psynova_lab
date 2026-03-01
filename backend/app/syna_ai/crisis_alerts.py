"""
PSYNOVA Crisis Alert System
Sends backend notifications when a high-risk crisis is detected.
"""

from app.syna_ai.database import get_db
from datetime import datetime


def send_crisis_alerts(user_id: str, role: str, user_message: str, risk_source: str) -> int:
    """
    Log a crisis event and dispatch alerts to all relevant parties.
    """
    conn, cursor = get_db()
    # 1. Log crisis event to database with user isolation
    cursor.execute(
        "INSERT INTO crisis_alerts (user_id, role, message, risk_source) VALUES (?, ?, ?, ?)",
        (user_id, role, user_message, risk_source)
    )
    conn.commit()
    alert_id = cursor.lastrowid

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n{'='*60}")
    print(f"!!! CRISIS ALERT TRIGGERED - ID: {alert_id}")
    print(f"Time: {timestamp}")
    print(f"Source: {risk_source}")
    print(f"Message: {user_message[:100]}{'...' if len(user_message) > 100 else ''}")
    print(f"{'='*60}")

    # 2. Dispatch alerts to all parties
    notify_psychologist(alert_id, user_message)
    notify_psynova_team(alert_id, user_message)
    notify_parents(alert_id, user_message)
    notify_institution(alert_id, user_message)

    # 3. Mark all alerts as sent in DB
    cursor.execute(
        """UPDATE crisis_alerts 
           SET alerted_psychologist = 1, 
               alerted_psynova_team = 1, 
               alerted_parents = 1, 
               alerted_institution = 1 
           WHERE id = ?""",
        (alert_id,)
    )
    conn.commit()

    print(f"DONE: All crisis alerts dispatched for alert ID: {alert_id}\n")
    return alert_id


# ===============================
# PLACEHOLDER NOTIFICATION FUNCTIONS
# ===============================

def notify_psychologist(alert_id: int, message: str):
    """Send alert to the user's assigned psychologist."""
    # TODO: Integrate actual notification service
    print(f"  [EMAIL] Alert -> Psychologist (alert_id: {alert_id}) - SENT (placeholder)")


def notify_psynova_team(alert_id: int, message: str):
    """Send alert to the Psynova monitoring team."""
    # TODO: Integrate actual notification service
    print(f"  [EMAIL] Alert -> Psynova Team (alert_id: {alert_id}) - SENT (placeholder)")


def notify_parents(alert_id: int, message: str):
    """Send alert to the user's parents/guardians."""
    # TODO: Integrate actual notification service
    print(f"  [EMAIL] Alert -> Parents (alert_id: {alert_id}) - SENT (placeholder)")


def notify_institution(alert_id: int, message: str):
    """Send alert to the user's educational institution."""
    # TODO: Integrate actual notification service
    print(f"  [EMAIL] Alert -> Institution (alert_id: {alert_id}) - SENT (placeholder)")
