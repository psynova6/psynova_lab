"""
BaseUserMixin — shared fields for all role-based user collections.
Not a Beanie Document itself; each role-specific model inherits from this
alongside Document to get its own MongoDB collection.
"""

from datetime import datetime, timezone
from typing import Optional

from beanie import Replace, Update, before_event

from pydantic import BaseModel, EmailStr, Field


class BaseUserMixin(BaseModel):
    """Shared fields across Student, Therapist, and InstitutionAdmin."""

    email: EmailStr
    phone: Optional[str] = None
    hashed_password: str

    first_name: Optional[str] = Field(None, max_length=64)
    last_name: Optional[str] = Field(None, max_length=64)
    language: str = "en"
    preferences: dict = Field(default_factory=dict)

    is_active: bool = True
    is_verified: bool = False
    is_blocked: bool = False
    failed_login_attempts: int = 0

    # Consent
    consent_given_at: Optional[datetime] = None
    consent_version: Optional[str] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


    @before_event(Replace, Update)
    def update_timestamp(self):
        """Update the updated_at timestamp on every save/update."""
        self.updated_at = datetime.now(timezone.utc)
