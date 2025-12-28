from fastapi import APIRouter

router = APIRouter()

@router.get("/", summary="Get phonics flashcards")
async def get_flashcards():
    """
    Returns a placeholder list of phonics flashcards.
    Week 3: Structure only, no database logic.
    """
    return {
        "feature": "Interactive Phonics Flashcards",
        "status": "scaffolded",
        "cards": [
            {"letter": "A", "sound": "/a/"},
            {"letter": "B", "sound": "/b/"}
        ]
    }
