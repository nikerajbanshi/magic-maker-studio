#!/bin/bash

# SoundSteps Startup Script
# This script sets up and launches the SoundSteps application

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}   SoundSteps - Starting Up    ${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Get Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✓${NC} Python version: ${PYTHON_VERSION}"

# Navigate to backend directory
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Virtual environment created"
else
    echo -e "${GREEN}✓${NC} Virtual environment exists"
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install/upgrade pip
echo -e "${YELLOW}Upgrading pip...${NC}"
pip install --upgrade pip -q

# Install requirements
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt -q
echo -e "${GREEN}✓${NC} Dependencies installed"

# Check if data directory exists
if [ ! -d "data" ]; then
    echo -e "${RED}Warning: Data directory not found${NC}"
    echo "The application may not work correctly without data files"
fi

# Start the server
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Starting FastAPI server...${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${GREEN}Application will be available at:${NC}"
echo -e "${YELLOW}  → http://localhost:8000${NC}"
echo -e "${YELLOW}  → API Documentation: http://localhost:8000/docs${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
echo ""

# Run the server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
