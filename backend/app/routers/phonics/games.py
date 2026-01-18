from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter()

MONSTER_FILE = os.path.join(os.path.dirname(__file__), "../../../data/hungry_monster.json")
PAIRS_FILE = os.path.join(os.path.dirname(__file__), "../../../data/minimal_pairs.json")

class GameSubmission(BaseModel):
    question_id: int
    selected_answer: str

@router.get("/hungry-monster", summary="Get Hungry Monster game questions")
async def get_monster_questions():
    """
    Returns all Hungry Monster game questions.
    """
    try:
        with open(MONSTER_FILE, 'r') as f:
            questions = json.load(f)
        return {"questions": questions, "total": len(questions)}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Game data file not found")

@router.get("/hungry-monster/{question_id}", summary="Get specific monster question")
async def get_monster_question(question_id: int):
    """
    Returns a specific Hungry Monster question by ID.
    """
    try:
        with open(MONSTER_FILE, 'r') as f:
            questions = json.load(f)
        
        question = next((q for q in questions if q["id"] == question_id), None)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        return question
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Game data file not found")

@router.post("/hungry-monster/submit", summary="Submit game answer")
async def submit_monster_answer(submission: GameSubmission):
    """
    Validates the submitted answer for a Hungry Monster question.
    """
    try:
        with open(MONSTER_FILE, 'r') as f:
            questions = json.load(f)
        
        question = next((q for q in questions if q["id"] == submission.question_id), None)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        is_correct = submission.selected_answer.lower() == question["correctAnswer"].lower()
        
        return {
            "correct": is_correct,
            "correctAnswer": question["correctAnswer"],
            "selectedAnswer": submission.selected_answer
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Game data file not found")

@router.get("/minimal-pairs", summary="Get minimal pairs exercises")
async def get_minimal_pairs():
    """
    Returns all minimal pair sorting exercises.
    """
    try:
        with open(PAIRS_FILE, 'r') as f:
            pairs = json.load(f)
        return {"exercises": pairs, "total": len(pairs)}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Minimal pairs data file not found")

@router.get("/minimal-pairs/{exercise_id}", summary="Get specific minimal pair exercise")
async def get_minimal_pair(exercise_id: int):
    """
    Returns a specific minimal pair exercise by ID.
    """
    try:
        with open(PAIRS_FILE, 'r') as f:
            pairs = json.load(f)
        
        exercise = next((e for e in pairs if e["id"] == exercise_id), None)
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        
        return exercise
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Minimal pairs data file not found")
