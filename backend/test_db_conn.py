import asyncio
import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConfigurationError, ServerSelectionTimeoutError

# Manually pulling from .env or just hardcoding for test (using your .env values)
MONGODB_URL = "mongodb+srv://psynova6_db_user:GQqQouV5E86m4WC9@psynova.gdin41s.mongodb.net/?appName=Psynova"
DB_NAME = "psynova"

async def test_connection():
    print(f"Testing MongoDB Connection to: {DB_NAME}")
    print(f"URL: {MONGODB_URL[:30]}...")
    
    try:
        # Increase timeouts for DNS resolution/SRV lookup
        client = AsyncIOMotorClient(
            MONGODB_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000
        )
        
        # Trigger a simple command to force connection/SRV lookup
        db = client[DB_NAME]
        print("Pinging MongoDB...")
        await db.command("ping")
        print("✅ SUCCESS: Connected to MongoDB successfully!")
        
        # Test collection access
        collections = await db.list_collection_names()
        print(f"Collections found: {collections}")
        
    except ConfigurationError as e:
        print("\n" + "!" * 50)
        print("CONFIG ERROR: DNS SRV resolution failed.")
        print("This usually means your local network/DNS is blocking SRV lookups.")
        print(f"Detail: {e}")
        print("FIX: In your .env, try using the standard 'Old Driver' connection string format.")
        print("!" * 50 + "\n")
    except ServerSelectionTimeoutError as e:
        print("\n" + "!" * 50)
        print("TIMEOUT ERROR: Could not select a server.")
        print(f"Detail: {e}")
        print("!" * 50 + "\n")
    except Exception as e:
        print(f"AN UNEXPECTED ERROR OCCURRED: {e}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    asyncio.run(test_connection())
