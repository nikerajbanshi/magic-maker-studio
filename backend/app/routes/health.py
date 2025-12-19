from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["System"])
async def health_check():
    """Verifies the server is online and reachable."""
    return {
        "status": "online",
        "service": "Magic Maker Studio Backend",
        "environment": "development"
    }