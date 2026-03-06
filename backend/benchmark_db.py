import asyncio
import time
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie, Document
from pydantic import Field
from typing import Optional

# Reuse settings logic
import os
from dotenv import load_dotenv
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://psynova6_db_user:GQqQouV5E86m4WC9@psynova.gdin41s.mongodb.net/?appName=Psynova")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "psynova")

class SimpleUser(Document):
    email: str
    class Settings:
        name = "students"

async def benchmark_db():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[MONGODB_DB_NAME]
    
    print(f"Connecting to {MONGODB_DB_NAME}...")
    start_conn = time.time()
    await init_beanie(database=db, document_models=[SimpleUser])
    print(f"Init Beanie took: {time.time() - start_conn:.4f}s")
    
    email_to_find = "test@example.com" # Just a test
    
    print(f"Starting lookups for {email_to_find}...")
    
    # 1. Lookup in students
    start = time.time()
    await db["students"].find_one({"email": email_to_find})
    print(f"Lookup in 'students' took: {time.time() - start:.4f}s")
    
    # 2. Lookup in therapists
    start = time.time()
    await db["therapists"].find_one({"email": email_to_find})
    print(f"Lookup in 'therapists' took: {time.time() - start:.4f}s")
    
    # 3. Lookup in institution_admins
    start = time.time()
    await db["institution_admins"].find_one({"email": email_to_find})
    print(f"Lookup in 'institution_admins' took: {time.time() - start:.4f}s")

if __name__ == "__main__":
    asyncio.run(benchmark_db())
