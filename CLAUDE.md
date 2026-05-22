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

**AI Review** (`services/aiReview.js`): Called when a student submits a PR URL. Fetches the PR diff via GitHub (`@octokit/rest`), sends it to Claude (`claude-haiku`) with project-specific rubrics (Restaurant Flow `RF`, Lead Bill `LB`, ClientDesk AI `CA`), and returns a structured JSON verdict. On `MERGE_READY`, it auto-merges the PR. Results are saved back to the `PRSubmission` record.

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

---

## Adding Lesson Content

All lesson body text lives in **`backend/prisma/lesson-content.js`** — a single exported object where each key is the lesson code (e.g. `'W1D2'`, `'W3D1'`).

### Step 1 — Write the content in `lesson-content.js`

Add or update the key matching the lesson code:

```js
'W1D2': `
SECTION HEADING
Intro paragraph...

──────────────────────────────
SUB-SECTION
──────────────────────────────

Explanation text here.

TRY IN CONSOLE
> const x = 42
> console.log(x)
---

TRY IT NOW
$ mkdir my-project && cd my-project
$ touch index.js
---

CODE EXAMPLE
function add(a, b) {
  return a + b
}
---

SUBMISSION CHECKLIST
☐ Item one
☐ Item two

COMMON MISTAKES
• Mistake one — explanation
• Mistake two — explanation
`,
```

**Format markers** (rendered specially in the UI):
| Marker | Rendered as |
|---|---|
| `TRY IT NOW` … `---` | Terminal block (dark green, `$` prefix) |
| `TRY IN CONSOLE` … `---` | Browser console block (dark blue, `>` prefix) |
| `CODE EXAMPLE` … `---` | File code block (dark gray) |
| `──────...` | Visual divider |
| `•` | Bullet point |
| `☐` | Checklist item |

### Step 2 — Wire it into `seed.js`

In the `lessonsRaw` array, add `description: content['W1D2']` to the matching lesson object:

```js
{ lessonCode:'W1D2', week:1, title:'Day 2 — JavaScript Fundamentals (Part 1)', duration:'45 mins', status:'PUBLISHED', description: content['W1D2'] },
```

### Step 3 — Reseed the database

```bash
cd backend
npm run db:seed
```

Or for a full reset: `npm run db:reset`

---

## Curriculum Structure

**12-week full-stack bootcamp** — 60 lessons total. Restructured from 10 weeks in May 2025.

| Phase | Weeks | What students build |
|---|---|---|
| Foundation | 1–4 | JS → Node/Express/Prisma → React → Auth + Mini Lead Manager |
| Project 1 | 5–6 | Restaurant Flow (Razorpay + Socket.io) — fresh repo |
| Project 2 | 7–9 | Lead Bill (GST billing + pdf-lib + Cloudinary) — Mini Lead Manager repo evolved |
| Project 3 | 10–11 | ClientDesk AI (Claude API + CI/CD + GitHub Actions) |
| Career | 12 | Portfolio, resume, mock interviews |

**Lesson codes:**
- Weeks 1–4: `W1D1`–`W4D4` (Day format)
- Weeks 5–11: `W5L1`–`W11L5` (Lesson format)
- Week 12: `W12D1`–`W12D5`

Week 4 Day 4 = Restaurant Flow kickoff (students create a fresh repo that day).
Week 7 = Mini Lead Manager evolves into Lead Bill (same repo, extended — never restart).

Weeks 1–6 seeded as `PUBLISHED`, Weeks 7–12 as `DRAFT`.

---

## Jira Setup

**Real Atlassian Jira** at `ravikiranravella6.atlassian.net`. Free tier = 10 users (includes admin seat, so effectively 9 students). Upgrade to Pro after 10 students.

**Project keys:**
| Key | Project | Weeks |
|---|---|---|
| DF | DevForge Foundation | 1–4 |
| RF | Restaurant Flow | 5–6 |
| LB | Lead Bill | 7–9 |
| CA | ClientDesk AI | 10–11 |

**Ticket format:** `RF-1`, `RF-2` … (Jira auto-numbers without zero-padding — seed.js uses this same format).

**Ticket codes seeded:** RF-1→RF-8, LB-1→LB-8, CA-1→CA-8 (8 tickets per project, 24 total).

**GitHub for Jira app** (free, Atlassian Marketplace): auto-links commits/PRs to tickets when branch name contains ticket code (e.g. `RF-3-payment-flow`). Merging a PR auto-closes the ticket.

**Jira board columns:** TO DO → IN PROGRESS → IN REVIEW → DONE  
(Rename any auto-generated "TESTING" column to "IN REVIEW")

**Scrum workflow:** Students create a branch named `<ticket-code>-short-description`, open a PR, submit the PR URL in DevForge, AI review runs automatically, mentor grades within 24 hours.

---

## PDF Scripts

Located in `scripts/` — run from project root:

```bash
node scripts/md-to-pdf.cjs              # Generates DevForge_12Week_Curriculum.pdf from .md
node scripts/generate-tickets-pdf.cjs   # Generates DevForge_Jira_Tickets.pdf (24 tickets + guide)
```

Both scripts use Chrome headless (`/Applications/Google Chrome.app`) to print HTML → PDF. No external markdown libraries — custom parser built in.

Output files (gitignored):
- `DevForge_12Week_Curriculum.pdf` / `.html`
- `DevForge_Jira_Tickets.pdf` / `.html`

**Note:** `package.json` has `"type": "module"` so all scripts must use `.cjs` extension, not `.js`.

---

## Seeded Test Student

**Ravikiran** (ravia1star@gmail.com) — role: STUDENT  
- `currentWeek: 7`  
- Lesson progress: W1D1–W4D4 + W5L1–W6L5 all complete  
- PR submissions: RF-1 (score 92, APPROVED), RF-2 (88, APPROVED), RF-3 (85, APPROVED), RF-4 (IN_REVIEW)  
- Cohort 3: Jun 2 – Aug 25, 2025
