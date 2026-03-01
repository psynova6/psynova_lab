import asyncio
import os
import sys
# Add current directory to path so it can find 'app'
sys.path.append(os.getcwd())

from app.database import connect_db

async def test_connection():
    print("Testing MongoDB connection...")
    try:
        await connect_db()
        print("Successfully connected!")
    except Exception as e:
        print(f"Connection failed as expected during test: {type(e).__name__}")

if __name__ == "__main__":
    asyncio.run(test_connection())
