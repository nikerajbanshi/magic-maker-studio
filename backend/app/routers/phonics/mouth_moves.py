from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../../data/mouth_moves.json")

@router.get("/", summary="Get all mouth moves exercises")
async def get_mouth_moves():
    """
    Returns all mouth positioning exercises for vowel pronunciation.
    Each exercise includes word pairs with mouth position guidance.
    """
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            exercises = json.load(f)
        return {"exercises": exercises, "total": len(exercises)}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mouth moves data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid mouth moves data format")

@router.get("/{exercise_id}", summary="Get specific mouth moves exercise")
async def get_mouth_move(exercise_id: int):
    """
    Returns a specific mouth moves exercise by ID.
    """
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            exercises = json.load(f)
        
        exercise = next((e for e in exercises if e["id"] == exercise_id), None)
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        
        return exercise
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mouth moves data file not found")
