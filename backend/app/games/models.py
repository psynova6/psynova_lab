from beanie import Document, Indexed
from pydantic import Field
from typing import Dict, Any, List
from datetime import datetime

class UserGameProgress(Document):
    user_id: Indexed(str)
    game_id: Indexed(str) # e.g., 'zensnap', 'mindful-tales'
    current_scene_id: str = "root"
    flags: Dict[str, Any] = Field(default_factory=dict)
    history: List[str] = Field(default_factory=list)
    completed_endings: List[str] = Field(default_factory=list)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "user_game_progress"
        indexes = [
            [("user_id", 1), ("game_id", 1)]
        ]
