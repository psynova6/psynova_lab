
import asyncio
import secrets
import os
import httpx
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from app.main import app
from app.config import settings
from app.database import connect_db, close_db

# Override DB for testing to a safe psynova_test
settings.MONGODB_DB_NAME = "psynova_test_auto"

async def signup_user(client, email, password, role="student"):
    """Signup helper with regex validation check."""
    payload = {
        "email": email,
        "password": password,
        "role": role,
        "consent": True,
        "consent_version": "1.0"
    }
    resp = await client.post("/api/auth/signup", json=payload)
    return resp

async def verify_user_in_db(email: str):
    """Manually verify user in DB to bypass SMTP/OTP for testing."""
    client_db = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client_db[settings.MONGODB_DB_NAME]
    # Check students, therapists, institution_admins
    for coll in ["students", "therapists", "institution_admins"]:
        await db[coll].update_one(
            {"email": email.lower()},
            {"$set": {"is_verified": True, "is_active": True}}
        )
    client_db.close()

async def login_user(client, email, password, role="student"):
    """Login helper."""
    payload = {"email": email, "password": password, "role": role}
    resp = await client.post("/api/auth/login", json=payload)
    return resp

async def run_tests():
    print("\n🚀 Starting COMPREHENSIVE AUTOMATED BACKEND TEST (Auto-Run)...\n")
    
    # 1. Initialize DB
    await connect_db()
    
    # Clean up test DB before start
    client_db = AsyncIOMotorClient(settings.MONGODB_URL)
    await client_db.drop_database(settings.MONGODB_DB_NAME)
    client_db.close()

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        
        # --- TEST 1: AUTH REGEX & VALIDATION ---
        print("--- TEST 1: AUTH REGEX & VALIDATION ---")
        
        # Invalid email
        resp = await signup_user(client, "invalid-email", "Password123!")
        assert resp.status_code in [400, 422], f"Email regex failed to catch 'invalid-email', got {resp.status_code}"
        print(f"✅ Invalid email caught correctly ({resp.status_code})")

        # Invalid password (no special char)
        resp = await signup_user(client, "test@psynova.com", "Password123")
        assert resp.status_code in [400, 422], f"Password regex failed to catch weak password, got {resp.status_code}"
        print(f"✅ Weak password caught correctly ({resp.status_code})")

        # --- TEST 2: SIGNUP & VERIFICATION ---
        print("\n--- TEST 2: SIGNUP & ROLE ENFORCEMENT ---")
        
        student_email = f"student_{secrets.token_hex(4)}@test.com"
        student_pwd = "SecurePassword123!"
        
        # Correct signup
        resp = await signup_user(client, student_email, student_pwd)
        assert resp.status_code == 201, f"Signup failed: {resp.text}"
        print(f"✅ Student signup success: {student_email}")
        
        # Manual verification
        await verify_user_in_db(student_email)
        print("✅ Student manually verified in DB")

        # Login with correct role
        resp = await login_user(client, student_email, student_pwd, "student")
        assert resp.status_code == 200, f"Login failed for student: {resp.text}"
        student_token = resp.json()["access_token"]
        print("✅ Student login success (True Role)")

        # Login with WRONG role (Mismatch check)
        resp = await login_user(client, student_email, student_pwd, "admin")
        assert resp.status_code == 403, f"Role mismatch failed to trigger 403, got {resp.status_code}"
        assert "Role mismatch" in resp.json()["detail"]
        print("✅ Role mismatch enforcement confirmed (403)")

        # --- TEST 3: SYNA AI ISOLATION (CHATS, MOODS, JOURNALS) ---
        print("\n--- TEST 3: SYNA AI ISOLATION (CHATS, MOODS, JOURNALS) ---")
        
        # Create User B
        user_b_email = f"user_b_{secrets.token_hex(4)}@test.com"
        await signup_user(client, user_b_email, student_pwd, "student")
        await verify_user_in_db(user_b_email)
        resp = await login_user(client, user_b_email, student_pwd, "student")
        user_b_token = resp.json()["access_token"]
        
        # User A posts a mood and a message
        headers_a = {"Authorization": f"Bearer {student_token}"}
        headers_b = {"Authorization": f"Bearer {user_b_token}"}
        
        # Syna Chat
        chat_resp = await client.post("/syna/chat", json={"message": "I am feeling sad today."}, headers=headers_a)
        assert chat_resp.status_code == 200, f"Chat A failed: {chat_resp.text}"
        print("✅ User A sent message to Syna")

        # Syna Mood
        mood_resp = await client.post("/syna/mood", json={"mood": 3}, headers=headers_a)
        assert mood_resp.status_code == 200, f"Mood A failed: {mood_resp.text}"
        print("✅ User A recorded mood score 3")

        # Syna Journal
        journal_resp = await client.post("/syna/journal", json={"content": "Dear Syna, User A diary entry."}, headers=headers_a)
        assert journal_resp.status_code == 200, f"Journal A failed: {journal_resp.text}"
        print("✅ User A recorded journal entry")

        # VERIFY USER B SEES NOTHING
        print("\nChecking Privacy for User B...")
        
        hist_b = await client.get("/syna/history", headers=headers_b)
        assert len(hist_b.json()["history"]) == 0, f"User B sees User A's chat history! Count: {len(hist_b.json()['history'])}"
        print("✅ User B chat history is empty (Isolated)")

        mood_b = await client.get("/syna/mood/history", headers=headers_b)
        assert len(mood_b.json()["history"]) == 0, f"User B sees User A's mood history! Count: {len(mood_b.json()['history'])}"
        print("✅ User B mood history is empty (Isolated)")

        journal_b = await client.get("/syna/journal/history", headers=headers_b)
        assert len(journal_b.json()["history"]) == 0, f"User B sees User A's journal entries! Count: {len(journal_b.json()['history'])}"
        print("✅ User B journal history is empty (Isolated)")

        # VERIFY USER A SEES THEIR DATA
        print("\nChecking Persistence for User A...")
        
        hist_a = await client.get("/syna/history", headers=headers_a)
        # 2 messages (user + bot reply)
        assert len(hist_a.json()["history"]) == 2, f"User A missing history. Count: {len(hist_a.json()['history'])}"
        print("✅ User A chat history retrieved successfully (2 messages)")

        mood_a = await client.get("/syna/mood/history", headers=headers_a)
        assert len(mood_a.json()["history"]) == 1, "User A missing mood history"
        print("✅ User A mood history retrieved successfully")

        # --- TEST 4: CRISIS ALERTS & ANALYTICS ---
        print("\n--- TEST 4: CRISIS ALERTS & ANALYTICS ---")
        
        # Trigger crisis
        crisis_resp = await client.post("/syna/chat", json={"message": "I want to kill myself"}, headers=headers_a)
        assert crisis_resp.json()["risk_level"] == "high"
        print("✅ High-risk crisis triggered and labeled correctly")

        # Check analytics (should show counts)
        analytics_resp = await client.get("/syna/analytics/risks", headers=headers_a)
        assert "high" in analytics_resp.json(), "High risk count missing in analytics"
        print(f"✅ Analytics risk distribution: {analytics_resp.json()}")

        # --- TEST 5: OTP RESEND ---
        print("\n--- TEST 5: OTP RESEND FLOW ---")
        unverified_email = f"unverified_{secrets.token_hex(4)}@test.com"
        await signup_user(client, unverified_email, student_pwd)
        
        resend_resp = await client.post("/api/auth/resend-verification", json={"email": unverified_email})
        assert resend_resp.status_code == 200
        print("✅ OTP Resend request processed successfully")

    await close_db()
    print("\n✨ ALL TESTS PASSED SUCCESSFULLY! ✨")
    print("Isolation: OK | Security: OK | Regex: OK | Lifecycle: OK\n")

if __name__ == "__main__":
    try:
        asyncio.run(run_tests())
    except Exception as e:
        print(f"❌ TEST SUITE FAILED: {e}")
        import traceback
        traceback.print_exc()

