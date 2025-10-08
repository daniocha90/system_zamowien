#!/bin/bash

# =============================================
# INSTALATOR SYSTEMU ZAMÓWIEŃ - Cyber Folks
# =============================================

set -e

# Kolory dla outputu
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funkcje pomocnicze
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Zmienne konfiguracyjne
DOMAIN="zooleszcz.pl"
REMOTE_USER="zooleszc"
INSTALL_DIR="/home/${REMOTE_USER}/domains/${DOMAIN}/public_html/zamowienia"
BACKUP_DIR="/home/${REMOTE_USER}/domains/${DOMAIN}/backups"

echo ""
echo "============================================="
echo "🏗️  INSTALATOR SYSTEMU ZAMÓWIEŃ"
echo "   Cyber Folks + MySQL"
echo "============================================="
echo ""

# Sprawdzenie czy skrypt jest uruchomiony na Cyber Folks
check_environment() {
    print_status "Sprawdzanie środowiska..."
    
    if [[ ! -d "/home/${REMOTE_USER}" ]]; then
        print_error "Nie znaleziono katalogu użytkownika Cyber Folks"
        print_error "Uruchom ten skrypt na serwerze Cyber Folks!"
        exit 1
    fi
    
    print_success "Środowisko Cyber Folks wykryte"
}

# Sprawdzenie zależności
check_dependencies() {
    print_status "Sprawdzanie zależności..."
    
    # Sprawdź Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js nie jest zainstalowany"
        print_status "Aktywuj Node.js przez panel Cyber Folks:"
        print_status "Panel → Advanced → Node.js Manager → Wybierz wersję 18+"
        exit 1
    fi
    
    # Sprawdź npm
    if ! command -v npm &> /dev/null; then
        print_error "npm nie jest dostępny"
        exit 1
    fi
    
    print_success "Wszystkie zależności spełnione"
    print_status "Node.js version: $(node --version)"
    print_status "npm version: $(npm --version)"
}

# Tworzenie backupu istniejącej instalacji
create_backup() {
    if [[ -d "$INSTALL_DIR" ]]; then
        print_status "Tworzenie backupu istniejącej instalacji..."
        local backup_name="backup_zamowienia_$(date +%Y%m%d_%H%M%S)"
        local backup_path="$BACKUP_DIR/$backup_name"
        
        mkdir -p "$BACKUP_DIR"
        cp -r "$INSTALL_DIR" "$backup_path" 2>/dev/null || {
            print_warning "Nie udało się utworzyć pełnego backupu, tworzenie backupu ważnych plików..."
            mkdir -p "$backup_path"
            cp "$INSTALL_DIR/backend/.env" "$backup_path/" 2>/dev/null || true
            cp "$INSTALL_DIR/backend/package.json" "$backup_path/" 2>/dev/null || true
        }
        
        print_success "Backup utworzony: $backup_name"
    else
        print_status "Brak istniejącej instalacji - pomijam backup"
    fi
}

# Tworzenie struktury katalogów
create_directories() {
    print_status "Tworzenie struktury katalogów..."
    
    mkdir -p "$INSTALL_DIR"
    mkdir -p "$INSTALL_DIR/backend"
    mkdir -p "$INSTALL_DIR/frontend"
    mkdir -p "$INSTALL_DIR/logs"
    mkdir -p "$INSTALL_DIR/uploads"
    mkdir -p "$INSTALL_DIR/scripts"
    
    # Ustawienie praw dostępu
    chmod 755 "$INSTALL_DIR/uploads" 2>/dev/null || true
    chmod 755 "$INSTALL_DIR/logs" 2>/dev/null || true
    
    print_success "Struktura katalogów utworzona"
}

