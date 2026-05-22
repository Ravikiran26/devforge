# DevForge — 12-Week Full-Stack Developer Curriculum

> Internal curriculum document. Version: May 2025.
> This covers what students learn, what they build, and what they submit each week.

---

## Program Philosophy

Students learn by building, not by watching. Every week produces something real — a commit, a pull request, a working feature, a deployed app. By the end of Week 12, a student has three deployed projects, 65+ merged pull requests, and a GitHub profile that answers the question "show me something you've built."

The stack is chosen deliberately: JavaScript → Node.js → React, in that order. Foundations first. Frameworks second. No skipping steps.

Jira is used from Day 1 of every project. Students work from real Jira boards — not simulated tickets, not a tutorial — with epics, sprints, story points, and PR-linked workflows. By graduation they know Jira by muscle memory.

---

## At a Glance

| Week | Focus | What They Build |
|------|-------|-----------------|
| 1 | Git, JavaScript, APIs, Jira | Mini Lead Manager repo — JS scripts that work with lead data |
| 2 | Node.js, Express, PostgreSQL, Prisma | Mini Lead Manager backend — leads API with full CRUD + PostgreSQL |
| 3 | React | Mini Lead Manager frontend — React UI connected to their own backend |
| 4 | Authentication + Project 1 Kickoff | Auth added to Mini Lead Manager → Restaurant Flow kicks off |
| 5 | Project 1 — Payments | Menu API, order placement, Razorpay payment integration |
| 6 | Project 1 — Real-time & Deploy | Socket.io kitchen view, React pages, deployed |
| 7 | Project 2 — GST Billing Backend | Mini Lead Manager evolves into Lead Bill — clients, invoices, GST |
| 8 | Project 2 — PDF & React | PDF generation, payment tracking, React client + invoice UI |
| 9 | Project 2 — Dashboard & Deploy | Invoice form with live GST preview, dashboard, deployed |
| 10 | Project 3 — AI Support Backend | Claude API integration, ticket CRUD, agent auth, email |
| 11 | Project 3 — CI/CD & Deploy | React portals, GitHub Actions pipeline, production deployed |
| 12 | Career Week | Resume, LinkedIn, mock interviews, job strategy |

### The Three Projects

| | Project 1 | Project 2 | Project 3 |
|---|---|---|---|
| **Name** | Restaurant Flow | Lead Bill | ClientDesk AI |
| **Jira key** | `RF` | `LB` | `CA` |
| **Type** | Restaurant ordering & payment system | Invoice & GST billing SaaS | AI-powered client support desk |
| **Key tech** | Razorpay payments, Socket.io real-time | GST calculation, pdf-lib, Cloudinary | Claude API, CI/CD, production deploy |
| **Weeks** | 5–6 | 7–9 | 10–11 |
| **Deployed on** | Vercel + Railway | Vercel + Railway | Vercel + Railway |

---

## Week 1 — Git, JavaScript, APIs & The Developer Workflow

**Goal**: By the end of Week 1, students are comfortable with the terminal, Git, JavaScript fundamentals, making API calls, and the pull request workflow. They understand what "frontend" and "backend" mean at a practical level. They have created the `mini-lead-manager` repo — the same codebase they will keep building on through Week 4 and which evolves into Lead Bill in Week 7.

---

### Day 1 — Terminal and Git

**Concepts:**
- What the terminal is and why developers use it
- Navigating directories: `ls`, `cd`, `mkdir`, `touch`, `rm`
- Git as version control: why it exists, what a repository is
- The Git workflow: `init → add → commit → push`
- Setting up a GitHub account and SSH key
- Cloning a repo, making changes, pushing a commit

**Terminal commands students must know today:**

| Command | Meaning | When students use it |
|---|---|---|
| `pwd` | Show the current folder | To confirm where they are before creating files |
| `ls` | List files and folders | To see what is inside the current folder |
| `cd folder-name` | Move into a folder | To enter a project folder |
| `cd ..` | Move one folder back | To go back when they enter the wrong folder |
| `mkdir devforge-practice` | Create a folder | To create a new practice project |
| `touch README.md` | Create a file | To create their first Markdown file |
| `clear` | Clean the terminal screen | To remove clutter while working |

**Git commands students must know today:**

