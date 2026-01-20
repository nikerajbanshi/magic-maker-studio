@echo off
REM SoundSteps Deployment Script for Windows
REM Deploys to Ubuntu server at 192.168.1.140

SET SERVER=user1@192.168.1.140
SET REMOTE_PATH=/home/user1/projects/soundsteps

echo ==========================================
echo   SoundSteps - Deployment Script
echo ==========================================
echo.

IF "%1"=="" GOTO usage
IF "%1"=="copy" GOTO copy
IF "%1"=="deploy" GOTO deploy
IF "%1"=="start" GOTO start
IF "%1"=="stop" GOTO stop
IF "%1"=="logs" GOTO logs
IF "%1"=="status" GOTO status
IF "%1"=="ssh" GOTO ssh
GOTO usage

:usage
echo Usage: deploy.bat [command]
echo.
echo Commands:
echo   copy      - Copy files to server using scp
echo   deploy    - Copy files and start containers
echo   start     - Start containers on server
echo   stop      - Stop containers on server
echo   logs      - View container logs
echo   status    - Check container status
echo   ssh       - SSH into server
echo.
GOTO end

:copy
echo [1/2] Creating remote directory...
ssh %SERVER% "mkdir -p %REMOTE_PATH%"

echo [2/2] Copying files to server...
echo Copying backend...
scp -r backend %SERVER%:%REMOTE_PATH%/
echo Copying static...
scp -r static %SERVER%:%REMOTE_PATH%/
echo Copying Docker files...
scp Dockerfile %SERVER%:%REMOTE_PATH%/
scp docker-compose.yml %SERVER%:%REMOTE_PATH%/

echo.
echo [OK] Files copied successfully!
GOTO end

:deploy
CALL :copy
echo.
echo [Starting containers...]
ssh %SERVER% "cd %REMOTE_PATH% && docker compose down 2>/dev/null; docker compose up --build -d"
echo.
echo [OK] Deployment complete!
echo   Access: http://192.168.1.140:8000
GOTO end

:start
echo Starting containers...
ssh %SERVER% "cd %REMOTE_PATH% && docker compose up --build -d"
echo [OK] Containers started!
echo   Access: http://192.168.1.140:8000
GOTO end

:stop
echo Stopping containers...
ssh %SERVER% "cd %REMOTE_PATH% && docker compose down"
echo [OK] Containers stopped!
GOTO end

:logs
echo Fetching logs (Ctrl+C to exit)...
ssh %SERVER% "cd %REMOTE_PATH% && docker compose logs -f"
GOTO end

:status
echo Container status:
ssh %SERVER% "cd %REMOTE_PATH% && docker compose ps"
GOTO end

:ssh
echo Connecting to server...
ssh %SERVER%
GOTO end

:end
