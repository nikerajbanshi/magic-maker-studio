# Frontend (Magic Maker Studio)

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

New: This project now supports Lottie animations in the Hungry Monster Game. Add Lottie JSON files to `backend/static/lottie/` and they will be listed by `GET /api/games/lottie` and served at `/static/lottie/<file>.json`. After changing dependencies, run `npm install` in `frontend` to install `lottie-react`.

## Auth & Flashcards
- Register a new user via `/register` — this stores a user in `localStorage` (no backend DB required for the demo).
- Login via `/login` — successful login redirects to `/dashboard`.
- `/flashcards` (Remember phase) requires letter audio files to be present on the backend at `/static/audio/letters/{letter}.mp3`.

If audio is missing, run the backend audio generator:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python generate_letters_audio.py
```
