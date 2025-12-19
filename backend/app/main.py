from fastapi import FastAPI
from app.routes import health

app = FastAPI(
    title="Magic Maker Studio API",
    description="Backend foundation for the Creative Learning Sandbox",
    version="1.0.0"
)

# Registering routes
app.include_router(health.router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Magic Maker Studio",
        "docs": "/docs",
        "status": "Ready to build"
    }