# Instalacja backendu
install_backend() {
    print_status "Instalacja backendu..."
    
    # Sprawdź czy pliki backendu istnieją
    if [[ ! -d "backend" ]]; then
        print_error "Katalog backend nie istnieje!"
        print_status "Upewnij się że wszystkie pliki są w odpowiednich katalogach"
        exit 1
    fi
    
    # Kopiowanie plików backendu
    cp -r backend/* "$INSTALL_DIR/backend/" 2>/dev/null || {
        print_error "Błąd kopiowania plików backendu"
        exit 1
    }
    
    cd "$INSTALL_DIR/backend"
    
    # Instalacja zależności
    print_status "Instalowanie zależności Node.js..."
    npm install --production --no-audit --no-fund
    
    if [[ $? -ne 0 ]]; then
        print_error "Błąd instalacji zależności Node.js"
        exit 1
    fi
    
    # Konfiguracja .env jeśli nie istnieje
    if [[ ! -f ".env" ]]; then
        print_warning "Plik .env nie istnieje - tworzenie z przykładu"
        if [[ -f ".env.example" ]]; then
            cp .env.example .env
            print_status "Edytuj plik .env przed uruchomieniem aplikacji:"
            print_status "nano $INSTALL_DIR/backend/.env"
        else
            print_error "Brak pliku .env.example - musisz ręcznie utworzyć .env"
        fi
    fi
    
    print_success "Backend zainstalowany"
}

# Instalacja frontendu
install_frontend() {
    print_status "Instalacja frontendu..."
    
    # Sprawdź czy zbudowany frontend istnieje
    if [[ -d "frontend/dist" ]]; then
        cp -r frontend/dist/* "$INSTALL_DIR/frontend/" 2>/dev/null || {
            print_error "Błąd kopiowania plików frontendu"
            exit 1
        }
        print_success "Frontend skopiowany"
    else
        print_warning "Brak zbudowanego frontendu w frontend/dist/"
        print_status "Aby zbudować frontend wykonaj:"
        print_status "1. cd frontend"
        print_status "2. npm install"
        print_status "3. npm run build"
        print_status "4. Skopiuj dist/ do $INSTALL_DIR/frontend/"
    fi
}

# Konfiguracja PM2
setup_pm2() {
    print_status "Konfiguracja PM2..."
    
    # Sprawdź czy PM2 jest zainstalowane
    if ! command -v pm2 &> /dev/null; then
        print_status "Instalowanie PM2..."
        npm install -g pm2
        
        if [[ $? -ne 0 ]]; then
            print_warning "Nie udało się zainstalować PM2 globalnie"
            print_status "Uruchom: npm install -g pm2"
            return 1
        fi
    fi
    
    # Uruchom aplikację z PM2
    cd "$INSTALL_DIR/backend"
    
    # Zatrzymij istniejącą instancję jeśli istnieje
    pm2 delete zamowienia-api 2>/dev/null || true
    
    # Uruchom nową instancję
    pm2 start server.js --name "zamowienia-api" --time
    
    if [[ $? -eq 0 ]]; then
        pm2 save 2>/dev/null || true
        print_success "Aplikacja uruchomiona z PM2"
    else
        print_warning "Błąd uruchamiania z PM2 - uruchom ręcznie: node server.js"
        return 1
    fi
}

# Konfiguracja .htaccess dla Apache
setup_htaccess() {
    print_status "Konfiguracja .htaccess..."
    
    local htaccess_path="$INSTALL_DIR/backend/.htaccess"
    
    cat > "$htaccess_path" << 'EOF'
RewriteEngine On

# Serwowanie plików statycznych
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# API proxy do Node.js
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# Frontend routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /zamowienia/frontend/index.html [L]
EOF

    if [[ -f "$htaccess_path" ]]; then
        print_success ".htaccess skonfigurowany"
    else
        print_warning "Nie udało się utworzyć .htaccess"
    fi
}

# Testowanie instalacji
test_installation() {
    print_status "Testowanie instalacji..."
    
    # Daj czas na uruchomienie
    sleep 3
    
    # Sprawdź czy backend działa
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "Backend działa poprawnie"
    else
        print_warning "Backend nie odpowiada - sprawdź logi: pm2 logs zamowienia-api"
    fi
    
    # Sprawdź czy pliki frontendu istnieją
    if [[ -f "$INSTALL_DIR/frontend/index.html" ]]; then
        print_success "Pliki frontendu znalezione"
    else
        print_warning "Brak plików frontendu - należy je zbudować"
    fi
}

# Wyświetl informacje po instalacji
show_post_install_info() {
    echo ""
    echo "============================================="
    echo "🎉 INSTALACJA ZAKOŃCZONA POMYŚLNIE!"
    echo "============================================="
    echo ""
    echo "📋 Adresy aplikacji:"
    echo "   Frontend: https://${DOMAIN}/zamowienia"
    echo "   Panel admina: https://${DOMAIN}/zamowienia/admin/dashboard"
    echo "   API Health: https://${DOMAIN}/zamowienia/api/health"
    echo ""
    echo "⚙️  Konfiguracja:"
    echo "   1. Edytuj plik: ${INSTALL_DIR}/backend/.env"
    echo "   2. Ustaw dane do MySQL w pliku .env"
    echo "   3. Utwórz bazę danych przez phpMyAdmin"
    echo "   4. Importuj schema.sql do bazy danych"
    echo ""
    echo "🛠️  Zarządzanie aplikacją:"
    echo "   Logi: pm2 logs zamowienia-api"
    echo "   Status: pm2 status"
    echo "   Restart: pm2 restart zamowienia-api"
    echo "   Stop: pm2 stop zamowienia-api"
    echo ""
    echo "🔧 Pozostałe kroki:"
    echo "   1. Aktywuj SSL w panelu Cyber Folks"
    echo "   2. Przetestuj formularz zamówienia"
    echo "   3. Sprawdź czy e-maile są wysyłane"
    echo ""
    echo "📞 Rozwiązywanie problemów:"
    echo "   Sprawdź logi: pm2 logs zamowienia-api --lines 50"
    echo "============================================="
}

# Główna funkcja instalacyjna
main() {
    echo ""
    echo "Rozpoczynanie instalacji systemu zamówień..."
    echo "Katalog instalacji: $INSTALL_DIR"
    echo ""
    
    # Potwierdzenie instalacji
    read -p "Czy chcesz kontynuować instalację? (t/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Tt]$ ]]; then
        print_error "Instalacja anulowana"
        exit 1
    fi
    
    # Kolejne kroki instalacji
    check_environment
    check_dependencies
    create_backup
    create_directories
    install_backend
    install_frontend
    setup_pm2
    setup_htaccess
    test_installation
    show_post_install_info
}

# Uruchom instalację
main "$@"
