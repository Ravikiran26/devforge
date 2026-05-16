# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevForge is a full-stack student learning platform with a React/Vite frontend and an Express/Node.js backend, backed by PostgreSQL via Prisma. It includes AI-powered PR code reviews using Claude + GitHub.

---

## Commands

### Frontend (root directory)
```bash
npm run dev        # Start Vite dev server at http://localhost:5173
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

### Backend (`backend/` directory)
```bash
npm run dev        # Start Express server with nodemon at http://localhost:5000
npm run start      # Start without hot reload
npm run db:push    # Push Prisma schema changes to the database
npm run db:studio  # Open Prisma Studio GUI
npm run db:seed    # Run seed script
npm run db:reset   # Force-reset DB and reseed
```

### Database
Postgres runs locally. The backend `.env` `DATABASE_URL` points to it. If using Docker instead, `backend/docker-compose.yml` sets up postgres with user `devforge` / password `devforge123` / db `devforge`.

---

## Architecture

### Frontend (`src/`)

**Auth flow**: `src/lib/api.js` is an Axios instance that auto-attaches `Authorization: Bearer {accessToken}` from the Zustand store. Its response interceptor catches 401s, queues requests, and attempts a token refresh via `POST /api/auth/refresh`. On failure it calls `logout()` and redirects to `/login`.

**State**: Two layers:
- `src/store/authStore.js` — Zustand store (persisted to localStorage as `devforge-auth`) holds `user`, `accessToken`, `refreshToken`. Methods: `setAuth()`, `setTokens()`, `logout()`.
- React Query (`@tanstack/react-query`) — all server data. Configured globally in `src/main.jsx` with `staleTime: 30s, retry: 1`. Mutations call `queryClient.invalidateQueries()` on success.

**Routing**: React Router v7 in `src/App.jsx`. Public routes: `/`, `/login`. Student routes under `<ProtectedRoute>` → `<DashboardLayout>`. Admin routes under `<AdminRoute>` (checks `user.role === 'ADMIN'`) → `<AdminLayout>`.

**Component patterns**: Pages use inline styles (`style={{}}`), not CSS files. Icons from `lucide-react`. Color constants for status/priority badges are defined inline (HIGH: `#dc2626`, MEDIUM: `#2563eb`, LOW: `#16a34a`). Tailwind utility classes are used for layout; custom design tokens are in `tailwind.config.js` (colors: `primary`, `secondary`, `tertiary`, `error`; fonts: Inter, JetBrains Mono).

---

### Backend (`backend/src/`)

**Entry point**: `server.js` wires Express middleware, CORS (origin from `CLIENT_URL` env), and all route groups.

**Route structure**:
- `POST/GET /api/auth/*` — public (no middleware)
- `/api/student/*` — protected by `authenticate` middleware
- `/api/admin/*` — protected by `authenticate` + `requireAdmin` middleware
- `GET /api/health` — health check

**Auth middleware** (`middleware/auth.js`): Verifies `Bearer` JWT using `JWT_SECRET`. Attaches `req.user`. `requireAdmin` additionally checks `req.user.role === 'ADMIN'`.

**Database** (`lib/prisma.js`): Exports a Prisma Client singleton. All routes import from here.

**AI Review** (`services/aiReview.js`): Called when a student submits a PR URL. Fetches the PR diff via GitHub (`@octokit/rest`), sends it to Claude (`claude-haiku`) with project-specific rubrics (InvoiceWala, ClassPro, DeliverDesk), and returns a structured JSON verdict. On `MERGE_READY`, it auto-merges the PR. Results are saved back to the `PRSubmission` record.

---

### Database Schema (Prisma)

Key models and relationships:
- `User` — base identity (email, hashed password, role enum: `STUDENT | ADMIN`)
- `Student` — extends User 1:1; optionally linked to a `Cohort`; tracks `currentWeek`, `status`, `plan`
- `Cohort` — groups students; has `Ticket`s and `Lesson`s
- `Ticket` — assignment per cohort (unique `code`); students create `PRSubmission`s against tickets
- `PRSubmission` — unique per `(studentId, ticketId)`; stores PR URL, AI review JSON, grade, `verdict`, `status`
- `Lesson` / `LessonProgress` — lesson catalogue with per-student watched tracking
- `Announcement` — pinnable notices with `type` enum
- `Payment` — payment records per student with `status` enum
- `RefreshToken` — stores issued refresh tokens with expiry for revocation

Cascade deletes: deleting a `User` cascades to `Student`, which cascades to `PRSubmission`, `LessonProgress`, and `RefreshToken`.

---

## Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=       # Required for AI PR review
GITHUB_TOKEN=            # Required for GitHub PR fetch/merge
```

**Frontend** (`.env` at root):
```
VITE_API_URL=http://localhost:5000/api
```
