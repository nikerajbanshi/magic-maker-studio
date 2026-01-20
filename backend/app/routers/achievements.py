from fastapi import APIRouter
import json
import os

router = APIRouter()

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../data/achievements.json")

@router.get("/", summary="Get achievements configuration")
async def get_achievements():
    """
    Returns the achievements configuration including XP values and achievement definitions.
    """
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            achievements = json.load(f)
        return achievements
    except FileNotFoundError:
        return {
            "modules": {},
            "streaks": {},
            "xpPerLevel": 500
        }
    except json.JSONDecodeError:
        return {
            "modules": {},
            "streaks": {},
            "xpPerLevel": 500
        }
