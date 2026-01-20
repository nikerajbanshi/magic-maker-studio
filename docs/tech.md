# SoundSteps - Technical Blueprint

## Magic Maker Studio | Demo Ready Documentation

> **Last Updated:** January 20, 2026  
> **Version:** 1.2.0  
> **Target Deployment:** Ubuntu Server 24.04 @ 192.168.1.140

---

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SOUNDSTEPS ARCHITECTURE                            │
│                         Interactive Phonics Learning Platform                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        Web Browser (Chrome/Edge/Safari)                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐   │    │
│  │  │  index.html  │  │  styles.css  │  │   app.js     │  │  init.js   │   │    │
│  │  │  (Main SPA)  │  │ (3500+ lines)│  │ (2400+ lines)│  │  (Auth)    │   │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘   │    │
│  │         │                 │                 │                │          │    │
│  │         └─────────────────┴────────┬────────┴────────────────┘          │    │
│  │                                    │                                     │    │
│  │  ┌─────────────────────────────────▼─────────────────────────────────┐  │    │
│  │  │                         SERVICES LAYER                             │  │    │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │  │    │
│  │  │  │ authService │ │progressServ.│ │feedbackServ.│ │leaderboard  │  │  │    │
│  │  │  │    .js      │ │    .js      │ │    .js      │ │ Service.js  │  │  │    │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │  │    │
│  │  └───────────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                              HTTP/HTTPS │ REST API Calls
                              Port 8000  │ JSON Payloads
                                        │
┌───────────────────────────────────────▼─────────────────────────────────────────┐
│                              DOCKER CONTAINER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                          APPLICATION LAYER                               │    │
│  │  ┌───────────────────────────────────────────────────────────────────┐  │    │
│  │  │                      FastAPI Application                           │  │    │
│  │  │  ┌─────────────┐  ┌─────────────────────────────────────────────┐ │  │    │
│  │  │  │   main.py   │  │              ROUTERS                         │ │  │    │
│  │  │  │  (App Core) │  │  ┌─────────┐ ┌─────────┐ ┌───────────────┐  │ │  │    │
│  │  │  │             │  │  │flashcard│ │sound_out│ │  mouth_moves  │  │ │  │    │
│  │  │  │  - CORS     │  │  │  .py    │ │   .py   │ │     .py       │  │ │  │    │
│  │  │  │  - Routes   │  │  └─────────┘ └─────────┘ └───────────────┘  │ │  │    │
│  │  │  │  - Static   │  │  ┌─────────┐ ┌─────────┐ ┌───────────────┐  │ │  │    │
│  │  │  │    Files    │  │  │ games   │ │progress │ │homophone_quiz │  │ │  │    │
│  │  │  │             │  │  │  .py    │ │   .py   │ │     .py       │  │ │  │    │
│  │  │  └─────────────┘  │  └─────────┘ └─────────┘ └───────────────┘  │ │  │    │
│  │  │                   └─────────────────────────────────────────────┘ │  │    │
│  │  └───────────────────────────────────────────────────────────────────┘  │    │
│  │                                                                          │    │
│  │  ┌───────────────────────────────────────────────────────────────────┐  │    │
│  │  │                        DATA LAYER (JSON)                           │  │    │
│  │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │  │    │
│  │  │  │flashcards.   │ │ soundout.    │ │minimal_pairs │ │mouth_moves│ │  │    │
│  │  │  │   json       │ │   json       │ │    .json     │ │   .json   │ │  │    │
│  │  │  │  (26 cards)  │ │  (22 words)  │ │  (2 pairs)   │ │ (4 pairs) │ │  │    │
│  │  │  └──────────────┘ └──────────────┘ └──────────────┘ └───────────┘ │  │    │
│  │  │  ┌──────────────┐ ┌──────────────┐                                │  │    │
│  │  │  │hungry_monster│ │   users.     │                                │  │    │
│  │  │  │    .json     │ │   json       │                                │  │    │
│  │  │  │  (3 rounds)  │ │ (User Auth)  │                                │  │    │
│  │  │  └──────────────┘ └──────────────┘                                │  │    │
│  │  └───────────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                          STATIC ASSETS                                   │    │
│  │  ┌──────────────────────────────┐  ┌──────────────────────────────────┐ │    │
│  │  │    /assets/images/ (.webp)   │  │     /assets/audio/ (.mp3)        │ │    │
│  │  │    ~40 unique image files    │  │     ~96 unique audio files       │ │    │
│  │  └──────────────────────────────┘  └──────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SERVER INFRASTRUCTURE                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │   Ubuntu 24.04 LTS  |  Docker Engine  |  192.168.1.140:8000            │    │
│  │   /home/user1/projects/soundsteps/                                      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### **Backend**

