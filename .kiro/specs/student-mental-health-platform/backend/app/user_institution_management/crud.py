"""
CRUD and service logic for User & Institution Management.
"""

from typing import List, Optional
from beanie import PydanticObjectId, UpdateResponse
from bson.errors import InvalidId
from .models import Institution, InstitutionUser
from app.authentication_onboarding.models.user import AnyUser, Role, get_user_by_id
from .schemas import InstitutionCreate, InstitutionUpdate, UserProfileUpdate
from datetime import datetime, timezone

def validate_id(oid: str, entity_name: str = "ID") -> PydanticObjectId:
    try:
        return PydanticObjectId(oid)
    except InvalidId:
        raise ValueError(f"Invalid {entity_name} format")

class UserInstitutionService:
    # --- Institution CRUD ---
    @staticmethod
    async def create_institution(data: InstitutionCreate) -> Institution:
        institution = Institution(**data.model_dump())
        await institution.insert()
        return institution

    @staticmethod
    async def get_institution(institution_id: str) -> Optional[Institution]:
        oid = validate_id(institution_id, "Institution ID")
        return await Institution.get(oid)

    @staticmethod
    async def update_institution(institution_id: str, data: InstitutionUpdate) -> Optional[Institution]:
        oid = validate_id(institution_id, "Institution ID")
        institution = await Institution.get(oid)
        if institution:
            update_data = data.model_dump(exclude_unset=True)
            # Re-validate against model if needed, then update atomically
            await institution.update({"$set": update_data})
            return await Institution.get(oid)
        return None

    @staticmethod
    async def soft_delete_institution(institution_id: str) -> bool:
        oid = validate_id(institution_id, "Institution ID")
        institution = await Institution.get(oid)
        if institution:
            await institution.update({"$set": {"is_active": False}})
            return True
        return False

    # --- User Profile Management ---
    @staticmethod
    async def update_user_profile(user_id: str, data: UserProfileUpdate) -> Optional[AnyUser]:
        oid = validate_id(user_id, "User ID")
        user = await get_user_by_id(oid)
        if user:
            update_data = data.model_dump(exclude_unset=True)
            await user.update({"$set": update_data})
            return await get_user_by_id(oid)
        return None

    # --- Relationships & Roles ---
    @staticmethod
    async def link_user_to_institution(user_id: str, institution_id: str, roles: List[Role]) -> InstitutionUser:
        u_oid = validate_id(user_id, "User ID")
        i_oid = validate_id(institution_id, "Institution ID")
        
        user = await get_user_by_id(u_oid)
        if not user:
            raise ValueError(f"User with ID {user_id} not found")
            
        institution = await Institution.get(i_oid)
        if not institution:
            raise ValueError(f"Institution with ID {institution_id} not found")
        
        # Atomic Upsert Attempt
        rel = await InstitutionUser.find_one(
            InstitutionUser.user.id == u_oid,
            InstitutionUser.institution.id == i_oid
        )
        
        if rel:
            # Atomic update of roles/is_active
            await rel.update({"$set": {"is_active": True}, "$addToSet": {"roles": {"$each": roles}}})
            return await InstitutionUser.find_one(InstitutionUser.user.id == u_oid, InstitutionUser.institution.id == i_oid)
        
        new_rel = InstitutionUser(user=user, institution=institution, roles=roles)
        await new_rel.insert()
        return new_rel

    @staticmethod
    async def unlink_user_from_institution(user_id: str, institution_id: str) -> bool:
        u_oid = validate_id(user_id, "User ID")
        i_oid = validate_id(institution_id, "Institution ID")
        rel = await InstitutionUser.find_one(
            InstitutionUser.user.id == u_oid,
            InstitutionUser.institution.id == i_oid
        )
        if rel:
            rel.is_active = False
            rel.updated_at = datetime.now(timezone.utc)
            await rel.save()
            return True
        return False
