from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, user, auth
from app.routers.phonics import flashcards, sound_out, games, progress, mouth_moves, homophone_quiz
from app.routers import achievements
import os

app = FastAPI(
    title="SoundSteps API",
    description="Backend API for SoundSteps - Interactive Phonics Learning Platform",
    version="1.2.0"
)

# CORS middleware (allow frontend to access API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System routes
app.include_router(health.router)

# Authentication routes
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"]
)

# User session routes
app.include_router(
    user.router,
    prefix="/api/user",
    tags=["User"]
)

# Phonics feature routes
app.include_router(
    flashcards.router,
    prefix="/api/cards",
    tags=["Flashcards"]
)

app.include_router(
    sound_out.router,
    prefix="/api/soundout",
    tags=["Sound Out"]
)

app.include_router(
    games.router,
    prefix="/api/game",
    tags=["Games"]
)

app.include_router(
    progress.router,
    prefix="/api/progress",
    tags=["Progress"]
)

# Mouth Moves module
app.include_router(
    mouth_moves.router,
    prefix="/api/mouth-moves",
    tags=["Mouth Moves"]
)

# Homophone Quiz module
app.include_router(
    homophone_quiz.router,
    prefix="/api/homophone-quiz",
    tags=["Homophone Quiz"]
)

# Achievements module
app.include_router(
    achievements.router,
    prefix="/api/achievements",
    tags=["Achievements"]
)

# Serve static files (frontend and assets)
static_dir = os.path.join(os.path.dirname(__file__), "../../static")
# Assets are now consolidated under static/assets/
assets_dir = os.path.join(os.path.dirname(__file__), "../../static/assets")

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
if os.path.exists(assets_dir):
    # Mount assets at /assets for backwards compatibility with existing data files
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/", tags=["Root"])
async def root():
    """
    Serve the main frontend application.
    """
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {
        "message": "Welcome to SoundSteps API",
        "docs": "/docs",
        "status": "Ready"
    }
