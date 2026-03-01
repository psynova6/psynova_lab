"""
Core authentication business logic — signup and login orchestration.
Routes each operation to the correct role-specific MongoDB collection:
  - student   → Student  ('students')
  - counselor → Therapist ('therapists')
  - admin     → InstitutionAdmin ('institution_admins')
"""

import logging
import re
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
from app.authentication_onboarding.schemas.auth import SignupRequest, TokenPair, EMAIL_REGEX, PASSWORD_REGEX
from app.authentication_onboarding.services import email_service, session_service
from app.config import settings

log = logging.getLogger(__name__)


def validate_email_format(email: str):
    """Raise 400 if email is invalid."""
    if not re.match(EMAIL_REGEX, email):
        log.warning(f"Auth rejected: invalid email format {email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format (e.g. test@gmail.com)."
        )


def validate_password_format(password: str, is_signup: bool = False):
    """Raise 400 if password is weak (signup) or invalid format (login)."""
    if not re.match(PASSWORD_REGEX, password):
        log.warning("Auth rejected: password pattern mismatch")
        if is_signup:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Weak password: Must be 8+ chars with uppercase, lowercase, digit, and special char (@$!%*?&)."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password format."
            )


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
    1. Validate consent & uniqueness across ALL roles
    2. Create role-specific document (Student / Therapist / InstitutionAdmin)
    3. Generate email verification OTP
    4. Send verification email
    """
    log.info(f"Signup initiated for email={data.email}, role={data.role}")

    # 0. Manual validation for 400 error codes + descriptive messages
    validate_email_format(data.email)
    validate_password_format(data.password, is_signup=True)

    if not data.consent:
        log.warning(f"Signup rejected: consent not given for {data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consent to the privacy policy is required.",
        )

    # 1. Check for duplicate email across ALL roles
    # The requirement is that one email cannot exist in multiple roles.
    found_user = None
    for role_val in [Role.STUDENT.value, Role.COUNSELOR.value, Role.ADMIN.value]:
        UserModel = get_model_for_role(role_val)
        existing = await UserModel.find_one(UserModel.email == data.email)
        if existing:
            found_user = existing
            break

    if found_user:
        log.warning(f"Signup conflict: email {data.email} already exists in role {found_user.role}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    UserModel = _get_role_model(data.role)

    # 2. Build role-specific instance
    common_fields = dict(
        email=data.email,
        phone=data.phone,
        hashed_password=hash_password(data.password),
        consent_given_at=datetime.now(timezone.utc),
        consent_version=data.consent_version,
    )

    try:
        if data.role == Role.STUDENT.value:
            from app.authentication_onboarding.models.student import Student
            user = Student(**common_fields, institution_id=data.institution_id)
        elif data.role == Role.COUNSELOR.value:
            from app.authentication_onboarding.models.therapist import Therapist
            user = Therapist(**common_fields, institution_id=data.institution_id)
        else:
            from app.authentication_onboarding.models.institution_admin import InstitutionAdmin
            user = InstitutionAdmin(**common_fields, institution_id=data.institution_id)

        await user.insert()
        log.info(f"User document created: id={user.id}, role={user.role}")

        # 3. OTP generation
        raw_otp = generate_otp()
        token = VerificationToken(
            user_id=str(user.id),
            user_role=data.role,
            code_hash=hash_otp(raw_otp),
            purpose=VerificationPurpose.EMAIL_VERIFY,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
        )
        await token.insert()
        log.info(f"OTP generated and stored for {user.email}")

        # 4. Send email
        await email_service.send_verification_email(user.email, raw_otp)
        log.info(f"Verification email sent to {user.email}")
        
        return user, raw_otp

    except Exception as e:
        log.exception(f"Unexpected error during signup for {data.email}: {e}")
        # If user was created but OTP or email failed, we might want to let them retry verification via login
        # but here we follow the request for clean handling.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during account creation. Please try again.",
        )


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
    Authenticate a user and return tokens.
    Enforces role strictness and provides detailed logging.
    """
    log.info(f"Login attempt: email={email}, requested_role={role}")

    # 0. Manual validation for 400 error codes + descriptive messages
    validate_email_format(email)
    validate_password_format(password, is_signup=False)
    
    rate_key = f"login:{email}"
    rate_limiter.check(rate_key, settings.LOGIN_MAX_ATTEMPTS, settings.LOGIN_WINDOW_MINUTES * 60)

    # 1. Find user across ALL roles to provide better feedback (e.g., Role Mismatch)
    user = None
    found_in_role = None
    for role_val in [Role.STUDENT.value, Role.COUNSELOR.value, Role.ADMIN.value]:
        UserModel = get_model_for_role(role_val)
        candidate = await UserModel.find_one(UserModel.email == email)
        if candidate:
            user = candidate
            found_in_role = role_val
            break

    if user is None:
        log.warning(f"Login failed: user not found for {email}")
        rate_limiter.record(rate_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # 2. Verify Password
    if not verify_password(password, user.hashed_password):
        log.warning(f"Login failed: incorrect password for {email}")
        rate_limiter.record(rate_key)
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= settings.AUTO_BLOCK_AFTER_FAILURES:
            user.is_blocked = True
            log.warning(f"User {email} auto-blocked due to failed attempts")
        await user.save()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # 3. Verify Role (Issue 2 Fix)
    if found_in_role != role:
        log.warning(f"Login failed: role mismatch for {email}. Expected {found_in_role}, got {role}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Role mismatch. Please log in through the correct portal.",
        )

    # 4. Status Checks
    if user.is_blocked:
        log.warning(f"Login rejected: user {email} is blocked")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is blocked. Contact support.",
        )
    if not user.is_active:
        log.warning(f"Login rejected: user {email} is inactive")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )
    if not user.is_verified:
        log.warning(f"Login rejected: user {email} is not verified")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first.",
        )

    log.info(f"Authentication successful for {email}")
    
    # Reset failure counter
    user.failed_login_attempts = 0
    await user.save()
    rate_limiter.reset(rate_key)

    # 5. Create Session & Tokens
    try:
        session, raw_refresh = await session_service.create_session(
            user_id=str(user.id),
            role=role,
            remember_me=remember_me,
            device_info=device_info,
            ip_address=ip_address,
        )
        
        access_token = create_access_token(sub=str(user.id), role=role)
        log.info(f"JWT tokens created for {email}")

        return TokenPair(
            access_token=access_token,
            refresh_token=raw_refresh,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
    except Exception as e:
        log.exception(f"Session creation failed for {email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during authentication.",
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

    validate_password_format(new_password, is_signup=True)

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
    validate_password_format(new_password, is_signup=True)
    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect."
        )
    user.hashed_password = hash_password(new_password)
    user.updated_at = datetime.now(timezone.utc)
    await user.save()