| Command | Meaning | When students use it |
|---|---|---|
| `git init` | Turn a folder into a Git repository | When starting a new local project |
| `git status` | Show what changed | Before every commit |
| `git add README.md` | Stage one file | When they want to commit only one file |
| `git add .` | Stage all changed files | When all current changes should be committed |
| `git commit -m "docs: add README"` | Save staged changes with a message | After staging files |
| `git log --oneline` | Show commit history in a short format | To confirm the commit was created |
| `git branch` | Show current branch | To check whether they are on `main` or a feature branch |
| `git checkout -b feat/day-1-setup` | Create and switch to a new branch | Before starting ticket work |
| `git push origin feat/day-1-setup` | Upload the branch to GitHub | Before opening a Pull Request |

**Day 1 practice flow:**

```bash
pwd
mkdir devforge-practice
cd devforge-practice
touch README.md
git init
git status
git add README.md
git commit -m "docs: add first README"
git log --oneline
```

**Simple rule for students:**

Before committing, always run:

```bash
git status
```

**What students do:**
- Create their first Git repository
- Write a `README.md` and commit it
- Push to GitHub
- Open their first pull request

**Jira intro:** Students are introduced to the DevForge Jira workspace. Each day's work has a pre-created Jira ticket. Today: `DF-001 — Set up GitHub account and push first commit`. Students learn what a ticket is, what "In Progress" vs "Done" means, and how to move it.

**Day output:** First commit on GitHub. First PR opened. Jira ticket closed.

---

### Day 2 — JavaScript Fundamentals (Part 1)

**Concepts:**
- Variables: `let`, `const`, differences
- Data types: string, number, boolean, null, undefined
- Arrays: creating, accessing, `.push()`, `.pop()`, `.length`
- Objects: key-value pairs, dot notation, bracket notation
- Functions: declaration, arguments, return values
- `console.log()` for debugging

**What students do:**
- Write a `leads.js` script in their `mini-lead-manager` repo
- Exercises use lead data: create a leads array, filter by status, calculate total value, format output
- Commit the file and push — first feature on the project they'll keep building all program

**Jira:** `DF-002 — JavaScript basics with lead data`

**Day output:** Working `leads.js` committed. PR reviewed by AI (logic correctness, naming, structure).

---

### Day 3 — JavaScript Fundamentals (Part 2)

**Concepts:**
- Conditionals: `if`, `else if`, `else`, ternary operator
- Loops: `for`, `while`, `for...of`, `for...in`
- Array methods: `.map()`, `.filter()`, `.find()`, `.forEach()`, `.reduce()`
- String methods: `.split()`, `.join()`, `.includes()`, `.trim()`, `.replace()`
- Template literals (backtick strings)
- Scope: what is in scope and what isn't

**What students do:**
- Extend `leads.js` with array methods: filter by status, map to summaries, reduce to total pipeline value
- Write a `report()` function that prints: total leads, won/lost count, and total value of won leads using template literals

**Jira:** `DF-003 — JS arrays, loops, and lead pipeline report`

**Day output:** Extended `leads.js` with report function. PR reviewed.

---

### Day 4 — Async JavaScript and APIs

**Concepts:**
- What an API is: client makes a request, server sends a response
- JSON format: what it looks like, how to read it
- `fetch()` and how it works
- Promises: `.then()`, `.catch()`
- `async/await` syntax
- Reading API documentation
- HTTP methods: GET, POST, difference between them

**What students do:**
- Write a Node.js script that fetches lead/contact data from a free public API (e.g. JSONPlaceholder `/users`)
- Map the response to a leads-shaped object: `{ id, name, email, phone, company }`
- Print a formatted lead list and handle network errors gracefully

**Jira:** `DF-004 — Fetch external data and shape it into leads`

**Day output:** Working fetch script with error handling. Understands request/response cycle. PR reviewed.

---

### Day 5 — Frontend vs Backend + The Git Branch Workflow

**Concepts:**
- What frontend means: the browser, HTML/CSS/JS, what the user sees
- What backend means: the server, the database, the logic users never see
- How frontend and backend talk to each other (HTTP, JSON)
- Git branching: what a branch is, why teams use them
- The full PR workflow: `branch → build → commit → push → PR → review → merge`
- Branch naming conventions: `feat/`, `fix/`, `chore/`

