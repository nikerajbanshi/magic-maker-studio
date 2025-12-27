from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import pathlib

router = APIRouter()

# Resolve to project root (backend/) to find the global static/ directory
BASE_DIR = pathlib.Path(__file__).resolve().parents[3]
LETTERS_DIR = BASE_DIR / "static" / "audio" / "letters"

@router.get("/")
async def health_check():
    return {"message": "Flashcards router is working"}

@router.get("/letters")
async def list_letters():
    letters = [chr(c) for c in range(ord('A'), ord('Z') + 1)]
    return [{"letter": l, "audio_url": f"/static/audio/letters/{l.lower()}.mp3"} for l in letters]

@router.get("/letters/{letter}/audio")
async def get_letter_audio(letter: str):
    letter = letter.lower()
    if len(letter) != 1 or not letter.isalpha():
        raise HTTPException(status_code=400, detail="Invalid letter")
    file_path = LETTERS_DIR / f"{letter}.mp3"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio not found for letter")
    return FileResponse(path=file_path)

@router.get("/cards")
async def get_cards():
    """Return randomized set of cards for the Remember phase.

    Each card: { id, letter, anchor (emoji), audio_url }
    """
    anchors = {
        'A': '🍎', 'B': '🐝', 'C': '🐱', 'D': '🐶', 'E': '🐘', 'F': '🐸', 'G': '🦒', 'H': '🏠', 'I': '🍦', 'J': '🦘', 'K': '🪁', 'L': '🦁', 'M': '🐵', 'N': '🐧', 'O': '🦉', 'P': '🥞', 'Q': '👑', 'R': '🤖', 'S': '🐍', 'T': '🐯', 'U': '☂️', 'V': '🎻', 'W': '🚶', 'X': '❌', 'Y': '🪀', 'Z': '⚡'
    }
    letters = [chr(c) for c in range(ord('A'), ord('Z') + 1)]
    import random
    random.shuffle(letters)

    cards = []
    for i, l in enumerate(letters, start=1):
        cards.append({
            "id": i,
            "letter": l,
            "anchor": anchors.get(l, ''),
            "audio_url": f"/static/audio/letters/{l.lower()}.mp3"
        })
    return cards