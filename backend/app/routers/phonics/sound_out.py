from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../../data/soundout.json")

@router.get("/", summary="Get all sound-out words")
async def get_soundout_words():
    """
    Returns all words for phonetic blending practice.
    Each word includes segmented and blended audio versions.
    """
    try:
        with open(DATA_FILE, 'r') as f:
            words = json.load(f)
        return {"words": words, "total": len(words)}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Sound-out data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid sound-out data format")

@router.get("/{word_id}", summary="Get specific word by ID")
async def get_soundout_word(word_id: int):
    """
    Returns a single word for blending practice by its ID.
    """
    try:
        with open(DATA_FILE, 'r') as f:
            words = json.load(f)
        
        word = next((w for w in words if w["id"] == word_id), None)
        if not word:
            raise HTTPException(status_code=404, detail="Word not found")
        
        return word
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Sound-out data file not found")
