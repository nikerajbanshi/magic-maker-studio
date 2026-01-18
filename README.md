# SoundSteps - Interactive Phonics Learning Platform

**Transform learning into an adventure!** 🎨✨

SoundSteps is a mobile-first, gamified phonics and pronunciation learning application designed to guide learners through progressive stages of competence using interactive, game-based modules.

---

## 🚀 Quick Start

### Option 1: Using the Start Script (Recommended)

```bash
bash start.sh
```

The script will:
- Create a virtual environment if needed
- Install all dependencies
- Launch the FastAPI server
- Display the local access URL

### Option 2: Manual Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3: Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t soundsteps .
docker run -p 8000:8000 soundsteps
```

---

## 📱 Access the Application

Once running, access SoundSteps at:

- **Main Application**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

---

## 🎯 Core Features

### 1. **Interactive Phonics Flashcards** 📚
- Learn letters A-Z with visual anchors
- Audio pronunciation for each letter
- Smooth animations and progress tracking

### 2. **Sound It Out** 🔊
- Phonetic blending practice with slider control
- Transition from segmented to blended sounds
- Visual phoneme display

### 3. **Hungry Monster Game** 👾
- Gamified listening comprehension
- Interactive drag-and-drop gameplay
- Instant feedback and scoring

### 4. **Minimal Pair Sorter** 🎯
- Distinguish similar phonemes
- Sort words into correct phoneme categories
- Build phonemic awareness

### 5. **Guest Authentication** 👤
- Quick guest login to start learning
- Session tracking for progress
- No registration required to try

---

## 🏗️ Architecture

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **API**: RESTful endpoints with automatic OpenAPI docs
- **Data**: JSON file-based storage (lightweight demo)
- **Static Serving**: Integrated file serving for frontend and assets

### Frontend
- **Approach**: Vanilla JavaScript (no frameworks)
- **Styling**: Custom CSS with mobile-first design
- **Performance**: Lightweight, no external CDN dependencies
- **Responsiveness**: Optimized for mobile and desktop

### Project Structure
```
soundsteps/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Application entry point
│   │   ├── routes/         # API routes
│   │   └── routers/        # Feature routers
│   ├── data/               # JSON data files
│   └── requirements.txt    # Python dependencies
├── static/                 # Frontend files
│   ├── index.html         # Main HTML
│   ├── styles.css         # Application styles
│   └── app.js             # Application logic
├── assets/                # Media assets
│   ├── images/            # WebP images
│   └── audio/             # MP3 audio files
├── docs/                  # Documentation
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose config
└── start.sh              # Startup script
```

---

## 🔌 API Endpoints

### User Management
- `POST /api/user/start` - Start guest session
- `GET /api/user/{session_id}` - Get session info

### Flashcards
- `GET /api/cards` - Get all flashcards
- `GET /api/cards/{id}` - Get specific flashcard

### Sound It Out
- `GET /api/soundout` - Get all words
- `GET /api/soundout/{id}` - Get specific word

### Games
- `GET /api/game/hungry-monster` - Get monster questions
- `GET /api/game/hungry-monster/{id}` - Get specific question
- `POST /api/game/hungry-monster/submit` - Submit answer
- `GET /api/game/minimal-pairs` - Get minimal pair exercises
- `GET /api/game/minimal-pairs/{id}` - Get specific exercise

### Health
- `GET /health` - Service health check

---

## 🎨 Design Principles

1. **Mobile-First**: Optimized for touch interactions
2. **Lightweight**: Minimal dependencies, fast load times
3. **Accessible**: ARIA labels, keyboard navigation
4. **Engaging**: Animations, feedback, and gamification
5. **Progressive**: Guides learners through competence stages

---

## 🛠️ Development

### Requirements
- Python 3.8+
- Modern web browser
- Terminal/Command prompt

### Adding New Content

1. **Flashcards**: Add entries to `backend/data/flashcards.json`
2. **Words**: Update `backend/data/soundout.json`
3. **Games**: Modify `backend/data/hungry_monster.json` or `minimal_pairs.json`
4. **Assets**: Add images to `assets/images/` and audio to `assets/audio/`

### Running in Development Mode

The `--reload` flag enables auto-reload on code changes:

```bash
uvicorn app.main:app --reload
```

---

## 📦 Deployment

### Production Considerations

1. Replace JSON storage with a database (PostgreSQL, MongoDB)
2. Add authentication and authorization
3. Implement rate limiting
4. Enable HTTPS/SSL
5. Configure CORS for specific domains
6. Add logging and monitoring
7. Set up CDN for assets

### Environment Variables

Create a `.env` file:

```
ENVIRONMENT=production
PORT=8000
HOST=0.0.0.0
```

---

## 📝 Week 6 Deliverables

This implementation represents the complete Week 6 hackathon deliverable:

✅ User authentication (guest login)  
✅ Interactive Phonics Flashcards  
✅ Sound It Out (phonetic blending)  
✅ Hungry Monster Story Game  
✅ Minimal Pair Sorter  
✅ Mobile-responsive UI  
✅ REST API with FastAPI  
✅ Static file serving  
✅ Docker support  
✅ Startup script  

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## 📄 License

This project is part of the Chunjae Bootcamp educational program.

---

## 👥 Team

**Team A - SoundSteps**
- Dikshya Rai
- Binam Poudel
- Nikesh Rajbanshi

**Bootcamp**: Chunjae Bootcamp 2025-2026  
**Project**: Magic Maker Studio v1.1  

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
kill -9 $(lsof -ti:8000)
```

### Virtual Environment Issues
```bash
# Remove and recreate venv
rm -rf backend/venv
python3 -m venv backend/venv
```

### Missing Dependencies
```bash
# Reinstall all dependencies
pip install -r backend/requirements.txt --force-reinstall
```

---

