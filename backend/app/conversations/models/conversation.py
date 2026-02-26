from enum import Enum
from datetime import datetime, timezone
from typing import Annotated, Any, List, Optional
from pydantic import BaseModel, Field, ConfigDict, GetCoreSchemaHandler, GetJsonSchemaHandler
from bson import ObjectId

from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x), when_used="json"
            ),
        )

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, _core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler) -> Any:
        return handler(core_schema.str_schema())

class ConversationType(str, Enum):
    STUDENT_AI = "student_ai"
    STUDENT_COUNSELOR = "student_counselor"
    MIXED = "mixed"

class ConversationStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
    ARCHIVED = "archived"

class Conversation(BaseModel):
    """Represents a chat conversation between student, AI, and/or counselors."""
    id: Annotated[Optional[PyObjectId], Field(default=None, alias="_id")] = None
    participants: List[PyObjectId] = Field(default_factory=list)
    type: ConversationType = ConversationType.STUDENT_AI
    status: ConversationStatus = ConversationStatus.OPEN
    institution_id: Optional[str] = None
    
    last_message_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