| Technology      | Version | Purpose                               |
| --------------- | ------- | ------------------------------------- |
| **Python**      | 3.11    | Core programming language             |
| **FastAPI**     | 0.104.1 | High-performance async web framework  |
| **Uvicorn**     | 0.24.0  | ASGI server (4 workers in production) |
| **Pydantic**    | 2.10.4  | Data validation & serialization       |
| **Passlib**     | 1.7.4   | Password hashing (bcrypt)             |
| **python-jose** | 3.3.0   | JWT token generation                  |

### **Frontend**

| Technology             | Version  | Purpose                                       |
| ---------------------- | -------- | --------------------------------------------- |
| **HTML5**              | -        | Semantic structure, SPA layout                |
| **CSS3**               | -        | Custom styling, animations, responsive design |
| **Vanilla JavaScript** | ES6+     | Application logic, DOM manipulation           |
| **Web Speech API**     | Built-in | Text-to-speech fallback                       |
| **LocalStorage**       | Built-in | Client-side data persistence                  |

### **Infrastructure**

| Technology         | Version    | Purpose                       |
| ------------------ | ---------- | ----------------------------- |
| **Docker**         | Latest     | Containerization              |
| **Docker Compose** | 3.8        | Multi-container orchestration |
| **Ubuntu Server**  | 24.04 LTS  | Production OS                 |
| **Nginx**          | (Optional) | Reverse proxy                 |

### **Fonts & UI**

| Resource                     | Purpose                              |
| ---------------------------- | ------------------------------------ |
| **Google Fonts: Comic Neue** | Primary font (400, 700 weights)      |
| **Google Fonts: Baloo 2**    | Brand name "SoundSteps" (800 weight) |
| **Emoji Icons**              | Module tiles and UI feedback         |

---

## 📁 Project Structure

```
magic-maker-studio/
├── 📄 docker-compose.yml      # Container orchestration
├── 📄 Dockerfile              # Container build instructions
├── 📄 start.bat / start.sh    # Local development launchers
│
├── 📂 backend/
│   ├── 📄 requirements.txt    # Python dependencies
│   ├── 📂 app/
│   │   ├── 📄 main.py         # FastAPI application entry point
│   │   ├── 📂 routers/phonics/
│   │   │   ├── 📄 flashcards.py
│   │   │   ├── 📄 sound_out.py
│   │   │   ├── 📄 games.py
│   │   │   ├── 📄 progress.py
│   │   │   ├── 📄 mouth_moves.py
│   │   │   └── 📄 homophone_quiz.py
│   │   ├── 📂 routes/
│   │   │   ├── 📄 auth.py
│   │   │   ├── 📄 health.py
│   │   │   └── 📄 user.py
│   │   ├── 📂 services/
│   │   │   ├── 📄 auth.py
│   │   │   └── 📄 password.py
│   │   └── 📂 models/
│   │       └── 📄 user.py
│   └── 📂 data/               # JSON data files
│       ├── 📄 flashcards.json
│       ├── 📄 soundout.json
│       ├── 📄 minimal_pairs.json
│       ├── 📄 mouth_moves.json
│       ├── 📄 hungry_monster.json
│       └── 📄 users.json
│
├── 📂 static/                 # Frontend SPA
│   ├── 📄 index.html          # Main HTML (single page)
│   ├── 📄 styles.css          # All CSS styles (~3500 lines)
│   ├── 📄 app.js              # Main application logic (~2400 lines)
│   ├── 📄 init.js             # Initialization & auth check
│   ├── 📂 components/
│   │   └── 📄 authUI.js       # Login/Register UI components
│   ├── 📂 services/
│   │   ├── 📄 authService.js
│   │   ├── 📄 progressService.js
│   │   ├── 📄 feedbackService.js
│   │   └── 📄 leaderboardService.js
│   └── 📂 assets/
│       ├── 📂 images/         # .webp images (~40 files)
│       └── 📂 audio/          # .mp3 audio files (~96 files)
│
└── 📂 docs/                   # Documentation
    └── 📄 tech.md             # This file
```

---

## 🔌 API Endpoints

### **Health & System**

| Method | Endpoint  | Description             |
| ------ | --------- | ----------------------- |
| GET    | `/health` | System health check     |
| GET    | `/`       | Serves index.html (SPA) |

