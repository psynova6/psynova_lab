from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from .models.conversation import ConversationType, ConversationStatus
from .models.message import SenderType
from datetime import datetime

class MessageCreate(BaseModel):
    content: str
    metadata: dict = {}

class MessageUpdate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    message: str

class MessageRead(BaseModel):
    id: str
    sender_id: Optional[str] = Field(default=None)
    sender_type: SenderType
    content: str
    metadata: dict
    created_at: datetime
    is_read: bool = False
    
    model_config = ConfigDict(from_attributes=True)

class ConversationCreate(BaseModel):
    participant_ids: List[str]
    type: ConversationType = ConversationType.STUDENT_AI
    institution_id: Optional[str] = None

class ConversationRead(BaseModel):
    id: str
    type: ConversationType
    status: ConversationStatus
    last_message_at: Optional[datetime]
    participant_ids: List[str]
    
    model_config = ConfigDict(from_attributes=True)
