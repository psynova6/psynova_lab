"""
Password hashing (bcrypt) and JWT token utilities.
"""

import hashlib
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

# ── Password hashing ──

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Hash a plaintext password using Argon2id."""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Argon2id password verification."""
    return pwd_context.verify(plain, hashed)


# ── JWT tokens ──


def create_access_token(
    sub: str,
    role: str,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a short-lived access JWT (default 15 min)."""
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"sub": sub, "role": role, "type": "access", "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(
    sub: str,
    role: str,
    session_id: str,
    remember_me: bool = False,
) -> str:
    """Create a long-lived refresh JWT (7 d default, 30 d if remember-me)."""
    days = settings.REMEMBER_ME_EXPIRE_DAYS if remember_me else settings.REFRESH_TOKEN_EXPIRE_DAYS
    expire = datetime.now(timezone.utc) + timedelta(days=days)
    payload = {
        "sub": sub,
        "role": role,
        "sid": session_id,
        "type": "refresh",
        "exp": expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT. Raises JWTError on failure."""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise


def hash_token(token: str) -> str:
    """Create a SHA-256 hash of a token for secure server-side storage."""
    return hashlib.sha256(token.encode()).hexdigest()
