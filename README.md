# ⚡ Uptime Pulse

> A highly reliable service availability monitoring, response time tracking, and real-time uptime analytics system.

![Next.js 15](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)

---

## 📋 Project Overview

**Uptime Pulse** is a full-featured monorepo application for continuous tracking of web applications, REST APIs, and infrastructure endpoints. The system regularly executes health checks (HTTP/HTTPS, Ping, TCP), collects response time metrics, and renders interactive uptime performance dashboards.

---

## 🛠 Tech Stack

### Frontend (`apps/frontend`)
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State & Data Fetching:** TanStack Query v5
- **UI & Charts:** Lucide Icons, Recharts

### Backend (`apps/backend`)
- **Framework:** [NestJS](https://nestjs.com/) (Modular architecture)
- **Database & ORM:** PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/)
- **Job Queues:** BullMQ + Redis
- **Authentication:** JWT (HTTP-only Cookies)

---

## 📂 Monorepo Structure

```text
uptime-pulse/
├── apps/
│   ├── backend/               # NestJS API server, poller & Drizzle migrations
│   │   ├── src/               # Modules (auth, monitors, metrics, notifications)
│   │   ├── drizzle/           # SQL migrations and database schema
│   │   └── Dockerfile         # Standalone backend container
│   └── frontend/              # Next.js 15 client dashboard
│       ├── src/app/           # App Router
│       ├── next.config.js     # Config with experimental.turbopack.root support
│       └── Dockerfile         # Standalone frontend container
├── package.json               # Root workspace manifest & scripts
├── pnpm-workspace.yaml        # pnpm monorepo configuration
├── .npmrc                     # Linker configuration (node-linker=hoisted)
└── docker-compose.yml         # Container orchestration
```

---

## 🚀 Quick Start (Docker)

The fastest way to spin up the entire stack (PostgreSQL, Redis, Backend, Frontend) with a single command:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/uptime-pulse.git
cd uptime-pulse
```

### 2. Environment Setup (`.env`)
Create a `.env` file in the root directory with the following variables:

```ini
# Database & Redis
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=uptime_pulse
DATABASE_URL=postgres://postgres:postgres@postgres:5432/uptime_pulse
REDIS_URL=redis://redis:6379

# JWT Secret
JWT_SECRET=super-secret-key-change-me

# Frontend Config
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Run Containers
```bash
docker compose up --build
```

Once running, access the services at:
- 🌐 **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend REST API:** [http://localhost:4000/api](http://localhost:4000/api)
- 🗄 **PostgreSQL DB:** `localhost:5432`

---

## 💻 Local Development (pnpm)

If you prefer running services directly on your host machine without full containerization:

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Infrastructure Services
```bash
docker compose up -d postgres redis
```

### 3. Apply Drizzle Migrations
```bash
pnpm --filter backend drizzle-kit push
```

### 4. Run Development Servers
```bash
# Terminal 1 (Backend, Port 4000):
pnpm --filter backend start:dev

# Terminal 2 (Frontend, Port 3000):
pnpm --filter frontend dev
```

---

## 📜 License

Distributed under the [MIT](LICENSE) License.
