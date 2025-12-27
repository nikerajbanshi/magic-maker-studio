from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from app.routes import health
from app.routers.phonics import flashcards, blending, games, progress

app = FastAPI(
    title="Magic Maker Studio API",
    description="Backend foundation for the Creative Learning Sandbox",
    version="1.0.0"
)

# Mount static directory for audiobooks and assets
STATIC_DIR = Path(__file__).parent.parent / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# CORS: allow frontend dev origin
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registering routes
app.include_router(health.router)
app.include_router(flashcards.router, prefix="/api/flashcards", tags=["Flashcards"])
app.include_router(blending.router, prefix="/api/blending", tags=["Blending"])
app.include_router(games.router, prefix="/api/games", tags=["Games"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Magic Maker Studio",
        "docs": "/docs",
        "status": "Ready to build"
    }