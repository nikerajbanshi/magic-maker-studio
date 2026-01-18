#!/bin/bash
# ============================================
# SoundSteps - Complete Setup Script
# For macOS and Linux
# ============================================
# This script sets up and runs:
# 1. Python virtual environment & dependencies
# 2. FastAPI server (localhost:8000)
# 3. Docker container (for deployment testing)
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║    🎵 SoundSteps - Complete Setup 🎵       ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# STEP 1: Check Prerequisites
# ============================================
echo -e "${CYAN}[1/5] Checking prerequisites...${NC}"

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    echo -e "  ${GREEN}✓${NC} Python: ${PYTHON_VERSION}"
else
    echo -e "  ${RED}✗ Python 3 not found!${NC}"
    echo -e "    Please install Python 3.11+ from https://python.org"
    exit 1
fi

# Check Docker (optional)
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Docker: Running"
        DOCKER_AVAILABLE=true
    else
        echo -e "  ${YELLOW}!${NC} Docker: Installed but not running"
        DOCKER_AVAILABLE=false
    fi
else
    echo -e "  ${YELLOW}!${NC} Docker: Not installed (optional)"
    DOCKER_AVAILABLE=false
fi

echo ""

# ============================================
# STEP 2: Setup Python Environment
# ============================================
echo -e "${CYAN}[2/5] Setting up Python environment...${NC}"

cd backend

if [ ! -d "venv" ]; then
    echo -e "  Creating virtual environment..."
    python3 -m venv venv
    echo -e "  ${GREEN}✓${NC} Virtual environment created"
else
    echo -e "  ${GREEN}✓${NC} Virtual environment exists"
fi

# Activate virtual environment
source venv/bin/activate
echo -e "  ${GREEN}✓${NC} Virtual environment activated"

# Upgrade pip quietly
pip install --upgrade pip -q
echo -e "  ${GREEN}✓${NC} Pip upgraded"

# Install dependencies
echo -e "  Installing dependencies..."
pip install -r requirements.txt -q
echo -e "  ${GREEN}✓${NC} Dependencies installed"

cd ..
echo ""

# ============================================
# STEP 3: Kill existing processes on port 8000
# ============================================
echo -e "${CYAN}[3/5] Preparing server port...${NC}"

if lsof -ti:8000 &> /dev/null; then
    echo -e "  Stopping existing process on port 8000..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 1
    echo -e "  ${GREEN}✓${NC} Port 8000 cleared"
else
    echo -e "  ${GREEN}✓${NC} Port 8000 available"
fi
echo ""

# ============================================
# STEP 4: Start FastAPI Server
# ============================================
echo -e "${CYAN}[4/5] Starting FastAPI server...${NC}"

cd backend
source venv/bin/activate

# Start server in background
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ../server.pid

cd ..

# Wait for server to start
echo -e "  Waiting for server to start..."
sleep 3

# Verify server is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Server running (PID: $SERVER_PID)"
else
    echo -e "  ${RED}✗${NC} Server failed to start. Check server.log for details."
    exit 1
fi
echo ""

# ============================================
# STEP 5: Build Docker Container (if available)
# ============================================
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo -e "${CYAN}[5/5] Building Docker container...${NC}"
    
    # Stop existing container
    docker stop soundsteps-app 2>/dev/null || true
    docker rm soundsteps-app 2>/dev/null || true
    
    # Build image
    echo -e "  Building Docker image (this may take a minute)..."
    docker build -t soundsteps . -q
    echo -e "  ${GREEN}✓${NC} Docker image built"
    
    # Note: Not running container since server already on port 8000
    echo -e "  ${GREEN}✓${NC} Docker ready for deployment"
    echo ""
else
    echo -e "${CYAN}[5/5] Skipping Docker (not available)...${NC}"
    echo -e "  ${YELLOW}!${NC} Install Docker Desktop to test containerized deployment"
    echo ""
fi

# ============================================
# SUCCESS!
# ============================================
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         🎉 Setup Complete! 🎉              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 App URL:${NC}        http://localhost:8000"
echo -e "${BLUE}📚 API Docs:${NC}       http://localhost:8000/docs"
echo -e "${BLUE}❤️  Health Check:${NC}  http://localhost:8000/health"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  View logs:       ${CYAN}tail -f server.log${NC}"
echo -e "  Stop server:     ${CYAN}kill \$(cat server.pid)${NC}"
echo -e "  Run Docker:      ${CYAN}./docker-run.sh${NC}"
echo ""
echo -e "${PURPLE}Ready to deploy? See DEPLOYMENT.md for Railway instructions!${NC}"
echo ""

# Try to open browser
if command -v open &> /dev/null; then
    echo -e "${YELLOW}Opening browser...${NC}"
    sleep 1
    open http://localhost:8000
elif command -v xdg-open &> /dev/null; then
    echo -e "${YELLOW}Opening browser...${NC}"
    sleep 1
    xdg-open http://localhost:8000
fi
