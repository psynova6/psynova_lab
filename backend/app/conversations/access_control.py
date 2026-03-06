from fastapi import HTTPException, status
from app.authentication_onboarding.models.user import AnyUser, Role
from .models.conversation import Conversation
from bson import ObjectId

async def verify_conversation_access(user: AnyUser, conversation_data: dict):
    """
    Verifies if a user has access to a conversation.
    conversation_data is the raw dictionary from MongoDB.
    """
    if user.role == Role.ADMIN:
        return True
        
    # Check if user is an explicit participant
    participant_ids = conversation_data.get("participants", [])
    user_id = user.id # Beanie Document id is already an ObjectId
    
    if any(str(p_id) == str(user_id) for p_id in participant_ids):
        return True
        
    # Counselors with correct institution access
    institution_id = conversation_data.get("institution_id")
    if user.role == Role.COUNSELOR and institution_id is not None and user.institution_id is not None:
        if str(institution_id) == str(user.institution_id):
            return True

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have access to this conversation."
    )
