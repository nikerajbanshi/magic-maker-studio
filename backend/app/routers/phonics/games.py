from fastapi import APIRouter

router = APIRouter()

@router.get("/", summary="Phonics games")
async def phonics_games():
    """
    Placeholder for phonics-based games (Hungry Monster, Minimal Pairs).
    """
    return {
        "feature": "Phonics Games",
        "status": "scaffolded",
        "games": ["Hungry Monster", "Minimal Pair Sorter"]
    }
