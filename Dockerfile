FROM node:18-alpine

# Installa pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copia i file
COPY package.json pnpm-lock.yaml ./
COPY public ./public
COPY src ./src
COPY *.json *.js *.ts ./

# Installa dipendenze
RUN pnpm install --no-frozen-lockfile

# Build
RUN pnpm run build:prod

# Serve
EXPOSE 3000
CMD ["pnpm", "run", "preview"]
