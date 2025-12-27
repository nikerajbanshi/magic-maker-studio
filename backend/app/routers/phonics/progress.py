from fastapi import APIRouter, HTTPException
from typing import Dict
from app.models.progress import ProgressUpdate, UserProgress
from app.services.progress_store import get_user_progress, update_user_progress


router = APIRouter()

@router.get("/")
async def health_check():
    return {"message": "Progress router is working"}


@router.get("/{user_id}")
async def read_progress(user_id: str):
    """Return the stored progress for a user. If none exists, returns an empty object."""
    prog = get_user_progress(user_id)
    if not prog:
        return {"user_id": user_id, "mastery": {}, "sessions": []}
    return prog


@router.post("/{user_id}")
async def save_progress(user_id: str, payload: ProgressUpdate):
    """Append a session and optional mastery updates for the given user."""
    body = payload.dict()
    user = update_user_progress(user_id, body)
    if not user:
        raise HTTPException(status_code=500, detail="Failed to update progress")
    return user
