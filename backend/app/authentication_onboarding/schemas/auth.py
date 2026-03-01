"""
Pydantic schemas for authentication requests and responses.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Signup ──


class SignupRequest(BaseModel):
    email: EmailStr
    phone: str | None = Field(None, max_length=20, examples=["+919876543210"])
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field("student", pattern="^(student|counselor|admin)$")
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
    email: EmailStr
    password: str
    role: str = Field(..., pattern="^(student|counselor|admin)$")
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


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


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
