"""
API Router for User & Institution Management.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from .schemas import (
    InstitutionCreate, InstitutionUpdate, InstitutionResponse,
    UserProfileUpdate, RoleAssignment, UserInstitutionResponse
)
from .crud import UserInstitutionService
from app.authentication_onboarding.models.user import User

router = APIRouter(prefix="/management", tags=["User & Institution Management"])

# --- Institution Endpoints ---

@router.post("/institutions", response_model=InstitutionResponse, status_code=status.HTTP_201_CREATED)
async def create_institution(data: InstitutionCreate):
    """Admin only: Create a new institution."""
    return await UserInstitutionService.create_institution(data)

@router.get("/institutions/{institution_id}", response_model=InstitutionResponse)
async def get_institution(institution_id: str):
    """Get institution details."""
    inst = await UserInstitutionService.get_institution(institution_id)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    return inst

@router.patch("/institutions/{institution_id}", response_model=InstitutionResponse)
async def update_institution(institution_id: str, data: InstitutionUpdate):
    """Admin only: Update institution details."""
    inst = await UserInstitutionService.update_institution(institution_id, data)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    return inst

@router.delete("/institutions/{institution_id}")
async def delete_institution(institution_id: str):
    """Admin only: Soft delete an institution."""
    success = await UserInstitutionService.soft_delete_institution(institution_id)
    if not success:
        raise HTTPException(status_code=404, detail="Institution not found")
    return {"message": "Institution deactivated successfully"}

# --- User Profile Endpoints ---

@router.patch("/users/{user_id}/profile")
async def update_user_profile(user_id: str, data: UserProfileUpdate):
    """Update user profile fields (name, preferences, etc.)."""
    user = await UserInstitutionService.update_user_profile(user_id, data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Profile updated successfully"}

# --- Relationship & Role Endpoints ---

@router.post("/link", response_model=UserInstitutionResponse)
async def link_user_to_institution(data: RoleAssignment):
    """Admin only: Link a user to an institution with specific roles."""
    try:
        return await UserInstitutionService.link_user_to_institution(
            data.user_id, data.institution_id, data.roles
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/unlink")
async def unlink_user_from_institution(user_id: str, institution_id: str):
    """Admin only: Unlink/Deactivate a user's relationship with an institution."""
    success = await UserInstitutionService.unlink_user_from_institution(user_id, institution_id)
    if not success:
        raise HTTPException(status_code=404, detail="Relationship not found")
    return {"message": "User unlinked successfully"}
