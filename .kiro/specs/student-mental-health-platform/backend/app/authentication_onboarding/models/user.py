from __future__ import annotations
"""
Role enum and shared type alias for all role-based user collections.

The monolithic `User` Document has been replaced by three dedicated collections:
  - Student   → 'students'
  - Therapist → 'therapists'
  - InstitutionAdmin → 'institution_admins'

This module re-exports the Role enum and a union type used for type hints
throughout the auth infrastructure.
"""

import enum
from typing import Union, TYPE_CHECKING

if TYPE_CHECKING:
    from app.authentication_onboarding.models.student import Student
    from app.authentication_onboarding.models.therapist import Therapist
    from app.authentication_onboarding.models.institution_admin import InstitutionAdmin

# Role enum — still used in JWT payloads, auth service, and conversations
class Role(str, enum.Enum):
    """Application roles mapped to their respective collections."""

    STUDENT = "student"
    COUNSELOR = "counselor"
    ADMIN = "admin"


# Role-based user union type alias
AnyUser = Union["Student", "Therapist", "InstitutionAdmin"]


# Convenience mapping: role string → Beanie Document class
def get_model_for_role(role: str):
    """Return the correct Beanie Document class for the given role string."""
    from app.authentication_onboarding.models.student import Student
    from app.authentication_onboarding.models.therapist import Therapist
    from app.authentication_onboarding.models.institution_admin import InstitutionAdmin

    mapping = {
        Role.STUDENT.value: Student,
        Role.COUNSELOR.value: Therapist,
        Role.ADMIN.value: InstitutionAdmin,
    }
    model = mapping.get(role)
    if model is None:
        raise ValueError(f"Unknown role: {role!r}. Expected one of {list(mapping.keys())}")
    return model


async def get_user_by_id(user_id):
    """
    Search for a user across all role-based collections by their ID.
    Returns the Beanie Document (Student, Therapist, or InstitutionAdmin) or None.
    """
    from app.authentication_onboarding.models.student import Student
    from app.authentication_onboarding.models.therapist import Therapist
    from app.authentication_onboarding.models.institution_admin import InstitutionAdmin

    for model in [Student, Therapist, InstitutionAdmin]:
        user = await model.get(user_id)
        if user:
            return user
    return None
