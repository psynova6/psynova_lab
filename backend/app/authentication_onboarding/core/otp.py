"""
OTP generation and validation utilities.
"""

import hashlib
import secrets


def generate_otp(length: int = 6) -> str:
    """Generate a cryptographically secure numeric OTP."""
    return "".join(str(secrets.randbelow(10)) for _ in range(length))


def hash_otp(otp: str) -> str:
    """SHA-256 hash the OTP for safe storage."""
    return hashlib.sha256(otp.encode()).hexdigest()


def verify_otp(plain_otp: str, hashed_otp: str) -> bool:
    """Constant-time comparison of OTP against its hash."""
    return secrets.compare_digest(hash_otp(plain_otp), hashed_otp)
