# DevForge — 10-Week Full-Stack Developer Curriculum

> Internal curriculum document. Version: May 2025.
> This covers what students learn, what they build, and what they submit each week.

---

## Program Philosophy

Students learn by building, not by watching. Every week produces something real — a commit, a pull request, a working feature, a deployed app. By the end of Week 10, a student has three deployed projects, 65+ merged pull requests, and a GitHub profile that answers the question "show me something you've built."

The stack is chosen deliberately: JavaScript → Node.js → React, in that order. Foundations first. Frameworks second. No skipping steps.

Jira tickets are introduced in Week 1 and used throughout the entire program. Students learn to read a ticket, break it into tasks, write a branch name from it, and close it with a PR — the same workflow used at every product company in India.

---

## At a Glance

| Week | Focus | What They Build |
|------|-------|-----------------|
| 1 | Git, JavaScript, APIs, Jira | CLI tools, API scripts, first PR |
| 2 | Node.js, Express, PostgreSQL, Prisma | REST API with full CRUD |
| 3 | React | Frontend connected to their own backend |
| 4 | Authentication + Lead Bill Kickoff | JWT auth system + Lead Bill setup |
| 5 | Lead Bill — Core Features | Lead & invoice CRUD, dashboard |
| 6 | Lead Bill — Cloudinary & Deploy | PDF/file uploads, UI polish, deployed |
| 7 | Restaurant Flow — Payments | Razorpay order + payment flow |
| 8 | Restaurant Flow — Real-time & Deploy | Live order updates via Socket.io, deployed |
| 9 | ClientDesk AI — Production & CI/CD | AI-powered support desk, deployed with pipeline |
| 10 | Career Week | Resume, LinkedIn, mock interviews, job strategy |

### The Three Projects

| | Project 1 | Project 2 | Project 3 |
|---|---|---|---|
| **Name** | Lead Bill | Restaurant Flow | ClientDesk AI |
| **Type** | Invoice & lead management SaaS | Restaurant ordering & payment system | AI-powered client support desk |
| **Key tech** | Auth, CRUD, Cloudinary (PDF uploads) | Razorpay payments, Socket.io real-time | AI (Claude API), CI/CD, production deploy |
| **Weeks** | 4–6 | 7–8 | 9 |
| **Deployed on** | Vercel + Railway | Vercel + Railway | Vercel + Railway |

---

## Week 1 — Git, JavaScript, APIs & The Developer Workflow

**Goal**: By the end of Week 1, students are comfortable with the terminal, Git, JavaScript fundamentals, making API calls, and the pull request workflow. They understand what "frontend" and "backend" mean at a practical level.

---

### Day 1 — Terminal and Git

**Concepts:**
- What the terminal is and why developers use it
- Navigating directories: `ls`, `cd`, `mkdir`, `touch`, `rm`
- Git as version control: why it exists, what a repository is
- The Git workflow: `init → add → commit → push`
- Setting up a GitHub account and SSH key
- Cloning a repo, making changes, pushing a commit

**What students do:**
- Create their first Git repository
- Write a `README.md` and commit it
- Push to GitHub
- Open their first pull request against the DevForge starter repo

**Jira intro:** Students are introduced to the DevForge Jira project. Each day's work has a pre-created Jira ticket. Today: `DF-001 — Set up GitHub account and push first commit`. Students learn what a ticket is, what "In Progress" vs "Done" means, and how to move it.

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
- Write a Node.js script (`practice.js`) with 10 exercises
- Exercises cover: string manipulation, array filtering, object creation, function writing
- Commit the file and push to their practice repo

**Jira:** `DF-002 — Complete JavaScript basics exercises and open PR`

**Day output:** Working JS script committed. PR reviewed by AI (logic correctness, naming, structure).

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
- Extend `practice.js` with 10 more exercises using the above methods
- Write a short script that reads an array of students, filters by score, and prints a formatted summary using template literals

**Jira:** `DF-003 — JS arrays, loops, and string methods`

**Day output:** Extended practice script. PR reviewed.

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
- Write a Node.js script that calls a free public API (e.g. `https://api.coindesk.com/v1/bpi/currentprice.json`)
- Print specific fields from the response in a formatted output
- Handle errors (what happens if the network fails)

**Jira:** `DF-004 — Make your first API call and handle the response`

