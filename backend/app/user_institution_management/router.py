from fastapi import APIRouter, HTTPException, Depends, status
from .schemas import (
    InstitutionCreate, InstitutionUpdate, InstitutionResponse,
    UserProfileUpdate, RoleAssignment, UserInstitutionResponse
)
from .crud import UserInstitutionService
from app.authentication_onboarding.models.user import AnyUser, Role
from app.authentication_onboarding.core.dependencies import role_required

router = APIRouter(prefix="/management", tags=["User & Institution Management"])

# Admin dependency
admin_only = [Depends(role_required(Role.ADMIN))]

# --- Institution Endpoints ---

@router.post("/institutions", response_model=InstitutionResponse, status_code=status.HTTP_201_CREATED, dependencies=admin_only)
async def create_institution(data: InstitutionCreate):
    """Admin only: Create a new institution."""
    try:
        return await UserInstitutionService.create_institution(data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create institution: {str(e)}"
        )

@router.get("/institutions/{institution_id}", response_model=InstitutionResponse)
async def get_institution(institution_id: str):
    """Get institution details."""
    try:
        inst = await UserInstitutionService.get_institution(institution_id)
        if not inst:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Institution not found")
        return inst
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.patch("/institutions/{institution_id}", response_model=InstitutionResponse, dependencies=admin_only)
async def update_institution(institution_id: str, data: InstitutionUpdate):
    """Admin only: Update institution details."""
    try:
        inst = await UserInstitutionService.update_institution(institution_id, data)
        if not inst:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Institution not found")
        return inst
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/institutions/{institution_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=admin_only)
async def delete_institution(institution_id: str):
    """Admin only: Soft delete an institution."""
    try:
        success = await UserInstitutionService.soft_delete_institution(institution_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Institution not found")
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# --- User Profile Endpoints ---

@router.patch("/users/{user_id}/profile", dependencies=admin_only)
async def update_user_profile(user_id: str, data: UserProfileUpdate):
    """Update user profile fields (name, preferences, etc.). Admin only for safety."""
    try:
        user = await UserInstitutionService.update_user_profile(user_id, data)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return {"message": "Profile updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# --- Relationship & Role Endpoints ---

@router.post("/link", response_model=UserInstitutionResponse, dependencies=admin_only)
async def link_user_to_institution(data: RoleAssignment):
    """Admin only: Link a user to an institution with specific roles."""
    try:
        return await UserInstitutionService.link_user_to_institution(
            data.user_id, data.institution_id, data.roles
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/institutions/{institution_id}/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=admin_only)
async def unlink_user_from_institution(institution_id: str, user_id: str):
    """Admin only: Unlink/Deactivate a user's relationship with an institution."""
    try:
        success = await UserInstitutionService.unlink_user_from_institution(user_id, institution_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Relationship not found")
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
