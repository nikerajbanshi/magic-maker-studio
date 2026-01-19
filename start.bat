@echo off
REM ============================================
REM SoundSteps - Complete Setup Script
REM For Windows
REM ============================================
REM This script sets up and runs:
REM 1. Python virtual environment & dependencies
REM 2. FastAPI server (localhost:8000)
REM 3. Docker container (for deployment testing)
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo    SoundSteps - Complete Setup
echo ========================================
echo.

REM Get script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM ============================================
REM STEP 1: Check Prerequisites
REM ============================================
echo [1/5] Checking prerequisites...

REM Check Python
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   [X] Python not found!
    echo       Please install Python 3.11+ from https://python.org
    echo       Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo   [OK] Python: %PYTHON_VERSION%

REM Check Docker (optional)
where docker >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    docker info >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo   [OK] Docker: Running
        set DOCKER_AVAILABLE=true
    ) else (
        echo   [!] Docker: Installed but not running
        set DOCKER_AVAILABLE=false
    )
) else (
    echo   [!] Docker: Not installed (optional)
    set DOCKER_AVAILABLE=false
)

echo.

REM ============================================
REM STEP 2: Setup Python Environment
REM ============================================
echo [2/5] Setting up Python environment...

cd backend

if not exist "venv" (
    echo   Creating virtual environment...
    python -m venv venv
    echo   [OK] Virtual environment created
) else (
    echo   [OK] Virtual environment exists
)

REM Activate virtual environment
call venv\Scripts\activate.bat
echo   [OK] Virtual environment activated

REM Upgrade pip quietly
python -m pip install --upgrade pip -q
echo   [OK] Pip upgraded

REM Install dependencies
echo   Installing dependencies...
pip install -r requirements.txt -q
echo   [OK] Dependencies installed

cd ..
echo.

REM ============================================
REM STEP 3: Kill existing processes on port 8000
REM ============================================
echo [3/5] Preparing server port...

REM Find and kill process on port 8000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo   Stopping existing process on port 8000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
echo   [OK] Port 8000 ready
echo.

REM ============================================
REM STEP 4: Start FastAPI Server
REM ============================================
echo [4/5] Starting FastAPI server...

cd backend
call venv\Scripts\activate.bat

REM Start server in new window
start "SoundSteps Server" /min cmd /c "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

cd ..

REM Wait for server to start
echo   Waiting for server to start...
timeout /t 5 /nobreak >nul

REM Verify server is running (simple check)
curl -s http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Server running
) else (
    echo   [!] Server may still be starting... Please wait a moment.
)
echo.

REM ============================================
REM STEP 5: Build Docker Container (if available)
REM ============================================
if "%DOCKER_AVAILABLE%"=="true" (
    echo [5/5] Building Docker container...
    
    REM Stop existing container
    docker stop soundsteps-app >nul 2>&1
    docker rm soundsteps-app >nul 2>&1
    
    REM Build image
    echo   Building Docker image (this may take a minute)...
    docker build -t soundsteps . -q
    echo   [OK] Docker image built
    echo   [OK] Docker ready for deployment
    echo.
) else (
    echo [5/5] Skipping Docker (not available)...
    echo   [!] Install Docker Desktop to test containerized deployment
    echo.
)

REM ============================================
REM SUCCESS!
REM ============================================
echo ========================================
echo         Setup Complete!
echo ========================================
echo.
echo  App URL:        http://localhost:8000
echo  API Docs:       http://localhost:8000/docs
echo  Health Check:   http://localhost:8000/health
echo.
echo  Useful commands:
echo    Stop server:  Close the "SoundSteps Server" window
echo    Run Docker:   docker-run.sh (in Git Bash)
echo.
echo  Ready to deploy? See DEPLOYMENT.md for Railway instructions!
echo.

REM Open browser
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:8000

echo.
echo Press any key to exit (server will keep running)...
pause >nul
