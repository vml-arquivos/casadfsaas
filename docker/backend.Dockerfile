# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar package.json e pnpm-lock.yaml (se existir)
COPY package.json pnpm-lock.yaml* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY mobile/package.json ./mobile/
COPY prisma ./prisma

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar o código-fonte
COPY . .

# Gerar o Prisma Client
RUN pnpm prisma generate

# Build do Backend
WORKDIR /app/backend
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app/backend

# Copiar arquivos de produção
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Variáveis de ambiente de runtime
ENV NODE_ENV production
ENV PORT 3001

EXPOSE 3001

CMD ["pnpm", "start"]
