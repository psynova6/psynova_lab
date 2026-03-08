from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from app.authentication_onboarding.core.dependencies import get_current_user
from app.authentication_onboarding.models.user import AnyUser
from app.games.models import UserGameProgress
from app.games.schemas import GameProgressUpdate, GameProgressOut

router = APIRouter(prefix="/games", tags=["Games"])

@router.get("/progress/{game_id}", response_model=Optional[GameProgressOut])
async def get_progress(
    game_id: str,
    current_user: AnyUser = Depends(get_current_user)
):
    user_id = str(current_user.id)
    progress = await UserGameProgress.find_one(
        UserGameProgress.user_id == user_id,
        UserGameProgress.game_id == game_id
    )
    return progress

@router.put("/progress/{game_id}", response_model=GameProgressOut)
async def update_progress(
    game_id: str,
    update: GameProgressUpdate,
    current_user: AnyUser = Depends(get_current_user)
):
    user_id = str(current_user.id)
    
    progress = await UserGameProgress.find_one(
        UserGameProgress.user_id == user_id,
        UserGameProgress.game_id == game_id
    )
    
    if progress:
        progress.current_scene_id = update.current_scene_id
        progress.flags = update.flags
        progress.history = update.history
        progress.completed_endings = update.completed_endings
        progress.last_updated = datetime.utcnow()
        await progress.save()
    else:
        progress = UserGameProgress(
            user_id=user_id,
            game_id=game_id,
            current_scene_id=update.current_scene_id,
            flags=update.flags,
            history=update.history,
            completed_endings=update.completed_endings
        )
        await progress.insert()
    
    return progress

@router.delete("/progress/{game_id}")
async def reset_progress(
    game_id: str,
    current_user: AnyUser = Depends(get_current_user)
):
    user_id = str(current_user.id)
    progress = await UserGameProgress.find_one(
        UserGameProgress.user_id == user_id,
        UserGameProgress.game_id == game_id
    )
    if progress:
        await progress.delete()
    return {"status": "success"}

from typing import Optional
