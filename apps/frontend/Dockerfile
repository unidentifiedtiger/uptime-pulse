# -----------------------------------------------
# Stage 1: Builder
# -----------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем конфиги
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/frontend/package.json ./apps/frontend/

# Устанавливаем зависимости с принудительным разрешением нативных бинарников
RUN pnpm install --frozen-lockfile --unsafe-perm=true

COPY apps/frontend ./apps/frontend

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Выделяем память Node.js и включаем кэш 빌да
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN --mount=type=cache,target=/app/apps/frontend/.next/cache \
    pnpm --filter frontend build

# -----------------------------------------------
# Stage 2: Runner (Production)
# -----------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --prod --frozen-lockfile --unsafe-perm=true

COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000

CMD ["pnpm", "--filter", "frontend", "start"]
