# ⚡ Uptime Pulse

> Высоконадежная система мониторинга доступности сервисов, отслеживания задержек и аналитики аптайма в реальном времени.

![Next.js 15](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)

---

## 📋 Описание проекта

**Uptime Pulse** — это полнофункциональное монорепозиторий-приложение для непрерывного отслеживания работоспособности веб-сервисов, REST API и инфраструктурных узлов. Система регулярно выполняет проверки (HTTP/HTTPS, Ping, TCP), собирает время отклика и формирует интерактивные дашборды с графиками аптайма.

---

## 🛠 Технологический стек

### Frontend (`apps/frontend`)
- **Фреймворк:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Стилизация:** [Tailwind CSS](https://tailwindcss.com/)
- **Состояние & Запросы:** TanStack Query v5
- **UI & Графики:** Lucide Icons, Recharts

### Backend (`apps/backend`)
- **Фреймворк:** [NestJS](https://nestjs.com/) (Модульная архитектура)
- **База данных & ORM:** PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/)
- **Очереди задач:** BullMQ + Redis
- **Авторизация:** JWT (HTTP-only Cookies)

---

## 📂 Структура Монорепозитория

```text
uptime-pulse/
├── apps/
│   ├── backend/               # NestJS API сервер, поллер и миграции Drizzle
│   │   ├── src/               # Модули (auth, monitors, metrics, notifications)
│   │   ├── drizzle/           # SQL миграции и схемы базы данных
│   │   └── Dockerfile         # Изолированный контейнер бэкенда
│   └── frontend/              # Next.js 15 клиентский дашборд
│       ├── src/app/           # App Router
│       ├── next.config.js     # Конфиг с поддержкой experimental.turbopack.root
│       └── Dockerfile         # Изолированный контейнер фронтенда
├── package.json               # Корневой манифест скриптов воркспейса
├── pnpm-workspace.yaml        # Конфигурация pnpm монорепозитория
├── .npmrc                     # Настройки линкера (node-linker=hoisted)
└── docker-compose.yml         # Оркестрация сервисов
```

---

## 🚀 Быстрый старт в Docker

Самый надежный способ запустить весь стек (PostgreSQL, Redis, Backend, Frontend) одной командой:

### 1. Клонирование и переход в проект
```bash
git clone https://github.com/your-username/uptime-pulse.git
cd uptime-pulse
```

### 2. Создание файла окружения (`.env`)
Создайте `.env` в корне проекта со следующими переменными:

```ini
# База данных и Redis
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=uptime_pulse
DATABASE_URL=postgres://postgres:postgres@postgres:5432/uptime_pulse
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=super-secret-key-change-me

# Frontend Config
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Запуск контейнеров
```bash
docker compose up --build
```

После успешной сборки сервисы будут доступны:
- 🌐 **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend REST API:** [http://localhost:4000/api](http://localhost:4000/api)
- 🗄 **PostgreSQL DB:** `localhost:5432`

---

## 💻 Локальная разработка (pnpm)

Если вы хотите запускать сервисы на хост-машине без полного контейнерирования:

### 1. Установка зависимостей
```bash
pnpm install
```

### 2. Запуск баз данных в Docker
```bash
docker compose up -d postgres redis
```

### 3. Применение миграций Drizzle
```bash
pnpm --filter backend drizzle-kit push
```

### 4. Запуск приложений в режиме разработки
```bash
# В первом терминале (Backend, Port 4000):
pnpm --filter backend start:dev

# Во втором терминале (Frontend, Port 3000):
pnpm --filter frontend dev
```

---

## 📜 Лицензия

Проект распространяется под лицензией [MIT](LICENSE).
