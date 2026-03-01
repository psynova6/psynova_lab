import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import sys
import hashlib
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
if not MONGODB_URL:
    print("❌ MONGODB_URL not set.")
    sys.exit(1)

MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "psynova")

async def verify_user(email: str):
    client = AsyncIOMotorClient(MONGODB_URL)
    try:
        db = client[MONGODB_DB_NAME]
        email_lower = email.lower()
        
        result = await db.users.update_one(
            {"email": email_lower},
            {"$set": {"is_verified": True, "is_active": True, "is_blocked": False}}
        )
        
        pseudonym = hashlib.sha256(email_lower.encode()).hexdigest()[:8]
        if result.modified_count > 0:
            print(f"✅ User pseudonym={pseudonym} verified successfully.")
        else:
            print(f"⚠️ User pseudonym={pseudonym} not found or already verified.")
    finally:
        client.close()

if __name__ == "__main__":
    print("Enter user email to verify: ", end="", flush=True)
    email = sys.stdin.readline().strip()
    if not email:
        print("❌ Email is required.")
        sys.exit(1)
    asyncio.run(verify_user(email))
