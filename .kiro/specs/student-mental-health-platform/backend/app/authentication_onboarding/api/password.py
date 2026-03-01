"""
Password management routes — forgot, reset, change.
"""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.authentication_onboarding.core.dependencies import get_current_user
from app.authentication_onboarding.models.user import AnyUser
from app.authentication_onboarding.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
)
from app.authentication_onboarding.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["Password"])


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Request a password reset",
    responses={429: {"description": "Rate limit exceeded"}},
)
async def forgot_password(data: ForgotPasswordRequest):
    """
    Send a password-reset token to the given email.
    Does not reveal whether the email exists.
    """
    await auth_service.request_password_reset(data.email)
    return MessageResponse(
        message="If an account with that email exists, a reset link has been sent."
    )


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Reset password with token",
    responses={400: {"description": "Invalid or expired token"}},
)
async def reset_password(data: ResetPasswordRequest):
    """Submit the reset token and a new password."""
    await auth_service.reset_password(data.token, data.new_password)
    return MessageResponse(message="Password reset successfully. You may now log in.")


@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="Change password (authenticated)",
    responses={
        400: {"description": "Current password incorrect"},
        401: {"description": "Not authenticated"},
    },
)
async def change_password(
    data: ChangePasswordRequest,
    current_user: Annotated[AnyUser, Depends(get_current_user)],
):
    """Change the password for the currently logged-in user."""
    await auth_service.change_password(
        current_user, data.current_password, data.new_password
    )
    return MessageResponse(message="Password changed successfully.")