### **Authentication**

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | New user registration    |
| POST   | `/api/auth/login`    | User login (returns JWT) |
| GET    | `/api/user/me`       | Get current user info    |

### **Phonics Modules**

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/cards/flashcards`      | Get all flashcard data       |
| GET    | `/api/soundout`              | Get sound-out exercises      |
| GET    | `/api/game/hungry-monster`   | Get Hungry Monster game data |
| GET    | `/api/mouth-moves`           | Get Mouth Moves exercises    |
| GET    | `/api/homophone-quiz/random` | Get random homophone quiz    |
| GET    | `/api/minimal-pairs`         | Get minimal pairs data       |

### **Progress & Achievements**

| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| POST   | `/api/progress/save`      | Save user progress |
| GET    | `/api/progress/{user_id}` | Get user progress  |

---

## 🎮 Learning Modules

### **1. ABC Flashcards**

- **Purpose:** Learn letter sounds A-Z
- **Data Source:** `flashcards.json` (26 entries)
- **Features:**
  - Flip animation to reveal word
  - Audio pronunciation per letter
  - Letter-image association
  - Navigation carousel

### **2. Sound Out**

- **Purpose:** Learn phoneme segmentation & blending
- **Data Source:** `soundout.json` (22 CVC words)
- **Features:**
  - Segmented audio (c-a-t)
  - Blended audio (cat)
  - Visual word image
  - Sequential progression

### **3. Hungry Monster**

- **Purpose:** Gamified word recognition
- **Data Source:** `hungry_monster.json` (3 rounds)
- **Features:**
  - Drag & drop interaction
  - Question audio prompts
  - Option audio on click
  - Correct/incorrect feedback

### **4. Mouth Moves**

- **Purpose:** Learn vowel length differences
- **Data Source:** `mouth_moves.json` (4 word pairs)
- **Features:**
  - Intro popup with audio instructions
  - Long vs short vowel comparison
  - Mouth position guidance (emoji)
  - Audio pronunciation comparison

### **5. Minimal Pairs**

- **Purpose:** Discriminate similar sounds
- **Data Source:** `minimal_pairs.json` (2 categories)
- **Features:**
  - Interactive tutorial (first-time)
  - /p/ vs /b/, /t/ vs /d/ pairs
  - Select matching sound game
  - Visual + audio feedback

### **6. Homophone Quiz**

- **Purpose:** Learn same-sound different-meaning words
- **Data Source:** Backend API
- **Features:**
  - Multiple choice format
  - Sentence context clues
  - Audio pronunciation

---

## 🔄 Data Flow

### **User Authentication Flow**

```
┌──────────┐     POST /api/auth/login      ┌──────────┐
│  Browser │ ──────────────────────────▶   │  FastAPI │
│          │     {email, password}          │          │
│          │                                │          │
│          │ ◀──────────────────────────   │          │
│          │     {token, user_info}         │          │
└──────────┘                                └──────────┘
      │
      │ Store in localStorage
      ▼
┌──────────────────────────────────────┐
│  localStorage:                        │
│    - authToken                        │
│    - userInfo                         │
│    - progress data                    │
│    - leaderboard                      │
│    - tutorial_seen flags              │
└──────────────────────────────────────┘
```

### **Module Loading Flow**

```
User clicks module tile
        │
        ▼
