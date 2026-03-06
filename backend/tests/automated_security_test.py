import httpx
import asyncio
import secrets
from typing import Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:8000"
MONGODB_URL = os.getenv("MONGODB_URL")
if not MONGODB_URL:
    raise RuntimeError("MONGODB_URL not set in environment.")

MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "psynova")

# Utility to verify users directly in DB
async def verify_user_in_db(email: str):
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[MONGODB_DB_NAME]
    await db.users.update_one(
        {"email": email.lower()},
        {"$set": {"is_verified": True, "is_active": True}}
    )
    client.close()

async def signup_and_verify(client, email, password, role="student"):
    payload = {
        "email": email,
        "password": password,
        "role": role,
        "consent": True,
        "consent_version": "1.0"
    }
    resp = await client.post("/api/auth/signup", json=payload)
    if resp.status_code != 201:
        print(f"❌ Signup failed for {email}: {resp.text}")
        return None
    
    await verify_user_in_db(email)
    
    login_payload = {"email": email, "password": password, "role": role}
    login_resp = await client.post("/api/auth/login", json=login_payload)
    if login_resp.status_code != 200:
        print(f"❌ Login failed for {email}: {login_resp.text}")
        return None
    
    return login_resp.json()["access_token"]

async def run_integration_tests():
    print("\n🛡️ Starting High-Fidelity Security & Integration Test Suite...\n")
    
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=120.0) as client:
        # 1. Create Test Participants
        student_email = f"student_{secrets.token_hex(4)}@test.com"
        counselor_email = f"counselor_{secrets.token_hex(4)}@test.com"
        hacker_email = f"hacker_{secrets.token_hex(4)}@test.com"
        pwd = "SecurityPassword123!"

        print("--- 1. Provisioning Test Users ---")
        student_token = await signup_and_verify(client, student_email, pwd, "student")
        counselor_token = await signup_and_verify(client, counselor_email, pwd, "counselor")
        hacker_token = await signup_and_verify(client, hacker_email, pwd, "student")
        
        if not student_token or not counselor_token or not hacker_token:
            print("❌ User provisioning failed.")
            return

        # Fetch Counselor ID for conversation creation
        db_client = AsyncIOMotorClient(MONGODB_URL)
        try:
            db = db_client[MONGODB_DB_NAME]
            counselor_obj = await db.users.find_one({"email": counselor_email})
            counselor_id = str(counselor_obj["_id"])
            hacker_obj = await db.users.find_one({"email": hacker_email})
            hacker_id = str(hacker_obj["_id"])
        finally:
            db_client.close()

        # 2. Test Conversation Creation
        print("\n--- 2. Testing Conversation Lifecycle ---")
        student_headers = {"Authorization": f"Bearer {student_token}"}
        conv_payload = {
            "participant_ids": [counselor_id],
            "type": "student_counselor"
        }
        resp = await client.post("/conversations/", json=conv_payload, headers=student_headers)
        assert resp.status_code in [201, 200], f"Failed to create conversation: {resp.text}"
        
        conversation = resp.json()
        conv_id = conversation["id"]

        # 3. Test Message Flow & Read Status
        print("\n--- 3. Testing Message Flow & Read Receipts ---")
        msg_payload = {"content": "Hello Counselor, testing secure line.", "metadata": {"priority": "high"}}
        resp = await client.post(f"/conversations/{conv_id}/messages", json=msg_payload, headers=student_headers)
        assert resp.status_code == 201, f"Failed to send message: {resp.text}"
        msg_data = resp.json()
        assert msg_data.get("is_read") is False, "New message should not be read"

        # counselor checks messages
        counselor_headers = {"Authorization": f"Bearer {counselor_token}"}
        resp = await client.get(f"/conversations/{conv_id}/messages", headers=counselor_headers)
        assert resp.status_code == 200, f"Counselor failed to fetch messages: {resp.text}"
        assert len(resp.json()) > 0, "No messages found"
        
        # Mark as read
        resp = await client.post(f"/conversations/{conv_id}/read", headers=counselor_headers)
        assert resp.status_code == 200, f"Failed to mark as read: {resp.text}"

        # 4. Security: Access Control (The Hacker Scenario)
        print("\n--- 4. Access Control (Forbidden Scenarios) ---")
        hacker_headers = {"Authorization": f"Bearer {hacker_token}"}
        
        # Unauthorized history fetch
        resp = await client.get(f"/conversations/{conv_id}/messages", headers=hacker_headers)
        assert resp.status_code == 403, f"Hacker should NOT see history, got {resp.status_code}"
        
        # Unauthorized message sending
        resp = await client.post(f"/conversations/{conv_id}/messages", json={"content": "I am a spy"}, headers=hacker_headers)
        assert resp.status_code == 403, f"Hacker should NOT be able to send messages, got {resp.status_code}"

        # 5. Security: Business Rules
        print("\n--- 5. Business Rules Enforcement ---")
        # Student-Student chats (forbidden)
        invalid_conv = {"participant_ids": [hacker_id], "type": "student_counselor"} # type mismatch if hacker is student
        resp = await client.post("/conversations/", json=invalid_conv, headers=student_headers)
        assert resp.status_code in [400, 403], f"Should fail student-student chat, got {resp.status_code}"

        print("\n✨ Integration Test Complete. All critical paths checked. ✨")

if __name__ == "__main__":
    asyncio.run(run_integration_tests())
