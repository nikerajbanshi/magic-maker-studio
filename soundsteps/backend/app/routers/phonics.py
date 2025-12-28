from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import pathlib

router = APIRouter()

BASE_DIR = pathlib.Path(__file__).parent.parent.parent
LETTERS_DIR = BASE_DIR / "static" / "audio" / "letters"

@router.get("/letters")
def list_letters():
    # Return list of letters A-Z with audio URLs
    letters = [chr(c) for c in range(ord('A'), ord('Z') + 1)]
    return [{"letter": l, "audio_url": f"/static/audio/letters/{l.lower()}.mp3"} for l in letters]


@router.get("/letters/{letter}/audio")
def get_letter_audio(letter: str):
    letter = letter.lower()
    if len(letter) != 1 or not letter.isalpha():
        raise HTTPException(status_code=400, detail="Invalid letter")
    file_path = LETTERS_DIR / f"{letter}.mp3"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio not found for letter")
    return FileResponse(path=file_path)
