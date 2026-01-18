# Week 6 Deliverable: Service Deployment & Operations

**Student:** Team Magic Maker Studio  
**Date:** January 18, 2026  
**Project:** SoundSteps - Interactive Phonics Learning Platform

---

## 📋 Assignment Checklist

| Requirement | Status | Details |
|-------------|--------|---------|
| System Architecture | ✅ Complete | See Section 1 |
| API Specification | ✅ Complete | See Section 2 |
| Publicly Accessible Prototype | ✅ Ready | Railway deployment prepared |

---

## 1. System Architecture for Web Application Deployment

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│              (Web Browsers - Desktop & Mobile)               │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS (Port 443)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   RAILWAY PLATFORM                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 Docker Container                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           Uvicorn (ASGI Server)                 │  │  │
│  │  │         - Async request handling                │  │  │
│  │  │         - WebSocket support                     │  │  │
│  │  └─────────────────────┬───────────────────────────┘  │  │
│  │                        │                               │  │
│  │  ┌─────────────────────▼───────────────────────────┐  │  │
│  │  │         FastAPI Application (Python 3.11)       │  │  │
│  │  │       - REST API endpoints                      │  │  │
│  │  │       - JWT authentication                      │  │  │
│  │  │       - Static file serving                     │  │  │
│  │  │       - Business logic                          │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Static Assets                      │  │  │
│  │  │    /static (HTML, CSS, JS, Audio, Images)      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Data Storage                       │  │  │
│  │  │    - JSON files (flashcards, games)            │  │  │
│  │  │    - LocalStorage (client-side progress)       │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 | Interactive UI with animations |
| **Backend** | FastAPI (Python 3.11) | REST API & static file serving |
| **ASGI Server** | Uvicorn | High-performance async server |
| **Containerization** | Docker | Application packaging |
| **Cloud Platform** | Railway | Hosting & deployment |
| **Authentication** | JWT + bcrypt | Secure user sessions |
| **Data Storage** | JSON files + LocalStorage | Lightweight persistence |

### Component Description

1. **Client Layer**
   - Responsive web UI supporting desktop and mobile
   - Speech recognition for pronunciation practice
   - Local progress storage for offline support

2. **Application Layer**
   - FastAPI serving both API endpoints and static files
   - JWT-based authentication (guest & registered users)
   - Four learning modules: Flashcards, Sound It Out, Hungry Monster, Minimal Pairs

3. **Data Layer**
   - JSON files for content (flashcards, words, game scenarios)
   - Browser LocalStorage for user progress and preferences
   - No external database required (lightweight deployment)

---

## 2. API Specification

### Base URL
```
Production: https://soundsteps-production.up.railway.app/api
Development: http://localhost:8000/api
```

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/auth/register` | POST | Register new user | `{"email": "string", "username": "string", "password": "string"}` | `{"user_id", "email", "username", "token"}` |
| `/api/auth/login` | POST | User login | `{"email": "string", "password": "string"}` | `{"access_token", "token_type": "bearer"}` |
| `/api/auth/guest` | POST | Create guest session | `{"name": "string"}` (optional) | `{"user_id", "username", "token"}` |
| `/api/auth/logout` | POST | End session | - | `{"message": "Logged out"}` |

### Flashcards Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/cards/` | GET | Get all A-Z flashcards | `{"cards": [{"letter", "word", "image", "audio"}]}` |
| `/api/cards/{letter}` | GET | Get specific letter | `{"letter", "word", "image", "audio"}` |

### Sound It Out Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/soundout/` | GET | Get all practice words | `{"words": [{"word", "phonemes", "image", "segmented_audio", "blended_audio"}]}` |

### Game Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/game/hungry-monster` | GET | Get monster game scenarios | `{"scenarios": [{"visual_prompt", "options", "correct_answer"}]}` |
| `/api/game/minimal-pairs` | GET | Get sorting exercises | `{"pairs": [{"sound1", "sound2", "words"}]}` |

### Health Check

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/health` | GET | Server health status | `{"status": "healthy", "timestamp": "ISO8601"}` |

### Example API Calls

```bash
# Health check
curl https://soundsteps-production.up.railway.app/api/health

# Get all flashcards
curl https://soundsteps-production.up.railway.app/api/cards/

# Guest login
curl -X POST https://soundsteps-production.up.railway.app/api/auth/guest \
  -H "Content-Type: application/json" \
  -d '{"name": "Student1"}'

