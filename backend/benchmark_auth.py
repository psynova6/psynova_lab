import asyncio
import time
from passlib.context import CryptContext
import logging

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

async def benchmark_argon2():
    password = "StrongPassword123!"
    logger.info("Starting Argon2 benchmarking...")
    
    # 1. Hashing
    start = time.time()
    hashed = pwd_context.hash(password)
    hashing_time = time.time() - start
    logger.info(f"Hashing took: {hashing_time:.4f}s")
    
    # 2. Verification
    start = time.time()
    is_valid = pwd_context.verify(password, hashed)
    verify_time = time.time() - start
    logger.info(f"Verification took: {verify_time:.4f}s")
    
    return hashing_time, verify_time

if __name__ == "__main__":
    asyncio.run(benchmark_argon2())
