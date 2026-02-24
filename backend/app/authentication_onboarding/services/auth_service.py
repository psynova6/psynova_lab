"""
Core authentication business logic — signup and login orchestration (MongoDB / Beanie).
"""

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
from app.authentication_onboarding.models.user import Role, User
from app.authentication_onboarding.models.verification import (
    PasswordResetToken,
    VerificationPurpose,
    VerificationToken,
)
from app.authentication_onboarding.schemas.auth import SignupRequest, TokenPair
from app.authentication_onboarding.services import email_service, session_service
from app.config import settings


# ── Signup ──


async def signup(data: SignupRequest) -> tuple[User, str]:
    """
    Register a new user:
    1. Validate consent & uniqueness
    2. Create user document
    3. Generate email verification OTP
    4. Send verification email (stub)

    Returns (user, raw_otp).
    """
    if not data.consent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consent to the privacy policy is required.",
        )

    # Check duplicate
    existing = await User.find_one(User.email == data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        email=data.email,
        phone=data.phone,
        hashed_password=hash_password(data.password),
        role=Role(data.role),
        institution_id=data.institution_id,
        consent_given_at=datetime.now(timezone.utc),
        consent_version=data.consent_version,
    )
    await user.insert()

    # Generate & persist OTP
    raw_otp = generate_otp()
    token = VerificationToken(
        user_id=str(user.id),
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
    remember_me: bool = False,
    device_info: str | None = None,
    ip_address: str | None = None,
) -> TokenPair:
    """
    Authenticate a user and return an access + refresh token pair.

    Enforces:
    - Rate limiting (5 attempts / 15 min per email)
    - Auto-block after 10 consecutive failures
    - Blocked / inactive / unverified account checks
    """
    rate_key = f"login:{email}"
    rate_limiter.check(rate_key, settings.LOGIN_MAX_ATTEMPTS, settings.LOGIN_WINDOW_MINUTES * 60)

    user = await User.find_one(User.email == email)

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

    # Reset failure counters on success
    user.failed_login_attempts = 0
    await user.save()
    rate_limiter.reset(rate_key)

    # Create session
    session, raw_refresh = await session_service.create_session(
        user_id=str(user.id),
        remember_me=remember_me,
        device_info=device_info,
        ip_address=ip_address,
    )

    access_token = create_access_token(sub=str(user.id), role=user.role.value)

    return TokenPair(
        access_token=access_token,
        refresh_token=raw_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


import logging
log = logging.getLogger(__name__)

async def verify_email_otp(email: str, code: str) -> User:
    """Validate a 6-digit OTP and mark the user as verified."""
    user = await User.find_one(User.email == email)
    if not user:
        log.warning(f"Verification failed: User not found for email {email}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if user.is_verified:
        log.info(f"User {email} already verified.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified."
        )

    # Fetch latest unused OTP
    token = await VerificationToken.find_one(
        VerificationToken.user_id == str(user.id),
        VerificationToken.purpose == VerificationPurpose.EMAIL_VERIFY,
        VerificationToken.used_at == None,  # noqa: E711
        sort=[("created_at", -1)],
    )

    if not token:
        log.warning(f"No pending verification token found for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No pending verification code."
        )
    
    if token.is_expired:
        log.warning(f"Verification token for user {user.id} has expired (expires_at={token.expires_at})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code has expired."
        )
    
    if token.attempts >= settings.OTP_MAX_ATTEMPTS:
        log.warning(f"Too many verification attempts for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed attempts. Request a new code.",
        )

    token.attempts += 1
    if not verify_otp(code, token.code_hash):
        log.warning(f"Invalid OTP code provided for user {user.id} (code: {code})")
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


async def resend_verification(email: str) -> None:
    """Generate and send a new OTP. Rate-limited to 3 per hour."""
    rate_key = f"resend:{email}"
    rate_limiter.check(rate_key, settings.OTP_MAX_RESENDS_PER_HOUR, 3600)

    user = await User.find_one(User.email == email)
    if not user:
        return  # don't reveal whether account exists
    if user.is_verified:
        return

    raw_otp = generate_otp()
    token = VerificationToken(
        user_id=str(user.id),
        code_hash=hash_otp(raw_otp),
        purpose=VerificationPurpose.EMAIL_VERIFY,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    )
    await token.insert()
    rate_limiter.record(rate_key)
    await email_service.send_verification_email(user.email, raw_otp)


# ── Password Reset ──


async def request_password_reset(email: str) -> None:
    """Create a password-reset token and send it via email."""
    rate_key = f"pwd_reset:{email}"
    rate_limiter.check(rate_key, 3, 3600)

    user = await User.find_one(User.email == email)
    if not user:
        return  # don't reveal whether account exists

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
    """Validate a reset token and update the password."""
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

    from beanie import PydanticObjectId

    user = await User.get(PydanticObjectId(token.user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.hashed_password = hash_password(new_password)
    user.updated_at = datetime.now(timezone.utc)
    await user.save()

    token.used_at = datetime.now(timezone.utc)
    await token.save()


async def change_password(user: User, current_password: str, new_password: str) -> None:
    """Change password for a logged-in user after verifying the current password."""
    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect."
        )
    user.hashed_password = hash_password(new_password)
    user.updated_at = datetime.now(timezone.utc)
    await user.save()
