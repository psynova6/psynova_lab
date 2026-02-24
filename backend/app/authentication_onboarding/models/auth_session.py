"""
AuthSession document — tracks refresh token sessions per device (MongoDB / Beanie).
"""

from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Indexed
from pydantic import Field


class AuthSession(Document):
    """Each active refresh token is tracked as a session document."""

    user_id: Indexed(str)  # type: ignore[valid-type]
    refresh_token_hash: str
    device_info: Optional[str] = None
    ip_address: Optional[str] = None

    remember_me: bool = False

    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    revoked_at: Optional[datetime] = None

    class Settings:
        name = "auth_sessions"

    @property
    def is_active(self) -> bool:
        expires_at = self.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        return self.revoked_at is None and expires_at > datetime.now(timezone.utc)

    def __repr__(self) -> str:
        return f"<AuthSession user={self.user_id} active={self.is_active}>"