**What students do:**
- Write a `ARCHITECTURE.md` in their `mini-lead-manager` repo explaining: how adding a lead will work (form → POST /leads → Express → Prisma → PostgreSQL → response → React updates)
- Practice the branch workflow: create a feature branch, make a change, open a PR with a proper title and description

**Jira:** `DF-005 — Document the Mini Lead Manager architecture and practise PR workflow`

**Day output:** `ARCHITECTURE.md` describing the full lead-add flow. PR with proper title, description, and linked Jira ticket. Git branch workflow solid.

---

**Week 1 Summary — What Students Have After Week 1:**
- `mini-lead-manager` repo on GitHub with 5+ commits and 5 merged PRs
- `leads.js` — a script that creates, filters, and reports on a leads array
- `ARCHITECTURE.md` — a diagram of how adding a lead will work end to end
- Understanding of terminal, Git branching, JavaScript fundamentals, async/await, API calls
- Familiarity with Jira ticket workflow they'll use every week

> **Rescue note:** Weak on array methods? Re-read W1D2 and W1D3 before starting Week 2. Express routes use `.map()` and `.filter()` constantly.

---

## Week 2 — Node.js, Express, PostgreSQL & Prisma

**Goal**: Build the Mini Lead Manager backend from scratch. By end of Week 2, students have a working leads API with a PostgreSQL database — the same backend their React UI will connect to in Week 3.

---

### Day 1 — Node.js and npm

**Concepts:**
- What Node.js is: JavaScript running outside the browser
- npm: installing packages, `package.json`, `node_modules`
- `require` vs `import`
- Creating a simple Node.js script that runs a web server (http module)
- What `nodemon` does and why it's useful

**Day output:** Basic Node.js server running on port 3000. Responds to a GET request.

---

### Day 2 — Express and Routes

**Concepts:**
- What Express is: a framework that simplifies building servers
- Routes: `app.get()`, `app.post()`, `app.put()`, `app.delete()`
- Route parameters: `/leads/:id`
- Query parameters: `/leads?status=NEW`
- `req.body`, `req.params`, `req.query`
- `res.json()`, `res.status()`
- Middleware: what it is, how it runs before your route handler

**Day output:** Express app with 5 leads routes (GET /leads, GET /leads/:id, POST /leads, PUT /leads/:id, DELETE /leads/:id). Returns hardcoded JSON for now.

---

### Day 3 — PostgreSQL and Prisma Setup

**Concepts:**
- What a relational database is: tables, rows, columns, relationships
- PostgreSQL: a production-grade open source database
- Prisma: a type-safe ORM that writes SQL for you
- `schema.prisma`: defining models
- `prisma migrate dev`: pushing schema to DB
- `prisma studio`: viewing data in a GUI
- Connecting Prisma to Express

**Day output:** Prisma schema with `Lead` model (name, phone, email, status, value, createdAt). Database running locally. Prisma connected to Express app.

---

### Day 4 — Full CRUD with Prisma

**Concepts:**
- `prisma.lead.create()`, `findMany()`, `findUnique()`, `update()`, `delete()`
- Handling not-found errors (return 404, not 500)
- Input validation: checking required fields before hitting the database
- What happens if you try to create a duplicate unique field

**Day output:** All 5 leads routes now read/write from PostgreSQL via Prisma. Students can create, read, update, and delete leads through the API — tested in Postman.

---

### Day 5 — Error Handling and Project Structure

**Concepts:**
- Centralised error handling in Express
- Separating routes from controllers (folder structure)
- Environment variables: what `.env` is, why secrets don't go in code
- `dotenv` package
- Testing your API with Postman

**Day output:** Clean project structure (routes/, controllers/, lib/). API fully functional. `.env` file used for `DATABASE_URL`. PR reviewed.

---

**Week 2 Summary — What Students Have After Week 2:**
- Mini Lead Manager backend: a working leads API (`POST /leads`, `GET /leads`, `PUT /leads/:id`, `DELETE /leads/:id`)
- PostgreSQL database with a `Lead` Prisma schema
- Clean folder structure matching industry conventions
- Experience with Postman for API testing
- 10+ merged PRs total

> **Rescue note:** Confused about async/await with Prisma? Go back to W1D4 before Week 3. Every React `useQuery` and `useMutation` call returns a promise — the same pattern.

