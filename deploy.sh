#!/bin/bash
# SoundSteps Deployment Script
# Deploys to Ubuntu server at 192.168.1.140

# Configuration
SERVER="user1@192.168.1.140"
REMOTE_PATH="/home/user1/projects/soundsteps"
LOCAL_PATH="."

echo "=========================================="
echo "  SoundSteps - Deployment Script"
echo "=========================================="

# Function to display usage
usage() {
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  copy      - Copy files to server"
    echo "  deploy    - Copy files and start containers"
    echo "  start     - Start containers on server"
    echo "  stop      - Stop containers on server"
    echo "  logs      - View container logs"
    echo "  status    - Check container status"
    echo "  ssh       - SSH into server"
    echo ""
}

# Copy files to server
copy_files() {
    echo "[1/2] Creating remote directory..."
    ssh $SERVER "mkdir -p $REMOTE_PATH"
    
    echo "[2/2] Copying files to server..."
    rsync -avz --progress \
        --exclude '.git' \
        --exclude '__pycache__' \
        --exclude '*.pyc' \
        --exclude 'venv' \
        --exclude '.venv' \
        --exclude 'node_modules' \
        --exclude '.env' \
        $LOCAL_PATH/ $SERVER:$REMOTE_PATH/
    
    echo "✓ Files copied successfully!"
}

# Deploy (copy + start)
deploy() {
    copy_files
    echo ""
    echo "[Starting containers...]"
    ssh $SERVER "cd $REMOTE_PATH && docker compose down 2>/dev/null; docker compose up --build -d"
    echo ""
    echo "✓ Deployment complete!"
    echo "  Access: http://192.168.1.140:8000"
}

# Start containers
start() {
    echo "Starting containers..."
    ssh $SERVER "cd $REMOTE_PATH && docker compose up --build -d"
    echo "✓ Containers started!"
    echo "  Access: http://192.168.1.140:8000"
}

# Stop containers
stop() {
    echo "Stopping containers..."
    ssh $SERVER "cd $REMOTE_PATH && docker compose down"
    echo "✓ Containers stopped!"
}

# View logs
logs() {
    echo "Fetching logs (Ctrl+C to exit)..."
    ssh $SERVER "cd $REMOTE_PATH && docker compose logs -f"
}

# Check status
status() {
    echo "Container status:"
    ssh $SERVER "cd $REMOTE_PATH && docker compose ps"
}

# SSH into server
ssh_server() {
    echo "Connecting to server..."
    ssh $SERVER
}

# Main command handler
case "$1" in
    copy)
        copy_files
        ;;
    deploy)
        deploy
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    ssh)
        ssh_server
        ;;
    *)
        usage
        ;;
esac
