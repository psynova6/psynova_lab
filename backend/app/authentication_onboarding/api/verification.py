"""
Email / OTP verification routes.
"""

from fastapi import APIRouter, status

from app.authentication_onboarding.schemas.auth import (
    MessageResponse,
    ResendVerificationRequest,
    VerifyEmailRequest,
)
from app.authentication_onboarding.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["Verification"])


@router.post(
    "/verify-email",
    response_model=MessageResponse,
    summary="Verify email with OTP",
    responses={
        400: {"description": "Invalid / expired code, or email already verified"},
        404: {"description": "User not found"},
        429: {"description": "Too many attempts"},
    },
)
async def verify_email(data: VerifyEmailRequest):
    """Submit the 6-digit OTP received via email to verify the account."""
    await auth_service.verify_email_otp(data.email, data.code)
    return MessageResponse(message="Email verified successfully.")


@router.post(
    "/resend-verification",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Resend verification OTP",
    responses={429: {"description": "Rate limit exceeded (max 3 / hour)"}},
)
async def resend_verification(data: ResendVerificationRequest):
    """
    Resend verification OTP. Rate-limited to 3 per hour.
    Does not reveal whether the email exists.
    """
    await auth_service.resend_verification(data.email)
    return MessageResponse(
        message="If an unverified account exists, a new code has been sent."
    )