---

## Week 3 — React

**Goal**: Build the Mini Lead Manager frontend. No tutorials — students connect their own React UI directly to the leads API they built in Week 2. By end of Week 3 the Mini Lead Manager is a working full-stack app.

---

### Day 1 — React Basics and Components

**Concepts:**
- What React is: a UI library, not a framework
- JSX: writing HTML-like syntax in JS
- Components: functions that return JSX
- Props: passing data into components
- Rendering a list with `.map()`

**Day output:** Vite + React project. A lead list rendered from hardcoded data using a `LeadCard` component.

---

### Day 2 — State with useState

**Concepts:**
- `useState`: what state is, how it triggers re-renders
- Controlled inputs: keeping form values in state
- Conditional rendering: `{condition && <Component/>}`
- Basic event handling: `onClick`, `onChange`, `onSubmit`

**Day output:** An "Add Lead" form that adds a lead to a local state array. Status dropdown (New / Contacted / Won / Lost). No backend yet.

---

### Day 3 — Fetching Data from Their Own API

**Concepts:**
- `useEffect`: running code after render
- `fetch()` inside React
- Loading states and error states
- Connecting to their own Express API from Week 2

**Day output:** React app fetches real leads from their own Week 2 backend. Full-stack connection working for the first time — Mini Lead Manager is live end to end.

---

### Day 4 — React Router and Navigation

**Concepts:**
- React Router v6: `<BrowserRouter>`, `<Routes>`, `<Route>`
- `<Link>` vs `<a>`
- `useParams()`: reading URL parameters
- Multi-page app: home, lead list, lead detail

**Day output:** Multi-page Mini Lead Manager: `/leads` list page → `/leads/:id` detail page with full lead info and status badge.

---

### Day 5 — TanStack Query (React Query)

**Concepts:**
- Why `useEffect` for data fetching gets messy at scale
- What React Query does: caching, background refetch, loading/error states
- `useQuery`: fetching data
- `useMutation`: creating/updating data
- `queryClient.invalidateQueries()`: refreshing data after a mutation

**Day output:** All leads fetching migrated from `useEffect` to React Query. Add Lead form uses `useMutation` — new lead appears instantly without page reload.

---

**Week 3 Summary — What Students Have After Week 3:**
- A fully working Mini Lead Manager: React frontend + Express backend + PostgreSQL
- Lead list, lead detail, add lead form — all connected to real data
- TanStack Query managing all server state
- 15+ merged PRs total
- The app is ready for auth (Week 4) and will eventually evolve into Lead Bill (Week 7)

> **Rescue note:** Confused about when to use `useQuery` vs `useMutation`? Rule of thumb — `useQuery` for reading data, `useMutation` for writing. Re-read W3D5 before Week 4 Day 2 when you add protected routes to the frontend.

---

## Week 4 — Authentication + Restaurant Flow Kickoff

**Goal**: Add JWT authentication to the Mini Lead Manager (Days 1–3). On Day 4, Restaurant Flow kicks off as a fresh repo — students start Project 1 with the full auth knowledge they just built.

---

### Day 1 — Authentication Concepts and Backend Implementation

**Concepts:**
- What authentication is: verifying who you are
- Passwords and hashing: `bcrypt`, why you never store plain text
- JWT: what a JSON Web Token is, what's inside it, how it's verified
- Access tokens vs refresh tokens: why two tokens, how they differ
- `POST /auth/register` and `POST /auth/login` routes

**Day output:** Register and login endpoints working. Passwords hashed. JWT returned on login.

---

### Day 2 — Protected Routes and Frontend Auth

**Concepts:**
- Middleware to verify JWTs: extracting and validating Bearer tokens
- Protected routes: routes that require a valid token
- Storing tokens in the frontend (localStorage, Zustand store)
- Attaching the token to every API request via Axios interceptors
- Redirect unauthenticated users to login

**Day output:** Protected backend routes. Frontend login flow. Token stored and sent with every request. Redirect on 401.

---

### Day 3 — Logout, Refresh Tokens, and Role-Based Access

**Concepts:**
- Logout: deleting the refresh token from the database, clearing the frontend store
- Refresh token flow: when access token expires, use refresh token to get a new one silently
- Storing refresh tokens in the database for revocation
- Role-based access: `ADMIN` vs `STAFF` — checking role in middleware

