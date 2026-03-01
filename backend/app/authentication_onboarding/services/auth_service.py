"""
Core authentication business logic — signup and login orchestration.
Routes each operation to the correct role-specific MongoDB collection:
  - student   → Student  ('students')
  - counselor → Therapist ('therapists')
  - admin     → InstitutionAdmin ('institution_admins')
"""

import logging
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status

from app.authentication_onboarding.core.otp import generate_otp, hash_otp, verify_otp
from app.authentication_onboarding.core.rate_limit import rate_limiter
from app.authentication_onboarding.core.security import (
    create_access_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.authentication_onboarding.models.user import Role, get_model_for_role
from app.authentication_onboarding.models.verification import (
    PasswordResetToken,
    VerificationPurpose,
    VerificationToken,
)
from app.authentication_onboarding.schemas.auth import SignupRequest, TokenPair
from app.authentication_onboarding.services import email_service, session_service
from app.config import settings

log = logging.getLogger(__name__)


# ── Helpers ──


def _get_role_model(role_str: str):
    """Resolve role string to the correct Beanie Document model class."""
    try:
        return get_model_for_role(role_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role: {role_str!r}.",
        )


async def _find_user_by_email(email: str, role_str: str):
    """Look up a user from the correct role-scoped collection."""
    UserModel = _get_role_model(role_str)
    return await UserModel.find_one(UserModel.email == email)


# ── Signup ──


async def signup(data: SignupRequest):
    """
    Register a new user in the role-specific collection.
    1. Validate consent & uniqueness within that collection
    2. Create role-specific document (Student / Therapist / InstitutionAdmin)
    3. Generate email verification OTP
    4. Send verification email
    """
    if not data.consent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consent to the privacy policy is required.",
        )

    UserModel = _get_role_model(data.role)

    # Check for duplicate email within the same role's collection
    existing = await UserModel.find_one(UserModel.email == data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Build role-specific instance with common + role-specific defaults
    common_fields = dict(
        email=data.email,
        phone=data.phone,
        hashed_password=hash_password(data.password),
        consent_given_at=datetime.now(timezone.utc),
        consent_version=data.consent_version,
    )

    # Role-specific extra fields
    if data.role == Role.STUDENT.value:
        from app.authentication_onboarding.models.student import Student
        user = Student(**common_fields, institution_id=data.institution_id)

    elif data.role == Role.COUNSELOR.value:
        from app.authentication_onboarding.models.therapist import Therapist
        user = Therapist(**common_fields, institution_id=data.institution_id)

    else:  # admin
        from app.authentication_onboarding.models.institution_admin import InstitutionAdmin
        user = InstitutionAdmin(**common_fields, institution_id=data.institution_id)

    await user.insert()

    # Generate & persist OTP (store user_role so verify can find the right collection)
    raw_otp = generate_otp()
    log.debug(f"Generated OTP for {user.email}")
    token = VerificationToken(
        user_id=str(user.id),
        user_role=data.role,
        code_hash=hash_otp(raw_otp),
        purpose=VerificationPurpose.EMAIL_VERIFY,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    )
    await token.insert()

    await email_service.send_verification_email(user.email, raw_otp)
    return user, raw_otp


# ── Login ──


async def login(
    email: str,
    password: str,
    role: str,
    remember_me: bool = False,
    device_info: str | None = None,
    ip_address: str | None = None,
) -> TokenPair:
    """
    Authenticate a user from the role-specific collection and return tokens.

    Enforces:
    - Role validation (wrong portal → 403)
    - Rate limiting (5 attempts / 15 min per email)
    - Auto-block after 10 consecutive failures
    - Blocked / inactive / unverified account checks
    """
    rate_key = f"login:{email}"
    rate_limiter.check(rate_key, settings.LOGIN_MAX_ATTEMPTS, settings.LOGIN_WINDOW_MINUTES * 60)

    # Look up ONLY in the correct collection for this role
    user = await _find_user_by_email(email, role)

    if user is None or not verify_password(password, user.hashed_password):
        rate_limiter.record(rate_key)
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.AUTO_BLOCK_AFTER_FAILURES:
                user.is_blocked = True
            await user.save()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is blocked. Contact support.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first.",
        )

    # Reset failure counter on success
    user.failed_login_attempts = 0
    await user.save()
    rate_limiter.reset(rate_key)

    # Create session & tokens
    session, raw_refresh = await session_service.create_session(
        user_id=str(user.id),
        role=role,
        remember_me=remember_me,
        device_info=device_info,
        ip_address=ip_address,
    )

    access_token = create_access_token(sub=str(user.id), role=role)

    return TokenPair(
        access_token=access_token,
        refresh_token=raw_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


# ── OTP Verification ──


async def verify_email_otp(email: str, code: str):
    """Validate a 6-digit OTP and mark the user as verified in the correct collection."""

    # 1. Locate the user across collections to get their ID and role
    user = None
    for role_val in [Role.STUDENT.value, Role.COUNSELOR.value, Role.ADMIN.value]:
        UserModel = _get_role_model(role_val)
        candidate = await UserModel.find_one(UserModel.email == email)
        if candidate:
            user = candidate
            break

    if not user:
        log.warning(f"Verification failed: no user found for email {email}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # 2. Find the specific pending OTP token for this user
    token = await VerificationToken.find_one(
        VerificationToken.user_id == str(user.id),
        VerificationToken.purpose == VerificationPurpose.EMAIL_VERIFY,
        VerificationToken.used_at == None,  # noqa: E711
        sort=[("created_at", -1)],
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No pending verification code for this account."
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified."
        )

    if token.is_expired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code has expired."
        )

    if token.attempts >= settings.OTP_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed attempts. Request a new code.",
        )

    token.attempts += 1
    if not verify_otp(code, token.code_hash):
        await token.save()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code."
        )

    log.info(f"OTP verified successfully for user {user.id}")
    token.used_at = datetime.now(timezone.utc)
    await token.save()

    user.is_verified = True
    user.updated_at = datetime.now(timezone.utc)
    await user.save()
    return user


