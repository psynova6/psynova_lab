from __future__ import annotations
"""
User & Institution Management Models (MongoDB / Beanie).
"""

from datetime import datetime, timezone
from typing import List, Optional
from pydantic import Field
from beanie import Document, Indexed, Link, before_event, Insert, Replace, Update, PydanticObjectId
import pymongo
from app.authentication_onboarding.models.user import AnyUser, Role, get_model_for_role

class Institution(Document):
    """Represents an education institution (College/University)."""
    name: Indexed(str, unique=True)
    address: Optional[str] = None
    domain: Indexed(str, unique=True)  # e.g., "university.edu"
    contact_info: dict = Field(default_factory=dict) # phone, email, etc.
    
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @before_event(Insert, Replace, Update)
    async def update_timestamp(self):
        self.updated_at = datetime.now(timezone.utc)

    class Settings:
        name = "institutions"

class InstitutionUser(Document):
    """Relationship between Users and Institutions, allowing multiple roles."""
    user_id: PydanticObjectId
    user_role: Role
    institution: Link[Institution]
    
    # List of roles within this institution (e.g., "student", "counselor", "admin")
    roles: List[Role] = Field(default_factory=list)
    
    is_active: bool = True
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @before_event(Insert, Replace, Update)
    async def update_timestamp(self):
        self.updated_at = datetime.now(timezone.utc)

    async def fetch_user(self) -> Optional[AnyUser]:
        """Manually resolve the user across role-based collections."""
        model = get_model_for_role(self.user_role)
        return await model.get(self.user_id)

    class Settings:
        name = "institution_users"
        indexes = [
            pymongo.IndexModel([("user_id", pymongo.ASCENDING), ("institution", pymongo.ASCENDING)], unique=True)
        ]


Institution.model_rebuild()
InstitutionUser.model_rebuild()