┌─────────────────┐
│  showScreen()   │ ──▶ Hide all screens, show target
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  showLoading()  │ ──▶ Display loading spinner
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   apiCall()     │ ──▶ fetch() to backend API
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  hideLoading()  │ ──▶ Remove spinner
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ updateModule()  │ ──▶ Render content to DOM
└─────────────────┘
```

---

## 🎨 CSS Architecture

### **Key CSS Variables & Features**

```css
/* Color Palette */
--primary: #9B7FE6;    /* Purple - headers, buttons */
--secondary: #FFD93D;  /* Yellow - accents, stars */
--success: #4CAF50;    /* Green - correct answers */
--error: #FF6B6B;      /* Red - wrong answers */
--bg-gradient: linear-gradient(135deg, #667eea, #764ba2);

/* Z-Index Hierarchy */
z-index: 9998  /* Tutorial dim overlay */
z-index: 9999  /* Tutorial spotlight */
z-index: 10001 /* Tutorial arrow */
z-index: 10002 /* Mouth intro overlay */
z-index: 10004 /* Tutorial message */
z-index: 10005 /* Tutorial skip button */
```

### **Responsive Breakpoints**

```css
@media (max-width: 768px) /* Tablet */ @media (max-width: 480px); /* Mobile */
```

---

## 🔊 Audio System

### **Primary: HTML5 Audio API**

```javascript
const audio = new Audio("/assets/audio/word.mp3");
audio.volume = 0.8;
audio.play().catch((err) => {
  // Fallback to speech synthesis
});
```

### **Fallback: Web Speech API**

```javascript
if ("speechSynthesis" in window) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;

  // Get female voice
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    (v) => v.name.includes("Female") || v.name.includes("Samantha"),
  );
  if (femaleVoice) utterance.voice = femaleVoice;

  speechSynthesis.speak(utterance);
}
```

---

## 💾 LocalStorage Keys

| Key                              | Purpose                  | Data Type  |
| -------------------------------- | ------------------------ | ---------- |
| `authToken`                      | JWT authentication token | String     |
| `userInfo`                       | User profile data        | JSON       |
| `globalLeaderboard`              | Top 5 user scores        | JSON Array |
| `flashcardProgress`              | Flashcard completion     | JSON       |
| `soundOutProgress`               | Sound Out completion     | JSON       |
| `minimalPairsProgress`           | Minimal Pairs scores     | JSON       |
| `minimal_pairs_tutorial_v2_seen` | Tutorial flag            | Boolean    |
| `mouth_moves_intro_seen`         | Intro popup flag         | Boolean    |

---

## 🚀 Deployment Instructions

### **Pre-Deployment Checklist**

- [ ] All JSON data files populated
- [ ] All audio files in `/assets/audio/`
- [ ] All image files in `/assets/images/`
- [ ] Docker installed on server
- [ ] Port 8000 open on firewall

### **Deploy to Ubuntu Server**

```bash
# 1. Connect to server
ssh user1@192.168.1.140

# 2. Navigate to project folder
cd ~/projects/soundsteps

# 3. Copy files (from Windows)
# Run from local machine:
scp -r magic-maker-studio/* user1@192.168.1.140:~/projects/soundsteps/

# 4. Build and start containers
docker compose up --build -d

# 5. Verify deployment
docker ps                    # Check container running
docker compose logs -f       # View logs
curl http://localhost:8000/health  # Test API

# 6. Access application
# Open browser: http://192.168.1.140:8000
```

### **Useful Docker Commands**

```bash
# Stop application
docker compose down

# Restart
docker compose restart

# Rebuild after changes
docker compose up --build -d

# View container logs
docker compose logs -f soundsteps

# Enter container shell
docker exec -it soundsteps-app /bin/bash

# Check resource usage
docker stats soundsteps-app
```

---

## 🧪 Testing Checklist for Demo

### **Authentication**

- [ ] Register new user
- [ ] Login with existing user
- [ ] Logout functionality
- [ ] Session persistence (refresh page)

### **Modules**

- [ ] ABC Flashcards - flip & audio
- [ ] Sound Out - segment & blend
- [ ] Hungry Monster - drag correct answer
- [ ] Mouth Moves - intro popup, word pairs
- [ ] Minimal Pairs - tutorial, matching game
- [ ] Homophone Quiz - answer questions

### **UI/UX**

- [ ] Loading spinners appear
- [ ] Animations smooth
- [ ] Audio plays correctly
- [ ] Mobile responsive

---

## 👥 Team Quick Reference

### **To understand the codebase:**

1. Start with `static/index.html` - see all screens
2. Read `static/app.js` - main functions for each module
3. Check `backend/app/main.py` - all API routes
4. Review JSON files in `backend/data/` - data structure

### **To add a new module:**

1. Create router in `backend/app/routers/phonics/`
2. Add data file in `backend/data/`
3. Register router in `main.py`
4. Add HTML screen in `index.html`
5. Add CSS styles in `styles.css`
6. Add JS functions in `app.js`
7. Add tile on home screen

### **To modify existing module:**

1. Find the `load[ModuleName]()` function in `app.js`
2. Find the screen ID in `index.html`
3. Find the API endpoint in the corresponding router

---

## 📞 Support Contacts

| Role     | Name | Focus Area         |
| -------- | ---- | ------------------ |
| Lead Dev | -    | Backend & Docker   |
| Frontend | -    | UI/UX & Animations |
| Content  | -    | Audio & Data       |

---

**Document Version:** 1.0  
**Created:** January 20, 2026  
**For:** SoundSteps Demo Preparation