**Day output:** Working API script. Clear understanding of request/response. PR reviewed.

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
- Draw (or describe in a `.md` file) how a login flow works: user submits form → frontend sends POST → backend checks DB → returns token → frontend stores it
- Practice the branch workflow: create a feature branch, make a change, open a PR with a proper title and description

**Jira:** `DF-005 — Model a login flow and practise the full PR workflow`

**Day output:** Documented flow diagram. PR with proper title, description, and linked Jira ticket. Git branch workflow solid.

---

**Week 1 Summary — What Students Have After Week 1:**
- GitHub account with 5+ commits
- 5 merged PRs
- Understanding of terminal, Git branching, JavaScript fundamentals, async/await, API calls
- Familiarity with Jira ticket workflow they'll use every week
- Can describe what frontend and backend mean

---

## Week 2 — Node.js, Express, PostgreSQL & Prisma

**Goal**: Build a real REST API from scratch. By end of Week 2, students have a working backend with a database — endpoints they can test with Postman or curl.

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
- Route parameters: `/users/:id`
- Query parameters: `/users?role=admin`
- `req.body`, `req.params`, `req.query`
- `res.json()`, `res.status()`
- Middleware: what it is, how it runs before your route handler

**Day output:** Express app with 5 routes (users CRUD). Returns hardcoded JSON for now.

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

**Day output:** Prisma schema with `User` model. Database running locally. Prisma connected to Express app.

---

### Day 4 — Full CRUD with Prisma

**Concepts:**
- `prisma.user.create()`, `findMany()`, `findUnique()`, `update()`, `delete()`
- Handling not-found errors (return 404, not 500)
- Input validation: checking required fields before hitting the database
- What happens if you try to create a duplicate unique field

**Day output:** All 5 routes now read/write from PostgreSQL via Prisma. Students can create, read, update, and delete users through the API.

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
- A working REST API with full CRUD
- PostgreSQL database with a Prisma schema
- Clean folder structure matching industry conventions
- Experience with Postman for API testing
- 10+ merged PRs total

---

## Week 3 — React

**Goal**: Build a frontend that connects to the backend they built in Week 2. No tutorials. They connect their own API to their own UI.

---

### Day 1 — React Basics and Components

**Concepts:**
- What React is: a UI library, not a framework
- JSX: writing HTML-like syntax in JS
- Components: functions that return JSX
- Props: passing data into components
- Rendering a list with `.map()`

**Day output:** Vite + React project. A list of users rendered from hardcoded data.

---

### Day 2 — State with useState

**Concepts:**
- `useState`: what state is, how it triggers re-renders
- Controlled inputs: keeping form values in state
- Conditional rendering: `{condition && <Component/>}`
- Basic event handling: `onClick`, `onChange`, `onSubmit`

**Day output:** A form that adds a user to a local state array. No backend yet.

---

### Day 3 — Fetching Data from Their Own API

**Concepts:**
- `useEffect`: running code after render
- `fetch()` inside React
- Loading states and error states
- Connecting to their own Express API from Week 2

**Day output:** React app fetches real users from the backend. Renders them. Full-stack connection working.

---

### Day 4 — React Router and Navigation

**Concepts:**
- React Router v6: `<BrowserRouter>`, `<Routes>`, `<Route>`
- `<Link>` vs `<a>`
- `useParams()`: reading URL parameters
- Multi-page app: home, user list, user detail

**Day output:** Multi-page React app with navigation. User list page → user detail page.

---

### Day 5 — TanStack Query (React Query)

**Concepts:**
- Why `useEffect` for data fetching gets messy at scale
- What React Query does: caching, background refetch, loading/error states
- `useQuery`: fetching data
- `useMutation`: creating/updating data
- `queryClient.invalidateQueries()`: refreshing data after a mutation

**Day output:** All data fetching migrated from `useEffect` to React Query. Create user form uses `useMutation`.

---

**Week 3 Summary — What Students Have After Week 3:**
- A working full-stack app: React frontend + Express backend + PostgreSQL
- Understanding of state, props, routing, and data fetching
- TanStack Query for real data management
- 15+ merged PRs total

---

## Week 4 — Authentication + Lead Bill Kickoff

**Goal**: Add JWT authentication to the full-stack app (2–3 days), then get oriented on Lead Bill and open the first real project ticket.

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

### Day 3 — Refresh Tokens and Role-Based Access

