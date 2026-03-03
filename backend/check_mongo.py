import asyncio
import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = "mongodb+srv://psynova6_db_user:GQqQouV5E86m4WC9@psynova.gdin41s.mongodb.net/?appName=Psynova"
DB_NAME = "psynova"

async def check_mongo():
    print(f"Checking MongoDB at {MONGODB_URL[:30]}...")
    client = AsyncIOMotorClient(
        MONGODB_URL,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=10000
    )
    db = client[DB_NAME]
    
    collections = ['students', 'therapists', 'institution_admins']
    for coll in collections:
        count = await db[coll].count_documents({})
        print(f"Collection '{coll}' count: {count}")
        if count > 0:
            doc = await db[coll].find_one()
            print(f"  Sample ID from '{coll}': {doc.get('_id')} (type: {type(doc.get('_id'))})")
            print(f"  Field 'is_active': {doc.get('is_active')}, 'is_blocked': {doc.get('is_blocked')}")

    client.close()

if __name__ == "__main__":
    asyncio.run(check_mongo())
