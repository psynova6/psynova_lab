"""
User document model and Role enumeration (MongoDB / Beanie).
"""

import enum
from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field


class Role(str, enum.Enum):
    """Application roles."""

    STUDENT = "student"
    COUNSELOR = "counselor"
    ADMIN = "admin"


class ConsentRecord(BaseModel):
    """Record of a specific consent action."""

    granted: bool = False
    granted_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None
    version: Optional[str] = None


class ConsentFlags(BaseModel):
    """Aggregate of user consent flags."""

    marketing: ConsentRecord = Field(default_factory=ConsentRecord)
    data_sharing: ConsentRecord = Field(default_factory=ConsentRecord)


class User(Document):
    """Represents a platform user stored in MongoDB."""

    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]
    phone: Optional[str] = None
    hashed_password: str

    first_name: Optional[str] = Field(None, max_length=64)
    last_name: Optional[str] = Field(None, max_length=64)
    language: str = "en"
    preferences: dict = Field(default_factory=dict)
    consent_flags: ConsentFlags = Field(default_factory=ConsentFlags)

    role: Role = Role.STUDENT
    institution_id: Optional[str] = None

    is_active: bool = True
    is_verified: bool = False
    is_blocked: bool = False
    failed_login_attempts: int = 0

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"

    def __repr__(self) -> str:
        return f"<User {self.email} role={self.role.value}>"