**Concepts:**
- Refresh token flow: when access token expires, use refresh token to get a new one
- Storing refresh tokens in the database for revocation
- Role-based access: `ADMIN` vs `USER` — checking role in middleware
- Logout: deleting the refresh token from the database

**Day output:** Complete auth system. Token refresh working. Role guard on admin routes. Logout endpoint.

---

### Day 4 — Lead Bill Kickoff

Students receive the Lead Bill project brief. They read it, break it into Jira tickets, plan their approach, and set up the project repo.

**What Lead Bill is:**
A B2B invoice and lead management SaaS. Businesses use it to track potential clients (leads), convert them to customers, create invoices, and manage billing. Users log in with role-based access (Admin can see all leads; Staff see only their own). Invoices are uploaded as PDFs via Cloudinary.

**Core features students will build:**
- Auth: register, login, refresh tokens, role-based access (Admin / Staff)
- Leads: create, list, update status (New → Contacted → Converted → Lost)
- Invoices: create an invoice linked to a lead, upload PDF to Cloudinary, mark as paid/unpaid
- Dashboard: total leads, revenue collected, unpaid invoice count
- Admin panel: view all staff, all leads, all invoices across the organization

**Prisma schema (Day 4 task):**
```
User (id, email, password, role)
Lead (id, name, company, status, assignedTo → User)
Invoice (id, amount, status, pdfUrl, leadId → Lead, createdBy → User)
```

**What students do on Day 4:**
- Read the Lead Bill brief and acceptance criteria
- Create Jira tickets for Sprint 1 (DF-020 to DF-027)
- Set up GitHub repo from the DevForge Lead Bill template
- Write the Prisma schema and run `prisma migrate dev`
- Open the first ticket, create branch `feat/DF-020-prisma-schema`, make the first commit

**Day output:** Lead Bill repo created. Prisma schema migrated. First PR opened.

---

**Week 4 Summary — What Students Have After Week 4:**
- Complete JWT auth system (register, login, refresh, logout, role-based access)
- Lead Bill repo set up, schema migrated, first PR merged
- 20+ merged PRs total

---

## Week 5 — Lead Bill: Core Features

**Goal**: Build the core features of Lead Bill. By end of Week 5, leads and invoices are fully functional in the backend and the React frontend is connected.

Students work from their own Jira tickets, opening PRs for each feature. AI reviews every PR.

**What gets built this week:**
- Leads API: `POST /leads`, `GET /leads`, `PATCH /leads/:id/status`, `DELETE /leads/:id`
- Invoices API: `POST /invoices`, `GET /invoices`, `PATCH /invoices/:id/status`
- Auth gates: all routes protected, admin-only routes guarded
- React frontend:
  - Login page → redirects to dashboard
  - Leads list page with status filter
  - Lead detail page with invoice list
  - Create lead form, update status dropdown
  - Create invoice form

**No daily breakdown this week** — students work from Jira tickets they created in Week 4. The project brief specifies which tickets must be closed by end of Week 5.

**Week 5 Summary — What Students Have After Week 5:**
- Lead Bill backend fully functional (all routes, auth guards, role checks)
- React frontend connected: leads list, detail, invoices, forms working
- 30+ merged PRs total
- Experience closing Jira tickets independently against a real project brief

---

## Week 6 — Lead Bill: Cloudinary, Dashboard & Deploy

**Goal**: Add PDF invoice uploads via Cloudinary, build the dashboard, polish the UI, and deploy Lead Bill live.

---

**Concepts covered:**
- What Cloudinary is: a cloud file storage service with a generous free tier
- `multer`: receiving file uploads in Express before sending to Cloudinary
- `cloudinary` npm package: uploading a file buffer and getting back a URL
- Storing the Cloudinary URL in the `Invoice` table
- Rendering a PDF link/preview in React from the stored URL
- Dashboard data: aggregating counts and totals with Prisma (`count`, `aggregate`)
- UI polish: empty states, loading spinners, error messages

**What students build in Lead Bill:**
- `POST /invoices/:id/upload-pdf` — accepts a PDF, uploads to Cloudinary, saves URL to invoice record
- Frontend upload form: file input, progress indicator, link to view the uploaded PDF
- Dashboard page: total leads by status, total invoice value, unpaid invoice count — all from real DB queries
- UI polish pass: consistent spacing, empty states ("No leads yet"), error boundary messages

