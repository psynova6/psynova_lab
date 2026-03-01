"""
Pydantic schemas for authentication requests and responses.
"""

import re
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

# --- Validation Constants ---
EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"


# ── Signup ──


class SignupRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_REGEX)
    phone: str | None = Field(None, max_length=20, examples=["+919876543210"])
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field("student", pattern="^(student|counselor|admin)$")

    @field_validator("password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError("Weak password pattern")
        return v
    institution_id: str | None = None
    consent: bool = Field(
        ..., description="User must accept privacy policy and terms."
    )
    consent_version: str = Field("1.0", max_length=20)


class SignupResponse(BaseModel):
    id: str
    email: str
    role: str
    is_verified: bool
    message: str


# ── Login ──


class LoginRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_REGEX)
    password: str = Field(...)
    role: str = Field(..., pattern="^(student|counselor|admin)$")

    @field_validator("password")
    @classmethod
    def validate_password_format(cls, v: str) -> str:
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError("Invalid password format")
        return v
    remember_me: bool = False
    device_info: str | None = None


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Access token TTL in seconds")


class RefreshRequest(BaseModel):
    refresh_token: str


# ── OTP Verification ──


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)


class ResendVerificationRequest(BaseModel):
    email: EmailStr


# ── Password Reset ──


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError("Weak password pattern")
        return v


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError("Weak password pattern")
        return v


# ── Generic Responses ──


class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str


# ── Session ──


class SessionOut(BaseModel):
    id: str
    device_info: str | None
    ip_address: str | None
    created_at: datetime
    expires_at: datetime
    is_current: bool = False
