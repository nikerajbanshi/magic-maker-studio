@echo off
REM ==========================================
REM   SoundSteps - Team1 Deployment Script
REM   Domain: https://team1.cbit.site
REM   Port: 8001
REM ==========================================

SET SERVER=user1@192.168.1.140
REM IMPORTANT: Deploy directly to /home/user1/projects (not subdirectory)
SET REMOTE_PATH=/home/user1/projects

echo ==========================================
echo   SoundSteps - Team1 Deployment
echo   Domain: https://team1.cbit.site
echo   Port: 8001
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
IF "%1"=="clean" GOTO clean
GOTO usage

:usage
echo Usage: deploy.bat [command]
echo.
echo Commands:
echo   copy      - Copy files to server
echo   deploy    - Copy files and start containers
echo   start     - Start containers on server
echo   stop      - Stop containers on server
echo   logs      - View container logs
echo   status    - Check container status
echo   ssh       - SSH into server
echo   clean     - Remove old containers and images
echo.
echo After deployment, access: https://team1.cbit.site
echo.
GOTO end

:copy
echo [1/2] Cleaning remote directory...
ssh %SERVER% "cd %REMOTE_PATH% && rm -rf backend static Dockerfile docker-compose.yml 2>/dev/null"

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
echo [Building and starting containers...]
ssh %SERVER% "cd %REMOTE_PATH% && docker compose down 2>/dev/null; docker compose up --build -d"
echo.
echo [Checking container status...]
ssh %SERVER% "cd %REMOTE_PATH% && docker ps --filter name=team1"
echo.
echo ==========================================
echo   [OK] Deployment complete!
echo   Access: https://team1.cbit.site
echo ==========================================
GOTO end

:start
echo Starting containers...
ssh %SERVER% "cd %REMOTE_PATH% && docker compose up --build -d"
echo.
echo [OK] Containers started!
echo Access: https://team1.cbit.site
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
echo.
echo === Container Status ===
ssh %SERVER% "cd %REMOTE_PATH% && docker compose ps"
echo.
echo === Port Check ===
ssh %SERVER% "docker ps --format 'table {{.Names}}\t{{.Ports}}' --filter name=team1"
echo.
GOTO end

:ssh
echo Connecting to server...
echo Remember: Your project is in %REMOTE_PATH%
ssh %SERVER%
GOTO end

:clean
echo Cleaning up old containers and images...
ssh %SERVER% "cd %REMOTE_PATH% && docker compose down --rmi local -v 2>/dev/null"
ssh %SERVER% "docker system prune -f"
echo [OK] Cleanup complete!
GOTO end

:end
