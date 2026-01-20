# SoundSteps - Complete Functional Specification

**Document Version:** 1.0  
**Last Updated:** January 20, 2026  
**Project:** SoundSteps (Magic Maker Studio)  
**Platform:** Web Application (Mobile-First Design)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [System Architecture](#3-system-architecture)
4. [User Interface Specifications](#4-user-interface-specifications)
5. [Module Specifications](#5-module-specifications)
6. [Progress & Achievement System](#6-progress--achievement-system)
7. [Technical Specifications](#7-technical-specifications)
8. [Deployment Guide](#8-deployment-guide)
9. [API Reference](#9-api-reference)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Executive Summary

### 1.1 Purpose

SoundSteps is an interactive phonics learning platform designed for young learners (ages 4-8). The application provides engaging, game-based learning experiences to help children master letter sounds, phoneme recognition, and word pronunciation.

### 1.2 Key Features

- **Six Learning Modules**: Flashcards, Sound It Out, Minimal Pairs, Mouth Moves, Homophone Quiz, Hungry Monster
- **Interactive Tutorial System**: Guided onboarding for complex modules
- **XP & Achievement System**: Gamified progression with levels and badges
- **Responsive Design**: Mobile-first approach with tablet/desktop support
- **Child-Friendly UI**: Colorful, accessible interface with Comic Neue font

### 1.3 Target Users

- **Primary**: Children ages 4-8 learning English phonics
- **Secondary**: Parents, teachers, and educators monitoring progress

---

## 2. Project Overview

### 2.1 Technology Stack

| Layer      | Technology                                           |
| ---------- | ---------------------------------------------------- |
| Frontend   | Vanilla JavaScript, HTML5, CSS3                      |
| Backend    | Python 3.11, FastAPI                                 |
| Storage    | LocalStorage (client-side), JSON files (server-side) |
| Deployment | Docker, Docker Compose                               |
| Font       | Comic Neue (Google Fonts)                            |

### 2.2 Design Philosophy

- **Mobile-First**: All interfaces designed for 320px+ screens
- **Accessibility**: High contrast colors, large touch targets (44px minimum)
- **Engagement**: Gamification elements throughout
- **Simplicity**: Minimal navigation, clear visual hierarchy

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   index.html │  │   app.js   │  │     styles.css     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Services Layer                        │ │
│  │  authService │ progressManager │ feedbackService         │ │
│  │  leaderboardService │ progressService                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                      Routers                              │ │
│  │  /api/phonics/flashcards  │  /api/phonics/sound-out      │ │
│  │  /api/phonics/pairs       │  /api/phonics/mouth-moves    │ │
│  │  /api/phonics/homophone   │  /api/phonics/hungry-monster │ │
│  │  /api/achievements                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Data Files (JSON)                       │ │
│  │  flashcards.json │ soundout.json │ minimal_pairs.json    │ │
│  │  mouth_moves.json │ homophone_quiz.json │ achievements.json│ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 File Structure

```
magic-maker-studio/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry
│   │   ├── middleware/          # Auth middleware
│   │   ├── models/              # Data models
│   │   ├── routers/
│   │   │   ├── achievements.py  # Achievement system API
│   │   │   └── phonics/         # Learning module APIs
│   │   │       ├── flashcards.py
│   │   │       ├── sound_out.py
│   │   │       ├── games.py     # Minimal pairs
│   │   │       ├── mouth_moves.py
│   │   │       ├── homophone_quiz.py
│   │   │       └── progress.py
│   │   ├── routes/              # Auth & health routes
│   │   └── services/            # Business logic
│   ├── data/                    # JSON data files
│   └── requirements.txt
├── static/
│   ├── index.html               # Main SPA entry point
│   ├── app.js                   # Main application logic
│   ├── styles.css               # Complete stylesheet
│   ├── init.js                  # Initialization
│   ├── components/
│   │   └── authUI.js            # Authentication UI
│   ├── services/
│   │   ├── authService.js       # Auth logic
│   │   ├── progressManager.js   # XP & achievements
│   │   ├── progressService.js   # Progress tracking
│   │   ├── feedbackService.js   # Visual feedback
│   │   └── leaderboardService.js# Leaderboard logic
│   └── assets/
│       ├── audio/               # Sound files
│       └── images/              # Image assets
├── docs/                        # Documentation
├── Dockerfile                   # Container definition
├── docker-compose.yml           # Container orchestration
├── deploy.sh                    # Linux deployment script
└── deploy.bat                   # Windows deployment script
```

---

## 4. User Interface Specifications

### 4.1 Design System

#### 4.1.1 Color Palette

| Color            | Hex       | Usage                           |
| ---------------- | --------- | ------------------------------- |
| Purple (Primary) | `#9B7FE6` | Buttons, highlights, brand      |
| Purple Dark      | `#8568D9` | Hover states, accents           |
| Blue             | `#5DADE2` | Secondary actions, links        |
| Green            | `#4CAF50` | Success states, correct answers |
| Red              | `#F44336` | Error states, incorrect answers |
| Orange           | `#FF9800` | Warnings, streak indicators     |
| White            | `#FFFFFF` | Backgrounds, cards              |
| Gray             | `#E8E8E8` | Borders, disabled states        |

#### 4.1.2 Typography

| Element    | Font       | Weight          | Size     |
| ---------- | ---------- | --------------- | -------- |
| Brand Name | Comic Neue | 900 (Black)     | 1.25rem  |
| Headings   | Comic Neue | 700 (Bold)      | 1.5-2rem |
| Body       | Comic Neue | 400 (Regular)   | 1rem     |
| Labels     | Comic Neue | 600 (Semi-bold) | 0.75rem  |

#### 4.1.3 Spacing & Layout

- **Border Radius**:
  - Cards: 24px
  - Buttons: 12-16px
  - Badges: 25px (pill shape)
- **Card Shadow**: `0 8px 32px rgba(155, 127, 230, 0.15)`
- **Button Shadow**: `0 4px 12px rgba(0, 0, 0, 0.1)`

### 4.2 Screen Specifications

#### 4.2.1 Welcome Screen

- Brand logo and title "SoundSteps"
- Guest access button (primary)
- Login/Register options (secondary)
- Animated sparkle effect on title

#### 4.2.2 Dashboard Screen

- **Header**: Home button, brand name (bold), logout button (red glow on hover)
- **Stats Row**: 4 tiles in single row (XP, Level, Badges, Streak)
  - Responsive: 2x2 grid on mobile (<480px)
- **Module Grid**: 6 colorful module cards (2x3 or 3x2 layout)
- **Skills Section**: Dynamic achievement badges (populated by JS)
- **Leaderboard**: Top 5 users with XP

#### 4.2.3 Module Screens

Each module screen includes:

- Back button (home icon)
- Brand name
- Module title
- Interactive content area
- Progress/feedback indicators

### 4.3 Responsive Breakpoints

| Breakpoint | Screen      | Behavior              |
| ---------- | ----------- | --------------------- |
| < 400px    | Small phone | Single column modules |
| < 480px    | Phone       | 2x2 stat cards        |
| 480-600px  | Large phone | 2 column modules      |
| > 600px    | Tablet+     | 3 column modules      |

---

## 5. Module Specifications

### 5.1 Flashcards Module

**Purpose**: Teach letter recognition and phoneme sounds

**Features**:

- Animated flip cards showing uppercase/lowercase letters
- Audio playback for letter sounds
- Word examples with images
- Progress through A-Z

**Interaction Flow**:

1. User sees letter card
2. Taps to hear sound
3. Views example word
4. Swipes/clicks to next letter

**XP Award**: 100 XP on completion

---

### 5.2 Sound It Out Module

**Purpose**: Blend phonemes to form words

**Features**:

- Interactive slider showing phoneme segments
- Audio playback for each segment
- Visual progress through word
- Instruction text above exercise

**Interaction Flow**:

1. User sees segmented word (e.g., "c-a-t")
2. Moves slider to reveal phonemes
3. Hears each phoneme sound
4. Blends to hear full word

**XP Award**: 120 XP on completion

---

### 5.3 Minimal Pairs Module

**Purpose**: Distinguish between similar phonemes

**Features**:

- Interactive tutorial system (4 steps)
- Drag-and-drop word sorting
- Two sound buckets (e.g., /p/ vs /b/)
- Audio playback for words
- Answer checking with feedback

**Tutorial System**:

1. **Step 1**: Click sound button to hear phoneme
2. **Step 2**: Click word card to hear pronunciation
3. **Step 3**: Drag word to matching sound box
4. **Step 4**: Click "Check Answers"

**Tutorial Behavior**:

- Tutorial actions do NOT count toward progress
- After tutorial, module resets to same question
- "Don't show again" checkbox available
- Skip button always visible

**XP Award**: 150 XP on completion

---

### 5.4 Mouth Moves Module

**Purpose**: Teach mouth positioning for vowel sounds

**Features**:

- Word pairs showing vowel contrasts
- Mouth position indicators (emoji faces)
- Audio playback for pronunciation
- Navigation between exercises

**Interaction Flow**:

1. User sees word pair (e.g., "bit" vs "beat")
2. Views mouth position guide
3. Listens to pronunciation difference
4. Navigates to next pair

**XP Award**: 100 XP on completion

---

### 5.5 Homophone Quiz Module

**Purpose**: Match words to correct pictures

**Features**:

- Audio word playback
- Multiple choice image selection
- Immediate feedback (correct/incorrect)
- Progress tracking

**Interaction Flow**:

1. User hears word
2. Selects matching image
3. Receives immediate feedback
4. Advances to next question

**XP Award**: 130 XP on completion

---

### 5.6 Hungry Monster Module

**Purpose**: Gamified phoneme practice

**Features**:

- Animated monster character
- Word feeding mechanic
- Target sound identification
- Celebration animations

**Interaction Flow**:

1. Monster displays target sound
2. Words appear on screen
3. User drags matching words to monster
4. Monster "eats" correct words
5. Confetti on perfect scores

**XP Award**: 140 XP on completion

---

## 6. Progress & Achievement System

### 6.1 XP System

| Module         | XP Reward |
| -------------- | --------- |
| Flashcards     | 100 XP    |
| Sound It Out   | 120 XP    |
| Minimal Pairs  | 150 XP    |
| Mouth Moves    | 100 XP    |
| Homophone Quiz | 130 XP    |
| Hungry Monster | 140 XP    |

**Level Progression**: 500 XP per level

### 6.2 Achievement Badges

| Badge | Name          | Criteria                |
| ----- | ------------- | ----------------------- |
| 🔤    | ABC Master    | Complete Flashcards     |
| 🔊    | Sound Pro     | Complete Sound It Out   |
| 🎯    | Pair Expert   | Complete Minimal Pairs  |
| 👄    | Mouth Master  | Complete Mouth Moves    |
| 🖼️    | Quiz Champ    | Complete Homophone Quiz |
| 👾    | Monster Tamer | Complete Hungry Monster |

### 6.3 Completion Celebration

When a module is completed:

1. Full-screen celebration overlay appears
2. Confetti animation plays
3. XP award displayed with animation
4. Achievement badge shown (if first completion)
5. Level-up notification (if applicable)
6. Auto-redirect to dashboard after 4.5 seconds

### 6.4 Dashboard Stats Display

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│   ⭐    │ │   📊    │ │   🏅    │ │   🔥    │
│   250   │ │    1    │ │    3    │ │    5    │
│   XP    │ │  Level  │ │ Badges  │ │ Streak  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

## 7. Technical Specifications

### 7.1 Frontend Services

#### 7.1.1 ProgressManager

- Manages XP accumulation
- Tracks level progression
- Handles achievement unlocking
- Persists data to localStorage

#### 7.1.2 LeaderboardService

- Maintains top scores
- Pre-populated with mock data:
  - Emma K. - 2450 XP
  - Liam J. - 2180 XP
  - Sophia M. - 1920 XP
  - Noah P. - 1750 XP
  - Olivia R. - 1580 XP

#### 7.1.3 FeedbackService

- Visual celebration animations
- Sound effect playback
- Toast notifications
- Confetti effects

### 7.2 Backend API Endpoints

| Endpoint                      | Method | Description                 |
| ----------------------------- | ------ | --------------------------- |
| `/health`                     | GET    | Health check                |
| `/api/phonics/flashcards`     | GET    | Get flashcard data          |
| `/api/phonics/sound-out`      | GET    | Get sound-out exercises     |
| `/api/phonics/pairs`          | GET    | Get minimal pairs           |
| `/api/phonics/mouth-moves`    | GET    | Get mouth moves exercises   |
| `/api/phonics/homophone`      | GET    | Get homophone quiz          |
| `/api/phonics/hungry-monster` | GET    | Get monster game data       |
| `/api/achievements`           | GET    | Get achievement definitions |

### 7.3 Data Storage

**LocalStorage Keys**:

- `soundsteps_user` - User progress and XP
- `globalLeaderboard` - Leaderboard data
- `minimal_pairs_tutorial_v2_seen` - Tutorial state
- `unlockedSkills` - Achievement tracking

---

## 8. Deployment Guide

### 8.1 Server Requirements

- **OS**: Ubuntu 20.04+ / Any Docker-compatible OS
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **RAM**: 512MB minimum
- **Disk**: 1GB minimum
- **Network**: Port 8000 accessible

### 8.2 Deployment Steps

#### 8.2.1 Using Deployment Scripts

**Windows (PowerShell)**:

```batch
# Copy files and deploy
.\deploy.bat deploy

# View logs
.\deploy.bat logs

# Check status
.\deploy.bat status
```

**Linux/Mac**:

```bash
# Make executable
chmod +x deploy.sh

# Deploy
./deploy.sh deploy

# View logs
./deploy.sh logs
```

#### 8.2.2 Manual Deployment

```bash
# SSH to server
ssh user1@192.168.1.140

# Navigate to project directory
cd /home/user1/projects/soundsteps

# Build and start
docker compose up --build -d

# Verify
docker compose ps
curl http://localhost:8000/health
```

### 8.3 Docker Configuration

**Dockerfile Features**:

- Python 3.11-slim base image
- Non-root user for security
- Health check endpoint
- 4 Uvicorn workers for production
- UTF-8 encoding for JSON data

**docker-compose.yml**:

- Development profile (with volume mounts)
- Production profile (optimized)
- Auto-restart policy
- Health checks

### 8.4 Accessing the Application

After deployment:

- **Application**: http://192.168.1.140:8000
- **API Docs**: http://192.168.1.140:8000/docs
- **Health Check**: http://192.168.1.140:8000/health

---

## 9. API Reference

### 9.1 Health Check

```http
GET /health
```

**Response**:

```json
{
  "status": "healthy",
  "timestamp": "2026-01-20T10:30:00Z"
}
```

### 9.2 Flashcards

```http
GET /api/phonics/flashcards
```

**Response**:

```json
{
  "cards": [
    {
      "id": 1,
      "letter": "A",
      "uppercase": "A",
      "lowercase": "a",
      "word": "apple",
      "image": "/assets/images/apple.png",
      "audio": "/assets/audio/a.mp3"
    }
  ],
  "total": 26
}
```

### 9.3 Minimal Pairs

```http
GET /api/phonics/pairs
```

**Response**:

```json
{
  "exercises": [
    {
      "id": 1,
      "category": "/p/ vs /b/",
      "words": [
        { "word": "pat", "phoneme": "/p/" },
        { "word": "bat", "phoneme": "/b/" }
      ]
    }
  ]
}
```

### 9.4 Achievements

```http
GET /api/achievements
```

**Response**:

```json
{
  "modules": {
    "flashcards": {
      "xp": 100,
      "achievement": {
        "id": "flashcards_complete",
        "name": "ABC Master",
        "icon": "🔤",
        "description": "Completed the Flashcards module"
      }
    }
  },
  "xpPerLevel": 500
}
```

---

## 10. Future Enhancements

### 10.1 Planned Features

- [ ] User account persistence (database backend)
- [ ] Parent/teacher dashboard
- [ ] Progress reports and analytics
- [ ] Additional language support
- [ ] Offline mode (PWA)
- [ ] Voice recognition for pronunciation
- [ ] Multiplayer challenges
- [ ] Custom avatar system

### 10.2 Performance Optimizations

- [ ] Image lazy loading
- [ ] Audio preloading
- [ ] Service worker caching
- [ ] CDN integration

### 10.3 Accessibility Improvements

- [ ] Screen reader optimization
- [ ] Keyboard navigation
- [ ] High contrast mode
- [ ] Font size adjustment

---

## Document History

| Version | Date       | Author           | Changes               |
| ------- | ---------- | ---------------- | --------------------- |
| 1.0     | 2026-01-20 | Development Team | Initial specification |

---

**End of Document**