**Lead Bill Deployment (end of Week 6):**
- Frontend deployed to Vercel (auto-deploy on push to `main`)
- Backend deployed to Railway with env vars set
- `prisma migrate deploy` run in production
- Lead Bill live URL submitted to DevForge portal

**Week 6 Summary — What Students Have After Week 6:**
- Lead Bill fully deployed and publicly accessible
- Cloudinary PDF upload working end-to-end
- Dashboard with real aggregated data
- 40+ merged PRs total
- **Portfolio item 1: Lead Bill — live link on GitHub**

---

## Week 7 — Restaurant Flow: Payments with Razorpay

**Goal**: Build Restaurant Flow — a restaurant ordering system where customers browse a menu, place an order, and pay via Razorpay. Students learn payment integration inside a real product, not in a tutorial vacuum.

---

**What Restaurant Flow is:**
A full-stack restaurant ordering and management platform. Customers browse the menu, add items to a cart, and complete payment via Razorpay. The kitchen sees incoming orders in real time. The restaurant owner has an admin panel to manage the menu and view order history.

**Core features:**
- Menu: categories (Starters, Mains, Desserts, Drinks), items with price + image
- Cart: add/remove items, quantity, subtotal
- Order: create an order from cart → pay via Razorpay → order confirmed
- Admin: manage menu items, view all orders with status (Pending → Preparing → Ready → Delivered)

**Concepts covered this week:**
- What Razorpay is and how online payments work in India
- Creating a Razorpay order server-side: `POST /orders/razorpay`
- Razorpay checkout widget in React: opening the modal, handling success/failure callbacks
- Verifying the payment signature server-side (HMAC) — why you never trust the client
- Storing payment record in PostgreSQL on successful verification
- Order status updated to `CONFIRMED` only after verified payment

**What gets built this week:**
- Restaurant Flow repo set up, Prisma schema designed (MenuItem, Order, OrderItem, Payment), first Jira tickets created
- Menu API: `GET /menu`, `POST /menu` (admin only)
- Cart flow in React: item list → add to cart → cart sidebar → checkout
- Razorpay order creation endpoint
- Payment checkout: create order → Razorpay modal → pay → verify → order confirmed
- Payment record saved to DB, order marked CONFIRMED

**Week 7 Summary — What Students Have After Week 7:**
- Razorpay payment integration working end-to-end
- Restaurant Flow: menu browsing, cart, and payment flow all functional
- 48+ merged PRs total

---

## Week 8 — Restaurant Flow: Real-time Kitchen View & Deploy

**Goal**: Add real-time order updates to Restaurant Flow using Socket.io, build the kitchen display, and deploy the app live.

---

**Concepts covered:**
- What real-time means: server pushes data to the client without the client polling
- WebSockets vs HTTP: persistent connection vs request-response
- Socket.io server setup alongside Express
- `io.emit()` vs `socket.emit()` vs `io.to(room).emit()`
- Connecting from React using the `socket.io-client` package
- Listening to events and updating UI state without a page refresh

**What gets built in Restaurant Flow:**
- Socket.io added to the Express server
- When a new order is placed (after Razorpay payment verified), server emits `new_order` event
- Kitchen Display page: connects via Socket.io, shows incoming orders live — no refresh needed
- Kitchen staff can click "Mark as Ready" → order status updates to `READY` → customer sees status change in their order history (also via Socket)
- Admin dashboard: live count of pending orders in the header badge, updates in real time

**Restaurant Flow Deployment (end of Week 8):**
- Frontend deployed to Vercel
- Backend (Express + Socket.io) deployed to Railway
- WebSocket connections verified working in production
- Restaurant Flow live URL submitted

**Week 8 Summary — What Students Have After Week 8:**
- Restaurant Flow fully deployed with real-time kitchen view
- Socket.io events working end-to-end in production
- 56+ merged PRs total
- **Portfolio item 2: Restaurant Flow — live link on GitHub**

---

## Week 9 — ClientDesk AI: Production Deployment & CI/CD

**Goal**: Build and deploy ClientDesk AI — an AI-powered client support desk. This week combines everything learned across the program and introduces CI/CD so every PR triggers automated checks before deploy.

---

