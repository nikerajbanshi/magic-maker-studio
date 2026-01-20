#!/bin/bash
# ==========================================
#   SoundSteps - Team1 Deployment Script
#   Domain: https://team1.cbit.site
#   Port: 8001
# ==========================================

# Configuration
SERVER="user1@192.168.1.140"
# IMPORTANT: Deploy directly to /home/user1/projects (not subdirectory)
REMOTE_PATH="/home/user1/projects"
LOCAL_PATH="."

echo "=========================================="
echo "  SoundSteps - Team1 Deployment"
echo "  Domain: https://team1.cbit.site"
echo "  Port: 8001"
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
    echo "  clean     - Remove old containers and images"
    echo ""
    echo "After deployment, access: https://team1.cbit.site"
    echo ""
}

# Copy files to server
copy_files() {
    echo "[1/2] Cleaning remote directory..."
    ssh $SERVER "cd $REMOTE_PATH && rm -rf backend static Dockerfile docker-compose.yml 2>/dev/null"
    
    echo "[2/2] Copying files to server..."
    rsync -avz --progress \
        --exclude '.git' \
        --exclude '__pycache__' \
        --exclude '*.pyc' \
        --exclude 'venv' \
        --exclude '.venv' \
        --exclude 'node_modules' \
        --exclude '.env' \
        --exclude 'docs' \
        --exclude 'scripts' \
        $LOCAL_PATH/backend $LOCAL_PATH/static $LOCAL_PATH/Dockerfile $LOCAL_PATH/docker-compose.yml $SERVER:$REMOTE_PATH/
    
    echo "✓ Files copied successfully!"
}

# Deploy (copy + start)
deploy() {
    copy_files
    echo ""
    echo "[Building and starting containers...]"
    ssh $SERVER "cd $REMOTE_PATH && docker compose down 2>/dev/null; docker compose up --build -d"
    echo ""
    echo "[Checking container status...]"
    ssh $SERVER "cd $REMOTE_PATH && docker ps --filter name=team1"
    echo ""
    echo "=========================================="
    echo "  ✓ Deployment complete!"
    echo "  Access: https://team1.cbit.site"
    echo "=========================================="
}

# Start containers
start() {
    echo "Starting containers..."
    ssh $SERVER "cd $REMOTE_PATH && docker compose up --build -d"
    echo "✓ Containers started!"
    echo "Access: https://team1.cbit.site"
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
    echo ""
    echo "=== Container Status ==="
    ssh $SERVER "cd $REMOTE_PATH && docker compose ps"
    echo ""
    echo "=== Port Check ==="
    ssh $SERVER "docker ps --format 'table {{.Names}}\t{{.Ports}}' --filter name=team1"
    echo ""
}

# SSH into server
ssh_server() {
    echo "Connecting to server..."
    echo "Remember: Your project is in $REMOTE_PATH"
    ssh $SERVER
}

# Clean up
clean() {
    echo "Cleaning up old containers and images..."
    ssh $SERVER "cd $REMOTE_PATH && docker compose down --rmi local -v 2>/dev/null"
    ssh $SERVER "docker system prune -f"
    echo "✓ Cleanup complete!"
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
    clean)
        clean
        ;;
    *)
        usage
        ;;
esac
