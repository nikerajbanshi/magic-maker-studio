from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../../data/flashcards.json")

@router.get("/", summary="Get all phonics flashcards")
async def get_flashcards():
    """
    Returns the complete list of phonics flashcards A-Z.
    Each card includes letter, word, image, audio, and phoneme.
    """
    try:
        with open(DATA_FILE, 'r') as f:
            flashcards = json.load(f)
        return {"cards": flashcards, "total": len(flashcards)}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Flashcards data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid flashcards data format")

@router.get("/{card_id}", summary="Get specific flashcard by ID")
async def get_flashcard(card_id: int):
    """
    Returns a single flashcard by its ID.
    """
    try:
        with open(DATA_FILE, 'r') as f:
            flashcards = json.load(f)
        
        card = next((c for c in flashcards if c["id"] == card_id), None)
        if not card:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        
        return card
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Flashcards data file not found")
