#!/bin/bash

# Backup script for MongoDB and files
set -e

echo "Starting backup..."

# Configuration
REMOTE_USER="zooleszc"
REMOTE_HOST="zooleszcz.pl"
BACKUP_PATH="/home/zooleszc/domains/zooleszcz.pl/backups"
REMOTE_BACKUP_PATH="/home/zooleszc/domains/zooleszcz.pl/backups"
FTP_HOST="your-ftp-host.com"
FTP_USER="your-ftp-user"
FTP_PASS="your-ftp-password"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Create backup directory
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p ${BACKUP_DIR}

# MongoDB backup
print_status "Backing up MongoDB..."
mongodump --uri="${MONGODB_URI}" --out=${BACKUP_DIR}/mongodb

# File backup
print_status "Backing up files..."
cp -r uploads ${BACKUP_DIR}/
cp -r logs ${BACKUP_DIR}/

# Create archive
print_status "Creating archive..."
tar -czf ${BACKUP_DIR}.tar.gz ${BACKUP_DIR}

# Upload to remote server
print_status "Uploading to remote server..."
scp ${BACKUP_DIR}.tar.gz ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKUP_PATH}/

# Upload to FTP (optional)
if [ ! -z "$FTP_HOST" ]; then
    print_status "Uploading to FTP..."
    curl -T ${BACKUP_DIR}.tar.gz -u ${FTP_USER}:${FTP_PASS} ftp://${FTP_HOST}/
fi

# Cleanup
rm -rf ${BACKUP_DIR}
rm -f ${BACKUP_DIR}.tar.gz

print_status "Backup completed successfully!"