**What ClientDesk AI is:**
A client support desk where businesses manage support tickets raised by their clients. The AI (Claude API) reads each new ticket and suggests a reply — the support agent reviews it, edits if needed, and sends. Admins see all tickets, agents see only their assigned ones. The app is production-deployed with a full CI/CD pipeline.

**Core features:**
- Client portal: clients submit support tickets (title, description, priority)
- Agent dashboard: list of assigned tickets, open/in-progress/resolved status
- AI reply suggestion: when a ticket is opened, Claude API drafts a suggested reply
- Agent reviews the suggestion, edits, and sends — reply stored and visible to client
- Admin panel: assign tickets to agents, view all tickets, see performance stats
- Ticket history: full thread of messages per ticket

**Concepts covered:**
- Calling the Claude API (Anthropic SDK) from Node.js: `anthropic.messages.create()`
- Prompt design for support ticket replies: system prompt + ticket context
- Environment configuration: `.env.development` vs `.env.production`
- What CI/CD means: code pushed → lint + build check runs → deploy happens
- GitHub Actions: writing a `.github/workflows/ci.yml` workflow file
- Vercel for frontend: automatic deployments on push to `main`
- Railway for backend: deploy config, health check endpoint
- `prisma migrate deploy` in production (not `migrate dev`)
- Reading deployment logs to debug production failures
- Environment variables in Railway and Vercel dashboards (not in code)

**What gets built this week:**
- ClientDesk AI repo set up, Prisma schema (Ticket, Message, Client, Agent), first Jira tickets created
- All core features built using all prior knowledge (auth, CRUD, role guards, React, React Query)
- Claude API integration: `POST /tickets/:id/ai-suggest` — reads ticket, returns a reply draft
- GitHub Actions CI pipeline: ESLint + Vite build check on every PR
- Full deployment: frontend on Vercel, backend on Railway
- ClientDesk AI live and publicly accessible

**Week 9 Summary — What Students Have After Week 9:**
- ClientDesk AI fully deployed with AI reply suggestions
- GitHub Actions CI/CD pipeline running on every PR
- Complete production deployment workflow understood
- 65+ merged PRs total
- **Portfolio item 3: ClientDesk AI — live link on GitHub**

---

## Week 10 — Career Week

**Goal**: Prepare students for job applications. Resume, GitHub profile, LinkedIn, mock interview, and application strategy.

---

### Day 1 — GitHub Profile and Project Presentation

**What students do:**
- Write proper `README.md` files for all three projects with: what the project does, tech stack, live link, and screenshots
  - Lead Bill: invoice & lead management SaaS
  - Restaurant Flow: restaurant ordering + real-time kitchen display
  - ClientDesk AI: AI-powered client support desk
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

**Week 10 Summary — What Students Have After Week 10:**
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
| **Lead Bill** | Invoice & lead management SaaS — auth, CRUD, Cloudinary PDF uploads, admin panel |
| **Restaurant Flow** | Restaurant ordering system — Razorpay payments, real-time kitchen view via Socket.io |
| **ClientDesk AI** | AI-powered support desk — Claude API integration, CI/CD pipeline, production deployed |
| **Resume** | Written using DevForge template and guide |
| **LinkedIn** | Updated profile with all 3 projects and searchable headline |
| **Certificate** | Completion certificate with unique verification link |
| **Job readiness** | Application tracker, 10 companies identified, interview prep done |

---

## Jira Workflow — Used Every Week

From Day 1 to Day 5 of Week 10, every piece of work has a Jira ticket.

**Ticket lifecycle:**
1. Student reads the ticket and understands the acceptance criteria
2. Creates a branch: `feat/DF-001-setup-github` (ticket code in branch name)
3. Builds the feature or completes the task
4. Opens a PR and links the Jira ticket in the description
5. AI reviews the PR
6. Student fixes issues, pushes again, gets re-reviewed
7. PR merged → ticket moved to Done

**Why this matters:** Every company that uses Jira, Linear, or GitHub Issues runs this workflow. Students finish DevForge already knowing it by muscle memory.

---

## Time Commitment

- **2–3 focused hours per day** (on curriculum weeks)
- **3–4 hours per day** (on project weeks)
- No fixed schedule — fully self-paced
- Can be stretched to 20 weeks with no penalty
- All content, project briefs, and AI PR reviews are available 24/7

---

*Document version: May 2025 · DevForge Cohort 3 · Internal use*
