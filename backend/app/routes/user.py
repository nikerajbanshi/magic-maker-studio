from fastapi import APIRouter
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

# In-memory session storage (for demo purposes)
sessions = {}

class SessionStart(BaseModel):
    name: str = "Guest"

@router.post("/start", summary="Start a new guest session")
async def start_session(session_data: SessionStart):
    """
    Creates a new guest session and returns a session ID.
    """
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "id": session_id,
        "name": session_data.name,
        "started_at": datetime.now().isoformat(),
        "progress": {
            "flashcards_completed": 0,
            "soundout_completed": 0,
            "games_completed": 0,
            "minimal_pairs_completed": 0
        }
    }
    
    return {
        "sessionId": session_id,
        "name": session_data.name,
        "message": "Session started successfully"
    }

@router.get("/{session_id}", summary="Get session information")
async def get_session(session_id: str):
    """
    Returns the current session information and progress.
    """
    if session_id not in sessions:
        return {"error": "Session not found"}, 404
    
    return sessions[session_id]
