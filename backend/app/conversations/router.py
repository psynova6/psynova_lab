from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from typing import List, Optional
from bson import ObjectId
from app.authentication_onboarding.models.user import AnyUser, Role, get_model_for_role
from app.authentication_onboarding.core.dependencies import get_current_user
from app import database
from app.config import settings

from .models.conversation import Conversation, ConversationType, ConversationStatus
from .models.message import Message, SenderType
from .schemas import MessageCreate, MessageRead, ConversationCreate, ConversationRead, MessageUpdate, MessageResponse
from .access_control import verify_conversation_access
from app.data_storage_and_encryption.encryption_utils import encrypt_field
from .notifier import notifier
import json
import asyncio
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/conversations", tags=["Conversations"])

def get_db():
    if database.client is None:
        raise RuntimeError("Database client not initialized. Ensure connect_db() was called.")
    return database.client[settings.MONGODB_DB_NAME]

@router.post("/", response_model=ConversationRead, status_code=201)
async def create_conversation(
    data: ConversationCreate,
    current_user: AnyUser = Depends(get_current_user)
):
    db = get_db()
    
    # 1. Role Check: Only students can initiate student-counselor chats
    if data.type == ConversationType.STUDENT_COUNSELOR and current_user.role != Role.STUDENT:
        raise HTTPException(
            status_code=403, 
            detail="Only students can initiate counselor conversations."
        )
    
    # 2. Participant Validation
    # Automatically include current user
    participants = set(data.participant_ids)
    participants.add(str(current_user.id))
    
    # Remove AI placeholder if it was manually added (not a real user)
    if "ai" in participants:
        participants.remove("ai")

    # Validate all IDs are valid ObjectIds
    for pid in participants:
        if not ObjectId.is_valid(pid):
            raise HTTPException(status_code=400, detail=f"Invalid participant ID: {pid}")
    
    participant_objs = [ObjectId(pid) for pid in participants]
    
    # 3. Verify users exist across collections
    found_users = []
    from app.authentication_onboarding.models.student import Student
    from app.authentication_onboarding.models.therapist import Therapist
    from app.authentication_onboarding.models.institution_admin import InstitutionAdmin

    for model in [Student, Therapist, InstitutionAdmin]:
        batch = await model.find({"_id": {"$in": participant_objs}}).to_list()
        found_users.extend(batch)
    
    if len(found_users) != len(participant_objs):
        raise HTTPException(status_code=404, detail="One or more participants not found.")

    # 4. Institution Check: For student-counselor, counselor must be at same institution
    if data.type == ConversationType.STUDENT_COUNSELOR:
        counselors = [u for u in found_users if u.role == Role.COUNSELOR]
        if not counselors:
            raise HTTPException(status_code=400, detail="No counselor specified for counselor-type conversation.")
        
        for counselor in counselors:
            if str(counselor.institution_id) != str(current_user.institution_id):
                raise HTTPException(
                    status_code=403, 
                    detail="Counselor must belong to the same institution as the student."
                )

    # 5. Prevent Duplicate Active Conversations
    # We check if an OPEN conversation already exists with the exact same participants and type
    existing = await db.conversations.find_one({
        "participants": {"$all": participant_objs, "$size": len(participant_objs)},
        "type": data.type.value,
        "status": ConversationStatus.OPEN.value
    })
    
    if existing:
        # Return existing conversation instead of 409 if it's already open
        # Return 200 instead of 201 for existing
        from fastapi.responses import JSONResponse
        content = ConversationRead(
            id=str(existing["_id"]),
            type=existing["type"],
            status=existing["status"],
            last_message_at=existing["last_message_at"],
            participant_ids=[str(p) for p in existing["participants"]]
        ).model_dump(mode="json")
        return JSONResponse(status_code=200, content=content)

    # 6. Create New Conversation
    conversation = Conversation(
        participants=participant_objs,
        type=data.type,
        institution_id=current_user.institution_id, # Default to student's institution
        last_message_at=datetime.now(timezone.utc)
    )
    
    conv_dict = conversation.model_dump(by_alias=True, exclude={"id"})
    result = await db.conversations.insert_one(conv_dict)
    
    return ConversationRead(
        id=str(result.inserted_id),
        type=conversation.type,
        status=conversation.status,
        last_message_at=conversation.last_message_at,
        participant_ids=[str(p) for p in participant_objs]
    )

