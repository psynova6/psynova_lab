from __future__ import annotations
"""
InstitutionAdmin document model — stored in the 'institution_admins' MongoDB collection.
Represents the administrative account for a College/University on the platform.
"""

from typing import Optional

from beanie import Document, Indexed
from pydantic import EmailStr

from .base_user import BaseUserMixin


class InstitutionAdmin(BaseUserMixin, Document):
    """Represents an institution administrator (principal / registrar)."""

    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]

    # Institution admin-specific fields
    institution_id: Optional[str] = None   # Reference to Institution._id
    designation: Optional[str] = None      # e.g., "Principal", "Dean of Students"

    @property
    def role(self) -> Role:
        from .user import Role
        return Role.ADMIN

    class Settings:
        name = "institution_admins"

    def __repr__(self) -> str:
        return f"<InstitutionAdmin {self.email}>"


InstitutionAdmin.model_rebuild()
