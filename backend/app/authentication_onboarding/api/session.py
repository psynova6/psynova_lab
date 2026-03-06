"""
Session management routes — list, revoke one, revoke all.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.authentication_onboarding.core.dependencies import get_current_user
from app.authentication_onboarding.models.user import AnyUser
from app.authentication_onboarding.schemas.auth import MessageResponse, SessionOut
from app.authentication_onboarding.services import session_service

router = APIRouter(prefix="/api/auth", tags=["Sessions"])


@router.get(
    "/sessions",
    response_model=list[SessionOut],
    summary="List active sessions",
)
async def list_sessions(
    current_user: Annotated[AnyUser, Depends(get_current_user)],
):
    """Return all active (non-revoked, non-expired) sessions for the current user."""
    sessions = await session_service.list_user_sessions(str(current_user.id))
    return [
        SessionOut(
            id=str(s.id),
            device_info=s.device_info,
            ip_address=s.ip_address,
            created_at=s.created_at,
            expires_at=s.expires_at,
        )
        for s in sessions
    ]


@router.delete(
    "/sessions/{session_id}",
    response_model=MessageResponse,
    summary="Revoke a single session",
    responses={404: {"description": "Session not found"}},
)
async def revoke_session(
    session_id: str,
    current_user: Annotated[AnyUser, Depends(get_current_user)],
):
    """Revoke a specific session (single-device logout)."""
    revoked = await session_service.revoke_session(session_id, str(current_user.id))
    if not revoked:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or already revoked.",
        )
    return MessageResponse(message="Session revoked.")


@router.delete(
    "/sessions",
    response_model=MessageResponse,
    summary="Logout from all devices",
)
async def revoke_all_sessions(
    current_user: Annotated[AnyUser, Depends(get_current_user)],
):
    """Revoke all active sessions for the current user (logout everywhere)."""
    count = await session_service.revoke_all_sessions(str(current_user.id))
    return MessageResponse(message=f"{count} session(s) revoked.")
