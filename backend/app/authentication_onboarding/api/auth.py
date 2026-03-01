"""
Auth routes — signup, login, refresh, logout.
"""

import logging
from typing import Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from jose import JWTError

from app.authentication_onboarding.core.dependencies import get_current_user
from app.authentication_onboarding.core.security import (
    create_access_token,
    decode_token,
    hash_token,
)
from app.authentication_onboarding.models.user import AnyUser, get_model_for_role
from app.authentication_onboarding.schemas.auth import (
    LoginRequest,
    MessageResponse,
    RefreshRequest,
    SignupRequest,
    SignupResponse,
    TokenPair,
    VerifyEmailRequest,
    ResendVerificationRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
)
from app.authentication_onboarding.services import auth_service, session_service
from app.config import settings

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    responses={
        409: {"description": "Email already registered"},
        400: {"description": "Consent not given or invalid data"},
    },
)
async def signup(data: SignupRequest):
    """
    Register a new user (student, counselor, or admin).

    Collects email, optional phone, password, institution, and consent.
    Sends a 6-digit OTP to the provided email for verification.
    """
    user, _ = await auth_service.signup(data)
    log.info(f"Signup successful for {user.email}")
    return SignupResponse(
        id=str(user.id),
        email=user.email,
        role=user.role.value,
        is_verified=user.is_verified,
        message="Account created. Please verify your email with the OTP sent.",
    )


@router.post(
    "/verify-email",
    response_model=MessageResponse,
    summary="Verify email with OTP",
    responses={
        400: {"description": "Invalid or expired OTP"},
        404: {"description": "User not found"},
    },
)
async def verify_email(data: VerifyEmailRequest):
    """
    Verify the user's email using the 6-digit OTP.
    """
    await auth_service.verify_email_otp(data.email, data.code)
    log.info(f"Email verified successfully for {data.email}")
    return MessageResponse(message="Email verified successfully. You can now log in.")


@router.post(
    "/resend-verification",
    response_model=MessageResponse,
    summary="Resend verification OTP",
)
async def resend_verification(data: ResendVerificationRequest):
    """
    Generate and send a new OTP to the user's email.
    """
    await auth_service.resend_verification(data.email)
    log.info(f"Verification code resend requested for {data.email}")
    return MessageResponse(message="If an unverified account exists, a new code has been sent.")


@router.post(
    "/login",
    response_model=TokenPair,
    summary="Authenticate and obtain tokens",
    responses={
        401: {"description": "Invalid credentials"},
        403: {"description": "Blocked / inactive / unverified account"},
        429: {"description": "Rate limit exceeded"},
    },
)
async def login(data: LoginRequest, request: Request):
    """
    Authenticate with email + password.

    Returns a short-lived access token and a long-lived refresh token.
    Pass `remember_me: true` for a 30-day refresh token (default 7 days).
    """
    ip = request.client.host if request.client else None
    tokens = await auth_service.login(
        email=data.email,
        password=data.password,
        role=data.role,
        remember_me=data.remember_me,
        device_info=data.device_info,
        ip_address=ip,
    )
    log.info(f"Login successful for {data.email} as {data.role}")
    return tokens


@router.post(
    "/refresh",
    response_model=TokenPair,
    summary="Refresh access token",
    responses={401: {"description": "Invalid or revoked refresh token"}},
)
async def refresh(data: RefreshRequest):
    """Exchange a valid refresh token for a new access token."""
    try:
        payload = decode_token(data.refresh_token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token."
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type."
        )

    session_id = payload.get("sid")
    user_id = payload.get("sub")

    session = await session_service.get_session_by_id(session_id)
    if not session or not session.is_active or session.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Session revoked or expired."
        )

    if session.refresh_token_hash != hash_token(data.refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token mismatch."
        )

    role = payload.get("role")
    if not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload: role missing."
        )

    try:
        UserModel = get_model_for_role(role)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid role in token."
        )

    user = await UserModel.get(PydanticObjectId(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found."
        )

    access_token = create_access_token(sub=str(user.id), role=user.role.value)

    return TokenPair(
        access_token=access_token,
        refresh_token=data.refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout (revoke current session)",
)
async def logout(
    data: RefreshRequest,
    current_user: Annotated[AnyUser, Depends(get_current_user)],
):
    """Revoke the refresh token for the current session."""
    try:
        payload = decode_token(data.refresh_token)
        session_id = payload.get("sid")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token."
        )

    if session_id:
        await session_service.revoke_session(session_id, str(current_user.id))

    return MessageResponse(message="Logged out successfully.")
