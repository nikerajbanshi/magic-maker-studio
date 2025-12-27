# Backend (Magic Maker Studio)

## Endpoints
- GET `/` → root info
- GET `/api/flashcards/letters` → list of letters with `audio_url`
- GET `/api/flashcards/letters/{letter}/audio` → streams letter .mp3 audio (FileResponse)

## Audio generation
To generate A-Z letter audio files (gTTS) run:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python generate_letters_audio.py
```

To generate demo blended word audio for the Blending module run:

```bash
cd backend
source venv/bin/activate
python generate_blend_words.py
```

If you encounter `ModuleNotFoundError: No module named 'gtts'`, make sure you've activated the venv before running `pip install -r requirements.txt`.