@router.get("/", response_model=List[ConversationRead])
async def list_conversations(
    current_user: AnyUser = Depends(get_current_user)
):
    db = get_db()
    cursor = db.conversations.find(
        {"participants": current_user.id}
    ).sort("last_message_at", -1)
    
    conversations = await cursor.to_list(length=100)
    
    return [
        ConversationRead(
            id=str(c["_id"]),
            type=c["type"],
            status=c["status"],
            last_message_at=c["last_message_at"],
            participant_ids=[str(p) for p in c["participants"]]
        ) for c in conversations
    ]

@router.get("/{id}/messages", response_model=List[MessageRead])
async def get_messages(
    id: str,
    limit: int = Query(50, ge=1, le=100),
    before: Optional[datetime] = None,
    after: Optional[datetime] = None,
    current_user: AnyUser = Depends(get_current_user)
):
    """Retrieve message history with optional date range filtering."""
    db = get_db()
    
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail=f"Invalid ID: {id}")
        
    conv_id = ObjectId(id)
    logger.debug(f"[get_messages] searching for {conv_id} in {settings.MONGODB_DB_NAME}")
    
    conversation = await db.conversations.find_one({"_id": conv_id})
    if not conversation:
        logger.debug(f"[get_messages] {conv_id} NOT FOUND")
        raise HTTPException(status_code=404, detail="Conversation lookup (history) failed")
        
    await verify_conversation_access(current_user, conversation)
    
    query = {"conversation_id": conv_id, "is_deleted": False}
    
    # Date range filtering
    if before or after:
        query["created_at"] = {}
        if before:
            query["created_at"]["$lt"] = before
        if after:
            query["created_at"]["$gt"] = after
    
    cursor = db.messages.find(query).sort("created_at", -1).limit(limit)
    
    messages_raw = await cursor.to_list(length=limit)
    messages_raw.reverse() # Show in chronological order
    
    result = []
    for m in messages_raw:
        msg_obj = Message(**m)
        result.append(MessageRead(
            id=str(m["_id"]),
            sender_id=str(m["sender_id"]) if m.get("sender_id") else None,
            sender_type=m["sender_type"],
            content=msg_obj.get_content() or "",
            metadata=m.get("metadata", {}),
            created_at=m["created_at"],
            is_read=current_user.id in m.get("read_by", [])
        ))
    
    return result

