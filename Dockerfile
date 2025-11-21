# Dockerfile per Alladin Trader - Railway
FROM node:18-alpine AS builder

# Installa dipendenze di sistema
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copia package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Installa pnpm e dipendenze
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copia il resto del codice
COPY . .

# Build della produzione
RUN pnpm run build:prod

# Stage finale - Nginx per servire i file statici
FROM nginx:alpine

# Copia i file build nella directory nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configurazione nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Espone la porta
EXPOSE 3000

# Comando di avvio nginx
CMD ["nginx", "-g", "daemon off;"]