**Pace tiers — this day covers a range. Mentors should set expectations at the start:**

| Tier | What to finish | Who it applies to |
|---|---|---|
| **Must finish** | Logout endpoint + frontend logout + protected routes working end to end | Everyone |
| **Advanced** | Refresh token rotation — silent refresh on 401, token stored in DB | Students who finished Must finish with time to spare |
| **Bonus** | Role-based admin guard — `requireAdmin` middleware, admin-only routes, frontend `AdminRoute` | Students ahead of pace |

**Day output:** Logout working. Protected routes solid. Students who reach Advanced have silent token refresh. Students who reach Bonus have a working admin guard.

---

### Day 4 — Restaurant Flow Kickoff

Students create a new repo: `restaurant-flow`. This is Project 1 — a fresh codebase, a new domain, but all the same patterns they just learned.

**What Restaurant Flow is:**
*(Revealed to enrolled students on kickoff day. The brief, Jira tickets, and acceptance criteria are inside the Jira project `RF`.)*

**Core features students will build over Weeks 5–6:**
- Menu: categories (Starters, Mains, Desserts, Drinks), items with price + image
- Cart: add/remove items, quantity, subtotal
- Order: create an order from cart → pay via Razorpay → order confirmed
- Real-time: Socket.io kitchen display — new orders appear live, no refresh needed
- Admin: manage menu items, view all orders with live status updates

**What students do on Day 4:**
- Create the `restaurant-flow` repo, set up Express + Prisma
- Create Jira project `RF`, create Sprint 1 tickets RF-001 to RF-004
- Design the Prisma schema (MenuItem, Order, OrderItem, Payment)
- Open the first ticket, create branch `feat/RF-001-schema-setup`, make first commit

**Day output:** New repo created. Schema designed. Sprint 1 planned on Jira. First PR opened.

---

**Week 4 Summary — What Students Have After Week 4:**
- Complete JWT auth system (register, login, refresh, logout, role-based access) on Mini Lead Manager
- `restaurant-flow` repo created with schema and first PR merged
- Real Jira project `RF` set up with Sprint 1 tickets
- 20+ merged PRs total

---

## Week 5 — Project 1: Restaurant Flow — Payments

**Goal**: Build the core ordering and payment flow. By end of Week 5, customers can browse the menu, place an order, and pay via Razorpay. The payment is verified server-side.

Students work from Jira tickets RF-001 to RF-004, opening PRs for each feature. AI reviews every PR.

**What gets built this week:**
- RF-001: Prisma schema for MenuItem, Order, OrderItem, Payment — prices in paise
- RF-002: Menu API (grouped by category), Place Order API (server-side total calculation)
- RF-003: Razorpay order creation, checkout, and HMAC signature verification
- RF-004: Order status management with enforced transitions (CONFIRMED → PREPARING → READY → DELIVERED)

**Key concepts introduced:**
- How online payments work: order creation → checkout → webhook/verification → confirmation
- Why the server must calculate totals — never trust the client to send prices
- HMAC-SHA256 signature verification: what it is and why you must do it
- Status machine pattern: enforcing valid state transitions at the API level

**Week 5 Summary — What Students Have After Week 5:**
- Razorpay payment integration working end-to-end
- Restaurant Flow: menu browsing and full payment flow functional
- 28+ merged PRs total

---

## Week 6 — Project 1: Restaurant Flow — Real-time & Deploy

**Goal**: Add real-time order updates using Socket.io, build the React pages, and deploy Restaurant Flow live.

Students work from Jira tickets RF-005 to RF-008, Sprint 2.

**What gets built this week:**
- RF-005: Socket.io server — `new_order` events to kitchen room, `order_status_updated` to customer room
- RF-006: React customer ordering page — menu, cart, Razorpay widget, live order tracking via Socket
- RF-007: React kitchen dashboard — live incoming orders, status update buttons, optimistic UI
- RF-008: Full deployment — backend on Railway, frontend on Vercel, Socket.io working in production

**Key concepts introduced:**
- WebSockets vs HTTP: persistent connection vs request-response
- `io.emit()` vs `socket.emit()` vs `io.to(room).emit()`
- Why DB write must complete before socket event is emitted
- Socket.io CORS in production

