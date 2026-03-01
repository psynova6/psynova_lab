"""
Pydantic schemas for user-facing responses.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: str
    email: EmailStr
    phone: str | None = None
    role: str
    institution_id: str | None = None
    is_verified: bool
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
