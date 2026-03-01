
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

async def verify_connection():
    # Mask password for safety
    if "@" in settings.MONGODB_URL:
        prefix, suffix = settings.MONGODB_URL.split("@", 1)
        if ":" in prefix:
            base, auth = prefix.rsplit(":", 1)
            masked_url = f"{base}:****@{suffix}"
        else:
            masked_url = settings.MONGODB_URL
    else:
        masked_url = settings.MONGODB_URL

    print(f"Testing URL: {masked_url}")
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        print("Pinging Atlas...")
        await client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"Connection failed: {type(e).__name__}: {e}")

if __name__ == "__main__":
    asyncio.run(verify_connection())
