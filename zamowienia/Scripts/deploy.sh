#!/bin/bash

# Deployment script for Cyber_Folks hosting
set -e

echo "Starting deployment..."

# Configuration
REMOTE_USER="zooleszc"
REMOTE_HOST="zooleszcz.pl"
REMOTE_PATH="/home/zooleszc/domains/zooleszcz.pl/public_html/"
BACKUP_PATH="/home/zooleszc/domains/zooleszcz.pl/backups/"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function for colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup
print_status "Creating backup..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${BACKUP_PATH} && cp -r ${REMOTE_PATH} ${BACKUP_PATH}/backup_$(date +%Y%m%d_%H%M%S)"

# Build frontend
print_status "Building frontend..."
cd frontend
npm install
npm run build

# Prepare deployment package
print_status "Preparing deployment package..."
cd ..
DEPLOY_DIR="deploy_$(date +%Y%m%d_%H%M%S)"
mkdir -p ${DEPLOY_DIR}

# Copy backend files
cp -r backend/* ${DEPLOY_DIR}/
cp -r scripts ${DEPLOY_DIR}/
cp package.json ${DEPLOY_DIR}/
cp README.md ${DEPLOY_DIR}/

# Copy built frontend
mkdir -p ${DEPLOY_DIR}/frontend-dist
cp -r frontend/dist/* ${DEPLOY_DIR}/frontend-dist/

# Create necessary directories
mkdir -p ${DEPLOY_DIR}/uploads
mkdir -p ${DEPLOY_DIR}/logs

# Upload to server
print_status "Uploading to server..."
scp -r ${DEPLOY_DIR}/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

# Install backend dependencies and restart
print_status "Installing dependencies and restarting services..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "
cd ${REMOTE_PATH}
npm install --production

# Restart with PM2
pm2 stop zamowienia-api || true
pm2 start server.js --name zamowienia-api
pm2 save
"

# Cleanup
rm -rf ${DEPLOY_DIR}

print_status "Deployment completed successfully!"