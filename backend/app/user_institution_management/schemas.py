"""
Pydantic schemas for User & Institution Management.
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# --- Institution Schemas ---

class InstitutionBase(BaseModel):
    name: str
    domain: str
    address: Optional[str] = None
    contact_info: Optional[Dict] = None

class InstitutionCreate(InstitutionBase):
    pass

class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None
    address: Optional[str] = None
    contact_info: Optional[Dict] = None
    is_active: Optional[bool] = None

class InstitutionResponse(InstitutionBase):
    id: str
    is_active: bool
    created_at: datetime

# --- User Profile & Role Schemas ---

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    language: Optional[str] = None
    preferences: Optional[Dict] = None
    consent_flags: Optional[Dict] = None

class RoleAssignment(BaseModel):
    user_id: str
    institution_id: str
    roles: List[str]

class UserInstitutionResponse(BaseModel):
    id: str
    user_id: str
    institution_id: str
    roles: List[str]
    is_active: bool
    joined_at: datetime
