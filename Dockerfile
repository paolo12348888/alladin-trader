FROM node:18-alpine

# Installa pnpm
RUN npm install -g pnpm@latest

# Crea directory di lavoro
WORKDIR /app

# Copia i file di configurazione delle dipendenze
COPY package.json pnpm-lock.yaml* ./

# Installa le dipendenze usando pnpm
RUN pnpm install --frozen-lockfile

# Copia il resto dei file del progetto
COPY . .

# Build dell'applicazione
RUN pnpm run build

# Espone la porta
EXPOSE 3000

# Avvia l'applicazione
CMD ["pnpm", "run", "preview"]