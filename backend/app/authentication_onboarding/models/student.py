from __future__ import annotations
"""
Student document model — stored in the 'students' MongoDB collection.
"""

from typing import Optional

from beanie import Document, Indexed
from pydantic import EmailStr

from .base_user import BaseUserMixin


class Student(BaseUserMixin, Document):
    """Represents a student user on the platform."""

    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]

    # Student-specific fields
    institution_id: Optional[str] = None   # Reference to Institution._id
    student_id: Optional[str] = None       # Official student roll/ID number
    program: Optional[str] = None          # e.g., "B.Tech Computer Science"
    year_of_study: Optional[int] = None    # e.g., 1, 2, 3, 4

    @property
    def role(self) -> Role:
        from .user import Role
        return Role.STUDENT

    class Settings:
        name = "students"

    def __repr__(self) -> str:
        return f"<Student {self.email}>"


Student.model_rebuild()