@router.get("/{id}/stream")
async def stream_messages(
    id: str,
    current_user: AnyUser = Depends(get_current_user)
):
    """
    Subscribe to real-time message updates via Server-Sent Events (SSE).
    """
    db = get_db()
    conv_id = ObjectId(id)
    
    conversation = await db.conversations.find_one({"_id": conv_id})
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    await verify_conversation_access(current_user, conversation)

    async def event_generator():
        queue = notifier.subscribe(id)
        try:
            while True:
                # Wait for a new message
                message_data = await queue.get()
                # Yield in SSE format
                yield f"data: {json.dumps(message_data)}\n\n"
        except (asyncio.CancelledError, Exception):
            # Ensure unsubscribe always runs
            raise
        finally:
            notifier.unsubscribe(id, queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/{id}/messages", response_model=MessageRead)
async def send_message(
    id: str,
    data: MessageCreate,
    current_user: AnyUser = Depends(get_current_user)
):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid conversation ID")
    conv_id = ObjectId(id)
    
    conversation = await db.conversations.find_one({"_id": conv_id})
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    if conversation["status"] != ConversationStatus.OPEN.value:
        raise HTTPException(status_code=400, detail="Conversation is closed")
        
    await verify_conversation_access(current_user, conversation)
    
    # Explicit mapping for sender types
    role_to_sender = {
        Role.STUDENT: SenderType.STUDENT,
        Role.COUNSELOR: SenderType.COUNSELOR,
        Role.ADMIN: SenderType.COUNSELOR # Or add ADMIN to SenderType
    }
    sender_type = role_to_sender.get(current_user.role, SenderType.COUNSELOR)
    
    message = Message.create_encrypted(
        content=data.content,
        conversation_id=conv_id,
        sender_id=current_user.id,
        sender_type=sender_type,
        metadata=data.metadata,
        read_by=[current_user.id] # Sender has read their own message
    )
    
    msg_dict = message.model_dump(by_alias=True, exclude={"id"})
    result = await db.messages.insert_one(msg_dict)
    
    # 7. Update conversation last message timestamp
    await db.conversations.update_one(
        {"_id": conv_id},
        {"$set": {"last_message_at": msg_dict["created_at"]}}
    )

    # 8. Broadcast the new message for streaming
    msg_read = MessageRead(
        id=str(result.inserted_id),
        sender_id=str(current_user.id),
        sender_type=sender_type,
        content=data.content,
        metadata=data.metadata,
        created_at=message.created_at
    )
    await notifier.broadcast(id, msg_read.model_dump(mode="json"))
    
    return msg_read

@router.patch("/{id}/messages/{message_id}", response_model=MessageRead)
async def edit_message(
    id: str,
    message_id: str,
    data: MessageUpdate,
    current_user: AnyUser = Depends(get_current_user)
):
    """Edit an existing message. Only the sender can edit their messages."""
    db = get_db()
    if not ObjectId.is_valid(id) or not ObjectId.is_valid(message_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    msg_id = ObjectId(message_id)
    conv_id = ObjectId(id)
    
    message_raw = await db.messages.find_one({"_id": msg_id, "conversation_id": conv_id})
    if not message_raw:
        raise HTTPException(status_code=404, detail="Message not found")
        
    # Only the original sender (non-AI) can edit their message
    if str(message_raw.get("sender_id")) != str(current_user.id):
        raise HTTPException(status_code=403, detail="You can only edit your own messages.")
    
    # Encrypt new content
    encrypted = encrypt_field(data.content)
    
    await db.messages.update_one(
        {"_id": msg_id},
        {"$set": {
            "encrypted_content": encrypted,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    
    # Broadcast the edit for streaming
    # Use existing message_raw instead of extra DB read for metadata/sender_type
    msg_read = MessageRead(
        id=str(msg_id),
        sender_id=str(current_user.id),
        sender_type=message_raw["sender_type"],
        content=data.content,
        metadata=message_raw.get("metadata", {}),
        created_at=message_raw["created_at"]
    )
    await notifier.broadcast(id, {"type": "edit", "message": msg_read.model_dump(mode="json")})
    
    return msg_read

@router.delete("/{id}/messages/{message_id}", response_model=MessageResponse)
async def delete_message(
    id: str,
    message_id: str,
    current_user: AnyUser = Depends(get_current_user)
):
    """Soft-delete a message. Only the sender or an admin can delete."""
    db = get_db()
    if not ObjectId.is_valid(id) or not ObjectId.is_valid(message_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    msg_id = ObjectId(message_id)
    conv_id = ObjectId(id)
    
    message_raw = await db.messages.find_one({"_id": msg_id, "conversation_id": conv_id})
    if not message_raw:
        raise HTTPException(status_code=404, detail="Message not found")
        
    if str(message_raw.get("sender_id")) != str(current_user.id) and current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to delete this message.")
        
    await db.messages.update_one(
        {"_id": msg_id},
        {"$set": {"is_deleted": True, "updated_at": datetime.now(timezone.utc)}}
    )
    
    # Broadcast the deletion
    await notifier.broadcast(id, {"type": "delete", "message_id": message_id})
    
    return MessageResponse(message="Message deleted successfully.")

@router.post("/{id}/read", response_model=MessageResponse)
async def mark_as_read(
    id: str,
    current_user: AnyUser = Depends(get_current_user)
):
    """Mark all messages in a conversation as read by the current user."""
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    conv_id = ObjectId(id)
    
    conversation = await db.conversations.find_one({"_id": conv_id})
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    await verify_conversation_access(current_user, conversation)
    
    # Update all messages that don't have this user in read_by
    await db.messages.update_many(
        {"conversation_id": conv_id, "read_by": {"$ne": current_user.id}},
        {"$addToSet": {"read_by": current_user.id}}
    )
    
    # Broadcast a read receipt
    await notifier.broadcast(id, {"type": "read", "user_id": str(current_user.id)})
    
    return MessageResponse(message="Conversation marked as read.")

@router.post("/{id}/close", response_model=MessageResponse)
async def close_conversation(
    id: str,
    current_user: AnyUser = Depends(get_current_user)
):
    """Close the conversation, preventing further messages."""
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    conv_id = ObjectId(id)
    
    conversation = await db.conversations.find_one({"_id": conv_id})
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    await verify_conversation_access(current_user, conversation)
    
    await db.conversations.update_one(
        {"_id": conv_id},
        {"$set": {
            "status": ConversationStatus.CLOSED,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    
    return MessageResponse(message="Conversation closed successfully.")
