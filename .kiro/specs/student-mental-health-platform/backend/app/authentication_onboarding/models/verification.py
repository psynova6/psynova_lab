"""
Verification and password-reset token documents (MongoDB / Beanie).
"""

import enum
from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Indexed
from pydantic import Field


class VerificationPurpose(str, enum.Enum):
    EMAIL_VERIFY = "email_verify"
    PHONE_VERIFY = "phone_verify"


class VerificationToken(Document):
    """Stores hashed OTP codes for email / phone verification."""

    user_id: Indexed(str)  # type: ignore[valid-type]
    user_role: str = "student"  # "student" | "counselor" | "admin" — used to find correct collection
    code_hash: str
    purpose: VerificationPurpose

    expires_at: datetime
    used_at: Optional[datetime] = None
    attempts: int = 0

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


    class Settings:
        name = "verification_tokens"

    @property
    def is_expired(self) -> bool:
        expires_at = self.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc) > expires_at

    @property
    def is_used(self) -> bool:
        return self.used_at is not None

    def __repr__(self) -> str:
        return f"<VerificationToken user={self.user_id} purpose={self.purpose.value}>"


class PasswordResetToken(Document):
    """Stores hashed tokens for password reset flow."""

    user_id: Indexed(str)  # type: ignore[valid-type]
    token_hash: str

    expires_at: datetime
    used_at: Optional[datetime] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "password_reset_tokens"

    @property
    def is_expired(self) -> bool:
        expires_at = self.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc) > expires_at

    @property
    def is_used(self) -> bool:
        return self.used_at is not None

    def __repr__(self) -> str:
        return f"<PasswordResetToken user={self.user_id}>"
