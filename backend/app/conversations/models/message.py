from enum import Enum
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict, field_serializer
from typing_extensions import Annotated
from app.data_storage_and_encryption.encryption_utils import encrypt_field, decrypt_field

class SenderType(str, Enum):
    STUDENT = "student"
    AI = "ai"
    COUNSELOR = "counselor"

class Message(BaseModel):
    """Represents an individual message within a conversation."""
    id: Annotated[Optional[ObjectId], Field(default=None, alias="_id")] = None
    conversation_id: Annotated[ObjectId, Field(...)]
    sender_id: Annotated[Optional[ObjectId], Field(default=None)] = None
    sender_type: SenderType
    
    # Content is stored encrypted
    encrypted_content: str
    
    metadata: Dict[str, Any] = Field(default_factory=dict)
    is_deleted: bool = False
    read_by: List[Any] = Field(default_factory=list)
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

    @field_serializer("id", "conversation_id", "sender_id", when_used="json")
    def serialize_object_id(self, v: Any) -> Optional[str]:
        return str(v) if v else None

    @staticmethod
    def create_encrypted(content: str, **kwargs) -> "Message":
        # Guard against manual override of encrypted_content
        if "encrypted_content" in kwargs:
            raise ValueError("Callers cannot supply encrypted_content directly.")
            
        encrypted = encrypt_field(content)
        return Message(encrypted_content=encrypted, **kwargs)

    def get_content(self) -> Optional[str]:
        return decrypt_field(self.encrypted_content)