**Restaurant Flow Sprint retrospective (end of Week 6):**
Students write a short async retrospective on Jira: what went well, what was hard, what they'd do differently. This becomes a habit for every project.

**Week 6 Summary — What Students Have After Week 6:**
- Restaurant Flow fully deployed and publicly accessible
- Socket.io events working end-to-end in production
- 36+ merged PRs total
- **Portfolio item 1: Restaurant Flow — live link on GitHub and LinkedIn**

> **Rescue note:** Socket.io not connecting in production? 99% of the time it is a CORS issue. Check that `CLIENT_URL` in Railway env matches the exact Vercel domain including `https://`.

---

## Week 7 — Project 2: Lead Bill — GST Billing Backend

**Goal**: The Mini Lead Manager from Weeks 1–4 evolves into Lead Bill — a GST-correct invoicing SaaS. Students don't start a new repo. They extend what they already built.

**The moment of continuity (Week 7):** Students look at their Mini Lead Manager backend and recognise that the Express server, Prisma setup, auth system, and leads API are already the foundation of Lead Bill. They add clients, invoices, and GST logic on top of a codebase they understand.

Students work from Jira project `LB`, Sprint 1 — tickets LB-001 to LB-003.

**What gets built this week:**
- LB-001: Extend Prisma schema — add `Client` model, `Invoice` model with line items, GST fields
- LB-002: Client management API with soft delete — `POST /clients`, `GET /clients`, `PUT /clients/:id`, `DELETE /clients/:id`
- LB-003: Invoice creation API — server-side GST calculation, auto-generated invoice numbers, same-state vs different-state detection

**Key concept — GST logic:**

```
Same-state invoice (freelancer.state === client.state):
  CGST = gstRate / 2
  SGST = gstRate / 2
  IGST = 0

Different-state invoice:
  CGST = 0
  SGST = 0
  IGST = gstRate
```

The system detects this automatically from stored state fields — the client never sends tax amounts.

**Week 7 Summary — What Students Have After Week 7:**
- Lead Bill backend: client and invoice CRUD working
- GST calculation correct for both same-state and different-state scenarios
- invoiceNumber auto-generation working (INV-YYYY-XXXX format)
- 42+ merged PRs total

---

## Week 8 — Project 2: Lead Bill — PDF & React

**Goal**: Add PDF invoice generation, payment tracking, and build the React frontend for client and invoice management.

Students work from Jira project `LB`, Sprint 2 — tickets LB-004 to LB-006.

**What gets built this week:**
- LB-004: PDF invoice generation with pdf-lib — server-side only, GST breakdown, correct amounts
- LB-005: Payment tracking — partial payments, overdue detection, dashboard summary endpoint
- LB-006: React client management page — TanStack Query, loading skeletons, edit modal, client-side search

**Key concepts introduced:**
- `pdf-lib`: generating PDFs in Node.js without HTML rendering
- Partial payment tracking — append payments, never overwrite
- All money in paise (integers) — zero floating point math anywhere
- TanStack Query loading skeletons vs spinners (skeleton is better UX)

**Week 8 Summary — What Students Have After Week 8:**
- PDF download working — generates correct GST invoice
- Payment tracking with overdue detection
- React client management page fully functional
- 48+ merged PRs total

---

## Week 9 — Project 2: Lead Bill — Invoice Form, Dashboard & Deploy

**Goal**: Build the invoice creation form with live GST preview, the dashboard, and deploy Lead Bill live. This is the most complex React week of the program.

Students work from Jira project `LB`, Sprint 3 — tickets LB-007 to LB-008.

**What gets built this week:**
- LB-007: React invoice form — dynamic line item rows, live GST calculation, CGST/SGST vs IGST preview, React Hook Form
- LB-008: React dashboard — stat cards from real API data, recent invoices, PDF download button, skeleton loading

**Key concepts introduced:**
- React Hook Form + Zod for complex form validation
- Live computed state: subtotals and GST recalculate as the user types
- `Intl.NumberFormat('en-IN')` for Indian currency formatting (₹1,23,456.00)
- Prisma aggregation queries: `count`, `aggregate`, `groupBy` for dashboard data