# ── Resend Verification ──


async def resend_verification(email: str) -> None:
    """Generate and send a new OTP. Tries all collections if role is unknown."""
    rate_key = f"resend:{email}"
    rate_limiter.check(rate_key, settings.OTP_MAX_RESENDS_PER_HOUR, 3600)

    # Search across all collections to find the unverified user
    user = None
    for role_val in [Role.STUDENT.value, Role.COUNSELOR.value, Role.ADMIN.value]:
        UserModel = get_model_for_role(role_val)
        candidate = await UserModel.find_one(UserModel.email == email)
        if candidate:
            user = candidate
            role_val_found = role_val
            break

    if not user or user.is_verified:
        return  # Don't reveal whether account exists

    raw_otp = generate_otp()
    log.debug(f"Resent OTP for {user.email}")
    token = VerificationToken(
        user_id=str(user.id),
        user_role=role_val_found,
        code_hash=hash_otp(raw_otp),
        purpose=VerificationPurpose.EMAIL_VERIFY,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    )
    await token.insert()
    rate_limiter.record(rate_key)
    await email_service.send_verification_email(user.email, raw_otp)


# ── Password Reset ──


async def request_password_reset(email: str) -> None:
    """Create a password-reset token and send it via email. Searches all collections."""
    rate_key = f"pwd_reset:{email}"
    rate_limiter.check(rate_key, 3, 3600)

    user = None
    for role_val in [Role.STUDENT.value, Role.COUNSELOR.value, Role.ADMIN.value]:
        UserModel = get_model_for_role(role_val)
        candidate = await UserModel.find_one(UserModel.email == email)
        if candidate:
            user = candidate
            break

    if not user:
        return  # Don't reveal whether account exists

    raw_token = secrets.token_urlsafe(48)
    reset = PasswordResetToken(
        user_id=str(user.id),
        token_hash=hash_token(raw_token),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    await reset.insert()
    rate_limiter.record(rate_key)
    await email_service.send_password_reset_email(user.email, raw_token)


async def reset_password(raw_token: str, new_password: str) -> None:
    """Validate a reset token and update the password in the correct collection."""
    from beanie import PydanticObjectId

    token_hash_val = hash_token(raw_token)
    token = await PasswordResetToken.find_one(
        PasswordResetToken.token_hash == token_hash_val,
        PasswordResetToken.used_at == None,  # noqa: E711
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token."
        )
    if token.is_expired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token has expired."
        )

    # Search all collections for the user
    user = None
    for role_val in [Role.STUDENT.value, Role.COUNSELOR.value, Role.ADMIN.value]:
        UserModel = get_model_for_role(role_val)
        candidate = await UserModel.get(PydanticObjectId(token.user_id))
        if candidate:
            user = candidate
            break

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.hashed_password = hash_password(new_password)
    user.updated_at = datetime.now(timezone.utc)
    await user.save()

    token.used_at = datetime.now(timezone.utc)
    await token.save()


async def change_password(user, current_password: str, new_password: str) -> None:
    """Change password for a logged-in user after verifying the current password."""
    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect."
        )
    user.hashed_password = hash_password(new_password)
    user.updated_at = datetime.now(timezone.utc)
    await user.save()
