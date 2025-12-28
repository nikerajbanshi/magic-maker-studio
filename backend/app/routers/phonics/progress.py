from fastapi import APIRouter

router = APIRouter()

@router.get("/", summary="Learner progress dashboard")
async def learner_progress():
    """
    Placeholder progress data for dashboard visualization.
    """
    return {
        "feature": "Competence Dashboard",
        "status": "scaffolded",
        "progress": {
            "flashcards": "completed",
            "blending": "in-progress",
            "games": "locked"
        }
    }
