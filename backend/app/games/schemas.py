from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

class GameProgressUpdate(BaseModel):
    current_scene_id: str
    flags: Dict[str, Any]
    history: List[str]
    completed_endings: List[str]

class GameProgressOut(BaseModel):
    user_id: str
    game_id: str
    current_scene_id: str
    flags: Dict[str, Any]
    history: List[str]
    completed_endings: List[str]
    last_updated: datetime
