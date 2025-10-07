# Wersja Node
FROM node:20-alpine

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie plików package.json
COPY package*.json ./

# Instalacja zależności
RUN npm install --production

# Kopiowanie reszty kodu backendu
COPY . .

# Eksponowanie portu 3000
EXPOSE 3000

# Polecenie startowe
CMD ["node", "index.js"]
