# -----------------------------------------------
# Stage 1: Builder
# -----------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Активируем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем манифесты монорепозитория
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/backend/package.json ./apps/backend/

# Устанавливаем зависимости с отключением строгой изоляции билд-скриптов
RUN pnpm install --frozen-lockfile --unsafe-perm=true

# Копируем исходники бэкенда
COPY apps/backend ./apps/backend

# Собираем NestJS проект
RUN pnpm --filter backend build

# -----------------------------------------------
# Stage 2: Runner (Production)
# -----------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/backend/package.json ./apps/backend/

# Устанавливаем только продакшен-зависимости
RUN pnpm install --prod --frozen-lockfile --unsafe-perm=true

# Копируем скомпилированный билд и схемы Drizzle
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/drizzle ./apps/backend/drizzle

EXPOSE 4000

CMD ["node", "apps/backend/dist/main.js"]
