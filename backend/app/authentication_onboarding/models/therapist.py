from __future__ import annotations
"""
Therapist (Counselor) document model — stored in the 'therapists' MongoDB collection.
"""

from typing import Optional

from beanie import Document, Indexed
from pydantic import EmailStr

from .base_user import BaseUserMixin


class Therapist(BaseUserMixin, Document):
    """Represents a therapist / counselor on the platform."""

    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]

    # Therapist-specific fields
    institution_id: Optional[str] = None   # Reference to Institution._id (None if independent)
    license_number: Optional[str] = None   # Professional license ID
    specialization: Optional[str] = None   # e.g., "Cognitive Behavioral Therapy"
    is_volunteer: bool = False             # True if this is an unlicensed volunteer
    supervisor_id: Optional[str] = None    # Therapist._id of the supervising counselor

    @property
    def role(self) -> Role:
        from .user import Role
        return Role.COUNSELOR

    class Settings:
        name = "therapists"

    def __repr__(self) -> str:
        email_parts = self.email.split("@")
        if len(email_parts) == 2 and email_parts[0]:
            masked_email = f"{email_parts[0][0]}***@{email_parts[1]}"
        else:
            masked_email = "***"
        return f"<Therapist {masked_email}>"


Therapist.model_rebuild()