**Lead Bill Deployment (end of Week 9):**
- Frontend deployed to Vercel (auto-deploy on push to `main`)
- Backend deployed to Railway with env vars set
- `prisma migrate deploy` run in production
- Lead Bill live URL submitted to DevForge portal

**Week 9 Summary — What Students Have After Week 9:**
- Lead Bill fully deployed and publicly accessible
- Invoice form with live GST preview working end-to-end
- Dashboard with real aggregated data
- 56+ merged PRs total
- **Portfolio item 2: Lead Bill — live link on GitHub and LinkedIn**

---

## Week 10 — Project 3: ClientDesk AI — Backend & Claude Integration

**Goal**: Build and deploy Project 3 — an AI-powered client support desk. Students create a new repo. This week covers the backend: ticket system, agent auth, Claude AI integration, and email notifications.

Students work from Jira project `CA`, Sprint 1 — tickets CA-001 to CA-004.

**What Project 3 is:**
*(Revealed to enrolled students on kickoff day. The brief, Jira tickets, and acceptance criteria are inside the Jira project `CA`.)*

**Core features:**
- Client portal: clients submit support tickets (title, description, priority)
- Agent dashboard: list of assigned tickets, open/in-progress/resolved status
- AI reply suggestion: when a ticket is opened, Claude API drafts a suggested reply
- Agent reviews the suggestion, edits, and sends — reply stored and visible to client
- Ticket history: full thread of messages per ticket

**What gets built this week:**
- CA-001: Prisma schema (Company, Agent, Customer, SupportTicket, Message, AiDraft) + Express setup
- CA-002: Ticket CRUD API — customers submit without accounts, agents log in with JWT
- CA-003: Claude API integration — async AI draft generation on every new ticket, approve/edit/reject flow
- CA-004: Nodemailer email notifications — ticket received + reply notification, non-blocking

**Key concepts introduced:**
- Calling the Claude API (Anthropic SDK): `anthropic.messages.create()`
- Async background processing: customer gets response immediately, AI runs after
- Graceful degradation: if Claude API fails, ticket still works and agent replies manually
- Non-blocking email: SMTP failure should never cause a 500

**Week 10 Summary — What Students Have After Week 10:**
- ClientDesk AI backend fully functional
- AI draft generation working (Claude Haiku)
- Email notifications via Nodemailer
- 60+ merged PRs total

---

## Week 11 — Project 3: ClientDesk AI — React, CI/CD & Deploy

**Goal**: Build the React frontends, set up GitHub Actions CI/CD, and deploy the full application to production.

Students work from Jira project `CA`, Sprint 2 — tickets CA-005 to CA-008.

**What gets built this week:**
- CA-005: GitHub Actions CI pipeline — lint + test on every PR, Railway auto-deploy on pass
- CA-006: React customer support portal — submit ticket, track status, see message thread (auto-refresh)
- CA-007: React agent dashboard — ticket queue, AI draft approval panel, manual reply, priority controls
- CA-008: Full production deployment with health monitoring

**Key concepts introduced:**
- GitHub Actions: writing `.github/workflows/ci.yml`
- Integration tests that hit a real test database (not mocks)
- Branch protection: CI must pass before merge is allowed
- `GET /api/health` that confirms DB connection — not just process uptime
- Environment variables in GitHub Actions secrets, Railway, and Vercel dashboards

**Week 11 Summary — What Students Have After Week 11:**
- ClientDesk AI fully deployed with CI/CD running on every PR
- GitHub Actions badge in README
- Complete production deployment workflow understood
- 65+ merged PRs total
- **Portfolio item 3: ClientDesk AI — live link on GitHub and LinkedIn**

---

## Week 12 — Career Week

**Goal**: Prepare students for job applications. Resume, GitHub profile, LinkedIn, mock interview, and application strategy.

---

### Day 1 — GitHub Profile and Project Presentation

**What students do:**
- Write proper `README.md` files for all three projects with: what the project does, tech stack, live link, and screenshots
  - Restaurant Flow: restaurant ordering + real-time kitchen display + Razorpay
  - Lead Bill: GST invoice management + PDF generation + Cloudinary
  - ClientDesk AI: AI-powered support desk + CI/CD pipeline
- Update their GitHub profile README: who they are, what they've built, stack, how to contact
- Pin all three DevForge projects on their GitHub profile

