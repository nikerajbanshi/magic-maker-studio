from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime


class SessionRecord(BaseModel):
    timestamp: str
    game: str
    score: float
    total: Optional[float] = None
    details: Optional[Dict[str, Any]] = None


class UserProgress(BaseModel):
    user_id: str
    mastery: Dict[str, float] = Field(default_factory=dict)
    sessions: List[SessionRecord] = Field(default_factory=list)
    last_updated: Optional[str] = None


class ProgressUpdate(BaseModel):
    game: str
    score: float
    total: Optional[float] = None
    details: Optional[Dict[str, Any]] = None
    mastery_delta: Optional[Dict[str, float]] = None
