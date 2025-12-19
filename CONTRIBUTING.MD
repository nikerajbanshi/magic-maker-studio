# Contributing to Magic Maker Studio 

Welcome team! To get this project running on your local machine for testing, follow these steps.

## Prerequisites
- **Python 3.10+**
- **Node.js (v18+) & npm**

## Backend Setup (FastAPI)
1. Navigate to the backend folder: `cd backend`
2. Create a virtual environment: `python3 -m venv venv`
3. Activate it:
   - Mac/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
4. Install dependencies: `pip install fastapi uvicorn`
5. Start the server: `uvicorn app.main:app --reload`
6. **Verify:** Go to `http://127.0.0.1:8000/health`

## Frontend Setup (React + Vite)
1. Open a new terminal tab and navigate to the frontend: `cd frontend`
2. Install packages: `npm install`
3. Start the dev server: `npm run dev`
4. **Verify:** Open the URL provided in the terminal (usually `http://localhost:5173`)

## Git Workflow
- Always create a new branch for features: `git checkout -b feature/your-feature-name`
- Submit a Pull Request (PR) to `main` for review.