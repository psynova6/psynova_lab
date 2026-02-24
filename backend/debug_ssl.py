
import asyncio
import ssl
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

async def diagnostic_check():
    print(f"Testing connectivity to Atlas...")
    print(f"URL: {settings.MONGODB_URL.split('@')[-1]}")
    
    # Try with default settings
    print("\n--- Try 1: Default Settings ---")
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print("✅ Ping successful!")
    except Exception as e:
        print(f"❌ Default connection failed: {e}")

    # Try with explicit certs via certifi
    print("\n--- Try 2: Explicit Certifi ---")
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URL, 
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000
        )
        await client.admin.command('ping')
        print("✅ Certifi connection successful!")
    except Exception as e:
        print(f"❌ Certifi connection failed: {e}")

    # Try with TLS verification disabled (DANGEROUS - ONLY FOR DIAGNOSIS)
    print("\n--- Try 3: Disable TLS Verification ---")
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URL, 
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        await client.admin.command('ping')
        print("✅ Non-verified connection successful!")
    except Exception as e:
        print(f"❌ Non-verified connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(diagnostic_check())
