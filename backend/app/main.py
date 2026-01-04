from fastapi import FastAPI
from app.routes import health
from app.routers.phonics import flashcards, sound_out, games, progress

app = FastAPI(
    title="Magic Maker Studio API",
    description="Backend foundation for the Creative Learning Sandbox",
    version="1.0.0"
)

# System routes
app.include_router(health.router)

# Phonics feature routes (Week 3 scaffolding)
app.include_router(
    flashcards.router,
    prefix="/api/phonics/flashcards",
    tags=["Flashcards"]
)

app.include_router(
    sound_out.router,
    prefix="/api/phonics/sound-out",
    tags=["Sound Out"]
)

app.include_router(
    games.router,
    prefix="/api/phonics/games",
    tags=["Games"]
)

app.include_router(
    progress.router,
    prefix="/api/phonics/progress",
    tags=["Progress"]
)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Magic Maker Studio",
        "docs": "/docs",
        "status": "Ready to build"
    }
