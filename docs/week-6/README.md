# Week 6 - Deployment & Operations

## SoundSteps: Interactive Phonics Learning Platform

This document covers the deployment architecture, API specifications, and deployment instructions for the SoundSteps phonics learning platform.

---

## 1. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│                    (Web Browsers - Desktop/Mobile)                       │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS (Port 443)
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          AWS EC2 Instance                                │
│                        (Amazon Linux 2023)                               │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                         NGINX (Reverse Proxy)                       │ │
│  │                    - SSL Termination (Let's Encrypt)                │ │
│  │                    - Static File Serving                            │ │
│  │                    - Load Balancing (optional)                      │ │
│  └────────────────────────────┬───────────────────────────────────────┘ │
│                               │ HTTP (Port 8000)                         │
│  ┌────────────────────────────▼───────────────────────────────────────┐ │
│  │                    Docker Container                                 │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │              Gunicorn/Uvicorn (WSGI/ASGI Server)             │  │ │
│  │  │                     - Worker Processes                        │  │ │
│  │  │                     - Request Handling                        │  │ │
│  │  └──────────────────────────────┬───────────────────────────────┘  │ │
│  │                                 │                                   │ │
│  │  ┌──────────────────────────────▼───────────────────────────────┐  │ │
│  │  │              FastAPI Application (Python)                    │  │ │
│  │  │           - REST API Endpoints                               │  │ │
│  │  │           - Authentication (JWT/bcrypt)                      │  │ │
│  │  │           - Business Logic                                   │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                       Static Assets                                 │ │
│  │              /static (HTML, CSS, JS, Audio, Images)                │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                       Data Storage                                  │ │
│  │              /backend/data (JSON files)                            │ │
│  │              LocalStorage (Client-side progress)                   │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Vanilla JS, HTML5, CSS3 | Interactive UI |
| Backend | FastAPI (Python 3.11+) | REST API |
| WSGI Server | Uvicorn | ASGI server for FastAPI |
| Reverse Proxy | Nginx | SSL, static files, routing |
| Containerization | Docker | Application packaging |
| Cloud Platform | AWS EC2 | Hosting infrastructure |
| SSL Certificate | Let's Encrypt | HTTPS encryption |

---

## 2. API Specification

### Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:8000/api
```

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/auth/register` | POST | Register new user | `{email, username, password}` | `{user_id, email, username, token}` |
| `/api/auth/login` | POST | User login | `{email, password}` | `{access_token, token_type}` |
| `/api/auth/guest` | POST | Create guest session | `{name}` | `{session_id, name}` |

### Flashcards Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/cards` | GET | Get all flashcards (A-Z) | `{cards: [{letter, word, image, audio}]}` |
| `/api/cards/{letter}` | GET | Get specific letter card | `{letter, word, image, audio}` |

### Sound It Out Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/soundout` | GET | Get word list for phoneme practice | `{words: [{word, phonemes, image, audio}]}` |
| `/api/soundout/{word}` | GET | Get specific word details | `{word, phonemes, image, audio}` |

### Game Endpoints

| Endpoint | Method | Description | Request/Response |
|----------|--------|-------------|------------------|
| `/api/game/question` | GET | Get random game question | `{question, options, correctAnswer}` |
| `/api/game/answer` | POST | Submit answer | Request: `{questionId, answer}` Response: `{correct, score}` |
| `/api/game/minimal-pairs` | GET | Get minimal pair exercises | `{exercises: [{category, words}]}` |

### Progress Endpoints

| Endpoint | Method | Description | Request/Response |
|----------|--------|-------------|------------------|
| `/api/progress` | GET | Get user progress | `{modules, overallProgress, achievements}` |
| `/api/progress` | POST | Update progress | `{module, activity, result}` |
| `/api/leaderboard` | GET | Get top scores | `{leaderboard: [{name, score, rank}]}` |

### Health Check

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/health` | GET | Health check | `{status: "healthy", timestamp}` |

---

## 3. Deployment Guide

### Option A: AWS EC2 Deployment (Recommended)

#### Prerequisites
- AWS Account
- Domain name (optional, can use EC2 public IP)
- SSH client

#### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2 → Launch Instance**
2. **Configure:**
   - Name: `soundsteps-server`
   - AMI: Amazon Linux 2023 or Ubuntu 22.04
   - Instance Type: `t2.micro` (free tier) or `t2.small`
   - Key Pair: Create new or use existing
   - Security Group: Allow ports 22, 80, 443, 8000

3. **Launch and wait for instance to start**

#### Step 2: Connect to EC2

```bash
# Download your .pem key file
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

#### Step 3: Install Dependencies

```bash
# Update system
sudo yum update -y  # Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # Ubuntu

# Install Docker
sudo yum install docker -y  # Amazon Linux
# OR
sudo apt install docker.io -y  # Ubuntu

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo yum install git -y  # Amazon Linux
# OR
sudo apt install git -y  # Ubuntu

# Logout and login again for docker group
exit
# Reconnect SSH
```

#### Step 4: Clone and Deploy Application

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/magic-maker-studio.git
cd magic-maker-studio

# Create docker-compose.yml (if not exists)
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend/data:/app/data
      - ./static:/app/static
    environment:
      - PYTHONUNBUFFERED=1
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./static:/usr/share/nginx/html/static:ro
    depends_on:
      - backend
    restart: unless-stopped
EOF

# Create Dockerfile for backend (if not exists)
cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Create nginx.conf
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name _;

        # Static files
        location /static {
            alias /usr/share/nginx/html/static;
            expires 1d;
            add_header Cache-Control "public, immutable";
        }

        location /assets {
            alias /usr/share/nginx/html/static/assets;
            expires 1d;
        }

        # API proxy
        location /api {
            proxy_pass http://backend:8000/api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Root
        location / {
            proxy_pass http://backend:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
EOF

# Build and start
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

#### Step 5: Access Your Application

```
http://YOUR_EC2_PUBLIC_IP
```

### Option B: Simple Python Deployment (Quick Start)

For testing without Docker:

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP

# Install Python
sudo yum install python3 python3-pip -y

# Clone repo
git clone https://github.com/YOUR_USERNAME/magic-maker-studio.git
cd magic-maker-studio/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run with Uvicorn (production)
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Or run in background
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > server.log 2>&1 &
```

### Option C: Railway/Render Deployment (Easiest)

1. **Push code to GitHub**
2. **Go to [Railway](https://railway.app) or [Render](https://render.com)**
3. **Connect GitHub repository**
4. **Configure:**
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. **Deploy automatically!**

---

## 4. Environment Variables

```bash
# .env file
DEBUG=false
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./data/app.db
ALLOWED_HOSTS=*
CORS_ORIGINS=*
```

---

## 5. Security Considerations

1. **HTTPS**: Always use SSL in production
2. **CORS**: Configure allowed origins properly
3. **Rate Limiting**: Implement API rate limits
4. **Input Validation**: Sanitize all user inputs
5. **Authentication**: Use JWT tokens with expiration
6. **Secrets**: Never commit secrets to git

---

## 6. Monitoring & Maintenance

### Health Check
```bash
curl http://YOUR_SERVER/api/health
```

### View Logs
```bash
# Docker
docker-compose logs -f

# Direct Python
tail -f server.log
```

### Restart Application
```bash
# Docker
docker-compose restart

# Direct Python
pkill -f uvicorn
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 &
```

---

## 7. Deployed Prototype

### Access Information
- **URL**: `http://[YOUR_EC2_IP]` or `https://your-domain.com`
- **Status**: Active
- **Features Available**:
  - ✅ User Authentication (Login/Register/Guest)
  - ✅ Flashcards (A-Z with audio)
  - ✅ Sound It Out (Phoneme blending with speech recognition)
  - ✅ Hungry Monster Game (Phonics questions)
  - ✅ Minimal Pairs Sorting
  - ✅ Progress Tracking (XP, Streaks, Skills)
  - ✅ Leaderboard System
  - ✅ Achievement Badges

### Demo Credentials
- **Guest Mode**: No credentials required
- **Test Account**: Register a new account to test full features

---

## 8. Future Enhancements

1. **Database Migration**: Move from JSON to PostgreSQL/MySQL
2. **User Management**: Admin dashboard
3. **Content Management**: Teacher-created content
4. **Analytics**: Learning progress analytics
5. **Multiplayer**: Competitive phonics games
6. **Mobile App**: React Native or Flutter wrapper

---

## Appendix: Quick Commands Reference

```bash
# Deploy
docker-compose up -d --build

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# SSH to EC2
ssh -i key.pem ec2-user@IP

# Check running containers
docker ps

# Check port
netstat -tlnp | grep 8000
```
