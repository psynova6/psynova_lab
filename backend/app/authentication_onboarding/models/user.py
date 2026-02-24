"""
User document model and Role enumeration (MongoDB / Beanie).
"""

import enum
from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Indexed
from pydantic import EmailStr, Field


class Role(str, enum.Enum):
    """Application roles."""

    STUDENT = "student"
    COUNSELOR = "counselor"
    ADMIN = "admin"


class User(Document):
    """Represents a platform user stored in MongoDB."""

    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]
    phone: Optional[str] = None
    hashed_password: str

    role: Role = Role.STUDENT
    institution_id: Optional[str] = None

    is_active: bool = True
    is_verified: bool = False
    is_blocked: bool = False
    failed_login_attempts: int = 0

    consent_given_at: Optional[datetime] = None
    consent_version: Optional[str] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"

    def __repr__(self) -> str:
        return f"<User {self.email} role={self.role.value}>"
