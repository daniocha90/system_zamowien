#!/bin/bash

# =============================================
# INSTALATOR SYSTEMU ZAMÓWIEŃ - Cyber Folks
# =============================================

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Konfiguracja
DOMAIN="zooleszcz.pl"
REMOTE_USER="zooleszc"
INSTALL_DIR="/home/${REMOTE_USER}/domains/${DOMAIN}/public_html/zamowienia"

echo ""
echo "============================================="
echo "🏗️  INSTALATOR SYSTEMU ZAMÓWIEŃ"
echo "   Cyber Folks + MySQL"
echo "============================================="
echo ""

# 1. Sprawdzenie zależności
print_status "1. Sprawdzanie zależności..."
if ! command -v node &> /dev/null; then
    print_error "Node.js nie jest zainstalowany"
    print_status "Aktywuj przez panel Cyber Folks:"
    print_status "Panel → Advanced → Node.js Manager → Node.js 18+"
    exit 1
fi
print_success "Node.js jest dostępny"

# 2. Tworzenie katalogów
print_status "2. Tworzenie struktury katalogów..."
mkdir -p "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR/backend"
mkdir -p "$INSTALL_DIR/frontend"
mkdir -p "$INSTALL_DIR/logs"
mkdir -p "$INSTALL_DIR/uploads"
print_success "Katalogi utworzone"

# 3. Kopiowanie backendu
print_status "3. Instalacja backendu..."
cp -r backend/* "$INSTALL_DIR/backend/"
cd "$INSTALL_DIR/backend"
npm install --production
print_success "Backend zainstalowany"

# 4. Kopiowanie frontendu
print_status "4. Instalacja frontendu..."
cd "$INSTALL_DIR"
cp -r frontend/dist/* frontend/
print_success "Frontend zainstalowany"

# 5. Konfiguracja bazy danych
print_status "5. Konfiguracja bazy danych..."
cd "$INSTALL_DIR/backend"
if [[ -f "database/schema.sql" ]]; then
    print_status "Utwórz bazę danych przez phpMyAdmin:"
    print_status "1. Wejdź do panelu Cyber Folks"
    print_status "2. Otwórz phpMyAdmin"
    print_status "3. Utwórz bazę: zamowienia_db"
    print_status "4. Importuj plik: database/schema.sql"
fi

# 6. Konfiguracja .env
print_status "6. Konfiguracja środowiska..."
if [[ ! -f ".env" ]]; then
    cp .env.example .env
    print_warning "Edytuj plik .env - ustaw dane do MySQL"
fi

# 7. Uruchomienie
print_status "7. Uruchamianie aplikacji..."
npm install -g pm2
pm2 start server.js --name "zamowienia-api"
pm2 save

echo ""
echo "============================================="
echo "🎉 INSTALACJA ZAKOŃCZONA!"
echo "============================================="
echo ""
echo "🌐 Adresy:"
echo "   Strona: https://${DOMAIN}/zamowienia"
echo "   Panel admina: https://${DOMAIN}/zamowienia/admin"
echo ""
echo "⚙️  Następne kroki:"
echo "   1. Edytuj plik .env - ustaw dane do MySQL"
echo "   2. Utwórz bazę przez phpMyAdmin"
echo "   3. Aktywuj SSL w panelu"
echo ""
echo "🔧 Komendy:"
echo "   Logi: pm2 logs zamowienia-api"
echo "   Restart: pm2 restart zamowienia-api"
echo "============================================="
