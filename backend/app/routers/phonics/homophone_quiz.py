from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../../data/homophone_quiz.json")

@router.get("/", summary="Get all homophone quiz questions")
async def get_homophone_quiz():
    """
    Returns all homophone quiz questions.
    Each question includes an image and two word options.
    """
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        return {"questions": questions, "total": len(questions)}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Homophone quiz data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid homophone quiz data format")

@router.get("/{question_id}", summary="Get specific homophone quiz question")
async def get_homophone_question(question_id: int):
    """
    Returns a specific homophone quiz question by ID.
    """
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        question = next((q for q in questions if q["id"] == question_id), None)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        return question
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Homophone quiz data file not found")
