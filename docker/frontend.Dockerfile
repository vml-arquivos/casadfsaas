# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar package.json e pnpm-lock.yaml (se existir)
COPY package.json pnpm-lock.yaml* ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY mobile/package.json ./mobile/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar o código-fonte
COPY . .

# Build do Frontend
WORKDIR /app/frontend
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app/frontend

# Copiar arquivos de produção
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json
COPY --from=builder /app/frontend/public ./public

# Variáveis de ambiente de runtime
ENV NODE_ENV production
ENV PORT 3000
# Expor a variável pública para o Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

EXPOSE 3000

CMD ["pnpm", "start"]
