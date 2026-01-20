# 🎵 SoundSteps - Interactive Phonics Learning Platform

<div align="center">

![SoundSteps Banner](https://img.shields.io/badge/SoundSteps-Phonics%20Learning-9B7FE6?style=for-the-badge&logo=music&logoColor=white)

**Transform learning into an adventure!** ✨

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

[Quick Start](#-quick-start) • [Features](#-features) • [Docker](#-docker) • [Deploy](#-deploy-to-railway) • [API Docs](#-api-documentation)

</div>

---

## 📖 About

SoundSteps is a mobile-first, gamified phonics learning application designed for children and ESL learners. The platform uses interactive games, visual feedback, and progress tracking to make learning phonics fun and effective.

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** or **Docker Desktop**
- macOS, Linux, or Windows

### One-Command Setup

**macOS/Linux:**

```bash
chmod +x start.sh && ./start.sh
```

**Windows:**

```cmd
start.bat
```

The script will:

1. ✅ Set up the Python environment
2. ✅ Install all dependencies
3. ✅ Start the FastAPI server
4. ✅ Build and run Docker container
5. ✅ Open the app in your browser

**Access the app:** http://localhost:8000

---

## 🎮 Features

| Module                | Description                                                     | Skills                                |
| --------------------- | --------------------------------------------------------------- | ------------------------------------- |
| **📚 Flashcards**     | Interactive A-Z alphabet cards with dual audio (phoneme + word) | Letter recognition, phoneme awareness |
| **🔊 Sound It Out**   | Phoneme blending with enhanced slider and visual prompt         | Segmenting, blending sounds           |
| **🎯 Minimal Pairs**  | Sound distinction sorting with interactive tutorial             | Phoneme differentiation               |
| **👄 Mouth Moves**    | Vowel pronunciation with mouth position guidance                | Vowel sounds, mouth awareness         |
| **🖼️ Homophone Quiz** | Match pictures to homophones with audio                         | Word recognition, listening           |
| **👾 Hungry Monster** | Listening comprehension game                                    | Auditory discrimination               |

### Additional Features

- 🏆 **Progress Tracking** - XP, streaks, and achievements
- 🎯 **Skill Badges** - Unlock rewards as you learn (8 badges total)
- 🎊 **Confetti Celebrations** - Instant positive feedback
- 📱 **Mobile-First Design** - Works on all devices
- 🔐 **Guest & User Login** - No signup required to start
- 📖 **Interactive Tutorials** - Guided learning experiences

---

## 🐳 Docker

### Quick Docker Start

```bash
# Build and run
./docker-run.sh

# Or manually:
docker build -t soundsteps .
docker run -d --name soundsteps-app -p 8000:8000 soundsteps
```

### Docker Commands

```bash
# View logs
docker logs -f soundsteps-app

# Stop container
docker stop soundsteps-app

# Restart container
docker restart soundsteps-app

# Remove container
docker rm -f soundsteps-app
```

---

## 🌐 Deploy to Railway

Railway is the easiest way to deploy SoundSteps to the web. See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

### Quick Deploy Steps

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects the Dockerfile and deploys! 🚀

Your app will be live at: `https://soundsteps-xxx.up.railway.app`

---

## 📁 Project Structure

```
magic-maker-studio/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py         # Application entry point
│   │   ├── routes/         # API route handlers
│   │   └── routers/        # Phonics module routers
│   │       └── phonics/
│   │           ├── flashcards.py
│   │           ├── sound_out.py
│   │           ├── games.py
│   │           ├── progress.py
│   │           ├── mouth_moves.py      # NEW
│   │           └── homophone_quiz.py   # NEW
│   ├── data/               # JSON data files
│   │   ├── flashcards.json
│   │   ├── soundout.json
│   │   ├── minimal_pairs.json
│   │   ├── hungry_monster.json
│   │   ├── mouth_moves.json            # NEW
│   │   └── homophone_quiz.json         # NEW
│   └── requirements.txt    # Python dependencies
├── static/                  # Frontend application
│   ├── index.html          # Main HTML file
│   ├── app.js              # Application logic
│   ├── styles.css          # Styling
│   ├── services/           # JS service modules
│   └── assets/             # Images and audio
│       ├── images/         # 41+ WebP images
│       └── audio/          # 171+ MP3 audio files
├── docs/                    # Weekly documentation
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose config
├── start.sh                # macOS/Linux startup script
├── start.bat               # Windows startup script
└── docker-run.sh           # Docker launcher script
```

---

## 🔌 API Documentation

Once running, access the interactive API docs:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

### Key Endpoints

| Method | Endpoint                   | Description                           |
| ------ | -------------------------- | ------------------------------------- |
| GET    | `/api/cards`               | Get all flashcard data                |
| GET    | `/api/soundout`            | Get sound-out exercises               |
| GET    | `/api/game/hungry-monster` | Get monster game questions            |
| GET    | `/api/game/minimal-pairs`  | Get minimal pairs exercises           |
| GET    | `/api/mouth-moves`         | Get mouth positioning exercises (NEW) |
| GET    | `/api/homophone-quiz`      | Get homophone quiz questions (NEW)    |
| POST   | `/api/auth/login`          | User login                            |
| POST   | `/api/auth/register`       | User registration                     |
| POST   | `/api/auth/guest`          | Guest login                           |

---

## 🛠️ Manual Setup

If you prefer manual setup over the start scripts:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/magic-maker-studio.git
cd magic-maker-studio

# 2. Create virtual environment
cd backend
python3 -m venv venv

# 3. Activate virtual environment
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🧪 Testing

```bash
# Run API tests
bash test_api.sh

# Manual health check
curl http://localhost:8000/health
```

---

## 👥 Team

**Team A - Chunjae Bootcamp**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for learners everywhere**

🎵 _Learning phonics, one sound at a time_ 🎵

</div>
