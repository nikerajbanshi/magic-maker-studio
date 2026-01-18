# SoundSteps - Complete Deployment Guide
**Version:** 1.1.0  
**Last Updated:** January 17, 2026  
**Deployment Target:** AWS EC2, Docker, or any Linux server

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker)](#quick-start-docker)
3. [Manual Deployment](#manual-deployment)
4. [AWS EC2 Deployment](#aws-ec2-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Security Hardening](#security-hardening)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Docker** 20.10+ and Docker Compose 2.0+ (for containerized deployment)
- **Python** 3.8+ (for manual deployment)
- **Git** (for cloning repository)
- **nginx** (optional, for reverse proxy)

### System Requirements
- **Minimum:** 1 CPU, 1GB RAM, 10GB disk (t2.micro)
- **Recommended:** 2 CPU, 2GB RAM, 20GB disk (t2.small)
- **OS:** Ubuntu 22.04 LTS, Amazon Linux 2, or any Linux distro

### Domain & SSL (Optional but Recommended)
- Domain name pointed to server IP
- SSL certificate (Let's Encrypt recommended)

---

## Quick Start (Docker)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/magic-maker-studio.git
cd magic-maker-studio
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env.production

# Edit with your settings
nano .env.production
# ⚠️ CHANGE SECRET_KEY!
```

### 3. Build and Run

**Development Mode** (with hot reload and volume mounts):
```bash
# Build and run in development mode
docker compose --profile dev up --build

# Or run detached
docker compose --profile dev up --build -d
```

**Production Mode** (optimized, no volumes):
```bash
# Build and run in production mode (recommended for deployment)
docker compose --profile prod up --build -d

# Check if running
docker compose ps

# View logs
docker compose logs -f soundsteps-prod
```

**Legacy (without profiles)**:
```bash
# Default run (development-like)
docker compose up --build -d
```

### 4. Access Application
Navigate to: **http://your-server-ip:8000**

---

## Manual Deployment

### Step 1: System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3 python3-pip python3-venv nginx -y

# Install Node.js (if using frontend build tools)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 2: Clone and Setup Application

```bash
# Create app directory
sudo mkdir -p /var/www/soundsteps
cd /var/www/soundsteps

# Clone repository
sudo git clone https://github.com/yourusername/magic-maker-studio.git .

# Set permissions
sudo chown -R $USER:$USER /var/www/soundsteps
```

### Step 3: Backend Setup

```bash
# Navigate to backend
cd /var/www/soundsteps/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create data directory
mkdir -p data

# Set environment variables
cp ../.env.example ../.env.production
nano ../.env.production  # Edit configuration
```

### Step 4: Create Systemd Service

Create `/etc/systemd/system/soundsteps.service`:

```ini
[Unit]
Description=SoundSteps FastAPI Application
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/var/www/soundsteps/backend
Environment="PATH=/var/www/soundsteps/backend/venv/bin"
EnvironmentFile=/var/www/soundsteps/.env.production
ExecStart=/var/www/soundsteps/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Step 5: Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (start on boot)
sudo systemctl enable soundsteps

# Start service
sudo systemctl start soundsteps

# Check status
sudo systemctl status soundsteps

# View logs
sudo journalctl -u soundsteps -f
```

### Step 6: Configure Nginx (Optional)

Create `/etc/nginx/sites-available/soundsteps`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS (after SSL setup)
    # return 301 https://$host$request_uri;

    # Static files
    location /static/ {
        alias /var/www/soundsteps/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /assets/ {
        alias /var/www/soundsteps/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API and app
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # File upload limits
    client_max_body_size 10M;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/soundsteps /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### Step 7: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## AWS EC2 Deployment

### Step 1: Launch EC2 Instance

**Via AWS Console:**
1. Navigate to EC2 Dashboard
2. Click "Launch Instance"
3. Choose AMI: **Ubuntu Server 22.04 LTS**
4. Instance Type: **t2.micro** (free tier) or **t2.small**
5. Configure Security Group:
   - SSH (22) - Your IP only
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
   - Custom TCP (8000) - 0.0.0.0/0 (temporary, remove after nginx setup)
6. Create or select key pair
7. Launch instance

**Via AWS CLI:**
```bash
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t2.micro \
    --key-name your-key-name \
    --security-group-ids sg-xxxxxxxxx \
    --subnet-id subnet-xxxxxxxxx \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=SoundSteps}]'
```

### Step 2: Connect to Instance

```bash
# Get instance public IP from AWS Console
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 3: Follow Manual Deployment Steps

Follow Steps 1-7 from "Manual Deployment" section above.

### Step 4: (Optional) Setup Elastic IP

```bash
# Allocate Elastic IP
aws ec2 allocate-address

# Associate with instance
aws ec2 associate-address \
    --instance-id i-xxxxxxxxx \
    --allocation-id eipalloc-xxxxxxxxx
```

### Step 5: (Optional) Create AMI Backup

```bash
# Create AMI from running instance
aws ec2 create-image \
    --instance-id i-xxxxxxxxx \
    --name "SoundSteps-Backup-$(date +%Y%m%d)" \
    --description "SoundSteps production backup"
```

---

## Environment Configuration

### Development Environment

```bash
# Use development settings
cp .env.development .env

# Start with auto-reload
bash start.sh
```

### Production Environment

```bash
# Use production settings
cp .env.production .env

# Generate secure secret key
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
# Copy output to .env.production SECRET_KEY

# Set proper CORS origins
# Edit .env.production:
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Set production API URL
API_BASE_URL=https://yourdomain.com/api
```

### Docker Environment

Environment variables in `docker-compose.yml`:

```yaml
version: '3.8'
services:
  soundsteps:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env.production
    environment:
      - ENVIRONMENT=production
    volumes:
      - ./backend/data:/app/backend/data
    restart: unless-stopped
```

---

## Security Hardening

### 1. Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Check status
sudo ufw status
```

### 2. Fail2Ban (Protect against brute force)

```bash
# Install
sudo apt install fail2ban -y

# Create custom jail
sudo nano /etc/fail2ban/jail.local
```

Add:
```ini
[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

```bash
# Restart fail2ban
sudo systemctl restart fail2ban
```

### 3. Secure Secret Key

```bash
# Generate strong key
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# Store in environment file (NOT in code!)
echo "SECRET_KEY=<generated-key>" >> .env.production
```

### 4. Regular Updates

```bash
# Create update script
cat > /home/ubuntu/update_soundsteps.sh << 'EOF'
#!/bin/bash
cd /var/www/soundsteps
git pull origin main
source backend/venv/bin/activate
pip install -r backend/requirements.txt
sudo systemctl restart soundsteps
EOF

chmod +x /home/ubuntu/update_soundsteps.sh
```

### 5. Backup Strategy

```bash
# Create backup script
cat > /home/ubuntu/backup_soundsteps.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/soundsteps"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup data
tar -czf $BACKUP_DIR/data_$DATE.tar.gz /var/www/soundsteps/backend/data/

# Keep only last 7 days
find $BACKUP_DIR -name "data_*.tar.gz" -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup_soundsteps.sh

# Add to cron (daily at 2 AM)
echo "0 2 * * * /home/ubuntu/backup_soundsteps.sh" | crontab -
```

---

## Monitoring & Logging

### Application Logs

```bash
# View FastAPI logs (systemd)
sudo journalctl -u soundsteps -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Docker logs
docker-compose logs -f
```

### Health Check Endpoint

```bash
# Check if app is running
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","version":"1.1.0"}
```

### Simple Monitoring Script

```bash
cat > /home/ubuntu/monitor_soundsteps.sh << 'EOF'
#!/bin/bash

# Check if service is running
if ! systemctl is-active --quiet soundsteps; then
    echo "SoundSteps service is down! Restarting..."
    sudo systemctl restart soundsteps
    echo "Service restarted at $(date)" >> /var/log/soundsteps_monitor.log
fi

# Check if responding
if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "SoundSteps not responding! Check logs."
    echo "Health check failed at $(date)" >> /var/log/soundsteps_monitor.log
fi
EOF

chmod +x /home/ubuntu/monitor_soundsteps.sh

# Run every 5 minutes
echo "*/5 * * * * /home/ubuntu/monitor_soundsteps.sh" | crontab -
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check service status
sudo systemctl status soundsteps

# View detailed logs
sudo journalctl -u soundsteps -n 100 --no-pager

# Check if port is in use
sudo lsof -i :8000

# Check Python path
which python3
/var/www/soundsteps/backend/venv/bin/python --version
```

### Database/Data Issues

```bash
# Check data directory permissions
ls -la /var/www/soundsteps/backend/data/

# Reset permissions
sudo chown -R ubuntu:ubuntu /var/www/soundsteps/backend/data/

# Check file contents
cat /var/www/soundsteps/backend/data/users.json
```

### CORS Errors

```bash
# Check CORS settings in .env.production
grep CORS .env.production

# Update allowed origins
nano .env.production
# Set: CORS_ORIGINS=https://yourdomain.com

# Restart service
sudo systemctl restart soundsteps
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### High Memory Usage

```bash
# Check memory usage
free -h

# Check processes
top

# Reduce workers in .env.production
WORKERS=2

# Restart service
sudo systemctl restart soundsteps
```

---

## Scaling Considerations

### Horizontal Scaling (Load Balancer)

```nginx
# Nginx load balancer configuration
upstream soundsteps_backend {
    least_conn;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
    server 127.0.0.1:8003;
}

server {
    location / {
        proxy_pass http://soundsteps_backend;
    }
}
```

### Database Migration

For production scale, consider migrating from JSON to PostgreSQL:

```python
# Future: Replace JSON with database
# pip install sqlalchemy psycopg2-binary

# Database URL in .env.production:
# DATABASE_URL=postgresql://user:password@localhost/soundsteps
```

---

## Post-Deployment Checklist

- [ ] Application accessible at domain/IP
- [ ] SSL certificate installed and auto-renewing
- [ ] SECRET_KEY changed from default
- [ ] CORS origins configured for production
- [ ] Firewall configured (ports 22, 80, 443 only)
- [ ] Fail2Ban installed and configured
- [ ] Backup script running daily
- [ ] Monitoring script checking health
- [ ] Logs rotating properly
- [ ] Test user registration
- [ ] Test guest access
- [ ] Test all modules (Flashcards, Sound It Out, etc.)
- [ ] Mobile responsive check
- [ ] Performance test (load testing)

---

## Quick Commands Reference

```bash
# Start service
sudo systemctl start soundsteps

# Stop service
sudo systemctl stop soundsteps

# Restart service
sudo systemctl restart soundsteps

# Check status
sudo systemctl status soundsteps

# View logs
sudo journalctl -u soundsteps -f

# Update application
cd /var/www/soundsteps && git pull && sudo systemctl restart soundsteps

# Backup data
tar -czf backup.tar.gz /var/www/soundsteps/backend/data/

# Test API
curl http://localhost:8000/health
curl http://localhost:8000/docs
```

---

## Support & Resources

- **Documentation:** /docs in repository
- **API Docs:** https://yourdomain.com/docs
- **GitHub Issues:** https://github.com/yourusername/magic-maker-studio/issues
- **Docker Hub:** (if published)

---

**Deployment Guide v1.0**  
**Last Updated:** January 17, 2026  
**Next Review:** February 2026