# Get hungry monster game
curl https://soundsteps-production.up.railway.app/api/game/hungry-monster
```

---

## 3. Deployed Prototype

### Deployment Status

| Item | Status |
|------|--------|
| Docker Configuration | ✅ Complete |
| Local Testing | ✅ Verified |
| Railway Deployment | 🟡 Ready (deploy on hackathon day 1) |

### How to Access

**Local Development:**
```bash
# macOS/Linux
./start.sh

# Windows
start.bat

# Then open: http://localhost:8000
```

**Production URL (after Railway deployment):**
```
https://soundsteps-production.up.railway.app
```

### Functional Features

| Feature | Status | Description |
|---------|--------|-------------|
| User Authentication | ✅ Working | Login, Register, Guest mode |
| Flashcards (A-Z) | ✅ Working | 26 letters with images and audio |
| Sound It Out | ✅ Working | 30 words with segmented/blended audio + speech recognition |
| Hungry Monster | ✅ Working | Visual phonics game with confetti rewards |
| Minimal Pairs | ✅ Working | Drag-drop sorting (/p/-/b/, /t/-/d/, etc.) |
| Progress Tracking | ✅ Working | XP, streaks, skill badges |
| Leaderboard | ✅ Working | Competitive rankings |

### Screenshots

**Dashboard:**
```
┌─────────────────────────────────────────┐
│  🏠 SoundSteps ✨              [Logout] │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐              │
│  │Flashcard│  │Sound It │              │
│  │   🔤    │  │  Out 🔊 │              │
│  └─────────┘  └─────────┘              │
│  ┌─────────┐  ┌─────────┐              │
│  │ Hungry  │  │ Minimal │              │
│  │Monster🎃│  │Pairs 🎯 │              │
│  └─────────┘  └─────────┘              │
│                                         │
│  📊 Progress: 150 XP | 🔥 3-day streak │
└─────────────────────────────────────────┘
```

---

## 4. Deployment Instructions (Railway)

### Step 1: Push to GitHub
```bash
git add -A
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose `magic-maker-studio` repository
5. Railway auto-detects Dockerfile ✅

### Step 3: Configure Environment
In Railway dashboard → Variables:
```
PORT=8000
PYTHONUNBUFFERED=1
```

### Step 4: Generate Public URL
1. Go to Settings → Networking
2. Click "Generate Domain"
3. Your app is live! 🎉

### Estimated Deployment Time: ~5 minutes

---

## 5. Project Repository

**GitHub:** [github.com/your-username/magic-maker-studio](https://github.com/your-username/magic-maker-studio)

### Project Structure
```
magic-maker-studio/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py         # Application entry point
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Business logic
│   ├── data/               # JSON data files
│   └── requirements.txt    # Python dependencies
├── static/                  # Frontend assets
│   ├── index.html          # Main HTML
│   ├── styles.css          # Styling
│   ├── app.js              # Main JavaScript
│   ├── services/           # JS service modules
│   └── assets/             # Images & audio
├── docs/                    # Documentation
│   └── week-6/             # This deliverable
├── Dockerfile              # Container configuration
├── docker-compose.yml      # Local development
├── start.sh                # macOS/Linux starter
├── start.bat               # Windows starter
└── README.md               # Project overview
```

---

## 6. Lessons Learned

### Deployment Concepts Applied

1. **Containerization with Docker**
   - Created Dockerfile for reproducible builds
   - Multi-stage builds for smaller images
   - Environment variable configuration

2. **ASGI Server (Uvicorn)**
   - Async request handling for better performance
   - Proper host/port binding for containers
   - Graceful shutdown handling

3. **Cloud Platform Deployment**
   - Railway for simple Git-based deployment
   - Environment variable management
   - Automatic SSL certificate provisioning

4. **API Design**
   - RESTful endpoint structure
   - JWT-based authentication
   - Proper HTTP status codes

### Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Module import paths in Docker | Used absolute imports with proper WORKDIR |
| bcrypt compatibility | Switched to passlib with bcrypt backend |
| Static file serving | FastAPI StaticFiles mount |
| Speech recognition accuracy | Implemented fuzzy matching with Levenshtein distance |

---

## 7. References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Railway Deployment Guide](https://docs.railway.app/)
- [Uvicorn ASGI Server](https://www.uvicorn.org/)

---

## 8. Conclusion

SoundSteps demonstrates a complete web application deployment pipeline:
- **Architecture:** Client-server with containerized backend
- **API:** RESTful endpoints for authentication and learning modules
- **Deployment:** Docker-based deployment ready for Railway

The prototype is fully functional with four interactive learning modules, progress tracking, and gamification features. Ready for public deployment on hackathon day 1.

---

*Submitted for Week 6: Service Deployment & Operations*