**Output:** GitHub profile that tells a clear story when a recruiter visits it.

---

### Day 2 — Resume

**What's covered:**
- What technical hiring managers look for in a fresher resume
- How to describe a project in 2 bullet points (what it does + what tech you used)
- What to cut: irrelevant coursework, vague skills lists, "familiar with" wording
- ATS basics: why formatting matters, what keywords to include
- The DevForge resume template walkthrough

**What students do:**
- Write their resume using the DevForge template and guide
- Self-review using the provided checklist

**Output:** A completed first draft resume.

---

### Day 3 — LinkedIn and Online Presence

**What's covered:**
- Why LinkedIn matters for junior developer hiring in India
- Headline: write it as a role, not a title ("Full-Stack Developer | Node.js · React · Open to Work")
- About section: 3–4 sentences, what you've built, what you're looking for
- Projects section: adding the three DevForge projects with live links
- Activity: how to be visible without being annoying

**Output:** LinkedIn profile updated.

---

### Day 4 — Interview Prep

**What's covered:**
- What a technical interview for a junior developer role looks like in India
- DSA: the 10 most commonly asked problems for freshers (with worked solutions)
- Project walkthrough: how to explain what you built in 3 minutes
- Behavioral questions: "tell me about yourself", "why this company", "biggest challenge"

**Output:** Students practice explaining one of their projects out loud (can record a Loom video for self-review).

---

### Day 5 — Job Application Strategy

**What's covered:**
- Which companies to target as a fresher: early-stage startups vs product companies vs service companies
- Where to find openings: LinkedIn, Naukri, company career pages, referrals
- How many to apply to per week and how to prioritise
- When and how to follow up
- The application tracker spreadsheet

**Output:** Week 1 application plan ready. First 10 companies identified and added to tracker.

---

**Week 12 Summary — What Students Have After Week 12:**
- GitHub profile with 3 live projects and 65+ merged PRs
- Completed resume
- Updated LinkedIn profile
- Job application tracker with first companies identified
- Interview prep done

---

## What Students Graduate With

| Item | Details |
|------|---------|
| **GitHub profile** | 3 deployed apps, 65+ merged pull requests |
| **Project 1** | Restaurant Flow — Razorpay payments, Socket.io real-time kitchen view |
| **Project 2** | Lead Bill — GST invoice management, pdf-lib PDF generation, Cloudinary uploads |
| **Project 3** | ClientDesk AI — Claude API integration, GitHub Actions CI/CD, production deployed |
| **Resume** | Written using DevForge template and guide |
| **LinkedIn** | Updated profile with all 3 projects and searchable headline |
| **Certificate** | Completion certificate with unique verification link |
| **Job readiness** | Application tracker, 10 companies identified, interview prep done |

---

## Jira Workflow — Used Every Week

From Day 1 to Week 11, every piece of work has a Jira ticket on a real Jira board.

**Ticket lifecycle:**
1. Student reads the ticket and understands the acceptance criteria
2. Creates a branch: `feat/RF-003-razorpay-integration` (Jira ticket code in branch name)
3. Builds the feature or completes the task
4. Opens a PR and links the Jira ticket in the description (`Closes RF-003`)
5. AI reviews the PR — feedback posted as a GitHub comment
6. Student fixes issues, pushes again, gets re-reviewed
7. PR merged → Jira ticket auto-transitions to Done (via GitHub for Jira integration)

**Jira projects:**
| Project | Key | Weeks |
|---|---|---|
| Foundation (daily exercises) | `DF` | 1–4 |
| Restaurant Flow | `RF` | 5–6 |
| Lead Bill | `LB` | 7–9 |
| ClientDesk AI | `CA` | 10–11 |

**Why this matters:** Every company that uses Jira, Linear, or GitHub Issues runs this workflow. Students finish DevForge already knowing it by muscle memory — and they have a real sprint history with velocity data to show in interviews.

---

## Time Commitment

- **2–3 focused hours per day** (on curriculum weeks)
- **3–4 hours per day** (on project weeks)
- No fixed schedule — fully self-paced
- Can be stretched to 20 weeks with no penalty
- All content, project briefs, and AI PR reviews are available 24/7

---

*Document version: May 2025 · DevForge Cohort 3 · Internal use*
