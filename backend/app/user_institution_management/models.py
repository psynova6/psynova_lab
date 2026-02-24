"""
User & Institution Management Models (MongoDB / Beanie).
"""

from datetime import datetime, timezone
from typing import List, Optional
from beanie import Document, Indexed, Link
from pydantic import Field, EmailStr
from app.authentication_onboarding.models.user import User

class Institution(Document):
    """Represents an education institution (College/University)."""
    name: Indexed(str, unique=True)
    address: Optional[str] = None
    domain: Indexed(str, unique=True)  # e.g., "university.edu"
    contact_info: Optional[dict] = Field(default_factory=dict) # phone, email, etc.
    
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "institutions"

class InstitutionUser(Document):
    """Relationship between Users and Institutions, allowing multiple roles."""
    user: Link[User]
    institution: Link[Institution]
    
    # List of roles within this institution (e.g., "student", "counselor", "admin")
    roles: List[str] = Field(default_factory=list)
    
    is_active: bool = True
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "institution_users"
