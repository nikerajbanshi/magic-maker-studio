from fastapi import APIRouter
from pathlib import Path
from typing import List


router = APIRouter()

@router.get("/")
async def health_check():
    return {"message": "Games router is working"}


@router.get("/lottie", response_model=List[str])
async def list_lottie_animations():
    """Return a list of available Lottie animation filenames (served from /static/lottie).
    Place open-source Lottie JSON files into backend/static/lottie/ to expose them here.
    """
    static_dir = Path(__file__).parent.parent.parent / "static" / "lottie"
    if not static_dir.exists():
        return []
    files = [p.name for p in sorted(static_dir.glob("*.json"))]
    return files