"""
CRUD and service logic for User & Institution Management.
"""

from typing import List, Optional
from beanie import PydanticObjectId
from .models import Institution, InstitutionUser
from app.authentication_onboarding.models.user import User, Role
from .schemas import InstitutionCreate, InstitutionUpdate, UserProfileUpdate
from datetime import datetime, timezone

class UserInstitutionService:
    # --- Institution CRUD ---
    @staticmethod
    async def create_institution(data: InstitutionCreate) -> Institution:
        institution = Institution(**data.model_dump())
        await institution.insert()
        return institution

    @staticmethod
    async def get_institution(institution_id: str) -> Optional[Institution]:
        return await Institution.get(institution_id)

    @staticmethod
    async def update_institution(institution_id: str, data: InstitutionUpdate) -> Optional[Institution]:
        institution = await Institution.get(institution_id)
        if institution:
            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(institution, key, value)
            institution.updated_at = datetime.now(timezone.utc)
            await institution.save()
        return institution

    @staticmethod
    async def soft_delete_institution(institution_id: str) -> bool:
        institution = await Institution.get(institution_id)
        if institution:
            institution.is_active = False
            institution.updated_at = datetime.now(timezone.utc)
            await institution.save()
            return True
        return False

    # --- User Profile Management ---
    @staticmethod
    async def update_user_profile(user_id: str, data: UserProfileUpdate) -> Optional[User]:
        user = await User.get(user_id)
        if user:
            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(user, key, value)
            user.updated_at = datetime.now(timezone.utc)
            await user.save()
        return user

    # --- Relationships & Roles ---
    @staticmethod
    async def link_user_to_institution(user_id: str, institution_id: str, roles: List[str]) -> InstitutionUser:
        user = await User.get(user_id)
        institution = await Institution.get(institution_id)
        if not user or not institution:
            raise ValueError("User or Institution not found")
        
        # Check if already exists
        rel = await InstitutionUser.find_one(
            InstitutionUser.user.id == PydanticObjectId(user_id),
            InstitutionUser.institution.id == PydanticObjectId(institution_id)
        )
        
        if rel:
            rel.roles = list(set(rel.roles + roles))
            rel.is_active = True
            rel.updated_at = datetime.now(timezone.utc)
            await rel.save()
            return rel
        
        new_rel = InstitutionUser(user=user, institution=institution, roles=roles)
        await new_rel.insert()
        return new_rel

    @staticmethod
    async def unlink_user_from_institution(user_id: str, institution_id: str) -> bool:
        rel = await InstitutionUser.find_one(
            InstitutionUser.user.id == PydanticObjectId(user_id),
            InstitutionUser.institution.id == PydanticObjectId(institution_id)
        )
        if rel:
            rel.is_active = False
            rel.updated_at = datetime.now(timezone.utc)
            await rel.save()
            return True
        return False
