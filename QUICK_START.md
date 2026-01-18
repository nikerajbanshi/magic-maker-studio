# 🚀 SoundSteps - Quick Start Guide

## TL;DR - Get Running in 30 Seconds

```bash
cd magic-maker-studio
bash start.sh
```

Then open: **http://localhost:8000**

---

## What You Get

✅ **5 Complete Learning Modules**:
1. Guest Login Screen
2. Interactive Flashcards (A-Z phonics)
3. Sound It Out (phoneme blending)
4. Hungry Monster Game (listening comprehension)
5. Minimal Pair Sorter (phoneme distinction)

✅ **Full-Stack Application**:
- FastAPI backend with REST API
- Vanilla JavaScript frontend
- JSON data storage
- Static file serving
- Mobile-responsive design

✅ **Ready to Deploy**:
- Docker support
- Start script
- API documentation
- Test suite

---

## Alternative Start Methods

### Method 1: Start Script (Easiest)
```bash
bash start.sh
```

### Method 2: Manual Python
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Method 3: Docker
```bash
docker-compose up --build
```

---

## Access Points

- **App**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Alt Docs**: http://localhost:8000/redoc
- **Health**: http://localhost:8000/health

---

## Test the API

With server running in another terminal:

```bash
bash test_api.sh
```

---

## Project Structure

```
soundsteps/
├── backend/          # FastAPI backend
│   ├── app/         # Application code
│   └── data/        # JSON data files
├── static/          # Frontend (HTML/CSS/JS)
├── assets/          # Images and audio
├── Dockerfile       # Container config
└── start.sh         # Startup script
```

---

## Troubleshooting

**Port in use?**
```bash
lsof -ti:8000 | xargs kill -9
```

**Dependencies issue?**
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt --upgrade
```

**Python version?**
Requires Python 3.8+. Check with:
```bash
python3 --version
```

---

## Features Overview

### 📚 Flashcards
- Learn letters A-Z
- Audio pronunciation
- Visual word associations
- Progress tracking

### 🔊 Sound It Out
- Phoneme blending practice
- Slider control (segmented ↔ blended)
- Visual phoneme display

### 👾 Hungry Monster
- Listening comprehension game
- Multiple choice answers
- Score tracking
- Instant feedback

### 🎯 Minimal Pairs
- Phoneme distinction
- Drag-and-drop sorting
- Answer validation

---

## Development

### Add More Flashcards
Edit: `backend/data/flashcards.json`

### Add More Words
Edit: `backend/data/soundout.json`

### Add Game Questions
Edit: `backend/data/hungry_monster.json`

### Add Assets
Place files in:
- Images: `assets/images/`
- Audio: `assets/audio/`

---

## Documentation

- [Complete README](README.md)
- [Completion Report](COMPLETION_REPORT.md)
- [API Documentation](http://localhost:8000/docs) (when running)
- [Contributing Guidelines](CONTRIBUTING.MD)

---

## Support

For issues or questions:
1. Check [COMPLETION_REPORT.md](COMPLETION_REPORT.md)
2. Review [README.md](README.md)
3. Check API docs at `/docs`

---

## Credits

**Team A - SoundSteps**
- Dikshya Rai
- Binam Poudel
- Nikesh Rajbanshi

**Chunjae Bootcamp 2025-2026**

---

**Happy Learning! 🎉📚✨**
