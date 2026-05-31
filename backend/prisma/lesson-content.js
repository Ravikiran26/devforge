// Week 1 lesson descriptions — imported by seed.js
// Format markers:
//   TRY IT NOW      → terminal block (dark green, commands starting with $)
//   TRY IN CONSOLE  → browser console block (dark blue, lines starting with >)
//   CODE EXAMPLE    → file code block (dark gray, paste into your project)
//   ---             → ends any block
//   ──────...       → visual divider
//   •               → bullet point
//   ☐               → checklist item
//   Lines starting with $, >, or 2-space indent → code style within blocks

module.exports = {

// ─── FOUNDATION LESSONS ──────────────────────────────────────────────────────

'L01': `
WHAT IS THE TERMINAL?
The terminal is a text-based way to control your computer. Instead of clicking icons and folders, you type commands. Every professional developer uses it every single day.

Think of it like this: clicking "New Folder" in Windows Explorer or Finder is the same as typing:
  mkdir folder-name
One line. Done. Once you learn these commands you can do everything a mouse can do — and much more.

Why do developers prefer the terminal?
• It is faster than clicking through menus
• You can automate repetitive tasks with scripts
• All dev tools (Node, Git, npm, Prisma) run through it
• It works the same on every machine — Mac, Linux, and Windows (WSL)

──────────────────────────────
TERMINAL COMMANDS YOU WILL USE EVERY DAY
──────────────────────────────

pwd — shows where you currently are (Print Working Directory)
ls — lists all files and folders in the current location
cd folder-name — move into a folder (Change Directory)
cd .. — go back one folder level
mkdir folder-name — create a new folder
touch filename.js — create a new empty file
clear — clean up the terminal screen

TRY IT NOW
$ pwd
$ ls
$ mkdir my-first-project
$ cd my-first-project
$ touch index.js
$ ls
---

After running this, you should see index.js listed. You just navigated your computer entirely through text.

──────────────────────────────
WHAT IS GIT?
──────────────────────────────

Git is a version control system. It is like Google Docs version history — but for your code. Every time you save a version with Git, you can always go back to it if something breaks.

Without Git — what most beginners do:
  project.js
  project_v2.js
  project_FINAL.js
  project_FINAL_v2_ACTUALLY_FINAL.js
  ... this is chaos and you will lose work

With Git — what real teams do:
  Every change is saved with a message describing what changed
  You can travel back to any previous version instantly
  10 developers can work on the same project without overwriting each other

Git lives on your computer. GitHub is the cloud platform where Git projects are stored and shared with your team. Git ≠ GitHub.

──────────────────────────────
HOW GIT ACTUALLY WORKS — THE THREE ZONES
──────────────────────────────

Understanding this one diagram will prevent 80% of Git confusion:

  [Working Directory]  →  git add  →  [Staging Area]  →  git commit  →  [Repository]
   files you edit                      files ready to save               saved history

Working Directory → where you write and edit code. Git watches this but doesn't save it yet.
Staging Area      → a preparation zone. You choose exactly which changes to include in the next commit.
Repository        → the permanent saved history. Once committed, it is safe.

Why have a staging area? Because sometimes you change 5 files but only want to commit 2 of them. Staging gives you that control.

──────────────────────────────
CORE GIT COMMANDS — THE SAVE CYCLE
──────────────────────────────

git init
  Turns any folder into a Git project. Run this once per project.

git status
  Shows what changed and what is staged. Run this before and after every git command. You cannot run it too often.

git add filename     — stage one specific file
git add .            — stage every changed file at once

git commit -m "message"
  Saves a permanent snapshot of staged files.
  Good: "feat: add login form with email validation"
  Bad:  "fix" / "update" / "asdfgh"

git log
  Shows full history of all commits. Press Q to exit.
  git log --oneline gives a compact one-line-per-commit view.

TRY IT NOW
$ mkdir git-practice && cd git-practice
$ git init
$ touch app.js README.md
$ git status
$ git add README.md
$ git status
$ git commit -m "docs: add README"
$ git add app.js
$ git commit -m "feat: add app.js entry point"
$ git log --oneline
---

You staged and committed two files separately. You should see two commits in the log with different messages.

──────────────────────────────
GIT DIFF — SEE WHAT CHANGED BEFORE COMMITTING
──────────────────────────────

Before you add and commit, you can see exactly what lines changed using git diff. This is how you review your own work before saving it.

TRY IT NOW
$ echo "console.log('hello')" >> app.js
$ git diff
---

Lines starting with + are additions (green). Lines starting with - are deletions (red). Review this before every commit to make sure you are not committing something unintended.

  git diff           → shows unstaged changes
  git diff --staged  → shows what is already staged and about to be committed

──────────────────────────────
BRANCHING — THE MOST IMPORTANT GIT CONCEPT
──────────────────────────────

A branch is your personal workspace for one specific task. Think of the main branch as the production version of the app — it always works, always ships. Every new feature, bug fix, or experiment happens on a separate branch.

  main                = stable, always working code. Protected. Nobody pushes here directly.
  feat/login-page     = your workspace for building the login feature
  fix/broken-button   = your workspace for fixing one specific bug

Branch naming convention used in every company:
  feat/description    → new feature
  fix/description     → bug fix
  docs/description    → documentation change
  refactor/description → code cleanup

TRY IT NOW
$ git branch
$ git checkout -b feat/my-first-feature
$ git branch
---

git branch shows all branches. The star (*) shows which branch you are currently on. git checkout -b creates a new branch AND switches to it in one command.

Now make a change on this branch:

TRY IT NOW
$ touch feature.js
$ git add .
$ git commit -m "feat: add feature.js"
$ git log --oneline
---

This commit only exists on feat/my-first-feature. The main branch does not have it yet. That is the point — each branch is isolated.

Switching between branches:
  git checkout main              → switch back to main
  git checkout feat/my-feature   → switch to an existing branch
  git branch -a                  → list all local branches

TRY IT NOW
$ git checkout main
$ ls
---

feature.js is gone from the directory. Not deleted — just on the other branch. Switch back and it reappears:

TRY IT NOW
$ git checkout feat/my-first-feature
$ ls
---

This is how teams work on 10 features simultaneously without breaking each other's work.

──────────────────────────────
GITHUB — CONNECTING LOCAL TO THE CLOUD
──────────────────────────────

Git on your laptop is local. GitHub is the cloud backup and collaboration platform. You push your local commits to GitHub so teammates can see them and so your work is safe even if your laptop dies.

git clone — download a repository from GitHub to your computer
This is the first command you run on Day 1 to get the starter project.

TRY IT NOW
$ git clone https://github.com/any-public-repo.git
$ cd repo-folder
$ ls
---

git clone creates a folder, downloads the entire repository into it, and automatically sets up the connection back to GitHub.

git push — upload your commits to GitHub
After committing locally, push your branch to GitHub so it is visible online.

TRY IT NOW
$ git push origin feat/my-first-feature
---

origin = the name of the GitHub remote (set automatically by git clone)
feat/my-first-feature = which branch to push

After this, your branch appears on GitHub and you can open a Pull Request.

git pull — download latest changes from GitHub to your local machine
Before starting work each day, pull to get any changes your teammates pushed overnight.

TRY IT NOW
$ git checkout main
$ git pull origin main
---

Always pull before creating a new branch. If you branch from an outdated main, your PR will have unnecessary merge conflicts.

──────────────────────────────
THE COMPLETE DAILY GIT WORKFLOW
──────────────────────────────

This is the exact sequence you will use every single day in this program:

  1. git checkout main          → start from the main branch
  2. git pull origin main       → get latest changes from GitHub
  3. git checkout -b feat/task  → create your feature branch
  4. (write code)
  5. git status                 → check what changed
  6. git diff                   → review the changes
  7. git add .                  → stage everything
  8. git commit -m "message"    → save the snapshot
  9. git push origin feat/task  → upload to GitHub
  10. Open Pull Request on GitHub

Repeat steps 4-8 as many times as needed before step 9. Multiple commits on one branch is normal and encouraged.

TRY IT NOW
$ git checkout main
$ git pull origin main
$ git checkout -b feat/practice-workflow
$ touch practice.js
$ git status
$ git diff
$ git add .
$ git commit -m "feat: add practice.js"
$ git log --oneline
---

──────────────────────────────
GITIGNORE — FILES GIT SHOULD NEVER TOUCH
──────────────────────────────

Some files must never be committed to GitHub:
  .env              → contains API keys, database passwords, JWT secrets
  node_modules/     → hundreds of MB of installed packages, regenerated with npm install
  dist/ or build/   → generated files, not source code
  .DS_Store         → Mac OS system files nobody else needs

A .gitignore file tells Git to completely ignore these files and folders.

TRY IT NOW
$ touch .env .gitignore
$ echo "node_modules/" >> .gitignore
$ echo ".env" >> .gitignore
$ echo "dist/" >> .gitignore
$ git status
---

.env and node_modules/ do not appear in git status at all — Git is ignoring them. They are invisible to Git.

If you commit a .env file with real credentials to a public GitHub repo, automated bots scan GitHub 24/7 and will find and use those credentials within minutes. This is not theoretical — it happens constantly. Always .gitignore your .env.

──────────────────────────────
MERGE CONFLICTS — WHAT THEY ARE AND HOW TO STAY CALM
──────────────────────────────

A merge conflict happens when two developers change the same line in the same file on different branches. Git cannot decide which version to keep — so it stops and asks you.

What a conflict looks like inside the file:
  <<<<<<< HEAD
  const port = 3000
  =======
  const port = 5000
  >>>>>>> feat/update-port

HEAD = your current branch's version
Below the ======= = the incoming branch's version

To resolve: delete the conflict markers and keep whichever version is correct (or combine both). Then git add and git commit as usual.

You will hit merge conflicts in this program. They are not disasters — they are normal. Read the markers, decide what the correct code should be, delete the markers, save, and commit.

──────────────────────────────
GIT CHEATSHEET — BOOKMARK THIS
──────────────────────────────

  git init                          → start a git project
  git clone <url>                   → download repo from GitHub
  git status                        → what changed?
  git diff                          → see line-by-line changes
  git add .                         → stage all changes
  git add filename                  → stage one file
  git commit -m "message"           → save snapshot
  git log --oneline                 → compact history
  git branch                        → list branches
  git checkout -b branch-name       → create + switch to new branch
  git checkout branch-name          → switch to existing branch
  git push origin branch-name       → upload branch to GitHub
  git pull origin main              → download latest from main
  git merge branch-name             → merge another branch into current

COMMON MISTAKES
• git commit without git add first — staging area is empty, commit saves nothing
• Vague commit messages like "fix" or "done" — write what you actually changed
• Committing to main directly — always create a branch for every task
• Forgetting git pull before creating a new branch — causes unnecessary conflicts
• Committing .env files — add to .gitignore before your first commit, not after
• Panicking at merge conflicts — read the markers, pick the right code, delete markers, commit
`,

// ─────────────────────────────────────────────────────────────────────────────

'L02': `
WHAT IS A WEB APPLICATION?
A website is a document you read. A web application is a program you use.

• Swiggy, PhonePe, Zerodha, Notion — these are web applications
• They remember your data, respond to your actions, update without reloading the page
• Every web application you will ever build has exactly two parts: a Frontend and a Backend

This lesson maps the entire picture before you write a single line of code. When you understand what runs where and why, every concept in the next 8 weeks will make sense immediately instead of feeling like magic.

──────────────────────────────
FRONTEND — WHAT LIVES IN THE BROWSER
──────────────────────────────

The frontend is everything the user can see and touch. It runs entirely inside the browser — Chrome, Firefox, Safari. The server is not involved after the initial page load.

What the frontend is made of:
• HTML — the structure. What elements exist on the page (buttons, inputs, cards, headings).
• CSS — the appearance. Colors, layout, fonts, spacing, animations.
• JavaScript — the behavior. What happens when you click, type, or scroll.
• React — a JavaScript library that makes building complex UIs manageable. Instead of manually updating the DOM, you describe what the UI should look like, and React handles all updates automatically.

What lives on the frontend in this program:
  LoginPage, Dashboard, LeadForm, LeadCard, InvoiceList, PaymentStatus

Where it runs:
The browser downloads your React code from a CDN or server once. After that, React runs locally on the user's device. The server is not contacted again until the user needs data.

──────────────────────────────
BACKEND — WHAT LIVES ON THE SERVER
──────────────────────────────

The backend is the engine behind the scenes. It runs on a server — a computer in the cloud that is always on, waiting for requests. Users never see it directly.

What the backend does:
• Receives HTTP requests from the frontend ("give me all leads for this user")
• Validates all input — frontend validation can be bypassed by anyone with basic dev tools
• Applies business rules (only ADMIN users can see this, GST = price * 0.18)
• Reads from and writes to the database
• Sends a structured response back to the frontend

What you will build the backend with:
• Node.js — lets you run JavaScript on a server (not just in a browser)
• Express.js — a lightweight framework for building API routes in Node.js
• Prisma — connects your Node.js backend to the PostgreSQL database with clean JavaScript

What lives on the backend in this program:
  POST /api/auth/login, GET /api/leads, POST /api/invoices, GET /api/dashboard

Where it runs:
A cloud server — Railway, Render, or Vercel. It runs 24/7 independently of the frontend.

──────────────────────────────
THE DATABASE — WHERE DATA LIVES PERMANENTLY
──────────────────────────────

Neither frontend nor backend can store data permanently on their own.
• Frontend data disappears the moment you close or refresh the browser tab
• Backend data disappears the moment you restart the server process

The database is the permanent storage layer. It lives on its own server and holds all your data across restarts, deployments, and crashes.

PostgreSQL — what you will use
PostgreSQL is a relational database. Data is stored in tables, like well-structured spreadsheets with relationships between them.

Tables you will build:
  users     → id, email, password (hashed), role, createdAt
  leads     → id, userId, name, phone, service, status, createdAt
  invoices  → id, leadId, amount, gstAmount, pdfUrl, createdAt
  students  → id, userId, college, currentWeek, plan, cohortId

Prisma is the bridge between Node.js and PostgreSQL. It lets you write database queries in JavaScript instead of raw SQL — and catches errors at the code level before they hit production.

──────────────────────────────
HOW THEY ALL CONNECT — THE FULL REQUEST CYCLE
──────────────────────────────

Let us trace exactly what happens when a user submits a login form on your app. This cycle happens in under 200 milliseconds.

1. User types email + password and clicks "Login"
   Happens in: the Browser — React

2. React sends an HTTP POST request to your backend
   POST http://localhost:5000/api/auth/login
   Body: { "email": "ravi@example.com", "password": "abc123" }

3. Express receives the request on the backend
   The route handler for POST /api/auth/login runs

4. Backend asks the database: does this user exist?
   Prisma: prisma.user.findUnique({ where: { email } })

5. Database responds with the user record (or null if not found)

6. Backend checks the password using bcrypt
   If correct: generates a JWT access token
   If wrong: responds with 401 Unauthorized

7. Backend sends the response back to React
   { success: true, token: "eyJhb...", user: { name: "Ravi", role: "STUDENT" } }

8. React stores the token and updates the UI
   Dashboard loads. Ravi's data appears.

This flow — Browser sends request, Express handles it, Prisma queries the DB, response comes back — repeats for every single feature you build. Understand this loop and debugging becomes systematic instead of guesswork.

──────────────────────────────
HTTP — THE LANGUAGE BROWSER AND SERVER SPEAK
──────────────────────────────

HTTP is the protocol — the agreed format — that frontend and backend use to communicate. Every interaction is a request + response pair.

HTTP Methods — they describe the intent of the request:
  GET    → read data (fetch all leads, get a user profile)
  POST   → create something new (submit a form, register a user)
  PATCH  → update part of a record (change a lead's status)
  PUT    → replace an entire record
  DELETE → remove a record

HTTP Status Codes — the backend's reply signal:
  200 OK           → everything worked
  201 Created      → new record was created successfully
  400 Bad Request  → the input was invalid or missing
  401 Unauthorized → not logged in
  403 Forbidden    → logged in but not allowed (wrong role)
  404 Not Found    → the record does not exist
  500 Server Error → something broke on the server

When a frontend bug shows "401" in the network tab, you immediately know: authentication failed. When you see "400", you know: the request body is wrong. Status codes are how backend developers communicate intent to frontend developers.

──────────────────────────────
JSON — THE DATA FORMAT EVERYTHING USES
──────────────────────────────

JSON (JavaScript Object Notation) is the format that backend and frontend use to exchange data. It looks exactly like a JavaScript object.

  // What React sends to Express (request body)
  { "name": "Ravi Sharma", "phone": "9876543210", "service": "Website" }

  // What Express sends back to React (response body)
  { "success": true, "message": "Lead created", "data": { "id": 1, "name": "Ravi Sharma" } }

Every API you will ever build returns JSON. Every API you will ever call returns JSON. Databases store data, JSON moves it between layers.

──────────────────────────────
YOUR TECH STACK AT A GLANCE
──────────────────────────────

  BROWSER (Frontend)        SERVER (Backend)          DATABASE
  ──────────────────        ─────────────────         ──────────────────
  React                     Node.js                   PostgreSQL
  Axios (sends requests) →  Express.js (handles)  →   Prisma ORM (queries)
  Zustand (state)           bcrypt (passwords)        Tables + Relations
  Vite (dev server)         JWT (auth tokens)         pgAdmin (GUI viewer)
  TailwindCSS               Nodemon (auto-restart)

• React talks to Express using Axios (HTTP requests)
• Express talks to PostgreSQL using Prisma (database queries)
• JWT tokens travel with every request to prove who the user is
• The entire stack uses JavaScript — same language, frontend to backend

──────────────────────────────
WHY JAVASCRIPT ON BOTH SIDES?
──────────────────────────────

JavaScript originally only ran in the browser. In 2009, Ryan Dahl created Node.js — it runs JavaScript on a server using Chrome's V8 engine.

This means:
• Same language on frontend AND backend — you learn one language deeply
• Share validation logic, types, and utility functions between layers
• One mental model instead of context-switching between Python/Ruby and JavaScript

This is why React + Node.js is one of the most in-demand stacks globally. Companies like LinkedIn, Netflix, Uber, PayPal, and thousands of Indian startups use this exact combination.

──────────────────────────────
WHAT YOU WILL BUILD IN THIS PROGRAM
──────────────────────────────

Project 1 — Lead Bill (Weeks 4–6)
  CRM + GST invoice SaaS — leads, proposals, invoices, payments
  Tech: JWT auth, full CRUD, Cloudinary PDF uploads, deployed on Vercel + Railway

Project 2 — Restaurant Flow (Weeks 7–8)
  Restaurant ordering and payment system
  Tech: Razorpay payments, Socket.io real-time order updates, deployed

Project 3 — ClientDesk AI (Week 9)
  AI-powered client support desk
  Tech: Claude API, CI/CD pipeline, production deployment

By the end you will have built 3 complete full-stack products — frontend, backend, database, auth, payments, real-time features, and AI integration — all deployed and on your GitHub.

──────────────────────────────
BEFORE YOU MOVE TO JAVASCRIPT ESSENTIALS
──────────────────────────────

You do not need to memorize any of this right now. But when you write your first Express route, ask yourself: which layer does this belong to? When you write your first React component, ask: what data does this need from the backend?

That mental model — Frontend sends requests, Backend processes them, Database stores the result — is the foundation everything else in this program builds on.
`,

// ─────────────────────────────────────────────────────────────────────────────

'L03': `
WHY THIS MATTERS
Before you write React or Node.js, you need to be confident with modern JavaScript. The patterns below appear in every single file you will write in this program. If any of these feel unfamiliar, spend 30 minutes in your browser console right now before moving to Day 1.

Open your browser console: press F12 → click "Console" tab → type JavaScript and press Enter.

──────────────────────────────
1. CONST AND LET
──────────────────────────────

Use const when a value will not be reassigned. Use let when it will change. Never use var — it is outdated and causes scope bugs.

  const API_URL = "http://localhost:5000"   // never changes
  const user = { name: "Ravi", week: 1 }   // the object itself doesn't get reassigned

  let count = 0     // will change
  count = count + 1 // fine

TRY IN CONSOLE
> const name = "Ravi"
> let score = 0
> score = score + 10
> console.log(name, score)
---

──────────────────────────────
2. ARROW FUNCTIONS
──────────────────────────────

Arrow functions are shorter and cleaner. Teams use them everywhere — in React components, in array methods, in Express routes.

  // Old style — still works but teams rarely use this in modern code
  function greet(name) {
    return "Hello " + name
  }

  // Arrow function — use this
  const greet = (name) => {
    return "Hello " + name
  }

  // Even shorter when the function body is just one expression
  const greet = (name) => "Hello " + name

TRY IN CONSOLE
> const double = (n) => n * 2
> console.log(double(7))
> const greet = (name) => "Hello " + name + "!"
> console.log(greet("Ravi"))
---

──────────────────────────────
3. TEMPLATE LITERALS
──────────────────────────────

Template literals let you embed variables inside strings. Use backticks instead of quotes. Real code is full of these.

  const name = "Ravi"
  const city = "Hyderabad"

  // Old way — messy with + signs
  console.log("Hello " + name + ", you are from " + city)

  // Template literal — clean and readable
  console.log(\`Hello \${name}, you are from \${city}\`)

  // Works with expressions too
  const price = 1000
  const gst = price * 0.18
  console.log(\`Price: Rs.\${price}, GST: Rs.\${gst}, Total: Rs.\${price + gst}\`)

TRY IN CONSOLE
> const product = "Mini Lead Manager"
> const week = 1
> console.log(\`Building \${product} — Week \${week}\`)
---

──────────────────────────────
4. ARRAY METHODS — MAP, FILTER, FIND
──────────────────────────────

These three methods are used in almost every React component and backend route you will write. Master them now.

.map() — transforms every item and returns a new array
  const prices = [100, 200, 300]
  const withGST = prices.map(p => p * 1.18)
  // Result: [118, 236, 354]

.filter() — keeps only the items that match a condition
  const leads = [
    { name: "Ravi",  status: "NEW"    },
    { name: "Priya", status: "CLOSED" },
    { name: "Rahul", status: "NEW"    }
  ]
  const activeLeads = leads.filter(l => l.status === "NEW")
  // Result: Ravi and Rahul only

.find() — returns the FIRST item that matches (not an array — a single item)
  const users = [{ id: 1, name: "Ravi" }, { id: 2, name: "Priya" }]
  const user = users.find(u => u.id === 2)
  // Result: { id: 2, name: "Priya" }

TRY IN CONSOLE
> const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
> const evens = numbers.filter(n => n % 2 === 0)
> const doubled = evens.map(n => n * 2)
> console.log(doubled)
---

──────────────────────────────
5. DESTRUCTURING
──────────────────────────────

Destructuring pulls values out of objects and arrays in one clean line. You will see this in every React component and backend route.

  const student = { name: "Ravi", college: "JNTU", week: 3, status: "ACTIVE" }

  // Old way — repetitive
  const name = student.name
  const week = student.week

  // Destructuring — one line
  const { name, week } = student

  // In function parameters — very common in backend routes
  const createLead = ({ name, phone, service }) => {
    // name, phone, service are directly available
  }

  // Array destructuring — you will see this with useState in React
  const [count, setCount] = useState(0)
  // count = current value, setCount = function to update it

TRY IN CONSOLE
> const user = { name: "Ravi", role: "student", week: 1 }
> const { name, role } = user
> console.log(name, role)
---

──────────────────────────────
6. SPREAD OPERATOR
──────────────────────────────

The spread operator (...) copies items from an array or object. You will use this constantly in React when updating state without mutating the original.

  // Copying and adding to an array — used when adding a new lead to the list
  const leads = [{ id: 1, name: "Ravi" }]
  const newLeads = [...leads, { id: 2, name: "Priya" }]

  // Copying and updating an object — used in form state handlers
  const form = { name: "Ravi", phone: "", service: "" }
  const updated = { ...form, phone: "9876543210" }
  // Result: { name: "Ravi", phone: "9876543210", service: "" }

  // In React controlled forms — the standard pattern
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

TRY IN CONSOLE
> const arr = [1, 2, 3]
> const bigger = [...arr, 4, 5]
> console.log(bigger)
> const obj = { name: "Ravi", week: 1 }
> const updated = { ...obj, week: 2 }
> console.log(updated)
---

──────────────────────────────
7. ASYNC/AWAIT
──────────────────────────────

Almost every operation in backend development takes time — querying a database, calling an external API, reading a file. JavaScript handles these asynchronously, which means it does not freeze and wait.

async/await makes asynchronous code look and read like normal step-by-step code.

Without async/await — hard to follow when nested:
  fetchLead(id).then(lead => {
    saveToDb(lead).then(result => {
      console.log(result)
    })
  })

With async/await — reads like normal code:
  const lead = await fetchLead(id)
  const result = await saveToDb(lead)
  console.log(result)

Rules:
  1. Add async before the function that contains await
  2. Add await before any operation that takes time (database, API call, file read)
  3. Wrap in try/catch to handle errors cleanly

CODE EXAMPLE
async function createLead(data) {
  try {
    const lead = await prisma.lead.create({ data })
    return { success: true, data: lead }
  } catch (error) {
    console.error("Failed to create lead:", error.message)
    return { success: false, message: error.message }
  }
}
---

TRY IN CONSOLE
> async function delay(ms) {
>   await new Promise(resolve => setTimeout(resolve, ms))
>   return "done after " + ms + "ms"
> }
> delay(1000).then(console.log)
---

──────────────────────────────
8. OBJECTS AND JSON
──────────────────────────────

Your backend sends and receives data as JSON. Your database returns rows as JavaScript objects. Understanding how to read, write, and transform objects is non-negotiable.

  // Creating an object
  const lead = {
    id: 1,
    name: "Ravi Sharma",
    phone: "9876543210",
    service: "Website",
    status: "NEW",
    createdAt: new Date()
  }

  // Reading from an object
  console.log(lead.name)          // "Ravi Sharma"
  console.log(lead["status"])     // "NEW" — same result, bracket notation

  // Checking if a key exists
  if (!lead.phone) {
    throw new Error("Phone is required")
  }

  // Converting to JSON string (for sending over HTTP)
  const json = JSON.stringify(lead)

  // Converting back to object (when you receive JSON)
  const parsed = JSON.parse(json)

TRY IN CONSOLE
> const student = { name: "Ravi", week: 1, active: true }
> Object.keys(student)
> Object.values(student)
> JSON.stringify(student)
---

COMMON MISTAKES
• Using var instead of const/let — causes unpredictable scope issues
• Forgetting e.preventDefault() in form submit — page reloads and all state is lost
• Not using await before a database call — you get a Promise object instead of actual data
• Mutating state directly: leads.push(item) — use [...leads, item] in React
• Forgetting to wrap async functions in try/catch — unhandled errors crash the server
`,

// ─── DAY LESSONS ─────────────────────────────────────────────────────────────

'W1D1_UNUSED': `
TODAY'S OUTPUT
By the end of today, you will have one GitHub Pull Request with a simple profile card and a screenshot attached. That PR is the deliverable.

HOW REAL TEAMS SHIP CODE
In every software company — from startups to large enterprises — no developer ever pushes code directly to the main branch. Not even the team lead. Not even the CTO.

Every single change, from a one-line bug fix to a new feature, goes through this exact flow:
  1. Create a branch for the specific task
  2. Write code on that branch
  3. Commit your changes with clear messages
  4. Push the branch to GitHub
  5. Open a Pull Request (PR) for a teammate to review
  6. Teammate reviews, suggests changes or approves
  7. Code merges into main only after approval

This protects the main branch. It creates accountability. It builds a history of what changed and why. You are learning this on Day 1 because the habit is more important than the code.

──────────────────────────────
THE GOLDEN RULE
──────────────────────────────

  main branch   = stable production code. Always works. Never break this.
  feature branch = your personal workspace. Experiment freely here.

Never commit directly to main. No exceptions in this program.

──────────────────────────────
COMPLETE WALKTHROUGH — YOUR FIRST PR
──────────────────────────────

Step 1 — Clone the starter repository
Your instructor shares a GitHub repo link. Cloning downloads it to your machine.

TRY IT NOW
$ git clone https://github.com/your-org/week1-starter.git
$ cd week1-starter
$ ls
---

Step 2 — Create your feature branch
Branch names follow a strict pattern in real teams: type/description-of-task

  feat/profile-card         → adding a new feature
  fix/broken-submit-button  → fixing a bug
  docs/update-readme        → documentation only

TRY IT NOW
$ git checkout -b feat/day-1-profile-card
$ git branch
---

The star (*) next to your branch name confirms you are on it. You are now working in your own safe workspace.

Step 3 — Build your profile card
Create a simple page with:
• Your name
• Your role, for example "Full-Stack Developer"
• 3 skills
• Your GitHub link
• One short bio line

This is practice for the PR workflow — keep it simple and functional. Do not spend time making it perfect.

Step 4 — Stage, commit, and push

TRY IT NOW
$ git status
$ git add .
$ git commit -m "feat: add profile card with name, role, skills, and GitHub link"
$ git push origin feat/day-1-profile-card
---

Step 5 — Open a Pull Request on GitHub
After pushing, GitHub shows a yellow banner: "Compare & pull request". Click it. Fill in the PR template completely — what you built, a screenshot, how to test it, what you learned. This is what teams call a "PR description" and it is mandatory.

Use this simple PR description:

CODE EXAMPLE
What I built:
- Added a profile card with my name, role, skills, bio, and GitHub link

How to test:
- Open the app
- Check that the profile card appears correctly

Screenshot:
- Attached below
---

──────────────────────────────
HOW TO WRITE GOOD COMMIT MESSAGES
──────────────────────────────

Format: type: short description (present tense, under 72 characters)

  feat: add profile card component                  ✓
  fix: correct form validation for email field      ✓
  style: update button colors to match design       ✓

  update                     ✗ — update what?
  fixed stuff                ✗ — what stuff?
  aaaaaa                     ✗ — this creates confusion and usually gets rejected in review

Types: feat, fix, style, refactor, docs, test, chore

──────────────────────────────
WHAT A REVIEWER LOOKS AT
──────────────────────────────

When a mentor reviews your PR, they check:
• Does the code match what the PR description says it does?
• Is the code readable — proper naming, no unnecessary nesting?
• Is a screenshot attached showing the output?
• Are commit messages meaningful?
• Is there any obvious bug or security issue?

A PR with "see code" as the description gets rejected. Always explain your work.

SUBMISSION CHECKLIST
☐ Repo cloned locally
☐ Branch created: feat/day-1-profile-card
☐ Profile card shows name, role, skills, GitHub link
☐ Commits have type-prefixed messages (feat: ...)
☐ PR opened on GitHub with description filled
☐ Screenshot attached to the PR

COMMON MISTAKES
• Committing directly to main — you skip the entire review workflow
• Branch name has spaces or uppercase — use lowercase hyphens only
• Vague commit messages like "done" or "work" — always be specific
• Forgetting to push before opening PR — GitHub won't see your local commits
• Empty PR description — always explain what you built and why

If git push fails, first run:

TRY IT NOW
$ git branch
$ git status
---

Make sure the star (*) is next to feat/day-1-profile-card. If you are on main, switch back to your feature branch before pushing.
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D2': `
JAVASCRIPT FUNDAMENTALS — PART 1
JavaScript is the programming language of the web. It runs in every browser and on every server (via Node.js). Before you write a single line of React or Express, you need to understand how JavaScript thinks.

Today covers the core building blocks: variables, data types, conditionals, functions, and array methods. These are concepts you will use every single day for the rest of the program.

──────────────────────────────
VARIABLES — STORING DATA
──────────────────────────────

A variable is a named container for a value. JavaScript has three ways to declare variables:

  const  → value never reassigned. Use this by default.
  let    → value can be reassigned. Use when the value changes (loop counters, form state).
  var    → old style. Never use var. It has scoping bugs that caused problems for a decade.

TRY IN CONSOLE
> const name = "Ravi"
> const age = 24
> let score = 0
> score = score + 10
> console.log(name, age, score)
---

Rule: start with const for everything. If you get an error saying you cannot reassign, switch to let. Never reach for var.

──────────────────────────────
DATA TYPES — WHAT VALUES LOOK LIKE
──────────────────────────────

JavaScript has 7 primitive types. You will use these 6 constantly:

  string   → text in quotes: "Ravi", 'hello', \`template\`
  number   → integers and decimals: 42, 3.14, -7
  boolean  → true or false (no quotes)
  null     → intentional empty value. You set it explicitly.
  undefined → value was never assigned. JavaScript sets this automatically.
  array    → ordered list of values: [1, "two", true]
  object   → key-value pairs: { name: "Ravi", age: 24 }

TRY IN CONSOLE
> typeof "hello"
> typeof 42
> typeof true
> typeof null
> typeof undefined
> typeof []
> typeof {}
---

Note: typeof null returns "object" — this is a 30-year-old JavaScript bug. null is not an object. Just know it exists.

──────────────────────────────
STRINGS — TEXT MANIPULATION
──────────────────────────────

Strings are text. You will use these every day when displaying data.

TRY IN CONSOLE
> const firstName = "Ravi"
> const lastName = "Kumar"
> const full = firstName + " " + lastName
> console.log(full)
> console.log(full.length)
> console.log(full.toUpperCase())
> console.log(full.toLowerCase())
> console.log(full.includes("Ravi"))
> console.log(full.split(" "))
---

Template literals use backticks and let you embed variables directly:

TRY IN CONSOLE
> const city = "Hyderabad"
> const message = \`Hello \${firstName}, welcome to \${city}!\`
> console.log(message)
---

Template literals are cleaner than + concatenation. Use them whenever you are mixing text and variables.

──────────────────────────────
NUMBERS AND OPERATORS
──────────────────────────────

TRY IN CONSOLE
> const price = 1000
> const gst = price * 0.18
> const total = price + gst
> console.log("Price:", price)
> console.log("GST:", gst)
> console.log("Total:", total)
> console.log(10 % 3)
---

% is the modulo operator. It returns the remainder after division. 10 % 3 = 1. Useful for checking if a number is even or odd: num % 2 === 0.

Comparison operators (always use === not ==):
  ===   strictly equal (value AND type match)
  !==   not equal
  >     greater than
  <     less than
  >=    greater than or equal
  <=    less than or equal

TRY IN CONSOLE
> 5 === 5
> 5 === "5"
> 5 == "5"
---

5 === "5" is false (number vs string). 5 == "5" is true because == does type coercion. Always use === to avoid surprise bugs.

──────────────────────────────
CONDITIONALS — MAKING DECISIONS
──────────────────────────────

CODE EXAMPLE
function getStatusLabel(status) {
  if (status === 'NEW') {
    return 'New Lead'
  } else if (status === 'CONTACTED') {
    return 'Contacted'
  } else if (status === 'CLOSED') {
    return 'Deal Closed'
  } else {
    return 'Unknown'
  }
}
---

TRY IN CONSOLE
> function getStatusLabel(status) {
>   if (status === 'NEW') return 'New Lead'
>   if (status === 'CONTACTED') return 'Contacted'
>   if (status === 'CLOSED') return 'Deal Closed'
>   return 'Unknown'
> }
> getStatusLabel('NEW')
> getStatusLabel('CLOSED')
> getStatusLabel('RANDOM')
---

Ternary operator — a one-line if/else for simple cases:

  condition ? valueIfTrue : valueIfFalse

TRY IN CONSOLE
> const score = 85
> const grade = score >= 60 ? "Pass" : "Fail"
> console.log(grade)
---

Use ternary for simple yes/no decisions. Use if/else when you have multiple branches or complex logic.

Logical operators:
  &&   AND — both conditions must be true
  ||   OR  — at least one must be true
  !    NOT — flips true to false

TRY IN CONSOLE
> const isLoggedIn = true
> const isAdmin = false
> console.log(isLoggedIn && isAdmin)
> console.log(isLoggedIn || isAdmin)
> console.log(!isLoggedIn)
---

──────────────────────────────
FUNCTIONS — REUSABLE BLOCKS OF LOGIC
──────────────────────────────

A function is a named, reusable block of code. You define it once and call it many times with different inputs.

CODE EXAMPLE
// Function declaration
function calculateGST(price, rate) {
  const tax = price * (rate / 100)
  return price + tax
}

// Arrow function — shorter syntax for the same thing
const calculateGST = (price, rate) => {
  const tax = price * (rate / 100)
  return price + tax
}

// One-liner arrow function — implicit return when no braces
const double = (n) => n * 2
---

TRY IN CONSOLE
> const calculateGST = (price, rate) => price + (price * rate / 100)
> calculateGST(1000, 18)
> calculateGST(500, 12)
> const double = n => n * 2
> double(7)
---

Arrow functions are the standard in modern JavaScript and React. You will see them everywhere.

Default parameters — used when an argument is not passed:

TRY IN CONSOLE
> const greet = (name = "Student") => \`Hello, \${name}!\`
> greet("Priya")
> greet()
---

──────────────────────────────
ARRAYS — WORKING WITH LISTS
──────────────────────────────

An array holds an ordered list of values. In real apps, arrays represent lists of leads, users, products, messages.

TRY IN CONSOLE
> const leads = ["Ravi", "Priya", "Rahul", "Sneha"]
> console.log(leads.length)
> console.log(leads[0])
> console.log(leads[leads.length - 1])
> leads.push("Kiran")
> console.log(leads)
---

The 4 array methods you will use in every React component:

.map() — transform every item into something new, returns new array
TRY IN CONSOLE
> const nums = [1, 2, 3, 4, 5]
> const doubled = nums.map(n => n * 2)
> console.log(doubled)
---

.filter() — keep only items that pass a test, returns new array
TRY IN CONSOLE
> const prices = [200, 1500, 800, 3000, 450]
> const expensive = prices.filter(p => p > 1000)
> console.log(expensive)
---

.find() — returns the first item that passes a test (not an array)
TRY IN CONSOLE
> const leads = [{id:1, name:"Ravi", status:"NEW"}, {id:2, name:"Priya", status:"WON"}, {id:3, name:"Rahul", status:"NEW"}]
> const found = leads.find(l => l.id === 2)
> console.log(found)
---

.forEach() — runs a function for each item, returns nothing
TRY IN CONSOLE
> const fruits = ["apple", "mango", "banana"]
> fruits.forEach(f => console.log("Fruit:", f))
---

Rule: use .map() when you need a new array, .filter() to remove items, .find() to look up one item, .forEach() only when you just need to do something with each item and don't need the result back.

──────────────────────────────
OBJECTS — KEY-VALUE DATA
──────────────────────────────

An object holds named properties. Every piece of data in your app — a lead, a user, an invoice — is an object.

TRY IN CONSOLE
> const lead = {
>   id: 1,
>   name: "Ravi Kumar",
>   phone: "9876543210",
>   service: "Web Development",
>   status: "NEW"
> }
> console.log(lead.name)
> console.log(lead["phone"])
> lead.status = "CONTACTED"
> console.log(lead.status)
---

Destructuring — pull properties out into their own variables:

TRY IN CONSOLE
> const { name, phone, status } = lead
> console.log(name)
> console.log(phone)
> console.log(status)
---

Spread operator — copy an object and override some fields:

TRY IN CONSOLE
> const updatedLead = { ...lead, status: "CLOSED", updatedAt: new Date() }
> console.log(updatedLead)
> console.log(lead)
---

The original lead is unchanged. ...lead copies all properties. Then you add or override specific ones. This is how state updates work in React — you never mutate the original, you create a new copy.

──────────────────────────────
PUTTING IT TOGETHER — A MINI LEAD TRACKER
──────────────────────────────

CODE EXAMPLE
const leads = [
  { id: 1, name: "Ravi Kumar",   service: "Web Dev",    status: "NEW",       value: 15000 },
  { id: 2, name: "Priya Sharma", service: "Mobile App", status: "CONTACTED", value: 50000 },
  { id: 3, name: "Rahul Mehta",  service: "SEO",        status: "NEW",       value: 8000  },
  { id: 4, name: "Sneha Patel",  service: "Web Dev",    status: "CLOSED",    value: 25000 },
]

// Get all NEW leads
const newLeads = leads.filter(l => l.status === 'NEW')
console.log("New leads:", newLeads.length)

// Get just the names
const names = leads.map(l => l.name)
console.log("Names:", names)

// Find one lead by id
const lead = leads.find(l => l.id === 2)
console.log("Found:", lead.name)

// Total pipeline value
const total = leads.reduce((sum, l) => sum + l.value, 0)
console.log("Total pipeline: ₹" + total)

// Summary line per lead
leads.forEach(l => {
  console.log(\`\${l.name} — \${l.service} — \${l.status} — ₹\${l.value}\`)
})
---

SUBMISSION CHECKLIST
☐ All console exercises run without errors
☐ Can explain the difference between const and let
☐ Can write an arrow function with a default parameter
☐ Can filter, map, and find on an array of objects
☐ Can destructure an object and spread-copy it with changes
☐ PR: feat/day-2-js-fundamentals with your mini lead tracker code

COMMON MISTAKES
• Using == instead of === — always use triple equals
• Forgetting return in a function — without return, the function returns undefined
• Mutating an array with push() inside React — use [...arr, newItem] instead
• Confusing .map() and .forEach() — map returns a new array, forEach returns nothing
• Accessing undefined properties — if lead.phone is undefined, you never set it or the key name is wrong
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D3': `
JAVASCRIPT FUNDAMENTALS — PART 2
Yesterday you learned variables, data types, functions, and basic array methods. Today goes deeper into the tools you will reach for in every real project: loops, error handling, modules, scope, and the advanced array/object patterns that show up constantly in React and Node.js code.

──────────────────────────────
LOOPS — REPEATING WORK
──────────────────────────────

Loops run a block of code repeatedly. You will use them to process arrays, validate data, and build output.

for loop — when you need the index or a specific count:

TRY IN CONSOLE
> for (let i = 0; i < 5; i++) {
>   console.log("Step", i)
> }
---

for...of — cleanest way to loop over an array when you don't need the index:

TRY IN CONSOLE
> const statuses = ["NEW", "CONTACTED", "CLOSED"]
> for (const status of statuses) {
>   console.log("Status:", status)
> }
---

for...in — loops over the keys of an object:

TRY IN CONSOLE
> const lead = { name: "Ravi", phone: "9876543210", status: "NEW" }
> for (const key in lead) {
>   console.log(key, "→", lead[key])
> }
---

while — runs as long as a condition is true. Use when you don't know the count upfront:

TRY IN CONSOLE
> let attempts = 0
> while (attempts < 3) {
>   console.log("Attempt", attempts + 1)
>   attempts++
> }
---

Rule: prefer for...of for arrays (clean, no index noise). Use for when you need the index. Avoid while unless you genuinely don't know the iteration count.

──────────────────────────────
ADVANCED ARRAY METHODS
──────────────────────────────

.reduce() — collapse an array into a single value (sum, count, object):

TRY IN CONSOLE
> const invoices = [
>   { amount: 5000, paid: true  },
>   { amount: 12000, paid: false },
>   { amount: 3500, paid: true  },
>   { amount: 8000, paid: false },
> ]
> const totalPaid = invoices
>   .filter(inv => inv.paid)
>   .reduce((sum, inv) => sum + inv.amount, 0)
> console.log("Total paid: ₹" + totalPaid)
---

.some() — returns true if at least one item passes the test:

TRY IN CONSOLE
> const leads = [{status:"NEW"}, {status:"CONTACTED"}, {status:"CLOSED"}]
> const hasNew = leads.some(l => l.status === "NEW")
> console.log(hasNew)
---

.every() — returns true only if ALL items pass the test:

TRY IN CONSOLE
> const scores = [85, 90, 72, 88, 91]
> const allPassed = scores.every(s => s >= 60)
> console.log(allPassed)
---

.sort() — sorts in place. Always pass a compare function for numbers:

TRY IN CONSOLE
> const prices = [1500, 200, 8000, 450, 3200]
> const ascending  = [...prices].sort((a, b) => a - b)
> const descending = [...prices].sort((a, b) => b - a)
> console.log(ascending)
> console.log(descending)
---

Note: [...prices] creates a copy before sorting. .sort() mutates the original array — spreading first prevents that side-effect.

Chaining methods together (very common in React):

TRY IN CONSOLE
> const leads = [
>   { name: "Ravi",   status: "NEW",       value: 15000 },
>   { name: "Priya",  status: "CONTACTED", value: 50000 },
>   { name: "Rahul",  status: "NEW",       value: 8000  },
>   { name: "Sneha",  status: "CLOSED",    value: 25000 },
> ]
> const topNew = leads
>   .filter(l => l.status === "NEW")
>   .sort((a, b) => b.value - a.value)
>   .map(l => l.name + " — ₹" + l.value)
> console.log(topNew)
---

──────────────────────────────
ERROR HANDLING — TRY / CATCH / FINALLY
──────────────────────────────

In production code, things go wrong: a network call fails, a user sends bad data, an external service is down. try/catch lets your program handle errors gracefully instead of crashing.

TRY IN CONSOLE
> function parseUserData(jsonString) {
>   try {
>     const data = JSON.parse(jsonString)
>     return data
>   } catch (error) {
>     console.log("Failed to parse:", error.message)
>     return null
>   }
> }
> parseUserData('{"name":"Ravi"}')
> parseUserData("not valid json")
---

throw — create your own errors with clear messages:

TRY IN CONSOLE
> function divide(a, b) {
>   if (b === 0) throw new Error("Cannot divide by zero")
>   return a / b
> }
> try {
>   console.log(divide(10, 2))
>   console.log(divide(10, 0))
> } catch (err) {
>   console.log("Error caught:", err.message)
> }
---

finally — runs whether the try succeeded or failed. Use for cleanup:

TRY IN CONSOLE
> function fetchData() {
>   try {
>     throw new Error("Network timeout")
>   } catch (err) {
>     console.log("Handled:", err.message)
>   } finally {
>     console.log("This always runs — close connections here")
>   }
> }
> fetchData()
---

In the backend (Week 2), every route handler will be wrapped in try/catch. This is not optional — an unhandled error crashes the entire server process.

──────────────────────────────
JSON — MOVING DATA BETWEEN SYSTEMS
──────────────────────────────

JSON (JavaScript Object Notation) is the universal format for sending data over the internet. Every API request and response you make in this program is JSON. The browser stores data as JSON. The backend sends JSON.

JSON.stringify() — convert a JavaScript object to a JSON string:

TRY IN CONSOLE
> const lead = { id: 1, name: "Ravi", status: "NEW" }
> const jsonString = JSON.stringify(lead)
> console.log(jsonString)
> console.log(typeof jsonString)
---

JSON.parse() — convert a JSON string back to a JavaScript object:

TRY IN CONSOLE
> const raw = '{"id":1,"name":"Ravi","status":"NEW"}'
> const obj = JSON.parse(raw)
> console.log(obj.name)
> console.log(typeof obj)
---

This is exactly what happens every time your frontend calls an API: the backend sends a JSON string over the network, the browser parses it back into a JavaScript object, and React renders it.

localStorage (browser only) — persist data across page refreshes:

TRY IN CONSOLE
> const user = { id: 1, name: "Ravi", role: "STUDENT" }
> localStorage.setItem("user", JSON.stringify(user))
> const stored = JSON.parse(localStorage.getItem("user"))
> console.log(stored.name)
> localStorage.removeItem("user")
---

──────────────────────────────
SCOPE — WHERE VARIABLES LIVE
──────────────────────────────

Scope controls where a variable can be accessed. Understanding this prevents 90% of "variable is not defined" errors.

Block scope — const and let only exist inside the {} block where they are declared:

TRY IN CONSOLE
> if (true) {
>   const message = "inside block"
>   console.log(message)
> }
> // console.log(message)  ← ReferenceError: message is not defined
---

Function scope — variables declared inside a function are not visible outside:

TRY IN CONSOLE
> function getTotal(price, tax) {
>   const total = price + tax
>   return total
> }
> console.log(getTotal(100, 18))
> // console.log(total)  ← ReferenceError
---

Closures — a function that remembers variables from the scope where it was created:

TRY IN CONSOLE
> function makeCounter() {
>   let count = 0
>   return function() {
>     count++
>     return count
>   }
> }
> const counter = makeCounter()
> console.log(counter())
> console.log(counter())
> console.log(counter())
---

count is private — nothing outside makeCounter can touch it. This is the exact pattern React's useState hook uses internally.

──────────────────────────────
MODULES — SPLITTING CODE ACROSS FILES
──────────────────────────────

As your app grows, you cannot keep all code in one file. Modules let you export from one file and import into another.

ES Modules (used in React / Vite frontend):

CODE EXAMPLE
// utils/tax.js
export function calculateGST(price, rate = 18) {
  return price * (rate / 100)
}

export const GST_RATES = { standard: 18, reduced: 12, exempt: 0 }

export default function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN")
}
---

CODE EXAMPLE
// App.jsx — importing from utils/tax.js
import formatCurrency, { calculateGST, GST_RATES } from './utils/tax'

const price = 5000
const tax   = calculateGST(price, GST_RATES.standard)
console.log(formatCurrency(price + tax))
---

CommonJS (used in Node.js / Express backend):

CODE EXAMPLE
// utils/tax.js (backend)
function calculateGST(price, rate = 18) {
  return price * (rate / 100)
}

module.exports = { calculateGST }
---

CODE EXAMPLE
// routes/invoices.js (backend)
const { calculateGST } = require('../utils/tax')
---

Rule: frontend (React) uses import/export. Backend (Node.js) uses require/module.exports. Do not mix them.

──────────────────────────────
HIGHER-ORDER FUNCTIONS
──────────────────────────────

A higher-order function is a function that takes another function as an argument, or returns a function. You have already been using them: .map(), .filter(), .find() all take a callback function.

Writing your own:

TRY IN CONSOLE
> function applyToAll(arr, fn) {
>   return arr.map(fn)
> }
> const prices = [1000, 2500, 800, 4200]
> const withGST = applyToAll(prices, p => p * 1.18)
> console.log(withGST)
---

TRY IN CONSOLE
> function withLogging(fn) {
>   return function(...args) {
>     console.log("Calling with:", args)
>     const result = fn(...args)
>     console.log("Result:", result)
>     return result
>   }
> }
> const loggedAdd = withLogging((a, b) => a + b)
> loggedAdd(5, 3)
---

This second pattern — wrapping a function to add behaviour — is exactly how Express middleware and React hooks work at their core.

──────────────────────────────
PUTTING IT TOGETHER — MINI INVOICE PROCESSOR
──────────────────────────────

CODE EXAMPLE
const invoices = [
  { id: "INV-001", client: "Ravi Kumar",   amount: 15000, paid: true,  date: "2024-01-10" },
  { id: "INV-002", client: "Priya Sharma", amount: 32000, paid: false, date: "2024-01-15" },
  { id: "INV-003", client: "Rahul Mehta",  amount: 8500,  paid: true,  date: "2024-01-18" },
  { id: "INV-004", client: "Sneha Patel",  amount: 45000, paid: false, date: "2024-01-20" },
  { id: "INV-005", client: "Kiran Rao",    amount: 12000, paid: true,  date: "2024-01-22" },
]

function processInvoices(invoices) {
  try {
    if (!Array.isArray(invoices) || invoices.length === 0) {
      throw new Error("invoices must be a non-empty array")
    }

    const paid   = invoices.filter(inv => inv.paid)
    const unpaid = invoices.filter(inv => !inv.paid)

    const totalRevenue = paid.reduce((sum, inv) => sum + inv.amount, 0)
    const totalPending = unpaid.reduce((sum, inv) => sum + inv.amount, 0)

    const topUnpaid = unpaid
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 2)
      .map(inv => \`\${inv.client} — ₹\${inv.amount.toLocaleString("en-IN")}\`)

    return {
      total:        invoices.length,
      paid:         paid.length,
      unpaid:       unpaid.length,
      totalRevenue: "₹" + totalRevenue.toLocaleString("en-IN"),
      totalPending: "₹" + totalPending.toLocaleString("en-IN"),
      topUnpaid,
    }
  } catch (err) {
    console.error("processInvoices failed:", err.message)
    return null
  }
}

const report = processInvoices(invoices)
console.log(report)
---

SUBMISSION CHECKLIST
☐ All console exercises run without errors
☐ Can use for...of and explain when to use for vs for...of
☐ Can chain .filter().sort().map() on an array of objects
☐ Can wrap risky code in try/catch and throw a custom error
☐ Can JSON.stringify and JSON.parse an object
☐ Can export a function from one file and import it in another
☐ Mini invoice processor runs and produces correct output
☐ PR: feat/day-3-js-fundamentals-2 with your invoice processor code

COMMON MISTAKES
• Using .sort() directly on original array — always spread first: [...arr].sort(...)
• Empty catch block — always log the error, never silently swallow it
• Forgetting the initial value in .reduce() — always pass 0 or {} as second argument
• Mixing import/export (ES Modules) with require/module.exports (CommonJS) in the same file
• Using for...in on arrays — it iterates keys ("0","1","2"), not values; use for...of instead
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D4': `
ASYNC JAVASCRIPT AND APIs
JavaScript runs one thing at a time — it is single-threaded. But real apps constantly need to do things that take time: fetch data from a server, read a file, wait for a database. If JavaScript blocked and waited for each operation to finish, your entire UI would freeze.

Async is how JavaScript handles waiting without blocking. Understanding this is not optional — every API call, every database query, every file upload in this program uses async code.

──────────────────────────────
THE PROBLEM — WHY ASYNC EXISTS
──────────────────────────────

Imagine a restaurant. The waiter takes your order, then stands at your table silently staring until the kitchen finishes cooking — 20 minutes, blocking all other customers. That is synchronous (blocking) code.

Real waiters take your order, submit it to the kitchen, then serve other tables while yours cooks. When your food is ready, they bring it. That is asynchronous (non-blocking) code.

TRY IN CONSOLE
> console.log("1 — take order")
> setTimeout(() => console.log("3 — food ready"), 1000)
> console.log("2 — serve other tables")
---

The output is 1, 2, 3 — not 1, 3, 2. JavaScript moves on immediately and comes back when the timer fires. This is the event loop.

──────────────────────────────
CALLBACKS — THE ORIGINAL ASYNC PATTERN
──────────────────────────────

A callback is a function you pass to another function to be called later, when the async work is done.

TRY IN CONSOLE
> function fetchLead(id, callback) {
>   setTimeout(() => {
>     const lead = { id, name: "Ravi Kumar", status: "NEW" }
>     callback(null, lead)
>   }, 500)
> }
> fetchLead(1, (error, lead) => {
>   if (error) return console.log("Error:", error)
>   console.log("Got lead:", lead.name)
> })
---

The convention is callback(error, result) — always check for error first. This worked, but nesting callbacks creates what teams call "callback hell":

  fetchUser(id, (err, user) => {
    fetchLeads(user.id, (err, leads) => {
      fetchInvoices(leads[0].id, (err, invoices) => {
        // 4 levels deep, impossible to read or debug
      })
    })
  })

Promises and async/await were invented to solve this.

──────────────────────────────
PROMISES — CHAINING ASYNC WORK
──────────────────────────────

A Promise represents a value that will arrive in the future. It is in one of three states:
  pending   → work is in progress
  fulfilled → work succeeded, value is ready
  rejected  → work failed, error is available

TRY IN CONSOLE
> function fetchLead(id) {
>   return new Promise((resolve, reject) => {
>     setTimeout(() => {
>       if (id <= 0) return reject(new Error("Invalid ID"))
>       resolve({ id, name: "Ravi Kumar", status: "NEW" })
>     }, 500)
>   })
> }
> fetchLead(1)
>   .then(lead => console.log("Success:", lead.name))
>   .catch(err => console.log("Error:", err.message))
---

TRY IN CONSOLE
> fetchLead(-1)
>   .then(lead => console.log("Success:", lead.name))
>   .catch(err => console.log("Error:", err.message))
---

.then() chains — run multiple steps in sequence without nesting:

TRY IN CONSOLE
> fetchLead(1)
>   .then(lead => {
>     console.log("Step 1 — got lead:", lead.name)
>     return { ...lead, status: "CONTACTED" }
>   })
>   .then(updated => {
>     console.log("Step 2 — updated:", updated.status)
>     return updated
>   })
>   .catch(err => console.log("Error:", err.message))
---

──────────────────────────────
ASYNC / AWAIT — THE MODERN WAY
──────────────────────────────

async/await is syntactic sugar over Promises. It makes async code look and read like normal synchronous code. This is what you will write in every React component and Express route in this program.

Rules:
  • async before a function means it always returns a Promise
  • await can only be used inside an async function
  • await pauses execution of that function until the Promise resolves

TRY IN CONSOLE
> async function getLeadDetails(id) {
>   try {
>     const lead = await fetchLead(id)
>     console.log("Lead name:", lead.name)
>     console.log("Lead status:", lead.status)
>     return lead
>   } catch (err) {
>     console.log("Failed:", err.message)
>     return null
>   }
> }
> getLeadDetails(1)
> getLeadDetails(-1)
---

Same result as .then()/.catch(), but reads as a straight flow top to bottom. Always wrap await calls in try/catch — an unhandled rejected promise crashes Node.js.

Running multiple async operations in parallel with Promise.all:

TRY IN CONSOLE
> async function fetchMultiple() {
>   console.time("parallel")
>   const [lead1, lead2] = await Promise.all([
>     fetchLead(1),
>     fetchLead(2)
>   ])
>   console.timeEnd("parallel")
>   console.log(lead1.name, "+", lead2.name)
> }
> fetchMultiple()
---

Both fetches start at the same time and finish together. If done sequentially, it would take 2× as long. Use Promise.all whenever operations do not depend on each other.

──────────────────────────────
WHAT IS AN API?
──────────────────────────────

API stands for Application Programming Interface. In web development it means: a set of URLs your server exposes that the frontend (or another service) can call to read or write data.

Every time you use Swiggy, PhonePe, or Zerodha:
  → The app sends an HTTP request to an API endpoint
  → The server processes it and returns JSON
  → The app parses the JSON and updates the UI

You have been building one all week. Now you will call one from the browser.

──────────────────────────────
FETCH API — CALLING APIS FROM THE BROWSER
──────────────────────────────

fetch() is the built-in browser function for making HTTP requests. It returns a Promise.

TRY IN CONSOLE
> fetch("https://jsonplaceholder.typicode.com/users/1")
>   .then(res => res.json())
>   .then(user => console.log(user.name, user.email))
>   .catch(err => console.log("Failed:", err.message))
---

Two steps are required: first await the Response, then call .json() to parse the body (also async):

TRY IN CONSOLE
> async function getUser(id) {
>   try {
>     const res  = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`)
>     if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
>     const user = await res.json()
>     console.log(user.name, "—", user.email)
>     return user
>   } catch (err) {
>     console.log("Error:", err.message)
>     return null
>   }
> }
> getUser(1)
> getUser(9999)
---

Always check res.ok before calling res.json(). A 404 does not throw — it resolves with a response where ok is false. If you skip this check, you parse the error page as data and get confusing bugs.

──────────────────────────────
POST REQUEST — SENDING DATA TO AN API
──────────────────────────────

GET requests retrieve data. POST requests send data to create something. You must set the method, headers, and body.

TRY IN CONSOLE
> async function createPost(title, body) {
>   try {
>     const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
>       method:  "POST",
>       headers: { "Content-Type": "application/json" },
>       body:    JSON.stringify({ title, body, userId: 1 })
>     })
>     if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
>     const post = await res.json()
>     console.log("Created post id:", post.id, "—", post.title)
>     return post
>   } catch (err) {
>     console.log("Error:", err.message)
>     return null
>   }
> }
> createPost("My First Post", "Hello from the browser")
---

  method:  "POST"                       → tells the server you're creating something
  headers: { "Content-Type": "application/json" } → tells the server the body is JSON
  body:    JSON.stringify(data)         → serialises your JS object to a JSON string

Every API call your React frontend makes to your Express backend will follow this exact pattern.

──────────────────────────────
AXIOS — THE INDUSTRY STANDARD HTTP CLIENT
──────────────────────────────

The built-in fetch() works, but in real projects teams use Axios. It automatically parses JSON, has better error handling, and supports interceptors (used for auth tokens in Week 4).

CODE EXAMPLE
// Install in your project
// npm install axios
---

CODE EXAMPLE
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // http://localhost:5000/api
})

// GET request
const res = await api.get('/leads')
const leads = res.data.data  // your { success, message, data } shape

// POST request
const res = await api.post('/leads', {
  name:    "Ravi Kumar",
  phone:   "9876543210",
  service: "Web Development",
})
const newLead = res.data.data
---

Axios throws on any non-2xx status code — no need to check res.ok manually. The full DevForge frontend uses Axios with an interceptor for auth (src/lib/api.js) — you will build this in Week 4.

──────────────────────────────
CONNECTING YOUR REACT FRONTEND TO YOUR EXPRESS BACKEND
──────────────────────────────

This is where everything from this week comes together. The frontend fetches data from your own API and displays it in real time.

CODE EXAMPLE
import { useState, useEffect } from 'react'

const API = "http://localhost:5000/api"

function App() {
  const [leads,   setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function loadLeads() {
      try {
        const res  = await fetch(\`\${API}/leads\`)
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
        const json = await res.json()
        setLeads(json.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadLeads()
  }, [])

  if (loading) return <p>Loading leads...</p>
  if (error)   return <p>Error: {error}</p>

  return (
    <div>
      <h1>Leads ({leads.length})</h1>
      {leads.map(lead => (
        <div key={lead.id}>
          <strong>{lead.name}</strong> — {lead.status}
        </div>
      ))}
    </div>
  )
}
---

useEffect runs after the component mounts. The empty [] dependency array means it runs once. This is the standard pattern for loading data on page load — you will use it in every project.

Three state variables for every data fetch: the data itself, a loading flag, and an error state. Every production React app handles all three.

──────────────────────────────
READING A PUBLIC API — PRACTICE
──────────────────────────────

JSONPlaceholder is a free fake REST API for practice. No sign-up, no API key.

TRY IN CONSOLE
> // Fetch all posts and show first 3 titles
> async function showPosts() {
>   const res   = await fetch("https://jsonplaceholder.typicode.com/posts")
>   const posts = await res.json()
>   posts.slice(0, 3).forEach(p => console.log(p.id, p.title))
> }
> showPosts()
---

TRY IN CONSOLE
> // Fetch user + their posts in parallel
> async function getUserWithPosts(userId) {
>   const [userRes, postsRes] = await Promise.all([
>     fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`),
>     fetch(\`https://jsonplaceholder.typicode.com/posts?userId=\${userId}\`)
>   ])
>   const user  = await userRes.json()
>   const posts = await postsRes.json()
>   console.log(\`\${user.name} has \${posts.length} posts\`)
> }
> getUserWithPosts(1)
---

SUBMISSION CHECKLIST
☐ Can explain the difference between synchronous and asynchronous code
☐ Can convert a .then()/.catch() chain to async/await
☐ Always wraps await in try/catch and handles the error
☐ Checks res.ok before calling res.json()
☐ Can make GET and POST requests with fetch()
☐ useEffect data-fetch with loading + error states works in React
☐ PR: feat/day-4-async-apis — React component fetching from your own Express API with screenshot

COMMON MISTAKES
• Missing await — the Promise object is returned, not the resolved value
• Forgetting try/catch around await — unhandled rejections crash Node.js and silently break React
• Not checking res.ok before res.json() — a 404 body parses without error and causes confusing bugs
• Calling an async function and expecting the value immediately — it always returns a Promise
• Putting data-fetching logic directly inside the component body — always put it inside useEffect
• Two sequential awaits when the operations are independent — use Promise.all to run in parallel
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D5': `
WEEK 1 WRAP-UP — HOW EVERYTHING CONNECTS
You have spent four days learning JavaScript, async code, and making API calls. Today you step back and build the mental model that makes everything click: exactly what the frontend does, what the backend does, why neither can do the other's job, and how professional teams ship code through branches and Pull Requests.

This is a concept-heavy day. Understanding this architecture is what separates developers who can debug any problem from developers who paste code until something works.

──────────────────────────────
THE FULL PICTURE — WHAT RUNS WHERE
──────────────────────────────

A full-stack web application has four distinct layers. Every single thing you build in this program maps to one of them.

  BROWSER (Frontend)
  └── React + Vite — runs on the user's device
  └── Responsible for: what the user sees and clicks
  └── Talks to: the Backend over HTTP

  SERVER (Backend)
  └── Node.js + Express — runs on a cloud server 24/7
  └── Responsible for: business logic, auth, data validation
  └── Talks to: the Database over a private connection

  DATABASE
  └── PostgreSQL — runs on its own server
  └── Responsible for: permanent storage
  └── Never directly accessible from the browser

  FILE STORAGE (Week 6)
  └── Cloudinary — stores uploaded images and files
  └── Accessible via URL after upload

Each layer trusts only its own boundaries. The browser never touches the database directly. The database never calls the frontend. The backend is the only layer that talks to all others.

──────────────────────────────
WHAT THE FRONTEND CAN DO — AND CANNOT DO
──────────────────────────────

FRONTEND CAN:
  • Show and hide UI elements based on state
  • Validate form inputs before submission (saves a network round-trip)
  • Store tokens and preferences in localStorage
  • Display data returned by the backend
  • Call backend API endpoints over HTTP

FRONTEND CANNOT:
  • Connect to a database — no driver, no credentials, impossible
  • Store secrets — any code in the browser is readable by anyone who opens DevTools
  • Be trusted for security — every validation the frontend does must be repeated on the backend
  • Make operations permanent — React state lives only until the page refreshes

THE CRITICAL RULE: Hiding a React component or route is NOT security.

TRY IN CONSOLE
> // Anyone can run this in DevTools to read your frontend environment variables
> import.meta.env
---

VITE_API_URL is visible. Any secret you put in VITE_ prefixed variables is public. This is why backend API keys (ANTHROPIC_API_KEY, DATABASE_URL, JWT_SECRET) must NEVER be in the frontend .env.

──────────────────────────────
WHAT THE BACKEND MUST DO
──────────────────────────────

Every request that reaches the backend must be treated as untrusted until proven otherwise. A user can bypass your entire React UI and call your API directly with curl or Postman.

Backend validates everything — independently of the frontend:

CODE EXAMPLE
// This validation must exist even if the frontend already validates
router.post('/leads', async (req, res) => {
  const { name, phone, service } = req.body

  // Frontend may skip this. A curl call definitely will.
  if (!name || !phone || !service) {
    return res.status(400).json({
      success: false, message: 'Name, phone, and service are required', data: null
    })
  }

  // Phone number format — frontend might not check this at all
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false, message: 'Phone must be 10 digits', data: null
    })
  }

  // ... save to database
})
---

Backend applies business rules:
  • Only ADMIN users can delete records — check req.user.role before deleting
  • A student cannot submit a PR for a ticket assigned to another cohort
  • A payment record cannot be marked PAID without a valid Razorpay signature

These rules live only on the backend. If they exist only in React, anyone can bypass them with one curl command.

──────────────────────────────
ENVIRONMENT VARIABLES — WHAT GOES WHERE
──────────────────────────────

Every project has two .env files. They serve completely different purposes.

FRONTEND (.env at the root, variables must start with VITE_):
  VITE_API_URL=http://localhost:5000/api

  Accessible via import.meta.env.VITE_API_URL in React code.
  These values are compiled into the browser bundle. They are NOT secret.
  Only put non-sensitive config here: API base URL, feature flags.

BACKEND (backend/.env, variables can be named anything):
  DATABASE_URL=postgresql://...
  JWT_SECRET=your-long-random-secret
  JWT_REFRESH_SECRET=another-long-secret
  ANTHROPIC_API_KEY=sk-ant-...
  GITHUB_TOKEN=ghp_...

  Accessible via process.env.JWT_SECRET in Node.js code.
  Never exposed to the browser. These are secrets.
  Always add backend/.env to .gitignore before the first commit.

The rule: if a value would cause real damage if leaked to the public internet, it belongs in the backend .env. If it would not, it can go in the frontend .env.

──────────────────────────────
THE REQUEST-RESPONSE CYCLE — WHAT ACTUALLY HAPPENS
──────────────────────────────

When a user submits a lead form in your React app, here is every step:

  1. User clicks Submit
  2. React calls e.preventDefault() — stops browser default page reload
  3. React validates inputs — shows error if empty, stops here
  4. React calls api.post('/leads', formData) — Axios constructs an HTTP POST request
  5. Axios adds Content-Type: application/json and Authorization: Bearer <token> headers
  6. The HTTP request travels over the network to http://localhost:5000
  7. Express receives the request
  8. CORS middleware checks: is the origin allowed? If not, rejects immediately
  9. express.json() middleware parses the JSON body into req.body
  10. authenticate middleware verifies the JWT token — if invalid, returns 401 here
  11. The route handler runs: validates fields, calls prisma.lead.create()
  12. Prisma sends a SQL INSERT to PostgreSQL
  13. PostgreSQL writes the row to disk, returns the saved record
  14. Prisma returns the record to Node.js as a JavaScript object
  15. The route handler sends res.status(201).json({ success: true, data: lead })
  16. The HTTP response travels back to the browser
  17. Axios resolves the Promise — res.data is the parsed JSON
  18. React updates state: setLeads(prev => [newLead, ...prev])
  19. React re-renders — the new lead appears in the list

Every network request follows this exact sequence. When something breaks, trace through each step to find where it failed.

──────────────────────────────
GIT BRANCH WORKFLOW — HOW REAL TEAMS SHIP CODE
──────────────────────────────

You have been creating branches all week. Today you learn the full professional workflow teams use to ship code without breaking each other's work.

The rule every company follows without exception:
  main branch = production. Always working. Never broken.
  Every change, no matter how small, happens on a branch.

THE GITHUB FLOW — THE STANDARD FOR THIS PROGRAM

  1. Pull latest main before creating your branch
  2. Create a branch with a descriptive name
  3. Write code and commit in small, focused chunks
  4. Push the branch to GitHub
  5. Open a Pull Request with a clear description
  6. Respond to review feedback and push fixes
  7. PR is approved — merge into main
  8. Delete the branch — it served its purpose

TRY IT NOW
$ git checkout main
$ git pull origin main
$ git checkout -b feat/day-5-architecture-notes
$ touch architecture.md
$ git add architecture.md
$ git commit -m "docs: add architecture notes from Day 5"
$ git push origin feat/day-5-architecture-notes
---

──────────────────────────────
BRANCH NAMING — THE CONVENTION EVERY COMPANY USES
──────────────────────────────

The prefix tells the reviewer what kind of change this is before they read a single line of code.

  feat/description       → new feature or functionality
  fix/description        → bug fix
  docs/description       → documentation only
  refactor/description   → code restructure, no behaviour change
  chore/description      → tooling, config, dependency updates

  Good branch names:
    feat/lead-form-validation
    fix/cors-error-localhost
    refactor/extract-api-client
    docs/add-readme-setup

  Bad branch names:
    my-branch
    changes
    test
    fix123

A good branch name answers: what does merging this do to main?

──────────────────────────────
WRITING A PULL REQUEST THAT GETS REVIEWED FAST
──────────────────────────────

A PR is a communication document, not just a code upload. Reviewers are busy. The faster they understand your changes, the faster they approve.

PR title format:
  feat: add lead form with validation
  fix: resolve CORS error on /api/leads endpoint
  refactor: extract api client to src/lib/api.js

PR description should answer:
  • What does this change do?
  • Why is it needed?
  • How can the reviewer test it?
  • Are there screenshots if it is UI work?

CODE EXAMPLE
// Good PR description

## What
Adds a controlled lead form with client-side validation.
On submit, POSTs to /api/leads and prepends the new lead to the list.
Form resets on success. Error message displayed on failure.

## Why
Day 2 deliverable — lead entry is the core feature of Mini Lead Manager.

## How to test
1. Run both frontend and backend
2. Fill the form and click Submit
3. Verify the lead appears at the top of the list without page reload
4. Submit with empty fields — verify error message appears

## Screenshots
[attach screenshot of the form and the lead list]
---

A PR with no description is a red flag in code review. Reviewers do not know what to look for.

──────────────────────────────
COMMITS — SIZE AND FREQUENCY
──────────────────────────────

A commit is a snapshot. It should represent one complete, coherent unit of work. Not too big, not too small.

TOO BIG (one commit for an entire day's work):
  "add everything for day 3" — impossible to review or revert

TOO SMALL (one commit per line):
  "add opening brace" — noise, clutters history

JUST RIGHT:
  "feat: add LeadCard component with status badge"
  "feat: add LeadForm with controlled inputs"
  "feat: connect form to POST /api/leads"
  "fix: reset form fields after successful submit"

Each commit tells a story. git log reads like a changelog.

TRY IT NOW
$ git log --oneline
---

If your own commits do not make sense to you 3 days later, they will not make sense to a teammate in a code review.

──────────────────────────────
RESOLVING MERGE CONFLICTS — STAY CALM
──────────────────────────────

A merge conflict happens when two branches change the same line. Git cannot decide which version to keep, so it marks both and asks you to choose.

What you will see in the file:
  <<<<<<< HEAD (your branch)
  const PORT = 3000
  =======
  const PORT = 5000
  >>>>>>> main

To resolve:
  1. Open the file in VS Code
  2. Read both versions
  3. Keep the correct one (or combine them)
  4. Delete all conflict markers: <<<<<<<, =======, >>>>>>>
  5. Save the file
  6. git add the file
  7. git commit to complete the merge

TRY IT NOW
$ git status
$ git diff
---

Run git status immediately when you open a project to understand what state it is in. Run git diff before every commit to review what you are about to save. These two commands catch 90% of mistakes before they happen.

──────────────────────────────
THE WEEK 1 PICTURE — WHAT YOU NOW KNOW
──────────────────────────────

Five days ago you did not know JavaScript. Today you understand:

  • JavaScript core: variables, types, functions, arrays, objects
  • Loops, error handling, JSON, scope, closures, modules
  • Promises and async/await — how JavaScript handles time
  • fetch() and Axios — calling APIs from the browser
  • What the frontend does vs what the backend must do
  • Why frontend validation is never enough
  • Where secrets live and why VITE_ variables are public
  • The full request-response cycle for every API call
  • The professional Git branch workflow used in every company
  • How to write a PR that gets reviewed and merged fast

Week 2 builds on everything here. You will build the entire backend — Node.js, Express, PostgreSQL, and Prisma — from scratch. Every JavaScript concept from this week is the foundation.

SUBMISSION CHECKLIST
☐ Can explain what the browser can and cannot do — with a real example
☐ Can explain what the backend must validate independently of the frontend
☐ Can explain where VITE_ env vars end up and why they are not secret
☐ Can trace the full lifecycle of one POST /api/leads request through all layers
☐ Week 1 branch naming has been consistent throughout (feat/, fix/, etc.)
☐ Every PR this week has a title, description, and test steps
☐ PR: feat/week-1-review — a short architecture.md documenting the frontend/backend split in your own words

COMMON MISTAKES
• Putting API keys in VITE_ environment variables — they are public, visible to anyone
• Trusting frontend validation as the only check — backend must validate independently
• Committing directly to main — always branch, always PR
• Vague commit messages like "fix" or "stuff" — write what actually changed
• Opening a PR with no description — reviewers skip these or request changes immediately
• Panicking at merge conflicts — read the markers, choose the correct code, delete markers, commit
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D6': `
THE PROBLEM WITH NO AUTHENTICATION
Right now, your API has zero security. Anyone who knows the URL can read every lead, create fake leads, delete everything. There is no concept of "my data" — it is all shared and unprotected.

Authentication solves two things:
  1. Identity — proves who is making the request
  2. Authorization — controls what that person is allowed to do

This is not optional for any real application. It is the difference between a toy and a product.

Important: hiding pages in React is NOT security. Anyone can open DevTools, find your API URL, and call it directly without touching the UI. Real security lives entirely on the backend.

──────────────────────────────
HOW THE FULL AUTH FLOW WORKS — STEP BY STEP
──────────────────────────────

REGISTER (first time user):
  1. User fills the register form — name, email, password
  2. Frontend sends POST /api/auth/register with that data
  3. Backend validates — is the email already taken? Is password long enough?
  4. Backend hashes the password with bcrypt (never store plain text)
  5. Backend saves the User to the database
  6. Backend returns a JWT token — user is logged in immediately

LOGIN (returning user):
  1. User fills login form — email, password
  2. Frontend sends POST /api/auth/login
  3. Backend finds the user by email
  4. Backend compares the submitted password against the stored hash using bcrypt.compare
  5. If match → backend signs a JWT token and returns it
  6. If no match → 401 Unauthorized, "Invalid credentials"

EVERY PROTECTED REQUEST AFTER LOGIN:
  1. Frontend stores the token (localStorage or memory)
  2. Frontend sends the token in every request header: Authorization: Bearer <token>
  3. Backend middleware reads the header, verifies the token using JWT_SECRET
  4. If valid → attaches req.user to the request object, calls next()
  5. If missing or invalid → 401 Unauthorized, request stops here

──────────────────────────────
WHAT IS A JWT TOKEN?
──────────────────────────────

JWT (JSON Web Token) has three parts separated by dots:
  eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VySWQiOiIxMjMifQ  .  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
       Header                       Payload                           Signature

Header  → algorithm used to sign
Payload → data you put inside: { userId, email, role, iat, exp }
Signature → proves the token was not tampered with

Anyone can decode the payload (it is just base64) — never put a password inside a JWT.
Only the server can VERIFY the signature, because only the server knows the JWT_SECRET.

If the JWT_SECRET changes, all existing tokens become invalid — every user gets logged out.

TRY IN CONSOLE
> // Decode a JWT without verifying — paste any token
> const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.xxx"
> const payload = JSON.parse(atob(token.split('.')[1]))
> console.log(payload)
---

──────────────────────────────
INSTALL DEPENDENCIES
──────────────────────────────

TRY IT NOW
$ npm install bcryptjs jsonwebtoken
---

Add to your backend .env:
  JWT_SECRET=replace_this_with_a_long_random_string_minimum_32_chars

──────────────────────────────
THE USER MODEL
──────────────────────────────

CODE EXAMPLE
// prisma/schema.prisma — add User and link Lead to User

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique  // prevents duplicate accounts
  password  String            // always the bcrypt hash, never plain text
  leads     Lead[]
  createdAt DateTime @default(now())
}

model Lead {
  id        String   @id @default(cuid())
  userId    String                                // ← every lead belongs to a user
  user      User     @relation(fields: [userId], references: [id])
  name      String
  phone     String
  service   String
  status    String   @default("NEW")
  createdAt DateTime @default(now())
}
---

TRY IT NOW
$ npx prisma migrate dev --name add_user_auth
---

──────────────────────────────
REGISTER AND LOGIN ROUTES
──────────────────────────────

CODE EXAMPLE
// src/routes/auth.js
const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const prisma  = require('../lib/prisma')
const router  = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required', data: null })
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters', data: null })
  }

  try {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered', data: null })
    }

    const hashedPassword = await bcrypt.hash(password, 10) // 10 = salt rounds
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true, message: 'Registration successful',
      data: { token, user: { id: user.id, name: user.name, email: user.email } }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', data: null })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required', data: null })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', data: null })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', data: null })
    }
    // Note: both "user not found" and "wrong password" return the same message.
    // This is intentional — never tell attackers which part was wrong.

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true, message: 'Login successful',
      data: { token, user: { id: user.id, name: user.name, email: user.email } }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', data: null })
  }
})

module.exports = router
---

CODE EXAMPLE
// src/server.js — register the auth routes (public, no middleware)
const authRouter = require('./routes/auth')
app.use('/api/auth', authRouter)
---

──────────────────────────────
THE AUTH MIDDLEWARE
──────────────────────────────

CODE EXAMPLE
// src/middleware/auth.js
const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided', data: null })
  }

  const token = authHeader.split(' ')[1]  // "Bearer abc123" → "abc123"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded   // { userId, email, iat, exp } now available in every route
    next()               // call the actual route handler
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token invalid or expired', data: null })
  }
}

module.exports = { authenticate }
---

CODE EXAMPLE
// src/server.js — protect all lead routes
const { authenticate } = require('./middleware/auth')

app.use('/api/leads', authenticate)
// now every route under /api/leads requires a valid Bearer token
---

──────────────────────────────
USER-SPECIFIC DATA — EVERY LEAD BELONGS TO THE LOGGED-IN USER
──────────────────────────────

CODE EXAMPLE
// src/routes/leads.js — filter by the authenticated user
const { authenticate } = require('../middleware/auth')

// CREATE — assign lead to the logged-in user
router.post('/', authenticate, async (req, res) => {
  const { name, phone, service } = req.body
  const lead = await prisma.lead.create({
    data: { name, phone, service, userId: req.user.userId }
  })
  res.status(201).json({ success: true, message: 'Lead created', data: lead })
})

// READ — only this user's leads
router.get('/', authenticate, async (req, res) => {
  const leads = await prisma.lead.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' }
  })
  res.json({ success: true, message: 'Leads fetched', data: leads })
})
---

──────────────────────────────
FRONTEND — STORING AND SENDING THE TOKEN
──────────────────────────────

CODE EXAMPLE
// After login — store the token
localStorage.setItem('token', data.token)

// In src/api/client.js — automatically attach to every request
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = \`Bearer \${token}\`
  return config
})

export default api
---

With this interceptor, every API call automatically includes the token. You never write Authorization headers manually in components.

SUBMISSION CHECKLIST
☐ User model added — email is unique constraint
☐ Lead model has userId linking to User
☐ Migration ran: npx prisma migrate dev --name add_user_auth
☐ POST /api/auth/register hashes password with bcrypt — confirmed in Postman
☐ POST /api/auth/login verifies password and returns JWT — confirmed in Postman
☐ Auth middleware in src/middleware/auth.js
☐ All /api/leads routes protected — unauthenticated request returns 401
☐ Every lead query filters by req.user.userId — User A cannot see User B's leads
☐ Frontend stores token and axios interceptor sends it automatically
☐ PR: feat/day-6-auth — Postman screenshots for: register, login, protected route with token, protected route without token (should get 401)

COMMON MISTAKES
• Password stored as plain text — always hash with bcrypt before saving
• JWT_SECRET not in .env or too short — tokens are weak or server crashes
• Missing "Bearer " prefix (with space) — middleware cannot parse the header
• Same error message for wrong email vs wrong password — intentional, never reveal which
• Lead created without userId — all users see all leads, security is broken
• Frontend hiding pages but backend APIs unprotected — anyone can bypass the UI
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D7': `
WHAT DEPLOYMENT MEANS — AND WHY IT MATTERS
Deployment means your application is live on the internet. Anyone in the world with the URL can register, login, create leads, and come back the next day to see them. Localhost is not a deliverable. Nobody else can open your localhost:5173 link.

This is the standard your work will be held to for every project:
  → Live frontend URL (Vercel)
  → Live backend URL (Railway or Render)
  → Live database in the cloud (Neon or Supabase)
  → All three connected and working together

A beautiful app that only runs on your laptop is not finished.

──────────────────────────────
THE THREE LAYERS OF DEPLOYMENT
──────────────────────────────

Full-stack applications have three parts that each need their own hosting:

  1. Database → Neon or Supabase (free PostgreSQL in the cloud)
     The database must be deployed first. Backend needs the DATABASE_URL before it can start.

  2. Backend → Railway or Render (free Node.js hosting)
     Deploy after the database. Needs DATABASE_URL, JWT_SECRET, CLIENT_URL, PORT.

  3. Frontend → Vercel (free React/Vite hosting)
     Deploy after the backend. Needs VITE_API_URL pointing to the live backend.

This order matters. Each layer depends on the one below it.

──────────────────────────────
STEP 1 — DEPLOY YOUR DATABASE TO NEON
──────────────────────────────

Go to neon.tech → Sign up (free) → Create New Project → copy the connection string.

The connection string looks like:
  postgresql://user:password@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require

Save this — you will need it in Step 2 for the backend deployment.

After you deploy the backend, run your Prisma migrations on the production database:

TRY IT NOW
$ DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
---

migrate deploy (not migrate dev) runs pending migrations without creating new ones. Use this in production, never migrate dev.

──────────────────────────────
STEP 2 — DEPLOY YOUR BACKEND TO RAILWAY
──────────────────────────────

Before deploying, make sure your backend start command is in package.json:
  "start": "node src/server.js"

Go to railway.app → New Project → Deploy from GitHub Repo → select your repo.

If your backend is in a /backend folder (monorepo), set the Root Directory to backend/ in Railway settings.

Add these environment variables in the Railway dashboard (Variables tab):

  DATABASE_URL  → paste the Neon connection string from Step 1
  JWT_SECRET    → generate a strong random secret:

TRY IT NOW
$ openssl rand -hex 32
---

Copy that output. That is your JWT_SECRET for production. Never reuse the local one.

  CLIENT_URL    → leave empty for now — fill in after Step 3 (Vercel URL)
  PORT          → Railway sets this automatically, but add PORT=5000 as a fallback

Railway will give you a backend URL like: https://your-app-name.up.railway.app

Test it immediately:

TRY IT NOW
$ curl https://your-app-name.up.railway.app/api/health
---

You should see: { "success": true, "timestamp": "..." }
If you do — your backend is live and the database is connected.

──────────────────────────────
STEP 3 — DEPLOY YOUR FRONTEND TO VERCEL
──────────────────────────────

Make sure your frontend build command works locally first:

TRY IT NOW
$ npm run build
---

If build fails locally, it will fail on Vercel too. Fix all errors before deploying.

Go to vercel.com → Add New Project → import your GitHub repo.

If your React app is inside a /frontend folder, set Framework Preset to Vite and Root Directory to frontend/.

Add environment variable in the Vercel dashboard:
  VITE_API_URL → https://your-app-name.up.railway.app/api

Deploy. Vercel gives you a URL like: https://mini-lead-manager.vercel.app

──────────────────────────────
STEP 4 — WIRE CORS FOR PRODUCTION
──────────────────────────────

Go back to Railway → Variables → update CLIENT_URL to your Vercel URL:
  CLIENT_URL → https://mini-lead-manager.vercel.app

This tells your Express cors() to allow requests from the live frontend. Without this, every API call from the live frontend gets blocked by CORS.

Railway redeploys automatically when environment variables change.

──────────────────────────────
STEP 5 — TEST THE LIVE APP END-TO-END
──────────────────────────────

Open your Vercel URL in the browser (not localhost):
  1. Register a new account
  2. Login with that account
  3. Create 2-3 leads
  4. Refresh the page — leads still there (database persisting)
  5. Open an incognito window — login with the same account — leads visible
  6. Try logging in with wrong password — should get "Invalid credentials"

If all of this works — you have successfully deployed a full-stack application to production.

──────────────────────────────
DEBUGGING PRODUCTION ISSUES — THE EXACT ORDER TO CHECK
──────────────────────────────

When something works locally but fails in production:

  1. Check environment variables first
     Are all of them set in the deployment dashboard? Spelling mistake in variable name = silent failure.

  2. Read the deployment logs
     Railway and Vercel both show build logs and runtime logs. Read the actual error — do not guess.

  3. Check CORS
     CLIENT_URL must be the live Vercel URL, not localhost. Even one wrong character blocks all requests.

  4. Check VITE_API_URL
     Must point to the live Railway URL, not http://localhost:5000.

  5. Check database migrations
     Did you run prisma migrate deploy on the production database? Tables may not exist.

  6. Test the health endpoint
     curl your-railway-url/api/health — if this fails, the backend is down or DATABASE_URL is wrong.

──────────────────────────────
RECORDING YOUR DEMO VIDEO (3 MINUTES)
──────────────────────────────

Structure your demo exactly like this — recruiters and reviewers watch many demos:

  00:00 – 00:30  Open the live Vercel URL in the browser. Show the address bar — it must not say localhost.
  00:30 – 01:00  Register a new account. Show the form, fill it, submit.
  01:00 – 01:30  Login with that account. Show the token in DevTools (Network tab).
  01:30 – 02:30  Create 3 leads. Then refresh — show leads still there. Then delete one.
  02:30 – 03:00  Open the Railway health URL in a new tab. Explain one technical decision briefly.

Tools: Loom (free, gives you a link instantly), OBS Studio, or your Mac/Windows screen recorder.

FINAL SUBMISSION CHECKLIST
☐ Frontend live on Vercel — URL shared in PR description
☐ Backend live on Railway — /api/health returns { success: true }
☐ Database on Neon/Supabase — not a local postgres
☐ Production migrations ran (prisma migrate deploy)
☐ Register works on the live app
☐ Login returns a JWT token
☐ Lead create persists on page refresh
☐ CORS configured — Vercel URL in CLIENT_URL on Railway
☐ README.md has live URLs and local setup instructions
☐ Demo video link in PR description (3 minutes)
☐ All 7 PRs (Day 1-7) visible on GitHub

COMMON MISTAKES
• Submitting localhost URL — no one else can open it, counts as not submitted
• VITE_API_URL still pointing to localhost in Vercel — frontend calls fail silently
• CLIENT_URL not updated in Railway after Vercel deploy — CORS blocks everything
• prisma migrate deploy not run — tables do not exist, every query returns 500
• JWT_SECRET different between local and production — works locally, 401 in production
• Waiting until the night before to deploy — deployment always has surprises, start early
`,

// ─── WEEK 1 CURRICULUM LESSONS ───────────────────────────────────────────────

'W1D1': `
WHAT YOU ARE BUILDING IN THIS PROGRAM
By the end of Week 12 you will have three deployed full-stack applications on your GitHub and 24+ merged pull requests. But it all starts from one project that grows with you:

  Weeks 1–4 — Foundation: Mini Lead Manager — your first Git repo, Express API, React UI, and JWT auth. Built from scratch, week by week.
  Weeks 5–6 — Restaurant Flow (fresh repo): Razorpay payments + Socket.io real-time orders. Customers order. Kitchen sees it live.
  Weeks 7–9 — Lead Bill (same repo as Mini Lead Manager, evolved): GST invoices, PDF export, Cloudinary uploads, deployed billing SaaS.
  Weeks 10–11 — ClientDesk AI (fresh repo): AI-powered support desk with Claude API drafts, multi-tenancy, and GitHub Actions CI/CD.
  Week 12 — Career: portfolio, resume, mock interviews, job prep.

The key thing: you are not practising exercises and then starting a project. You start the project on Day 1. Every week adds real features to something you already own.

──────────────────────────────────────────────────

WHAT IS THE TERMINAL?

The terminal is a text-based way to control your computer. Instead of clicking icons and folders, you type commands. Every professional developer uses it every single day.

Think of it like this: clicking "New Folder" in Windows Explorer is the exact same thing as typing a command in the terminal. But the terminal is faster, works on any computer in the world, and is how servers are controlled — servers that run websites don't have a mouse or a screen.

By the end of today, you will be comfortable enough with the terminal that it stops feeling scary. It is just a tool — like learning a keyboard shortcut for the first time.

──────────────────────────────────────────────────

HOW TO OPEN THE TERMINAL

On Mac: Press Cmd + Space, type "Terminal", press Enter.
On Windows: You will use Git Bash — we install it below. After installing, search "Git Bash" and open it.

When the terminal opens, you will see a blinking cursor. That means it is ready. Type a command and press Enter to run it.

──────────────────────────────────────────────────

THE 6 COMMANDS YOU NEED TODAY

You do not need to memorise hundreds of commands. These 6 are enough to navigate like a developer:

• pwd — Print Working Directory. Shows you where you are right now.
• ls — List. Shows all files and folders inside the current folder.
• cd foldername — Change Directory. Move into a folder.
• cd .. — Go back one folder. The two dots mean "parent folder".
• mkdir foldername — Make Directory. Creates a new folder.
• touch filename — Creates a new empty file.

Let's practice all of them right now.

TRY IT NOW
$ pwd
---

This prints something like /Users/yourname on Mac or /c/Users/yourname on Windows. That is your current location — the same as what you see in your file explorer.

TRY IT NOW
$ ls
---

You will see a list of your files and folders. This is your home directory.

TRY IT NOW
$ mkdir mini-lead-manager
$ cd mini-lead-manager
$ pwd
---

You just created a folder called mini-lead-manager and moved inside it. pwd confirms your new location.

TRY IT NOW
$ touch notes.txt
$ ls
---

You created an empty file. ls confirms it exists.

TRY IT NOW
$ cd ..
$ pwd
---

cd .. moved you back up one level to the folder above.

──────────────────────────────────────────────────

WHAT IS GIT?

Git is version control software. It tracks every change you make to your code over time.

Imagine you are writing a 5,000 word document and you accidentally delete 1,000 words. Without version control, they are gone forever. With Git, you can go back to any previous saved version.

At every company in the world — small startup or big product company — developers use Git. It is not optional. It is how teams work together without breaking each other's code.

The key idea: Git takes snapshots of your code. Each snapshot is called a commit. You decide when to take a snapshot and what message to attach to it. Those messages become the history of your project.

──────────────────────────────────────────────────

INSTALLING GIT

On Mac, Git is usually already installed. Check by running:

TRY IT NOW
$ git --version
---

If you see something like git version 2.39.0, you are good.

On Windows, go to git-scm.com, download the installer, and run it. During the install, choose "Git Bash" as the terminal. After install, open Git Bash and run git --version to confirm.

──────────────────────────────────────────────────

SETTING UP GIT — DO THIS ONCE

Before Git can track your work, it needs to know your name and email. Run these two commands. Replace the values with your own name and email:

TRY IT NOW
$ git config --global user.name "Your Name"
$ git config --global user.email "you@example.com"
---

This is a one-time setup on each computer. Git will attach your name and email to every commit you make.

──────────────────────────────────────────────────

YOUR FIRST GIT REPOSITORY

A repository (repo) is just a folder that Git is tracking. Let's create one.

TRY IT NOW
$ cd mini-lead-manager
$ git init
---

You will see: Initialized empty Git repository in .../mini-lead-manager/.git/

Git created a hidden .git folder inside your project. That folder is where Git stores all its data. You never touch it directly.

──────────────────────────────────────────────────

THE GIT WORKFLOW — 4 STEPS YOU WILL DO EVERY DAY

Memorise this pattern. You will use it hundreds of times:

1. Make changes to your files
2. git add — tell Git which changes to include in the next snapshot
3. git commit — take the snapshot with a message describing what you did
4. git push — upload the snapshot to GitHub so it is saved online

Let's do all 4 steps right now.

Step 1 — Create a file to track:

TRY IT NOW
$ touch README.md
---

Step 2 — Check what Git sees:

TRY IT NOW
$ git status
---

Git tells you README.md is "untracked" — it sees the file, but it is not tracking it yet.

Step 3 — Stage the file (tell Git to include it):

TRY IT NOW
$ git add README.md
---

Run git status again. Now it says "Changes to be committed". The file is staged and ready for the snapshot.

Step 4 — Take the snapshot (commit):

TRY IT NOW
$ git commit -m "Add README"
---

The -m flag is your commit message. Keep messages short and specific.
Bad: "stuff". Bad: "changes". Good: "Add README". Good: "Fix login bug".

You just took your first Git snapshot. It is saved locally on your computer.

──────────────────────────────────────────────────

SETTING UP YOUR GITHUB ACCOUNT

Git runs on your computer. GitHub is the website that stores your code online so the world can see it — and so you never lose it even if your laptop dies.

1. Go to github.com and create a free account.
2. Choose a professional username — this is your developer identity. Recruiters will see it. Use your real name or a clean version of it.
3. Verify your email address.

──────────────────────────────────────────────────

CONNECTING YOUR COMPUTER TO GITHUB WITH AN SSH KEY

To push code from your terminal to GitHub, you need to prove your computer is allowed to. We do this with an SSH key — think of it like a key card. Your computer holds the key, GitHub holds the lock.

Step 1 — Generate the key pair:

TRY IT NOW
$ ssh-keygen -t ed25519 -C "you@example.com"
---

Press Enter three times (accept the default file location, and skip the passphrase for now).

This creates two files in your ~/.ssh/ folder:
• id_ed25519 — your private key. Never share this with anyone.
• id_ed25519.pub — your public key. This goes on GitHub.

Step 2 — Copy your public key:

TRY IT NOW
$ cat ~/.ssh/id_ed25519.pub
---

Select everything that prints and copy it. It starts with ssh-ed25519 and ends with your email address.

Step 3 — Add it to GitHub:
Go to github.com → click your profile photo → Settings → SSH and GPG keys → New SSH key.
Give it a title like "My Laptop". Paste what you copied. Click Add SSH key.

Step 4 — Test the connection:

TRY IT NOW
$ ssh -T git@github.com
---

If it says "Hi yourusername! You've successfully authenticated" — you are connected. If it says permission denied, check that you pasted the correct .pub key.

──────────────────────────────────────────────────

PUSHING YOUR FIRST COMMIT TO GITHUB

Step 1 — Create a new repository on GitHub:
Go to github.com → click the + icon at the top right → New repository.
Name it mini-lead-manager. Set it to Public. Do NOT tick "Add a README file" — we already have one locally.
Click Create repository.

Step 2 — Link your local folder to GitHub and push:

TRY IT NOW
$ git remote add origin git@github.com:yourusername/mini-lead-manager.git
$ git branch -M main
$ git push -u origin main
---

Replace yourusername with your actual GitHub username.

If it worked, you will see output ending with:
Branch 'main' set up to track remote branch 'main' from 'origin'.

Now open github.com/yourusername/mini-lead-manager in your browser. Your README.md is there. Your first commit is live on GitHub.

──────────────────────────────────────────────────

OPENING YOUR FIRST PULL REQUEST

A pull request (PR) is how developers propose changes. You create a separate branch, make changes on it, then open a PR to ask for those changes to be reviewed and merged. This is the most important workflow in professional development — you will do it every day at DevForge.

Step 1 — Create a new branch:

TRY IT NOW
$ git checkout -b feat/add-about-section
---

git checkout -b creates a new branch and switches to it. The name follows the convention: type/short-description. Common types: feat (new feature), fix (bug fix), chore (cleanup).

Step 2 — Add some content to your README. Open README.md in any text editor (Notepad, VS Code, anything) and paste this:

CODE EXAMPLE
# DevForge Practice

This is my practice repository for the DevForge program.

## About Me

I am learning full-stack development — JavaScript, Node.js, React, and PostgreSQL.
By Week 10, I will have 3 deployed applications on my GitHub.
---

Step 3 — Commit the change:

TRY IT NOW
$ git add README.md
$ git commit -m "Add about section to README"
---

Step 4 — Push the branch to GitHub:

TRY IT NOW
$ git push -u origin feat/add-about-section
---

Step 5 — Open the pull request:
Go to your GitHub repository. You will see a yellow banner: "feat/add-about-section had recent pushes — Compare & pull request". Click that button.

Write a clear title: Add about section to README
Write a short description: Added an About Me section with learning goals.
Click Create pull request.

That is your first pull request. In the DevForge program, every piece of work you do will go through a PR. It gets reviewed, you fix any issues, and then it gets merged. This is exactly how real teams work.

──────────────────────────────────────────────────

TODAY'S CHECKLIST

Before you move to Day 2, go through each item below:

☐ Terminal opens and pwd, ls, cd, mkdir, touch all work correctly
☐ Git is installed — git --version shows a version number
☐ Name and email configured — git config --global user.name and user.email done
☐ GitHub account created with a professional username
☐ SSH key generated and added to GitHub — ssh -T git@github.com says "successfully authenticated"
☐ mini-lead-manager repository created on GitHub
☐ README.md committed and pushed — visible at github.com/yourusername/mini-lead-manager
☐ First pull request opened with the feat/add-about-section branch

All 8 checked? You are ready for Day 2.
If any are not checked, finish them before moving forward. Day 2 builds directly on today.

──────────────────────────────────────────────────

COMMON ERRORS AND HOW TO FIX THEM

Permission denied (publickey) when pushing
Your SSH key is not set up correctly. Run ssh -T git@github.com to test. If it fails, make sure you added the id_ed25519.pub file (not the private one) to GitHub.

fatal: remote origin already exists
Run git remote remove origin first, then add it again with the correct URL.

nothing to commit, working tree clean
Git has nothing new to snapshot. You need to make a change to a file, then run git add and git commit again.

Your branch is ahead of 'origin/main' by 1 commit
This is not an error. It means you have local commits that haven't been pushed. Run git push.

I accidentally committed to main instead of a branch
Run git checkout -b feat/my-branch-name. Your commit moves with you to the new branch.
`,

// ─── WEEK 2 LESSONS ──────────────────────────────────────────────────────────

'W2D1': `
NODE.JS AND npm
Last week you wrote JavaScript in the browser. Today you learn to run JavaScript on a server using Node.js — this unlocks everything: building APIs, reading files, talking to databases, and deploying code to the cloud.

This is the foundation of your entire backend. Week 2 builds on today.

──────────────────────────────
WHAT IS NODE.JS?
──────────────────────────────

Node.js is a runtime that lets you run JavaScript outside the browser. Before Node.js (2009), JavaScript could only run in a browser tab. Now the same language runs on servers, in CI pipelines, in CLI tools, and in serverless functions.

Why this matters for you:
  • One language — you already know JavaScript. Node.js means you use it everywhere.
  • Massive ecosystem — npm has 2.5 million packages. Almost anything you need already exists.
  • Non-blocking I/O — Node.js is built for handling many network requests efficiently (the same async model you learned on Day 4 is how Node.js works internally).
  • Used everywhere — Razorpay, Zerodha, Swiggy, Notion, LinkedIn, Netflix all run significant Node.js workloads.

Node.js is not a framework. It is a runtime — the engine that executes JavaScript files on your machine.

──────────────────────────────
INSTALLING AND VERIFYING NODE.JS
──────────────────────────────

TRY IT NOW
$ node --version
$ npm --version
---

If node is not found, install it from nodejs.org — download the LTS version (Long Term Support). LTS is the stable version used in production. Never install the "Current" version for backend development.

Node comes with npm bundled. You get both in one install.

──────────────────────────────
RUNNING JAVASCRIPT WITH NODE
──────────────────────────────

Any .js file can be run directly with node. No browser required.

TRY IT NOW
$ mkdir node-practice && cd node-practice
$ touch index.js
---

Open index.js and add:

CODE EXAMPLE
// index.js
const name    = "DevForge"
const version = 2

console.log(\`\${name} backend v\${version}\`)
console.log("Current time:", new Date().toISOString())

const leads = [
  { name: "Ravi",  status: "NEW"       },
  { name: "Priya", status: "CONTACTED" },
  { name: "Rahul", status: "CLOSED"    },
]

const newLeads = leads.filter(l => l.status === "NEW")
console.log("New leads:", newLeads.length)
---

TRY IT NOW
$ node index.js
---

Everything from Week 1 works exactly the same. The difference: this runs on a server, not in a browser. No DOM, no window, no document — just pure JavaScript logic.

──────────────────────────────
THE NODE.JS REPL — INSTANT EXPERIMENTATION
──────────────────────────────

Node has a REPL (Read-Eval-Print Loop) — an interactive console just like the browser DevTools console, but in your terminal.

TRY IT NOW
$ node
---

You are now inside the Node REPL. The prompt changes to >.

TRY IT NOW
> 2 + 2
> const arr = [1, 2, 3, 4, 5]
> arr.filter(n => n % 2 === 0)
> arr.reduce((sum, n) => sum + n, 0)
> new Date().toISOString()
> .exit
---

Use the REPL to test a function or expression before putting it in a file. Press Ctrl+C twice or type .exit to leave.

──────────────────────────────
WHAT IS npm?
──────────────────────────────

npm (Node Package Manager) is the tool that installs and manages packages — reusable code written by other developers. Every tool you use in this program is an npm package:

  express       → web framework for building APIs
  prisma        → database ORM
  axios         → HTTP client
  jsonwebtoken  → JWT signing and verification
  bcryptjs      → password hashing
  cors          → CORS middleware
  dotenv        → load .env files into process.env
  nodemon       → auto-restarts server on file save

Instead of writing all of this from scratch, you install a battle-tested package in seconds.

──────────────────────────────
INITIALISING A NODE PROJECT — package.json
──────────────────────────────

Every Node.js project starts with package.json. It records the project name, scripts, and every installed dependency.

TRY IT NOW
$ npm init -y
---

The -y flag accepts all defaults. Open the generated package.json:

CODE EXAMPLE
{
  "name": "node-practice",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {},
  "devDependencies": {}
}
---

  name, version    → project identity
  scripts          → shortcuts for terminal commands
  dependencies     → packages needed in production
  devDependencies  → packages only needed during development (nodemon, jest)

──────────────────────────────
INSTALLING PACKAGES
──────────────────────────────

TRY IT NOW
$ npm install axios
$ npm install --save-dev nodemon
---

After running this, three things happen:
  1. node_modules/ folder is created — contains the installed packages (never commit this)
  2. package.json is updated — axios appears in "dependencies", nodemon in "devDependencies"
  3. package-lock.json is created — exact version of every package, for reproducible installs

Always add node_modules to .gitignore immediately:

TRY IT NOW
$ echo "node_modules/" >> .gitignore
$ echo ".env" >> .gitignore
---

node_modules can be hundreds of MB. Anyone who clones your repo runs npm install to regenerate it. They do not need it in Git.

──────────────────────────────
npm SCRIPTS — SHORTCUTS FOR YOUR TEAM
──────────────────────────────

Scripts in package.json are commands your whole team runs the same way. Instead of remembering "node src/server.js", everyone runs "npm run dev".

CODE EXAMPLE
{
  "scripts": {
    "start": "node src/server.js",
    "dev":   "nodemon src/server.js"
  }
}
---

TRY IT NOW
$ npm run start
---

npm run <name> executes whatever command is in that script. This is how every project in this program is started.

──────────────────────────────
NODE.JS BUILT-IN MODULES
──────────────────────────────

Node comes with built-in modules — no installation needed. You access them with require().

fs — file system, read and write files:

TRY IT NOW
$ node
> const fs = require('fs')
> fs.writeFileSync('test.txt', 'Hello from Node.js')
> const content = fs.readFileSync('test.txt', 'utf-8')
> console.log(content)
> .exit
---

path — handle file paths correctly across Mac, Windows, Linux:

CODE EXAMPLE
const path = require('path')

const fullPath = path.join(__dirname, 'src', 'server.js')
console.log(fullPath)
// → /Users/yourname/project/src/server.js

const ext = path.extname('server.js')
console.log(ext) // → .js
---

__dirname is a Node.js global that gives the absolute path to the current file's directory. You will use path.join(__dirname, ...) constantly in backend code to build file paths that work on any operating system.

os — operating system information:

TRY IT NOW
$ node
> const os = require('os')
> console.log(os.platform())
> console.log(os.hostname())
> console.log(Math.round(os.freemem() / 1024 / 1024) + " MB free")
> .exit
---

http — the built-in HTTP server module (you will use Express instead, but understanding this helps):

CODE EXAMPLE
// Without Express — raw Node.js HTTP
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Hello from raw Node.js' }))
})

server.listen(3000, () => console.log('Server on port 3000'))
---

TRY IT NOW
$ node index.js
---

Open http://localhost:3000 — it works. This is what Express wraps: raw Node.js HTTP. Express adds routing, middleware, and a cleaner API on top. Day 2 replaces this with Express.

──────────────────────────────
PROCESS AND ENVIRONMENT VARIABLES
──────────────────────────────

process is a global Node.js object — no require needed. It gives you information about the running process and access to environment variables.

TRY IT NOW
$ node
> process.platform
> process.version
> process.cwd()
> process.env.PATH.split(':').slice(0, 3)
> .exit
---

process.env is how your backend reads secrets from the .env file. Without dotenv, you would set environment variables in the terminal manually. With dotenv, you put them in a file:

TRY IT NOW
$ npm install dotenv
---

CODE EXAMPLE
// Create .env in your project root
PORT=5000
DATABASE_URL=postgresql://localhost/mydb
JWT_SECRET=supersecretkey123
---

CODE EXAMPLE
// At the very top of your entry file — before anything else
require('dotenv').config()

const PORT = process.env.PORT || 5000
console.log("Starting on port:", PORT)
console.log("DB URL set:", !!process.env.DATABASE_URL)
---

TRY IT NOW
$ node index.js
---

Rule: require('dotenv').config() must be the very first line of your entry file. If any other module runs before it and reads process.env, the values will be undefined.

──────────────────────────────
COMMONJS vs ES MODULES IN NODE
──────────────────────────────

Node.js has two module systems. You need to recognise both.

CommonJS — the original Node.js standard (what you will use for the backend in this program):
  const express = require('express')
  module.exports = router

ES Modules — the modern standard (used in React/Vite frontend):
  import express from 'express'
  export default router

You can use ES Modules in Node.js by adding "type": "module" to package.json, but CommonJS is still the dominant standard for Express backends and has better tooling compatibility. Stick with require/module.exports for all backend code in this program.

──────────────────────────────
NODEMON — AUTO-RESTART ON SAVE
──────────────────────────────

During development, every time you change a .js file you would need to stop the server (Ctrl+C) and restart it manually. Nodemon watches for file changes and restarts automatically.

CODE EXAMPLE
// package.json — add this script
{
  "scripts": {
    "dev":   "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
---

TRY IT NOW
$ npm run dev
---

Change anything in index.js and save. Watch the terminal — nodemon restarts the server in under a second. Use npm run dev during development. Use npm start in production (nodemon is a devDependency, not installed in production environments).

──────────────────────────────
THE BACKEND FOLDER STRUCTURE — SET THIS UP NOW
──────────────────────────────

Before writing a single route, create the proper folder structure. Changing this halfway through a project is painful.

TRY IT NOW
$ mkdir -p src/routes src/middleware src/lib
$ touch src/server.js .env .gitignore
---

The structure you will use for every backend in this program:

  backend/
    src/
      routes/       → one file per feature: leads.js, auth.js, users.js
      middleware/   → reusable middleware: auth.js, errorHandler.js
      lib/          → shared clients: prisma.js, mailer.js
      server.js     → Express setup only — no business logic here
    prisma/
      schema.prisma → database model definitions
    .env            → secrets (never commit)
    .gitignore      → at minimum: node_modules/, .env
    package.json

src/server.js has one job: wire Express, middleware, and routes together. It does not contain route logic. Each feature gets its own file in routes/.

──────────────────────────────
CHECKING YOUR UNDERSTANDING
──────────────────────────────

Before Day 2, make sure you can answer these:
  • What is the difference between Node.js and a browser?
  • What does npm install do — where do the packages go?
  • Why is node_modules in .gitignore?
  • What does require('dotenv').config() actually do?
  • What is the difference between npm run dev and npm start?
  • What is __dirname and why is path.join better than string concatenation for file paths?

If any of these feel unclear, re-run the exercises above before moving on.

SUBMISSION CHECKLIST
☐ node --version and npm --version both show version numbers
☐ node index.js runs without errors
☐ npm init -y creates package.json
☐ npm install axios adds it to dependencies
☐ nodemon installed as a devDependency, dev script in package.json
☐ .gitignore contains node_modules/ and .env
☐ process.env reads values from .env via dotenv
☐ Backend folder structure created: src/routes/, src/middleware/, src/lib/, src/server.js
☐ PR: feat/day-1-nodejs-setup

COMMON MISTAKES
• Installing nodemon as a regular dependency — it belongs in devDependencies: npm install --save-dev nodemon
• Committing node_modules — always add to .gitignore before the first commit
• require('dotenv').config() not at the top — other modules load before .env is parsed, process.env values are undefined
• Confusing npm run dev (nodemon) with npm start (node) — never run nodemon in production
• Putting all code in one file — create the folder structure on Day 1, not Day 5
• Using import/export syntax in a CommonJS Node project — stick to require/module.exports for the backend
`,

// ─────────────────────────────────────────────────────────────────────────────

'W2D2': `
EXPRESS AND ROUTES
Yesterday you ran a raw Node.js HTTP server. Today you replace it with Express — the framework used by almost every Node.js backend in production. Express gives you clean routing, middleware, and a structure that scales from a single route to hundreds.

By the end of today you will have a complete, structured Express server with real CRUD routes for leads — tested end-to-end in Postman.

──────────────────────────────
WHY EXPRESS?
──────────────────────────────

Raw Node.js HTTP works, but writing every route handler from scratch is painful:

  // Raw Node.js — route logic tangled with response logic
  if (req.method === 'GET' && req.url === '/api/leads') { ... }
  if (req.method === 'POST' && req.url === '/api/leads') { ... }

Express gives you a clean API for the same thing:

  router.get('/leads',  (req, res) => { ... })
  router.post('/leads', (req, res) => { ... })

Express is not magic — it is a thin layer on top of the raw http module you saw yesterday. Understanding raw Node.js first means you know exactly what Express is saving you from.

──────────────────────────────
SETTING UP EXPRESS FROM SCRATCH
──────────────────────────────

TRY IT NOW
$ mkdir backend && cd backend
$ npm init -y
$ npm install express cors dotenv
$ npm install --save-dev nodemon
$ mkdir -p src/routes src/middleware src/lib
$ touch src/server.js .env .gitignore
$ echo "node_modules/" >> .gitignore
$ echo ".env" >> .gitignore
---

Add scripts to package.json:

CODE EXAMPLE
{
  "scripts": {
    "dev":   "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
---

Add to .env:

CODE EXAMPLE
PORT=5000
CLIENT_URL=http://localhost:5173
---

──────────────────────────────
THE SERVER FILE — WIRING EVERYTHING TOGETHER
──────────────────────────────

src/server.js has one job: set up Express, register middleware, mount routes, and start listening. No business logic lives here.

CODE EXAMPLE
// src/server.js
require('dotenv').config()

const express = require('express')
const cors    = require('cors')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() })
})

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`)
})
---

TRY IT NOW
$ npm run dev
---

Open http://localhost:5000/api/health in your browser. You should see JSON. If you do — Express is running. Every backend in this program starts with this health check.

──────────────────────────────
HOW MIDDLEWARE WORKS
──────────────────────────────

Middleware is a function that runs on every request before it reaches your route handler. Express processes each request through a pipeline of middleware functions in the order you register them.

  Request → cors() → express.json() → authenticate() → route handler → Response

Each middleware function receives (req, res, next):
  • req  → the incoming request (headers, body, params, query)
  • res  → the response you will send back
  • next → call this to pass control to the next middleware

CODE EXAMPLE
// A simple logging middleware
function logger(req, res, next) {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`)
  next() // must call next() or the request hangs forever
}

app.use(logger) // runs on every request
---

The two middleware you always need:

app.use(cors(...))      → allows the browser to call your API from a different port
app.use(express.json()) → parses the JSON body into req.body — without this, req.body is always undefined

Order matters. Register middleware before routes. If you put express.json() after your routes, req.body will be undefined in all of them.

──────────────────────────────
ROUTING — THE CORE OF EXPRESS
──────────────────────────────

A route maps an HTTP method + URL path to a handler function.

  app.METHOD(PATH, HANDLER)

  app.get('/api/leads',     handler) → GET  /api/leads
  app.post('/api/leads',    handler) → POST /api/leads
  app.patch('/api/leads/:id', handler) → PATCH /api/leads/123
  app.delete('/api/leads/:id', handler) → DELETE /api/leads/123

Request object — what comes IN:
  req.body    → parsed JSON body (POST/PATCH requests)
  req.params  → URL parameters: /leads/:id → req.params.id
  req.query   → query string: /leads?status=NEW → req.query.status
  req.headers → request headers including Authorization

Response methods — what goes OUT:
  res.json(data)           → sends JSON, sets Content-Type automatically
  res.status(404).json({}) → sets status code then sends JSON
  res.send('text')         → sends plain text
  res.status(204).end()    → no body (used for DELETE success sometimes)

──────────────────────────────
EXPRESS ROUTER — ONE FILE PER FEATURE
──────────────────────────────

Putting all routes in server.js works for one or two routes. A real app has dozens. Express Router lets you split routes into separate files.

CODE EXAMPLE
// src/routes/leads.js
const express = require('express')
const router  = express.Router()

let leads = [] // in-memory for today — replaced with Prisma on Day 4

// GET /api/leads — fetch all
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Leads fetched', data: leads })
})

// GET /api/leads/:id — fetch one
router.get('/:id', (req, res) => {
  const lead = leads.find(l => l.id === req.params.id)
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found', data: null })
  }
  res.json({ success: true, message: 'Lead fetched', data: lead })
})

// POST /api/leads — create
router.post('/', (req, res) => {
  const { name, phone, service } = req.body

  if (!name || !phone || !service) {
    return res.status(400).json({
      success: false,
      message: 'name, phone, and service are required',
      data: null
    })
  }

  const lead = {
    id:        Date.now().toString(),
    name,
    phone,
    service,
    status:    'NEW',
    createdAt: new Date().toISOString()
  }
  leads.push(lead)
  res.status(201).json({ success: true, message: 'Lead created', data: lead })
})

// PATCH /api/leads/:id — update status
router.patch('/:id', (req, res) => {
  const lead = leads.find(l => l.id === req.params.id)
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found', data: null })
  }
  const { status } = req.body
  const allowed = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED']
  if (status && !allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: \`status must be one of: \${allowed.join(', ')}\`,
      data: null
    })
  }
  if (status) lead.status = status
  res.json({ success: true, message: 'Lead updated', data: lead })
})

// DELETE /api/leads/:id — delete
router.delete('/:id', (req, res) => {
  const before = leads.length
  leads = leads.filter(l => l.id !== req.params.id)
  if (leads.length === before) {
    return res.status(404).json({ success: false, message: 'Lead not found', data: null })
  }
  res.json({ success: true, message: 'Lead deleted', data: null })
})

module.exports = router
---

Now mount the router in server.js:

CODE EXAMPLE
// src/server.js — add after the health check route
const leadsRouter = require('./routes/leads')
app.use('/api/leads', leadsRouter)
---

When you mount with app.use('/api/leads', leadsRouter), every route inside leads.js is relative to /api/leads. So router.get('/') becomes GET /api/leads, and router.get('/:id') becomes GET /api/leads/:id.

──────────────────────────────
THE STANDARD RESPONSE FORMAT — USE THIS EVERYWHERE
──────────────────────────────

Every API endpoint in this program returns the same shape:

  Success: { "success": true,  "message": "Lead created",      "data": { ...lead }  }
  Error:   { "success": false, "message": "Name is required",  "data": null         }

Why this matters: the frontend code that handles responses becomes uniform. Instead of guessing what shape each endpoint returns, every response is predictable. This is a team contract — break it in one route and the frontend breaks.

Pick this format once. Never deviate.

──────────────────────────────
HTTP STATUS CODES — USE THEM CORRECTLY
──────────────────────────────

Status codes are part of the API contract. Using the wrong code is a red flag in code review.

  200 OK           → GET, PATCH, DELETE succeeded
  201 Created      → POST succeeded — a new record was created
  400 Bad Request  → client sent invalid data (missing field, wrong format, failed validation)
  401 Unauthorized → request has no valid token or token expired
  403 Forbidden    → token is valid but user lacks permission (wrong role)
  404 Not Found    → the record does not exist
  409 Conflict     → request conflicts with existing data (duplicate email on register)
  500 Server Error → something broke on the backend — database down, unhandled exception

Never return 200 for a validation error. Never return 500 for missing input the client can fix. These two mistakes account for 90% of HTTP status misuse in student code.

──────────────────────────────
QUERY PARAMETERS — FILTERING AND SEARCHING
──────────────────────────────

Query parameters let the frontend filter data without creating separate endpoints.

  GET /api/leads?status=NEW
  GET /api/leads?search=Ravi
  GET /api/leads?status=NEW&search=Ravi

CODE EXAMPLE
router.get('/', (req, res) => {
  const { status, search } = req.query

  let result = leads

  if (status) {
    result = result.filter(l => l.status === status)
  }

  if (search) {
    const term = search.toLowerCase()
    result = result.filter(l =>
      l.name.toLowerCase().includes(term) ||
      l.phone.includes(term)
    )
  }

  res.json({ success: true, message: 'Leads fetched', data: result })
})
---

TRY IT NOW — test in Postman or browser:
  GET http://localhost:5000/api/leads?status=NEW
  GET http://localhost:5000/api/leads?search=ravi
---

──────────────────────────────
TESTING YOUR API IN POSTMAN
──────────────────────────────

Postman is the standard tool for testing API endpoints. Download it at postman.com if you have not already.

Test every endpoint in this exact order — confirm each one works before moving to the next:

  1. GET  http://localhost:5000/api/health
     Expected: 200, { success: true, timestamp: "..." }

  2. POST http://localhost:5000/api/leads
     Body (JSON): { "name": "Ravi Kumar", "phone": "9876543210", "service": "Web Dev" }
     Expected: 201, { success: true, data: { id: "...", status: "NEW", ... } }

  3. GET  http://localhost:5000/api/leads
     Expected: 200, array with the lead you just created

  4. GET  http://localhost:5000/api/leads/:id  (use the id from step 2)
     Expected: 200, single lead object

  5. PATCH http://localhost:5000/api/leads/:id
     Body: { "status": "CONTACTED" }
     Expected: 200, lead with updated status

  6. DELETE http://localhost:5000/api/leads/:id
     Expected: 200, { success: true, data: null }

  7. GET  http://localhost:5000/api/leads/:id  (same id as step 6)
     Expected: 404, { success: false, message: "Lead not found" }

  8. POST http://localhost:5000/api/leads  (missing name)
     Body: { "phone": "9876543210", "service": "Web Dev" }
     Expected: 400, { success: false, message: "name, phone, and service are required" }

All 8 pass? Your Express API is working correctly.

──────────────────────────────
ERROR HANDLING — THE CATCH-ALL
──────────────────────────────

When an unhandled error occurs in a route (database crash, bug in code), Express will either hang or send an ugly HTML error page. A global error handler catches everything cleanly.

CODE EXAMPLE
// src/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    data:    null
  })
}

module.exports = errorHandler
---

CODE EXAMPLE
// src/server.js — register AFTER all routes (this is required by Express)
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)
---

Now in any route, you can pass errors to this handler with next(err) instead of writing the same error response in every catch block:

CODE EXAMPLE
router.get('/', async (req, res, next) => {
  try {
    const leads = await prisma.lead.findMany()
    res.json({ success: true, message: 'Leads fetched', data: leads })
  } catch (err) {
    next(err) // passes to errorHandler middleware
  }
})
---

──────────────────────────────
THE 404 ROUTE — CATCH UNKNOWN PATHS
──────────────────────────────

If someone calls a path that doesn't exist on your API, Express returns an HTML "Cannot GET /unknown" page. Replace this with JSON.

CODE EXAMPLE
// src/server.js — register AFTER all routes, BEFORE errorHandler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: \`Route \${req.method} \${req.url} not found\`,
    data:    null
  })
})
---

──────────────────────────────
THE COMPLETE server.js — PRODUCTION STRUCTURE
──────────────────────────────

CODE EXAMPLE
require('dotenv').config()

const express     = require('express')
const cors        = require('cors')
const leadsRouter = require('./routes/leads')
const errorHandler = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() })
})

app.use('/api/leads', leadsRouter)

// ── 404 handler (after all routes) ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: \`Route \${req.method} \${req.url} not found\`, data: null })
})

// ── Global error handler (last middleware) ────────────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => console.log(\`Server on http://localhost:\${PORT}\`))
---

SUBMISSION CHECKLIST
☐ npm run dev starts the server without errors
☐ GET /api/health returns 200 with timestamp
☐ All 8 Postman tests pass (including 400 and 404 cases)
☐ Routes split into src/routes/leads.js — nothing in server.js except setup
☐ All responses use { success, message, data } format
☐ Correct status codes: 201 for create, 400 for bad input, 404 for missing record
☐ Global error handler and 404 handler registered after routes
☐ Query parameter filtering works: ?status=NEW and ?search=name
☐ PR: feat/day-2-express-routes — Postman screenshots for all 8 tests

COMMON MISTAKES
• Missing app.use(express.json()) — req.body is undefined for every POST/PATCH request
• Route registered before middleware — express.json() must come before routes
• All routes in server.js — split into src/routes/ immediately, failing code review
• Forgetting return before res.status(400) — execution continues and sends a second response, causing "Cannot set headers after they are sent" crash
• Wrong status codes: 200 for create (should be 201), 500 for bad input (should be 400)
• 404 handler registered before routes — every request returns 404
• errorHandler registered before routes — errors are never passed to it correctly
• Not testing error cases in Postman — only testing the happy path misses half the logic
`,

// ─────────────────────────────────────────────────────────────────────────────

'W2D3': `
POSTGRESQL AND PRISMA SETUP
The in-memory array from Day 2 disappears every time you restart the server. Today you fix that permanently by connecting a real database. But first — three concepts you need to understand clearly before writing a single line.

──────────────────────────────
WHAT IS A DATABASE? (IN PLAIN ENGLISH)
──────────────────────────────

A database is permanent storage for your app's data.

  • React state   → lives in the browser. Gone on refresh.
  • Server memory → lives in Node.js. Gone on restart.
  • Database      → lives on disk. Survives everything.

A lead you create today should exist tomorrow, after a deployment, after a server crash. Only a database guarantees that. Everything else is temporary.

──────────────────────────────
SQL VS NoSQL — THE SHORT VERSION
──────────────────────────────

There are two main types of databases. Here is the honest one-line version of each:

SQL (PostgreSQL, MySQL, SQLite)
  Data lives in tables with rows and columns — like a spreadsheet.
  Relationships between tables are enforced at the database level.
  The structure is defined before you insert any data.

  Use when: your data has clear relationships, correctness matters, you are building anything financial or user-facing.
  Examples: Razorpay, Zerodha, Swiggy orders, every banking system.

NoSQL (MongoDB, DynamoDB, Redis, Firestore)
  Data lives as flexible documents, key-value pairs, or graphs.
  No fixed structure — each record can have different fields.

  Use when: your data shape varies widely, you are caching, or you need to scale writes to millions per second.
  Examples: MongoDB for content/blogs, Redis for caching sessions, Firestore for mobile sync.

THE HONEST ANSWER FOR THIS PROGRAM:
Use PostgreSQL (SQL) for everything you build here. Your data has clear relationships (a Lead belongs to a User, an Invoice has many Items), and correctness is non-negotiable. NoSQL would be the wrong choice.

──────────────────────────────
WHAT IS POSTGRESQL?
──────────────────────────────

PostgreSQL is the most advanced open-source SQL database. It is what runs Spotify's playlists, Instagram's early backend, and almost every serious Indian fintech.

Four things it gives you for free that in-memory arrays cannot:
  • Persistence     — data survives restarts, crashes, and deployments
  • Unique constraints — the database refuses duplicate emails, not just your code
  • Foreign keys    — a Lead cannot reference a User that does not exist
  • Transactions    — multiple writes either all succeed or all fail together

──────────────────────────────
WHAT IS PRISMA?
──────────────────────────────

Prisma is an ORM (Object Relational Mapper). It sits between your Node.js code and PostgreSQL.

Without Prisma — raw SQL:
  db.query("INSERT INTO leads (name, phone, service) VALUES ($1, $2, $3)", [name, phone, service])

With Prisma — clean JavaScript:
  await prisma.lead.create({ data: { name, phone, service } })

Same result. Prisma also generates Prisma Studio — a visual browser UI for your database. Think of it as a spreadsheet view of your tables, zero configuration.

──────────────────────────────
INSTALLING POSTGRESQL LOCALLY
──────────────────────────────

Mac:
TRY IT NOW
$ brew install postgresql@16
$ brew services start postgresql@16
$ psql --version
---

Windows (WSL):
TRY IT NOW
$ sudo apt update && sudo apt install postgresql postgresql-contrib
$ sudo service postgresql start
$ psql --version
---

Create the database for your project:
TRY IT NOW
$ psql -U postgres
postgres=# CREATE DATABASE mini_lead_manager;
postgres=# \\q
---

If psql -U postgres gives "role does not exist", try: psql -U $(whoami)

──────────────────────────────
ADDING PRISMA TO YOUR BACKEND
──────────────────────────────

TRY IT NOW
$ npm install @prisma/client
$ npm install --save-dev prisma
$ npx prisma init
---

This creates two things:
  prisma/schema.prisma  → where you define your data models
  .env entry            → DATABASE_URL is added automatically

Update DATABASE_URL in your .env:

CODE EXAMPLE
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mini_lead_manager"
---

Format breakdown:
  postgresql://  → protocol
  postgres       → your PostgreSQL username
  yourpassword   → your PostgreSQL password (blank if none: postgresql://postgres@localhost...)
  localhost:5432 → host and port (5432 is the PostgreSQL default)
  mini_lead_manager → the database name you just created

──────────────────────────────
DEFINING YOUR DATA MODEL
──────────────────────────────

schema.prisma is where you define your tables. Prisma reads this file and creates the actual PostgreSQL tables for you.

CODE EXAMPLE
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Lead {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String?
  service   String
  budget    Int?
  status    String   @default("NEW")
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
---

Field types you will use:
  String   → any text
  Int      → whole number
  Float    → decimal number
  Boolean  → true/false
  DateTime → date and time

Modifiers:
  ?              → optional (can be null)
  @default(...)  → default value if not provided
  @id            → primary key
  @unique        → no duplicates allowed
  @updatedAt     → auto-updated on every change

──────────────────────────────
RUNNING YOUR FIRST MIGRATION
──────────────────────────────

A migration reads your schema and creates the actual tables in PostgreSQL. Every schema change after this creates a new migration file — a permanent history of how your database evolved.

TRY IT NOW
$ npx prisma migrate dev --name init_leads
---

You should see: "Your database is now in sync with your schema."

If you see an error about connection refused — PostgreSQL is not running. Start it first (brew services start postgresql@16 or sudo service postgresql start).

──────────────────────────────
PRISMA STUDIO — SEE YOUR DATABASE
──────────────────────────────

TRY IT NOW
$ npx prisma studio
---

Prisma Studio opens at http://localhost:5555. You will see the Lead table with all your columns. You can add, edit, and delete records directly — useful for checking your data during development.

Add a test record in Studio and verify it appears. Delete it after. Confirm the table structure matches your schema exactly.

──────────────────────────────
THE PRISMA CLIENT SINGLETON
──────────────────────────────

Never create a new PrismaClient in every route file. Each instance opens a new database connection pool. In production, you will exhaust the connection limit quickly.

Create it once, export it, import it everywhere:

CODE EXAMPLE
// src/lib/prisma.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma
---

CODE EXAMPLE
// In any route file — import the singleton
const prisma = require('../lib/prisma')
---

──────────────────────────────
REPLACING IN-MEMORY LEADS WITH PRISMA
──────────────────────────────

Now replace the let leads = [] array with real database queries. Every database operation is async — use await.

CODE EXAMPLE
// src/routes/leads.js
const express = require('express')
const router  = express.Router()
const prisma  = require('../lib/prisma')

// GET all leads
router.get('/', async (req, res, next) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, message: 'Leads fetched', data: leads })
  } catch (err) { next(err) }
})

// GET one lead
router.get('/:id', async (req, res, next) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    res.json({ success: true, message: 'Lead fetched', data: lead })
  } catch (err) { next(err) }
})

// POST create lead
router.post('/', async (req, res, next) => {
  const { name, phone, service, email, budget } = req.body
  if (!name || !phone || !service) {
    return res.status(400).json({ success: false, message: 'name, phone, and service are required', data: null })
  }
  try {
    const lead = await prisma.lead.create({
      data: { name, phone, service, email, budget: budget ? parseInt(budget) : null }
    })
    res.status(201).json({ success: true, message: 'Lead created', data: lead })
  } catch (err) { next(err) }
})

// PATCH update lead
router.patch('/:id', async (req, res, next) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data:  req.body
    })
    res.json({ success: true, message: 'Lead updated', data: lead })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    }
    next(err)
  }
})

// DELETE lead
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Lead deleted', data: null })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    }
    next(err)
  }
})

module.exports = router
---

P2025 is Prisma's error code for "record not found". Catch it to return a clean 404 instead of a 500.

──────────────────────────────
CONFIRMING IT WORKS — THE PERSISTENCE TEST
──────────────────────────────

This is the test that proves your database is working:

  1. POST /api/leads — create a lead
  2. GET /api/leads  — confirm it appears
  3. Stop the server (Ctrl+C)
  4. Start the server again (npm run dev)
  5. GET /api/leads  — lead is still there

If the lead survives a server restart, your database integration is working correctly. The in-memory array is gone forever.

──────────────────────────────
SCHEMA CHANGES — HOW TO UPDATE YOUR MODEL
──────────────────────────────

As your app grows, you will need to add or change fields. Never edit the database directly — always update schema.prisma and run a migration.

TRY IT NOW (example: add a "source" field to Lead)
$ // 1. Add \`source String?\` to your Lead model in schema.prisma
$ npx prisma migrate dev --name add_source_to_lead
$ npx prisma generate
---

npx prisma generate regenerates the Prisma Client after schema changes. If you skip it, your JavaScript code won't know the new field exists.

Run these two commands every time you change schema.prisma:
  npx prisma migrate dev --name describe_your_change
  npx prisma generate

──────────────────────────────
PRISMA CHEATSHEET
──────────────────────────────

  prisma.lead.findMany()                      → get all records
  prisma.lead.findMany({ where: { status: 'NEW' } })  → filter
  prisma.lead.findMany({ orderBy: { createdAt: 'desc' } }) → sort
  prisma.lead.findUnique({ where: { id } })   → get one by id
  prisma.lead.create({ data: { ... } })       → insert new record
  prisma.lead.update({ where: { id }, data: { ... } }) → update
  prisma.lead.delete({ where: { id } })       → delete
  prisma.lead.count()                         → total count
  prisma.lead.count({ where: { status: 'NEW' } }) → filtered count

SUBMISSION CHECKLIST
☐ PostgreSQL installed and running locally
☐ Database created (CREATE DATABASE mini_lead_manager)
☐ DATABASE_URL correct in .env — server connects without error
☐ Lead model defined in schema.prisma with all fields
☐ npx prisma migrate dev ran successfully
☐ Prisma Studio shows Lead table with correct columns
☐ src/lib/prisma.js exports the singleton client
☐ All routes use prisma — no in-memory array remains
☐ Persistence test passed: lead survives server restart
☐ PR: feat/day-3-postgresql-prisma — Prisma Studio screenshot + Postman tests

COMMON MISTAKES
• Wrong DATABASE_URL — copy the format exactly, check username/password/db name character by character
• @ or # in DB password not URL-encoded — @ becomes %40, # becomes %23
• new PrismaClient() in every route file — use the singleton in src/lib/prisma.js
• Skipping npx prisma generate after schema changes — the JS client is stale and won't know new fields
• Editing the database directly in Prisma Studio instead of migrating — schema and DB go out of sync
• Not handling P2025 (record not found) — Prisma throws on .update() or .delete() when record missing
`,

// ─────────────────────────────────────────────────────────────────────────────

'W2D4': `
FULL CRUD WITH PRISMA
Before writing any code today — let's answer the question that stops most students: why are we using Prisma at all? You already know JavaScript. PostgreSQL speaks SQL. Why add another tool in between?

──────────────────────────────
WHY PRISMA EXISTS — THE HONEST ANSWER
──────────────────────────────

Your Express routes need to read and write data in PostgreSQL. You have two options:

OPTION 1 — Raw SQL (without Prisma):
  db.query("SELECT * FROM leads WHERE status = $1 ORDER BY created_at DESC", ['NEW'])
  db.query("INSERT INTO leads (name, phone, service, status) VALUES ($1, $2, $3, $4)", [name, phone, service, 'NEW'])

OPTION 2 — Prisma:
  prisma.lead.findMany({ where: { status: 'NEW' }, orderBy: { createdAt: 'desc' } })
  prisma.lead.create({ data: { name, phone, service } })

Same result. Prisma generates the SQL for you.

What you gain with Prisma:
  • No SQL strings — typos in SQL strings crash at runtime, not at write time
  • Autocomplete — your editor knows every field on every model
  • JavaScript objects in, JavaScript objects out — no manual row mapping
  • Prisma Studio — visual table browser, free
  • Schema as source of truth — one file defines your entire database structure
  • Error codes — P2025 (not found), P2002 (duplicate) instead of parsing SQL error strings

What Prisma is NOT:
  Prisma is not magic. It is a translator: your JavaScript ↔ SQL.
  It does not replace understanding what your database is doing.
  Every prisma.lead.findMany() call runs a real SELECT statement.
  Understanding what query Prisma generates helps you debug slow APIs.

Today you use every Prisma operation in a real API: read, filter, sort, create, update, delete, count. These patterns repeat in every project you build from here.

──────────────────────────────
THE FIVE PRISMA OPERATIONS YOU WILL USE EVERY DAY
──────────────────────────────

Here are the core operations — get these five into muscle memory.

findMany — get a list:
TRY IN CONSOLE
> // All leads
> await prisma.lead.findMany()
>
> // With filter
> await prisma.lead.findMany({ where: { status: 'NEW' } })
>
> // With sort
> await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
>
> // With both
> await prisma.lead.findMany({
>   where:   { status: 'NEW' },
>   orderBy: { createdAt: 'desc' }
> })
---

findUnique — get exactly one record by its unique field:
TRY IN CONSOLE
> await prisma.lead.findUnique({ where: { id: 'some-id' } })
> // Returns null if not found — never throws
---

create — insert a new record:
TRY IN CONSOLE
> await prisma.lead.create({
>   data: { name: 'Ravi Kumar', phone: '9876543210', service: 'Web Dev' }
> })
> // Returns the full saved record including id, createdAt, updatedAt
---

update — change fields on an existing record:
TRY IN CONSOLE
> await prisma.lead.update({
>   where: { id: 'some-id' },
>   data:  { status: 'CONTACTED', notes: 'Called on Monday' }
> })
> // Throws P2025 if record not found
---

delete — remove a record permanently:
TRY IN CONSOLE
> await prisma.lead.delete({ where: { id: 'some-id' } })
> // Throws P2025 if record not found
---

──────────────────────────────
FILTERING — WHERE CLAUSE
──────────────────────────────

The where option maps directly to SQL WHERE. Prisma gives you comparison operators for every field type.

CODE EXAMPLE
// Exact match
prisma.lead.findMany({ where: { status: 'NEW' } })

// Multiple conditions — AND (both must be true)
prisma.lead.findMany({
  where: { status: 'NEW', service: 'Web Dev' }
})

// OR — at least one must be true
prisma.lead.findMany({
  where: {
    OR: [
      { status: 'NEW' },
      { status: 'CONTACTED' }
    ]
  }
})

// Contains — partial string match (like SQL LIKE %term%)
prisma.lead.findMany({
  where: {
    name: { contains: 'ravi', mode: 'insensitive' }
  }
})

// Number comparison
prisma.lead.findMany({
  where: { budget: { gte: 10000 } }  // budget >= 10000
})
// Other operators: lt (less than), lte, gt, gte, not, in, notIn
---

TRY IT NOW — add a search endpoint to your leads router:

CODE EXAMPLE
router.get('/', async (req, res, next) => {
  try {
    const { status, search, minBudget } = req.query

    const where = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name:    { contains: search, mode: 'insensitive' } },
        { phone:   { contains: search } },
        { service: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minBudget) {
      where.budget = { gte: parseInt(minBudget) }
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, message: 'Leads fetched', data: leads })
  } catch (err) { next(err) }
})
---

Test in Postman:
  GET /api/leads?status=NEW
  GET /api/leads?search=ravi
  GET /api/leads?minBudget=10000
  GET /api/leads?status=NEW&search=kumar

──────────────────────────────
PAGINATION — SKIP AND TAKE
──────────────────────────────

Real apps never return all records at once. A table with 10,000 leads would crash the browser and take seconds to load. Pagination returns a small page at a time.

CODE EXAMPLE
router.get('/', async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const skip  = (page - 1) * limit

    const [leads, total] = await prisma.$transaction([
      prisma.lead.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.lead.count()
    ])

    res.json({
      success: true,
      message: 'Leads fetched',
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (err) { next(err) }
})
---

prisma.$transaction([...]) runs both queries in one round-trip to the database — faster than two separate awaits.

Test in Postman:
  GET /api/leads?page=1&limit=5
  GET /api/leads?page=2&limit=5

──────────────────────────────
SELECT — RETURN ONLY THE FIELDS YOU NEED
──────────────────────────────

By default Prisma returns every field. In a real app, some fields are large or sensitive. select lets you pick exactly what to return.

CODE EXAMPLE
// Return only id, name, status — not phone, email, notes
const leads = await prisma.lead.findMany({
  select: {
    id:        true,
    name:      true,
    status:    true,
    service:   true,
    createdAt: true
  }
})
---

This is important when a model has a passwordHash field — never return it to the frontend. With select, you control exactly what leaves the backend.

──────────────────────────────
UPSERT — CREATE OR UPDATE IN ONE CALL
──────────────────────────────

upsert checks if a record exists. If it does — update it. If it does not — create it. Useful for syncing data.

CODE EXAMPLE
const lead = await prisma.lead.upsert({
  where:  { phone: '9876543210' },
  update: { status: 'CONTACTED' },
  create: { name: 'Ravi Kumar', phone: '9876543210', service: 'Web Dev' }
})
---

──────────────────────────────
HANDLING PRISMA ERROR CODES
──────────────────────────────

Prisma throws structured errors with a code property. Handle them specifically instead of catching everything as a 500.

  P2025 → Record not found (update or delete on missing id)
  P2002 → Unique constraint failed (duplicate email, duplicate phone)
  P2003 → Foreign key constraint failed (referenced record does not exist)

CODE EXAMPLE
router.post('/', async (req, res, next) => {
  try {
    const lead = await prisma.lead.create({ data: req.body })
    res.status(201).json({ success: true, message: 'Lead created', data: lead })
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: \`A lead with this \${err.meta?.target?.join(', ')} already exists\`,
        data: null
      })
    }
    next(err)
  }
})
---

CODE EXAMPLE
router.patch('/:id', async (req, res, next) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data:  req.body
    })
    res.json({ success: true, message: 'Lead updated', data: lead })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    }
    next(err)
  }
})
---

──────────────────────────────
AGGREGATE — COUNT, SUM, AVERAGE
──────────────────────────────

Aggregates let you calculate totals from the database — faster and cheaper than loading all records into JavaScript and calculating manually.

CODE EXAMPLE
// Dashboard stats endpoint
router.get('/stats', async (req, res, next) => {
  try {
    const [total, byStatus, budgetStats] = await prisma.$transaction([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by:      ['status'],
        _count:  { id: true }
      }),
      prisma.lead.aggregate({
        _sum: { budget: true },
        _avg: { budget: true },
        _max: { budget: true },
      })
    ])

    res.json({
      success: true,
      message: 'Stats fetched',
      data: {
        total,
        byStatus: byStatus.map(s => ({ status: s.status, count: s._count.id })),
        totalBudget: budgetStats._sum.budget,
        avgBudget:   Math.round(budgetStats._avg.budget || 0),
        topBudget:   budgetStats._max.budget
      }
    })
  } catch (err) { next(err) }
})
---

Test: GET /api/leads/stats — you should see a breakdown by status and budget totals.

──────────────────────────────
TRANSACTIONS — ALL OR NOTHING
──────────────────────────────

Sometimes two database writes must succeed together or neither should happen. Example: when a lead is closed, create an invoice at the same time. If the invoice creation fails, the lead status must not change either.

CODE EXAMPLE
router.patch('/:id/close', async (req, res, next) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.update({
        where: { id: req.params.id },
        data:  { status: 'CLOSED' }
      })

      const invoice = await tx.invoice.create({
        data: {
          leadId:  lead.id,
          amount:  req.body.amount,
          status:  'PENDING'
        }
      })

      return { lead, invoice }
    })

    res.json({ success: true, message: 'Lead closed and invoice created', data: result })
  } catch (err) { next(err) }
})
---

If the invoice creation throws, Prisma automatically rolls back the lead status update. The database stays consistent.

──────────────────────────────
THE COMPLETE LEADS ROUTER — PRODUCTION READY
──────────────────────────────

CODE EXAMPLE
const express = require('express')
const router  = express.Router()
const prisma  = require('../lib/prisma')

// GET all — with filter, search, pagination
router.get('/', async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1
    const limit  = parseInt(req.query.limit) || 10
    const skip   = (page - 1) * limit
    const where  = {}

    if (req.query.status) where.status = req.query.status
    if (req.query.search) {
      where.OR = [
        { name:    { contains: req.query.search, mode: 'insensitive' } },
        { service: { contains: req.query.search, mode: 'insensitive' } },
      ]
    }

    const [leads, total] = await prisma.$transaction([
      prisma.lead.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.lead.count({ where })
    ])

    res.json({
      success: true, message: 'Leads fetched',
      data: { leads, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
    })
  } catch (err) { next(err) }
})

// GET one
router.get('/:id', async (req, res, next) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    res.json({ success: true, message: 'Lead fetched', data: lead })
  } catch (err) { next(err) }
})

// POST create
router.post('/', async (req, res, next) => {
  const { name, phone, service } = req.body
  if (!name || !phone || !service) {
    return res.status(400).json({ success: false, message: 'name, phone, and service are required', data: null })
  }
  try {
    const lead = await prisma.lead.create({ data: req.body })
    res.status(201).json({ success: true, message: 'Lead created', data: lead })
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Duplicate value on unique field', data: null })
    }
    next(err)
  }
})

// PATCH update
router.patch('/:id', async (req, res, next) => {
  try {
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, message: 'Lead updated', data: lead })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    next(err)
  }
})

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Lead deleted', data: null })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    next(err)
  }
})

module.exports = router
---

SUBMISSION CHECKLIST
☐ Can explain what Prisma does in one sentence without looking at notes
☐ GET /api/leads?status=NEW filters correctly
☐ GET /api/leads?search=ravi searches name and service case-insensitively
☐ GET /api/leads?page=1&limit=5 returns paginated results with total and pages
☐ GET /api/leads/stats returns count by status + budget totals
☐ POST returns 409 on duplicate unique field, not 500
☐ PATCH and DELETE return 404 (not 500) when id does not exist
☐ All queries use next(err) — no route swallows errors silently
☐ PR: feat/day-4-full-crud — Postman screenshots for every endpoint including error cases

COMMON MISTAKES
• Using findMany when you need findUnique — findMany with a wrong id returns an empty array, not null, so your "not found" check never triggers
• Passing req.body directly to prisma.create() without validating — any field in the body gets written to the database
• Two separate awaits instead of prisma.$transaction — counts and finds can return inconsistent results if a record is created between the two queries
• Not handling P2025 on update/delete — it surfaces as a 500 with a Prisma stack trace exposed to the client
• Calculating aggregates in JavaScript after fetching all rows — let the database do it with prisma.lead.aggregate()
`,

// ─────────────────────────────────────────────────────────────────────────────

'W2D5': `
ERROR HANDLING AND PROJECT STRUCTURE
You have built a working Express + Prisma backend over the last four days. Today is not about adding new features — it is about making what you have production-ready.

Two things separate a student project from code a company can actually ship:
  1. Consistent, structured error handling — errors are expected, not surprises
  2. A folder structure that scales — code you can navigate when there are 50 files, not 5

Both are things most developers learn only after the chaos of a real project breaks them. You are learning them now.

──────────────────────────────
WHY ERROR HANDLING MATTERS
──────────────────────────────

Unhandled errors in a Node.js backend do one of two things:
  • Crash the entire server process — every user gets a connection refused error
  • Leak internal details — stack traces, file paths, database schema exposed in the response

Neither is acceptable in production. A robust backend handles every failure case and always returns a clean, structured response — regardless of what went wrong.

The goal: the frontend should never see a raw Node.js error. Ever.

──────────────────────────────
THE THREE CATEGORIES OF ERRORS
──────────────────────────────

Every error your backend will ever encounter falls into one of three buckets:

OPERATIONAL ERRORS — expected, handleable
  These are normal. A user sends bad input. A record does not exist. A token is expired.
  Response: a specific HTTP status + clear message (400, 401, 403, 404, 409)
  You handle these in route code with if checks and early returns.

PROGRAMMER ERRORS — bugs in your code
  These should not happen in production. Wrong variable name, reading .id on undefined.
  Response: 500 — something broke on the server
  You handle these with a global error handler and fix the bug.

INFRASTRUCTURE ERRORS — database down, disk full, out of memory
  Rare but real. The database connection drops. A third-party API is unreachable.
  Response: 503 Service Unavailable — not your fault but you still need to handle gracefully
  You handle these with retry logic and health checks.

The mistake most beginners make: treating all three the same. Catching every error with a 500 means the client has no idea what went wrong or whether they can fix it.

──────────────────────────────
CREATING A CUSTOM APP ERROR CLASS
──────────────────────────────

Instead of manually building error responses in every route, create one error class the whole backend uses. Throw it anywhere — your error handler catches it and formats the response correctly.

CODE EXAMPLE
// src/lib/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true  // marks this as a known, expected error
  }
}

module.exports = AppError
---

Now in any route, throw it like a normal error:

CODE EXAMPLE
const AppError = require('../lib/AppError')

router.get('/:id', async (req, res, next) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
    if (!lead) throw new AppError('Lead not found', 404)
    res.json({ success: true, message: 'Lead fetched', data: lead })
  } catch (err) {
    next(err)
  }
})
---

──────────────────────────────
THE GLOBAL ERROR HANDLER
──────────────────────────────

One middleware at the bottom of server.js catches every error passed via next(err). It decides what to send to the client.

CODE EXAMPLE
// src/middleware/errorHandler.js
const AppError = require('../lib/AppError')

function errorHandler(err, req, res, next) {
  // Always log — you need the full stack trace to debug
  console.error(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`)
  console.error(err.stack)

  // Handle Prisma-specific error codes
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found', data: null })
  }
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'field'
    return res.status(409).json({ success: false, message: \`Duplicate value on \${field}\`, data: null })
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ success: false, message: 'Referenced record does not exist', data: null })
  }

  // Handle our own AppError (known, operational errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({ success: false, message: err.message, data: null })
  }

  // Unknown error — do not leak details to the client
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again.',
    data: null
  })
}

module.exports = errorHandler
---

Register it last in server.js — after all routes and the 404 handler:

CODE EXAMPLE
// src/server.js
app.use('/api/leads', leadsRouter)
app.use('/api/auth',  authRouter)

app.use((req, res) => {
  res.status(404).json({ success: false, message: \`Route \${req.method} \${req.url} not found\`, data: null })
})

app.use(errorHandler) // must be last
---

──────────────────────────────
ASYNC ROUTE WRAPPER — REMOVE TRY/CATCH BOILERPLATE
──────────────────────────────

Every async route has the same try/catch/next(err) pattern. That is 3 lines of boilerplate per route. With 20 routes, it adds up. An async wrapper removes it entirely.

CODE EXAMPLE
// src/lib/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler
---

CODE EXAMPLE
// Before — with boilerplate
router.get('/:id', async (req, res, next) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
    if (!lead) throw new AppError('Lead not found', 404)
    res.json({ success: true, message: 'Lead fetched', data: lead })
  } catch (err) {
    next(err)
  }
})

// After — clean
const asyncHandler = require('../lib/asyncHandler')
const AppError     = require('../lib/AppError')

router.get('/:id', asyncHandler(async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
  if (!lead) throw new AppError('Lead not found', 404)
  res.json({ success: true, message: 'Lead fetched', data: lead })
}))
---

Same behaviour. Any thrown error — AppError, Prisma error, or unexpected bug — is automatically caught and passed to next(). No try/catch needed in the route at all.

──────────────────────────────
INPUT VALIDATION — CATCH BAD DATA AT THE DOOR
──────────────────────────────

Validation should happen before any database call. The moment a required field is missing or a value is the wrong type, return 400 immediately. Never let bad data reach Prisma.

CODE EXAMPLE
// src/lib/validate.js
function required(obj, fields) {
  const missing = fields.filter(f => !obj[f] || String(obj[f]).trim() === '')
  if (missing.length > 0) {
    const AppError = require('./AppError')
    throw new AppError(\`Missing required fields: \${missing.join(', ')}\`, 400)
  }
}

function isPhone(phone) {
  if (!/^\d{10}$/.test(phone)) {
    const AppError = require('./AppError')
    throw new AppError('Phone must be exactly 10 digits', 400)
  }
}

function isEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const AppError = require('./AppError')
    throw new AppError('Invalid email format', 400)
  }
}

module.exports = { required, isPhone, isEmail }
---

CODE EXAMPLE
// In a route
const { required, isPhone } = require('../lib/validate')

router.post('/', asyncHandler(async (req, res) => {
  const { name, phone, service } = req.body
  required(req.body, ['name', 'phone', 'service'])
  isPhone(phone)

  const lead = await prisma.lead.create({ data: { name, phone, service } })
  res.status(201).json({ success: true, message: 'Lead created', data: lead })
}))
---

──────────────────────────────
THE PRODUCTION FOLDER STRUCTURE
──────────────────────────────

A project that starts with good structure stays manageable as it grows. A project that starts messy only gets worse. Here is the structure every backend in this program uses:

  backend/
    src/
      routes/
        leads.js          → CRUD routes for leads
        auth.js           → register, login, refresh, logout
        users.js          → user profile routes
      middleware/
        auth.js           → authenticate + requireAdmin
        errorHandler.js   → global error handler
      lib/
        prisma.js         → Prisma client singleton
        AppError.js       → custom error class
        asyncHandler.js   → async route wrapper
        validate.js       → input validation helpers
      server.js           → Express setup, middleware, route mounting only
    prisma/
      schema.prisma       → data models
      seed.js             → seed script for dev data
      migrations/         → migration history (auto-generated)
    .env                  → secrets — never commit
    .gitignore            → node_modules/, .env, dist/
    package.json

Rules for this structure:
  • server.js has no route logic — only wires things together
  • Each feature gets one file in routes/ — leads.js handles everything lead-related
  • lib/ contains utilities shared across multiple routes — never business logic
  • middleware/ contains only Express middleware functions

──────────────────────────────
ENVIRONMENT CONFIGURATION — VALIDATE ON STARTUP
──────────────────────────────

If a required environment variable is missing, your app will behave unpredictably — crashes happen deep in the code with confusing errors. Fail fast: check all required env vars the moment the server starts.

CODE EXAMPLE
// src/lib/config.js
require('dotenv').config()

const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL']

for (const key of required) {
  if (!process.env[key]) {
    console.error(\`FATAL: Missing required environment variable: \${key}\`)
    process.exit(1)  // kill the process immediately — do not start a broken server
  }
}

module.exports = {
  port:              parseInt(process.env.PORT) || 5000,
  clientUrl:         process.env.CLIENT_URL,
  jwtSecret:         process.env.JWT_SECRET,
  jwtRefreshSecret:  process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn:      process.env.JWT_EXPIRES_IN      || '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}
---

CODE EXAMPLE
// src/server.js — import config first, before anything else
const config = require('./lib/config')

const app  = express()
const PORT = config.port
---

Now if JWT_SECRET is missing from .env, the server refuses to start and prints exactly which variable is missing — instead of crashing 30 minutes later when a user tries to log in.

──────────────────────────────
GRACEFUL SHUTDOWN
──────────────────────────────

When a server process is killed (Ctrl+C, deployment restart, crash), in-flight requests can be dropped mid-response. A graceful shutdown waits for active requests to finish before exiting.

CODE EXAMPLE
// src/server.js
const server = app.listen(PORT, () => {
  console.log(\`Server on http://localhost:\${PORT}\`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully')
  server.close(async () => {
    await prisma.\$disconnect()
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received — shutting down gracefully')
  server.close(async () => {
    await prisma.\$disconnect()
    process.exit(0)
  })
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err)
  server.close(() => process.exit(1))
})
---

SIGTERM is sent by Railway/Render/Docker when restarting the server. SIGINT is Ctrl+C in your terminal. unhandledRejection catches any async error that was not caught by try/catch or asyncHandler — a last safety net.

──────────────────────────────
THE COMPLETE server.js
──────────────────────────────

CODE EXAMPLE
const config      = require('./lib/config')
const express     = require('express')
const cors        = require('cors')
const prisma      = require('./lib/prisma')
const errorHandler = require('./middleware/errorHandler')

const leadsRouter = require('./routes/leads')
const authRouter  = require('./routes/auth')

const app  = express()
const PORT = config.port

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: config.clientUrl }))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() })
})

app.use('/api/auth',  authRouter)
app.use('/api/leads', leadsRouter)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: \`Route \${req.method} \${req.url} not found\`, data: null })
})

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler)

// ── Start ─────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => console.log(\`Server on http://localhost:\${PORT}\`))

process.on('SIGTERM', () => server.close(async () => { await prisma.\$disconnect(); process.exit(0) }))
process.on('SIGINT',  () => server.close(async () => { await prisma.\$disconnect(); process.exit(0) }))
process.on('unhandledRejection', (err) => { console.error(err); server.close(() => process.exit(1)) })
---

──────────────────────────────
WEEK 2 WRAP-UP — WHAT YOU NOW KNOW
──────────────────────────────

Five days ago you had only a frontend. Today you have a production-ready backend:

  • Node.js runtime — JavaScript outside the browser
  • Express server — routing, middleware, structured responses
  • PostgreSQL database — permanent storage, relationships, constraints
  • Prisma ORM — clean JavaScript for every database operation
  • Error handling — AppError, asyncHandler, global error middleware
  • Input validation — bad data caught before it reaches the database
  • Project structure — a layout that scales to 50+ files
  • Environment config — fail-fast on missing secrets
  • Graceful shutdown — clean process management

Week 3 builds React on top of all of this. You will connect the frontend to your own backend, manage server state with React Query, and handle auth on both sides.

SUBMISSION CHECKLIST
☐ AppError class created in src/lib/AppError.js
☐ asyncHandler wrapper created in src/lib/asyncHandler.js
☐ All routes use asyncHandler — no try/catch in route handlers
☐ errorHandler handles P2025, P2002, AppError, and unknown errors separately
☐ config.js validates all required env vars on startup — server refuses to start if any are missing
☐ Folder structure matches the layout above — nothing extra in server.js
☐ Graceful shutdown handlers registered for SIGTERM, SIGINT, unhandledRejection
☐ All existing Postman tests still pass after the refactor
☐ PR: feat/day-5-error-handling — before/after showing the route simplification with asyncHandler

COMMON MISTAKES
• Returning 500 for every error — operational errors (bad input, not found) need specific codes
• Registering errorHandler before routes — errors from routes never reach it
• Using try/catch in every route after adding asyncHandler — defeats the purpose, redundant
• Leaking error details to the client — never send err.stack or err.message from unknown errors
• Not calling process.exit(1) after unhandledRejection — the process stays alive in a broken state
• Skipping config.js validation — the server starts "successfully" but crashes on first real request
`,

// ─── WEEK 3 LESSONS ──────────────────────────────────────────────────────────

'W3D1': `
REACT BASICS AND COMPONENTS
You have a working backend. Week 3 is about the frontend — the part users actually see and touch. React is the library you will use to build every UI in this program.

Today: what React is, why teams use it, and the single most important concept — components.

──────────────────────────────
WHAT IS REACT AND WHY TEAMS USE IT
──────────────────────────────

React is a JavaScript library for building user interfaces. Created by Facebook in 2013, now used at Instagram, Airbnb, Notion, Swiggy, Razorpay, Zerodha — essentially every company that builds a serious web product.

The problem React solves:

Without React, updating the UI means finding DOM elements and changing them manually:
  document.getElementById('count').innerText = count + 1
  document.querySelector('.lead-list').innerHTML = leads.map(l => \`<div>\${l.name}</div>\`).join('')

This breaks as the UI grows. When 10 things depend on the same data, you have 10 places to update manually — and they go out of sync.

React's answer: describe what the UI should look like for a given state. React handles all the updates automatically.

  // You describe this:
  <LeadList leads={leads} />

  // React figures out what changed and updates only what needs updating

This mental shift — from "update the DOM" to "describe the UI" — is the entire point of React.

──────────────────────────────
SETTING UP A REACT PROJECT WITH VITE
──────────────────────────────

Vite is the build tool that powers React development. It starts in under a second and reloads changes instantly.

TRY IT NOW
$ npm create vite@latest frontend -- --template react
$ cd frontend
$ npm install
$ npm run dev
---

Open http://localhost:5173 — you have a running React app. The folder structure:

  frontend/
    src/
      App.jsx       → root component
      main.jsx      → entry point — mounts App into index.html
      assets/       → static files (images, fonts)
    index.html      → single HTML file for the entire app
    vite.config.js  → Vite configuration
    package.json

index.html has one div: <div id="root"></div>. React mounts the entire application into that div. There is no other HTML — React builds the whole UI in JavaScript.

──────────────────────────────
JSX — HTML INSIDE JAVASCRIPT
──────────────────────────────

JSX is the syntax React components use. It looks like HTML but it is JavaScript — Vite compiles it to regular function calls.

CODE EXAMPLE
// This JSX:
const element = <h1 className="title">Hello, {name}</h1>

// Compiles to this JavaScript:
const element = React.createElement('h1', { className: 'title' }, 'Hello, ' + name)
---

Key JSX rules:
  • Use className instead of class (class is a reserved JS keyword)
  • Every component must return a single root element — wrap siblings in <div> or <>...</>
  • JavaScript expressions go inside {} curly braces
  • Self-closing tags must close: <img /> not <img>
  • Comments inside JSX: {/* this is a comment */}

TRY IN CONSOLE
> // In your browser DevTools on the running Vite app
> // JSX expressions — {} embeds any JavaScript
> const user  = { name: "Ravi", age: 24 }
> const score = 85
---

CODE EXAMPLE
function UserCard({ user, score }) {
  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>Age: {user.age}</p>
      <p>Score: {score >= 60 ? 'Pass' : 'Fail'}</p>
      <p>Status: {score >= 60 ? <span style={{ color: 'green' }}>Pass</span> : <span style={{ color: 'red' }}>Fail</span>}</p>
    </div>
  )
}
---

──────────────────────────────
COMPONENTS — THE CORE IDEA
──────────────────────────────

A component is a reusable piece of UI. Think of it as a custom HTML element you define once and use anywhere.

Every React component is a JavaScript function that:
  1. Accepts an optional props object as its argument
  2. Returns JSX

That is all a component is.

CODE EXAMPLE
// The simplest possible component
function Greeting() {
  return <h1>Hello from DevForge</h1>
}

// Use it like an HTML tag
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  )
}
---

Component naming rules:
  • Always start with a capital letter — React uses this to tell components from HTML tags
  • One component per file — LeadCard.jsx, LeadList.jsx, LeadForm.jsx
  • File name matches component name exactly

──────────────────────────────
PROPS — PASSING DATA INTO COMPONENTS
──────────────────────────────

Props (properties) are how you pass data into a component. They are read-only — a component never modifies its own props.

CODE EXAMPLE
// LeadCard.jsx — receives one lead object as a prop
function LeadCard({ lead }) {
  const statusColors = {
    NEW:        { bg: '#dbeafe', color: '#1e40af' },
    CONTACTED:  { bg: '#fef9c3', color: '#854d0e' },
    QUALIFIED:  { bg: '#dcfce7', color: '#166534' },
    CLOSED:     { bg: '#f0fdf4', color: '#15803d' },
  }
  const badge = statusColors[lead.status] || { bg: '#f3f4f6', color: '#374151' }

  return (
    <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{lead.name}</h3>
        <span style={{ ...badge, padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
          {lead.status}
        </span>
      </div>
      <p style={{ margin: '8px 0 0', color: '#6b7280' }}>{lead.phone} · {lead.service}</p>
    </div>
  )
}

export default LeadCard
---

CODE EXAMPLE
// App.jsx — passes data into LeadCard
import LeadCard from './components/LeadCard'

const leads = [
  { id: '1', name: 'Ravi Kumar',   phone: '9876543210', service: 'Web Dev',    status: 'NEW'       },
  { id: '2', name: 'Priya Sharma', phone: '9123456780', service: 'Mobile App', status: 'CONTACTED' },
  { id: '3', name: 'Rahul Mehta',  phone: '9000011112', service: 'SEO',        status: 'CLOSED'    },
]

function App() {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <h1>Mini Lead Manager</h1>
      {leads.map(lead => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  )
}
---

The key prop is required when rendering a list. React uses it to track which items changed between renders. Use the record's id — never use the array index.

──────────────────────────────
CONDITIONAL RENDERING
──────────────────────────────

Show or hide UI based on data using JavaScript inside JSX.

CODE EXAMPLE
function LeadCard({ lead, isSelected }) {
  return (
    <div style={{
      border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
      padding: 16,
      borderRadius: 8
    }}>
      <h3>{lead.name}</h3>

      {/* Short-circuit — only renders if condition is true */}
      {lead.notes && <p style={{ color: '#6b7280' }}>{lead.notes}</p>}

      {/* Ternary — renders one of two options */}
      {lead.status === 'CLOSED'
        ? <span style={{ color: 'green' }}>Deal closed</span>
        : <span style={{ color: '#6b7280' }}>In progress</span>
      }

      {/* Null renders nothing */}
      {isSelected ? <div className="selected-badge">Selected</div> : null}
    </div>
  )
}
---

Three patterns for conditional rendering:
  {condition && <Component />}     → renders only when condition is true
  {condition ? <A /> : <B />}      → ternary, renders one or the other
  {condition ? <A /> : null}       → renders A or nothing

──────────────────────────────
COMPONENT COMPOSITION — BUILDING SCREENS FROM SMALL PIECES
──────────────────────────────

Real screens are built by composing small components. Each component has one responsibility.

CODE EXAMPLE
// Component tree for the leads screen:
//
//  App
//  └── LeadsPage
//      ├── PageHeader         (title + subtitle)
//      ├── LeadForm           (inputs + submit button)
//      └── LeadList           (the list)
//          └── LeadCard × n   (one per lead)

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ color: '#6b7280', margin: '4px 0 0' }}>{subtitle}</p>}
    </div>
  )
}

function LeadList({ leads }) {
  if (leads.length === 0) {
    return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>No leads yet. Add your first one.</p>
  }
  return (
    <div>
      {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
    </div>
  )
}

function LeadsPage() {
  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
      <PageHeader title="Leads" subtitle="Track your sales pipeline" />
      <LeadForm />
      <LeadList leads={leads} />
    </div>
  )
}
---

One rule: if a component is getting long or does more than one thing, split it. A 200-line component is a sign it needs to be broken up.

──────────────────────────────
CHILDREN PROP — WRAPPING COMPONENTS
──────────────────────────────

The special children prop lets a component wrap other components — like a reusable card or layout shell.

CODE EXAMPLE
function Card({ title, children }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
      {title && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
          {title}
        </div>
      )}
      <div style={{ padding: 16 }}>
        {children}
      </div>
    </div>
  )
}

// Usage — anything between <Card> tags becomes children
function App() {
  return (
    <Card title="Lead Summary">
      <p>Total leads: 12</p>
      <p>New this week: 4</p>
    </Card>
  )
}
---

──────────────────────────────
FOLDER STRUCTURE FOR REACT
──────────────────────────────

  src/
    components/
      LeadCard.jsx     → presentational — receives props, renders UI
      LeadList.jsx     → receives array, renders LeadCard for each
      LeadForm.jsx     → handles input and validation
      PageHeader.jsx   → reusable header with title + subtitle
    pages/
      LeadsPage.jsx    → full page — composes components
      DashboardPage.jsx
    lib/
      api.js           → Axios instance
    store/
      authStore.js     → Zustand auth state (Week 4)
    App.jsx            → routing
    main.jsx           → entry point

  components/  → small, reusable pieces used across multiple pages
  pages/       → one file per route — compose components here

SUBMISSION CHECKLIST
☐ Vite app running on http://localhost:5173 without errors
☐ LeadCard component renders name, phone, service, status badge
☐ Status badge colour changes based on lead.status value
☐ LeadList maps over an array and renders a LeadCard for each
☐ Empty state shown when leads array is empty
☐ PageHeader component used with title and optional subtitle props
☐ All components in separate files with correct export default
☐ PR: feat/day-1-react-components — screenshot of the leads list in the browser

COMMON MISTAKES
• Component name starts with lowercase — React treats it as an HTML tag, nothing renders
• Missing key prop on .map() — React warns in console and diffing breaks
• Using index as key — causes broken animations and stale renders when items reorder
• Modifying props inside a component — props are read-only, never mutate them
• Putting everything in App.jsx — split into components from Day 1
• className vs class — JSX requires className, class causes a warning and may not work
`,

// ─────────────────────────────────────────────────────────────────────────────

'W3D2': `
STATE WITH USESTATE
Yesterday components received data through props — data passed in from outside, read-only. Today you add state: data that lives inside a component, changes over time, and causes the UI to update automatically when it changes.

State is the engine of every interactive React UI.

──────────────────────────────
WHAT IS STATE?
──────────────────────────────

State is data a component owns and can change. When state changes, React re-renders the component with the new value — automatically, without you touching the DOM.

Three questions to decide if something should be state:
  1. Does it change over time?             → if no, it is a constant or prop
  2. Can it be calculated from other data? → if yes, calculate it, don't store it
  3. Does the UI need to update when it changes? → if no, use a ref, not state

Examples of state:
  • The form fields the user is typing into
  • Whether a modal is open or closed
  • The list of leads currently displayed
  • Which tab is selected
  • Whether an API call is loading

Examples of things that are NOT state:
  • The user's id (comes from the backend, stored in authStore)
  • A calculated total (derive it from state with .reduce())
  • A DOM reference (use useRef)

──────────────────────────────
USESTATE — THE HOOK THAT ADDS STATE
──────────────────────────────

useState is a React hook. It returns an array of two items:
  [currentValue, setterFunction]

You call the setter to change the value. React re-renders the component with the new value.

TRY IT NOW — paste this into App.jsx and open the browser:

CODE EXAMPLE
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)  // 0 is the initial value

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: 64, margin: 0 }}>{count}</h1>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        <button onClick={() => setCount(count - 1)}>-</button>
        <button onClick={() => setCount(0)}>Reset</button>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  )
}

export default Counter
---

Every click calls setCount, React re-renders Counter with the new value, the screen updates. You never touched the DOM.

──────────────────────────────
THE GOLDEN RULE — NEVER MUTATE STATE DIRECTLY
──────────────────────────────

React detects changes by checking if the state value is a new reference. If you mutate the existing value instead of creating a new one, React sees no change and does not re-render.

CODE EXAMPLE
// WRONG — mutating state directly
const [leads, setLeads] = useState([])
leads.push(newLead)        // mutates the array — React does NOT re-render
leads[0].status = 'CLOSED' // mutates an object inside the array — same problem

// CORRECT — always create a new value
setLeads([...leads, newLead])                          // new array
setLeads(leads.filter(l => l.id !== id))               // new array without the deleted item
setLeads(leads.map(l => l.id === id ? { ...l, status: 'CLOSED' } : l)) // new array with one item changed
---

The pattern for every state operation:
  Add    → setLeads([...leads, newLead])
  Remove → setLeads(leads.filter(l => l.id !== id))
  Update → setLeads(leads.map(l => l.id === id ? { ...l, ...changes } : l))

──────────────────────────────
OBJECT STATE — FORM FIELDS
──────────────────────────────

Forms have multiple fields. Use one useState with an object instead of a separate useState per field.

CODE EXAMPLE
import { useState } from 'react'

const INITIAL_FORM = { name: '', phone: '', service: '', status: 'NEW' }

function LeadForm({ onSubmit }) {
  const [form,  setForm]  = useState(INITIAL_FORM)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError(null) // clear error as user types
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.phone.trim() || !form.service.trim()) {
      setError('Name, phone, and service are required')
      return
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Phone must be exactly 10 digits')
      return
    }

    onSubmit(form)
    setForm(INITIAL_FORM) // reset after successful submit
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
      {error && (
        <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 6, fontSize: 14 }}>
          {error}
        </div>
      )}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name"
        style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6 }}
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="10-digit phone"
        style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6 }}
      />
      <input
        name="service"
        value={form.service}
        onChange={handleChange}
        placeholder="Service requested"
        style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6 }}
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6 }}
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="QUALIFIED">Qualified</option>
        <option value="CLOSED">Closed</option>
      </select>
      <button type="submit" style={{ padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
        Add Lead
      </button>
    </form>
  )
}

export default LeadForm
---

[name]: value uses a computed property key — the bracket evaluates e.target.name as the key. This single handler works for every field in the form.

──────────────────────────────
LIFTING STATE UP — SHARING BETWEEN COMPONENTS
──────────────────────────────

When two components need the same state, move it up to their closest common parent. Pass the state down as props and the setter as a callback.

CODE EXAMPLE
// LeadsPage owns the leads state — both form and list need it
import { useState } from 'react'
import LeadForm from '../components/LeadForm'
import LeadList from '../components/LeadList'

function LeadsPage() {
  const [leads, setLeads] = useState([])

  const handleAddLead = (formData) => {
    const newLead = { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setLeads(prev => [newLead, ...prev])
  }

  const handleStatusChange = (id, newStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
  }

  const handleDelete = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
      <h1>Lead Manager</h1>
      <LeadForm onSubmit={handleAddLead} />
      <LeadList
        leads={leads}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default LeadsPage
---

CODE EXAMPLE
// LeadList.jsx — receives leads and handlers as props
function LeadList({ leads, onStatusChange, onDelete }) {
  if (leads.length === 0) {
    return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>No leads yet.</p>
  }
  return (
    <div>
      <p style={{ color: '#6b7280', fontSize: 14 }}>{leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
      {leads.map(lead => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
---

CODE EXAMPLE
// LeadCard.jsx — calls parent handlers on user action
function LeadCard({ lead, onStatusChange, onDelete }) {
  return (
    <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0 }}>{lead.name}</h3>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>{lead.phone} · {lead.service}</p>
        </div>
        <button
          onClick={() => onDelete(lead.id)}
          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 }}
        >
          ×
        </button>
      </div>
      <select
        value={lead.status}
        onChange={e => onStatusChange(lead.id, e.target.value)}
        style={{ marginTop: 12, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="QUALIFIED">Qualified</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  )
}
---

──────────────────────────────
DERIVED STATE — CALCULATE, DON'T STORE
──────────────────────────────

If a value can be calculated from existing state, calculate it during render. Do not add a new useState for it.

CODE EXAMPLE
function LeadsPage() {
  const [leads, setLeads] = useState([])

  // Derived — calculated from leads state every render
  // Do NOT: const [newCount, setNewCount] = useState(0)
  const newCount       = leads.filter(l => l.status === 'NEW').length
  const closedCount    = leads.filter(l => l.status === 'CLOSED').length
  const totalPipeline  = leads.reduce((sum, l) => sum + (l.budget || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div>New: <strong>{newCount}</strong></div>
        <div>Closed: <strong>{closedCount}</strong></div>
        <div>Pipeline: <strong>₹{totalPipeline.toLocaleString('en-IN')}</strong></div>
      </div>
      {/* ... */}
    </div>
  )
}
---

Every time leads changes, these values recalculate automatically. No extra state to keep in sync, no bugs from stale counts.

──────────────────────────────
MULTIPLE USESTATE CALLS
──────────────────────────────

One component can have as many useState calls as it needs. Separate unrelated state into separate variables.

CODE EXAMPLE
function LeadsPage() {
  const [leads,     setLeads]     = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab,  setActiveTab]  = useState('ALL')

  // Derived from leads + filters — not stored in state
  const filteredLeads = leads
    .filter(l => activeTab === 'ALL' || l.status === activeTab)
    .filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search leads..."
      />
      {/* tabs, list, etc */}
    </div>
  )
}
---

──────────────────────────────
FUNCTIONAL UPDATES — WHEN STATE DEPENDS ON PREVIOUS STATE
──────────────────────────────

When the new state depends on the previous value, pass a function to the setter instead of the value directly. This guarantees you are working with the latest state — important when multiple updates happen in the same event cycle.

CODE EXAMPLE
// Risky — count might be stale in fast updates
setCount(count + 1)

// Safe — always uses the latest value
setCount(prev => prev + 1)

// For arrays — always use functional form when adding/removing
setLeads(prev => [newLead, ...prev])
setLeads(prev => prev.filter(l => l.id !== id))
setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
---

SUBMISSION CHECKLIST
☐ Counter works — increment, decrement, reset all update the UI correctly
☐ LeadForm has controlled inputs for all fields
☐ Validation shows error message — name, phone (10 digits), service required
☐ Form resets to empty values after successful submit
☐ LeadsPage lifts state — form and list share the same leads array
☐ Changing status in LeadCard updates the card without page refresh
☐ Delete removes the lead from the list immediately
☐ Stats (new count, total pipeline) update automatically when leads change
☐ Search input filters the visible list in real time
☐ PR: feat/day-2-usestate — screenshot of form, list, and live stats

COMMON MISTAKES
• setLeads([...leads, newLead]) inside an event that fires twice — use functional form: setLeads(prev => [newLead, ...prev])
• leads.push(newLead) then setLeads(leads) — push mutates, React sees the same reference, no re-render
• Storing derived values in state — always calculate from existing state during render
• Forgetting e.preventDefault() on form submit — page reloads, all state lost
• One useState per form field — use one object state with a single handleChange handler
• Passing onDelete={handleDelete(lead.id)} — this calls handleDelete immediately on render. Use onDelete={() => handleDelete(lead.id)} instead
`,

// ─────────────────────────────────────────────────────────────────────────────

'W3D3': `
FETCHING DATA FROM YOUR OWN API
The last two days your leads lived in React state — they disappeared on every page refresh. Today you connect the frontend to your own Express backend. Every lead comes from the real database, every form submission saves permanently.

This is where Week 2 and Week 3 meet.

──────────────────────────────
THE SETUP — TWO SERVERS, ONE APP
──────────────────────────────

Your full-stack app has two separate processes running at the same time:
  • React (Vite) → http://localhost:5173
  • Express       → http://localhost:5000

Open two terminal tabs. Start both before writing any code today.

TRY IT NOW
$ # Terminal 1 — backend
$ cd backend && npm run dev

$ # Terminal 2 — frontend
$ cd frontend && npm run dev
---

──────────────────────────────
AXIOS — THE HTTP CLIENT
──────────────────────────────

You learned fetch() in Week 1. In real projects, teams use Axios because it:
  • Automatically parses JSON — no .json() call needed
  • Throws on non-2xx status codes — no need to check res.ok manually
  • Supports interceptors — attach auth tokens automatically (Week 4)
  • Has cleaner error objects — err.response.data has your API's error body

TRY IT NOW
$ cd frontend && npm install axios
---

Create one Axios instance shared by the whole frontend:

CODE EXAMPLE
// src/lib/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default api
---

CODE EXAMPLE
// frontend/.env  (root of the frontend project, not backend)
VITE_API_URL=http://localhost:5000/api
---

Every component imports from src/lib/api.js. If the backend URL ever changes, you update one line.

──────────────────────────────
WHAT IS CORS AND HOW TO FIX IT
──────────────────────────────

The moment your React app (port 5173) calls your Express API (port 5000), the browser blocks it. Different ports = different origins = CORS error.

The error in DevTools:
  Access to XMLHttpRequest at 'http://localhost:5000/api/leads' from origin
  'http://localhost:5173' has been blocked by CORS policy.

The fix is always on the backend. Never on the frontend:

CODE EXAMPLE
// backend/src/server.js — already there from Week 2
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
---

Postman does NOT enforce CORS — it is a browser-only rule. If it works in Postman but not in the browser, CORS is always the reason.

──────────────────────────────
USEEFFECT — FETCHING DATA ON MOUNT
──────────────────────────────

useEffect runs code after a component renders. The empty [] dependency array means "run once when this component first appears on the screen" — exactly when you want to load data.

CODE EXAMPLE
import { useState, useEffect } from 'react'
import api from '../lib/api'

function LeadsPage() {
  const [leads,   setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await api.get('/leads')
        setLeads(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leads')
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, []) // empty array = run once on mount

  if (loading) return <p style={{ textAlign: 'center', padding: 40 }}>Loading...</p>
  if (error)   return <p style={{ color: '#ef4444', padding: 16 }}>{error}</p>

  return (
    <div>
      {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
    </div>
  )
}
---

Always handle three states for every data fetch: loading, error, and success. Never leave the user staring at a blank screen.

──────────────────────────────
CREATING A LEAD — POST REQUEST
──────────────────────────────

Replace the in-memory add with a real POST to your backend. After the API saves the lead, update local state so the UI reflects the change without a full refetch.

CODE EXAMPLE
function LeadsPage() {
  const [leads,     setLeads]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // ... useEffect fetch from above

  const handleAddLead = async (formData) => {
    try {
      setSubmitting(true)
      const res = await api.post('/leads', formData)
      setLeads(prev => [res.data.data, ...prev]) // prepend — newest first
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lead')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <LeadForm onSubmit={handleAddLead} submitting={submitting} />
      {/* ... */}
    </div>
  )
}
---

Do not refetch all leads after creating one. The backend returned the saved lead — prepend it to local state. One API call, instant UI update.

──────────────────────────────
UPDATING AND DELETING — PATCH AND DELETE
──────────────────────────────

CODE EXAMPLE
const handleStatusChange = async (id, newStatus) => {
  try {
    const res = await api.patch(\`/leads/\${id}\`, { status: newStatus })
    setLeads(prev => prev.map(l => l.id === id ? res.data.data : l))
  } catch (err) {
    console.error('Failed to update:', err.response?.data?.message)
  }
}

const handleDelete = async (id) => {
  if (!window.confirm('Delete this lead? This cannot be undone.')) return
  try {
    await api.delete(\`/leads/\${id}\`)
    setLeads(prev => prev.filter(l => l.id !== id))
  } catch (err) {
    console.error('Failed to delete:', err.response?.data?.message)
  }
}
---

Pattern: call the API → on success, update local state. Never use window.location.reload() — it destroys all state and causes a flash.

──────────────────────────────
THE OPTIMISTIC UPDATE PATTERN
──────────────────────────────

Optimistic updates make the UI feel instant. Update the state immediately, then make the API call. If the call fails, roll back.

CODE EXAMPLE
const handleStatusChange = async (id, newStatus) => {
  const previous = leads.find(l => l.id === id)

  // Update UI immediately — don't wait for the API
  setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))

  try {
    await api.patch(\`/leads/\${id}\`, { status: newStatus })
  } catch (err) {
    // Roll back if API fails
    setLeads(prev => prev.map(l => l.id === id ? previous : l))
    setError('Failed to update status')
  }
}
---

This is the pattern Swiggy uses when you mark an order as favourite. The star fills immediately — the API call happens in the background.

──────────────────────────────
LOADING AND ERROR STATES — EVERY CASE
──────────────────────────────

CODE EXAMPLE
function LeadCard({ lead, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleStatusChange = async (e) => {
    setUpdating(true)
    await onStatusChange(lead.id, e.target.value)
    setUpdating(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(lead.id)
    // no setDeleting(false) — component will unmount after delete
  }

  return (
    <div style={{ opacity: deleting ? 0.5 : 1, transition: 'opacity 0.2s' }}>
      <h3>{lead.name}</h3>
      <select
        value={lead.status}
        onChange={handleStatusChange}
        disabled={updating}
        style={{ opacity: updating ? 0.6 : 1 }}
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="QUALIFIED">Qualified</option>
        <option value="CLOSED">Closed</option>
      </select>
      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}
---

──────────────────────────────
DEBUGGING API CALLS — THE PROCESS
──────────────────────────────

When a frontend API call fails, check in this exact order:

  1. Is the backend running?    → check the terminal, visit http://localhost:5000/api/health
  2. DevTools → Network tab     → click the failed request, read status code and response body
  3. CORS error?                → check backend cors() config and CLIENT_URL env var
  4. 404 Not Found?             → VITE_API_URL is wrong or missing /api suffix
  5. 400 Bad Request?           → frontend is sending wrong or missing fields
  6. 500 Server Error?          → bug in the backend — check the backend terminal for the stack trace
  7. Network Error (no status)? → backend is not running or wrong port

Always read the error — do not guess.

SUBMISSION CHECKLIST
☐ Both servers running before starting
☐ VITE_API_URL set in frontend .env
☐ src/lib/api.js exports Axios instance with baseURL
☐ Leads load from GET /api/leads on page mount
☐ Loading state shows while fetching, error state shows on failure
☐ Add lead calls POST /api/leads — lead appears at top of list
☐ Status change calls PATCH /api/leads/:id — UI updates immediately
☐ Delete calls DELETE /api/leads/:id — lead removed from list
☐ Page refresh shows all leads still present (data is in the database)
☐ PR: feat/day-3-api-connect — screenshots of leads loaded from backend

COMMON MISTAKES
• fetch() instead of Axios — both work but teams use Axios for consistency and interceptors
• Not checking error state — if the backend is down, the user sees a blank screen
• Calling window.location.reload() after create — destroys state, causes a flash, unnecessary
• Missing VITE_ prefix on env variable — Vite only exposes variables with VITE_ prefix to the browser
• Using fetch() result directly — fetch() does not throw on 404/500, must check res.ok manually
• Two API calls for one operation — one POST returns the saved lead, use it to update state
`,

// ─────────────────────────────────────────────────────────────────────────────

'W3D4': `
REACT ROUTER AND NAVIGATION
Right now your app has one screen. Real apps have many — a leads list, a lead detail page, a dashboard, a settings page. React Router gives you multiple "pages" inside a single HTML file, with proper URLs and browser history.

──────────────────────────────
HOW ROUTING WORKS IN REACT
──────────────────────────────

Traditional websites: every URL loads a different HTML file from the server. Click a link → network request → new page loads.

React (SPA — Single Page Application): one HTML file. React Router intercepts link clicks, reads the URL, and renders the correct component — no network request, no page reload, instant transition.

The user sees a normal URL change in the browser bar. The experience feels like a normal website. But it is all happening in JavaScript.

TRY IT NOW
$ npm install react-router-dom
---

──────────────────────────────
SETTING UP THE ROUTER
──────────────────────────────

Wrap your entire app with BrowserRouter. This gives every component access to routing.

CODE EXAMPLE
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
---

──────────────────────────────
DEFINING ROUTES — ROUTES AND ROUTE
──────────────────────────────

CODE EXAMPLE
// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import LeadsPage     from './pages/LeadsPage'
import LeadDetailPage from './pages/LeadDetailPage'
import NotFoundPage  from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/"          element={<DashboardPage />} />
      <Route path="/leads"     element={<LeadsPage />} />
      <Route path="/leads/:id" element={<LeadDetailPage />} />
      <Route path="*"          element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
---

  path="/"          → exact match for the root URL
  path="/leads"     → matches /leads exactly
  path="/leads/:id" → matches /leads/abc123 — :id is a URL parameter
  path="*"          → matches anything else — your 404 page

──────────────────────────────
NAVIGATION — LINK AND USENAVIGATE
──────────────────────────────

Never use <a href="/leads"> in React — it causes a full page reload. Use React Router's Link instead.

CODE EXAMPLE
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <nav style={{ width: 220, padding: '24px 16px', borderRight: '1px solid #e2e8f0' }}>
      <Link to="/"       style={{ display: 'block', padding: '10px 12px', textDecoration: 'none', color: '#374151' }}>
        Dashboard
      </Link>
      <Link to="/leads"  style={{ display: 'block', padding: '10px 12px', textDecoration: 'none', color: '#374151' }}>
        Leads
      </Link>
    </nav>
  )
}
---

useNavigate — navigate programmatically (after a form submit, after login):

CODE EXAMPLE
import { useNavigate } from 'react-router-dom'

function LeadForm({ onSubmit }) {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newLead = await onSubmit(formData)
    navigate(\`/leads/\${newLead.id}\`) // go to the new lead's detail page
  }
}
---

──────────────────────────────
ACTIVE LINKS — NAVLINK
──────────────────────────────

NavLink works like Link but automatically adds an active class/style when its path matches the current URL.

CODE EXAMPLE
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display:        'block',
    padding:        '10px 12px',
    borderRadius:   6,
    textDecoration: 'none',
    fontWeight:     isActive ? 600 : 400,
    background:     isActive ? '#eff6ff' : 'transparent',
    color:          isActive ? '#2563eb' : '#374151',
  })

  return (
    <nav style={{ width: 220, padding: '24px 16px' }}>
      <NavLink to="/"      style={linkStyle} end>Dashboard</NavLink>
      <NavLink to="/leads" style={linkStyle}>Leads</NavLink>
    </nav>
  )
}
---

The end prop on Dashboard means it only matches exactly / — without it, / would also match /leads since /leads starts with /.

──────────────────────────────
URL PARAMETERS — USEPARAMS
──────────────────────────────

URL parameters let you pass data through the URL. /leads/abc123 — abc123 is the lead id.

CODE EXAMPLE
// src/pages/LeadDetailPage.jsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../lib/api'

function LeadDetailPage() {
  const { id } = useParams()  // reads :id from the URL
  const [lead,    setLead]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await api.get(\`/leads/\${id}\`)
        setLead(res.data.data)
      } catch (err) {
        setError(err.response?.status === 404 ? 'Lead not found' : 'Failed to load lead')
      } finally {
        setLoading(false)
      }
    }
    fetchLead()
  }, [id]) // re-fetch whenever the id in the URL changes

  if (loading) return <p>Loading...</p>
  if (error)   return <p style={{ color: '#ef4444' }}>{error}</p>

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <h1>{lead.name}</h1>
      <p>{lead.phone} · {lead.service}</p>
      <p>Status: {lead.status}</p>
      <p>Created: {new Date(lead.createdAt).toLocaleDateString('en-IN')}</p>
    </div>
  )
}

export default LeadDetailPage
---

──────────────────────────────
QUERY PARAMETERS — USELOCATION AND USESEARCHPARAMS
──────────────────────────────

Query parameters (?status=NEW&search=ravi) are for filters and search — they do not change which component renders, only what data it shows.

CODE EXAMPLE
import { useSearchParams } from 'react-router-dom'

function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get('status') || 'ALL'
  const search = searchParams.get('search') || ''

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div>
      <input
        value={search}
        onChange={e => updateFilter('search', e.target.value)}
        placeholder="Search leads..."
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].map(s => (
          <button
            key={s}
            onClick={() => updateFilter('status', s === 'ALL' ? '' : s)}
            style={{ fontWeight: status === s ? 700 : 400 }}
          >
            {s}
          </button>
        ))}
      </div>
      {/* ... */}
    </div>
  )
}
---

The URL updates to /leads?status=NEW&search=ravi as the user filters. Refresh the page — the filters persist because they are in the URL.

──────────────────────────────
LAYOUT ROUTES — SHARED SIDEBAR AND HEADER
──────────────────────────────

Most apps have a persistent sidebar and header that stays across all pages. Layout routes let you share a layout without repeating it in every page component.

CODE EXAMPLE
// src/components/layout/DashboardLayout.jsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <Outlet />  {/* child route renders here */}
      </main>
    </div>
  )
}

export default DashboardLayout
---

CODE EXAMPLE
// src/App.jsx — nest routes inside the layout
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardPage   from './pages/DashboardPage'
import LeadsPage       from './pages/LeadsPage'
import LeadDetailPage  from './pages/LeadDetailPage'
import LoginPage       from './pages/LoginPage'
import NotFoundPage    from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<DashboardLayout />}>
        <Route path="/"            element={<DashboardPage />} />
        <Route path="/leads"       element={<LeadsPage />} />
        <Route path="/leads/:id"   element={<LeadDetailPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
---

The login page gets no sidebar. Every other route shares DashboardLayout automatically. <Outlet /> is where the child route component renders.

──────────────────────────────
PROTECTED ROUTES — REDIRECT IF NOT LOGGED IN
──────────────────────────────

Some routes should only be accessible when the user is logged in. A ProtectedRoute component checks auth state and redirects to /login if not authenticated.

CODE EXAMPLE
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
---

CODE EXAMPLE
// src/App.jsx — wrap the layout with ProtectedRoute
<Route
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route path="/"          element={<DashboardPage />} />
  <Route path="/leads"     element={<LeadsPage />} />
  <Route path="/leads/:id" element={<LeadDetailPage />} />
</Route>
---

Week 4 replaces the localStorage token check with a proper Zustand auth store. The pattern is the same.

──────────────────────────────
USENAVIGATE PATTERNS
──────────────────────────────

CODE EXAMPLE
const navigate = useNavigate()

// Go to a page
navigate('/leads')

// Go back one page in browser history
navigate(-1)

// Replace current history entry (user cannot press back)
navigate('/login', { replace: true })

// Pass state that the next page can read
navigate('/leads/new', { state: { prefillService: 'Web Dev' } })
---

Read state passed from navigate:
CODE EXAMPLE
import { useLocation } from 'react-router-dom'

function NewLeadPage() {
  const { state } = useLocation()
  const prefill   = state?.prefillService || ''
  // ...
}
---

SUBMISSION CHECKLIST
☐ react-router-dom installed
☐ BrowserRouter wraps the app in main.jsx
☐ At least 4 routes: /, /leads, /leads/:id, * (404)
☐ Sidebar uses NavLink with active styling
☐ LeadDetailPage reads :id from useParams and fetches from backend
☐ DashboardLayout with Outlet — sidebar shared across all routes
☐ ProtectedRoute redirects to /login when no token
☐ Filter buttons update URL query params — filters persist on refresh
☐ PR: feat/day-4-react-router — screenshots of each page and active nav link

COMMON MISTAKES
• <a href="/leads"> instead of <Link to="/leads"> — causes a full page reload, state lost
• Missing end on the root NavLink — / matches every path, Dashboard is always highlighted
• Not adding [id] to useEffect deps array — stale data shown when navigating between detail pages
• Accessing useParams() outside a Route component — returns empty object, no error
• Nested routes not using <Outlet /> in the layout — child routes render nothing
`,

// ─────────────────────────────────────────────────────────────────────────────

'W3D5': `
TANSTACK QUERY (REACT QUERY)
The last two days you fetched data with useState + useEffect. It works — but you managed every piece manually: loading state, error state, refetching after mutations, cache invalidation. For two endpoints that is fine. For a real app with 20+ endpoints, it becomes unmanageable.

TanStack Query (formerly React Query) handles all of that automatically.

──────────────────────────────
THE PROBLEM WITH USESTATE + USEEFFECT FOR DATA FETCHING
──────────────────────────────

Here is what you wrote for every data fetch so far:

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetch().then(setData).catch(setError).finally(() => setLoading(false))
  }, [])

Five problems this pattern does not solve:
  1. Navigate away and back — data refetches from scratch every time
  2. Two components need the same data — two network requests for identical data
  3. After creating a lead, the list does not automatically update
  4. Tab goes in the background, comes back — stale data shown until manual refresh
  5. No retry on network failure

React Query solves all five with zero extra code.

──────────────────────────────
SETUP — QUERYCLIENT AND QUERYCLIENTPROVIDER
──────────────────────────────

TRY IT NOW
$ npm install @tanstack/react-query
---

CODE EXAMPLE
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // data is fresh for 30 seconds
      retry:     1,         // retry failed requests once
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
---

QueryClient is the cache. QueryClientProvider makes it available to every component in the tree.

──────────────────────────────
USEQUERY — FETCHING DATA
──────────────────────────────

Replace the useState + useEffect pattern with a single useQuery call.

CODE EXAMPLE
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

// Before — 15 lines of boilerplate
const [leads,   setLeads]   = useState([])
const [loading, setLoading] = useState(true)
const [error,   setError]   = useState(null)
useEffect(() => { api.get('/leads').then(res => setLeads(res.data.data)) ... }, [])

// After — 5 lines, more features
const { data: leads = [], isLoading, isError, error } = useQuery({
  queryKey: ['leads'],
  queryFn:  () => api.get('/leads').then(res => res.data.data)
})
---

What useQuery gives you for free:
  isLoading   → true on the first fetch (no cached data yet)
  isFetching  → true whenever a fetch is happening (including background refetches)
  isError     → true if the last fetch failed
  error       → the error object
  data        → the resolved value from queryFn
  refetch()   → manually trigger a refetch

queryKey is the cache key. Any query with the same key shares cached data.

──────────────────────────────
QUERY KEYS — THE CACHE IDENTITY
──────────────────────────────

The queryKey uniquely identifies a query in the cache. React Query uses it to:
  • Share data between components using the same key
  • Know which cache entries to invalidate after a mutation
  • Refetch when key values change (e.g. filters)

CODE EXAMPLE
// Static key — fetches once, caches forever (until stale)
useQuery({ queryKey: ['leads'],      queryFn: ... })
useQuery({ queryKey: ['dashboard'],  queryFn: ... })

// Dynamic key — refetches automatically when id changes
const { id } = useParams()
useQuery({ queryKey: ['leads', id],  queryFn: () => api.get(\`/leads/\${id}\`).then(r => r.data.data) })

// Key with filters — new cache entry per filter combination
useQuery({ queryKey: ['leads', { status, search }], queryFn: ... })
---

When useParams id changes, React Query sees a different key and fetches fresh data — automatically. No need to add id to a useEffect dependency array.

──────────────────────────────
USEMUTATION — CREATING, UPDATING, DELETING
──────────────────────────────

useMutation handles write operations (POST, PATCH, DELETE). Its key feature: onSuccess callback that can invalidate queries — causing them to automatically refetch.

CODE EXAMPLE
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

function LeadsPage() {
  const queryClient = useQueryClient()

  const createLead = useMutation({
    mutationFn: (data) => api.post('/leads', data).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      // React Query refetches the leads list automatically
    },
    onError: (err) => {
      console.error(err.response?.data?.message)
    }
  })

  const handleSubmit = (formData) => {
    createLead.mutate(formData)
  }

  return (
    <div>
      <LeadForm
        onSubmit={handleSubmit}
        submitting={createLead.isPending}
        error={createLead.error?.response?.data?.message}
      />
    </div>
  )
}
---

  mutate(data)    → trigger the mutation
  isPending       → true while the mutation is in flight
  isSuccess       → true after successful completion
  isError         → true if it failed
  reset()         → clear the mutation state

──────────────────────────────
FULL LEADS PAGE WITH REACT QUERY
──────────────────────────────

CODE EXAMPLE
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import LeadForm from '../components/LeadForm'
import LeadCard from '../components/LeadCard'

function LeadsPage() {
  const queryClient = useQueryClient()

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['leads'],
    queryFn:  () => api.get('/leads').then(r => r.data.data)
  })

  // ── Create ─────────────────────────────────────────────────────────────────
  const createLead = useMutation({
    mutationFn: (data) => api.post('/leads', data).then(r => r.data.data),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['leads'] })
  })

  // ── Update ─────────────────────────────────────────────────────────────────
  const updateLead = useMutation({
    mutationFn: ({ id, data }) => api.patch(\`/leads/\${id}\`, data).then(r => r.data.data),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['leads'] })
  })

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteLead = useMutation({
    mutationFn: (id) => api.delete(\`/leads/\${id}\`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['leads'] })
  })

  if (isLoading) return <p style={{ textAlign: 'center', padding: 40 }}>Loading leads...</p>
  if (isError)   return <p style={{ color: '#ef4444', padding: 16 }}>Failed to load leads.</p>

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 32 }}>
      <h1>Leads <span style={{ fontSize: 16, color: '#6b7280', fontWeight: 400 }}>({leads.length})</span></h1>

      <LeadForm
        onSubmit={(data) => createLead.mutate(data)}
        submitting={createLead.isPending}
      />

      {leads.length === 0
        ? <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>No leads yet.</p>
        : leads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={(id, status) => updateLead.mutate({ id, data: { status } })}
              onDelete={(id) => deleteLead.mutate(id)}
            />
          ))
      }
    </div>
  )
}

export default LeadsPage
---

Every mutation calls invalidateQueries — the leads list refetches automatically. No manual state updates, no stale data, no setLeads(...) anywhere.

──────────────────────────────
STALE TIME AND BACKGROUND REFETCHING
──────────────────────────────

staleTime controls how long React Query considers data "fresh". While fresh, it will not refetch in the background. After staleTime expires, the next use of that query triggers a background refetch — the user sees the cached data instantly, then the fresh data replaces it silently.

CODE EXAMPLE
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  30 * 1000,  // 30 seconds — fine for most data
      gcTime:     5 * 60 * 1000, // 5 minutes — how long to keep unused cache
      retry:      1,             // retry once on failure
      refetchOnWindowFocus: true // refetch when tab comes back into focus
    }
  }
})
---

Tune staleTime per query:
  User profile     → 5 minutes (rarely changes)
  Dashboard stats  → 60 seconds (changes often)
  Lead list        → 30 seconds (moderate change rate)
  Notifications    → 10 seconds (needs to be fresh)

──────────────────────────────
REACT QUERY DEVTOOLS
──────────────────────────────

React Query has a devtools panel that shows every cached query, its status, data, and when it will refetch.

TRY IT NOW
$ npm install @tanstack/react-query-devtools
---

CODE EXAMPLE
// src/main.jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Inside QueryClientProvider:
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
---

A floating icon appears in the bottom-left corner of your app. Click it to see the cache in real time. Use this whenever you are debugging data issues.

──────────────────────────────
PREFETCHING — LOAD DATA BEFORE THE USER NAVIGATES
──────────────────────────────

Prefetch data on hover so it is already in cache when the user clicks.

CODE EXAMPLE
import { useQueryClient } from '@tanstack/react-query'

function LeadCard({ lead }) {
  const queryClient = useQueryClient()

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['leads', lead.id],
      queryFn:  () => api.get(\`/leads/\${lead.id}\`).then(r => r.data.data),
      staleTime: 10 * 1000
    })
  }

  return (
    <Link to={\`/leads/\${lead.id}\`} onMouseEnter={handleMouseEnter}>
      {lead.name}
    </Link>
  )
}
---

When the user hovers a lead card, the detail page data loads in the background. By the time they click, the page renders instantly with no loading state.

──────────────────────────────
WEEK 3 WRAP-UP — WHAT YOU NOW HAVE
──────────────────────────────

You started the week with a backend and a static frontend. You now have a fully connected full-stack application:

  • React components — composable, reusable UI pieces
  • useState — local component state and form management
  • useEffect — side effects and data fetching on mount
  • Axios — structured HTTP client with baseURL and interceptors
  • React Router — multi-page navigation with URL parameters and layout routes
  • TanStack Query — server state, caching, background refetching, mutations

Week 4 adds authentication. You will implement login, JWT tokens, protected routes, and role-based access — both on the backend and frontend.

SUBMISSION CHECKLIST
☐ @tanstack/react-query and devtools installed
☐ QueryClient created with staleTime: 30000 and retry: 1
☐ QueryClientProvider wraps the app in main.jsx
☐ useQuery replaces all useState + useEffect data fetching
☐ useMutation used for create, update, and delete
☐ invalidateQueries called in onSuccess of every mutation — list auto-refreshes
☐ ReactQueryDevtools visible in dev mode
☐ Lead detail page uses dynamic query key ['leads', id]
☐ PR: feat/day-5-react-query — Devtools screenshot showing cached queries

COMMON MISTAKES
• Calling mutate() directly without useMutation — mutate is not a standalone function
• Forgetting invalidateQueries after a mutation — list shows stale data after create/update/delete
• Wrong queryKey format — key must be an array: ['leads'], not 'leads'
• Not providing a default value: data = [] — data is undefined on first render before the query resolves
• Two QueryClientProvider in the same tree — only one at the root
• Using useQuery for mutations (POST/PATCH/DELETE) — useQuery is for reads only, useMutation for writes
`,

// ─── WEEK 4 LESSONS ──────────────────────────────────────────────────────────

'W4D1': `
AUTH CONCEPTS AND BACKEND IMPLEMENTATION
Every application in this program requires authentication. Without it, your API is open to the world — anyone can read every lead, delete every record, or impersonate any user. Today you build the auth system from scratch on the backend.

──────────────────────────────
WHAT AUTHENTICATION ACTUALLY IS
──────────────────────────────

Authentication answers: who are you?
Authorization answers: what are you allowed to do?

They are different. You can be authenticated (logged in) but not authorised (not an ADMIN). Both checks live on the backend — never trust the frontend.

The flow every serious app uses:

  REGISTER
  1. User sends email + password
  2. Backend validates — is email already taken? Is password strong enough?
  3. Backend hashes the password with bcrypt (never store plain text — ever)
  4. Backend saves the User to the database
  5. Backend issues a JWT access token + a refresh token, returns both

  LOGIN
  1. User sends email + password
  2. Backend finds the user by email
  3. Backend compares submitted password against stored hash with bcrypt.compare()
  4. If match → issue tokens. If no match → 401 "Invalid credentials"
  5. Never say "email not found" — always "Invalid credentials" (prevents email enumeration)

  AUTHENTICATED REQUEST
  1. Frontend sends token in every request: Authorization: Bearer <token>
  2. Backend middleware reads the header, verifies token with JWT_SECRET
  3. If valid → attaches req.user, calls next()
  4. If missing or invalid → 401 immediately, route never runs

──────────────────────────────
WHAT IS A JWT TOKEN?
──────────────────────────────

JWT (JSON Web Token) is a self-contained token — the server can verify it without a database lookup.

Structure: three Base64-encoded parts separated by dots:
  eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV

  Header  → algorithm used: { "alg": "HS256" }
  Payload → your data: { "userId": "123", "role": "STUDENT", "iat": 1700000000, "exp": 1700000900 }
  Signature → HMAC(header + payload, JWT_SECRET) — proves the server issued it

Anyone can decode the payload (it is just Base64). Only the server can verify the signature — because only the server knows JWT_SECRET. This is why:
  • Never put sensitive data in the payload (passwords, card numbers)
  • Never expose JWT_SECRET — anyone with it can forge any token

Access tokens expire fast (15 minutes). Refresh tokens expire slowly (7 days). More on this in Day 3.

──────────────────────────────
WHAT IS BCRYPT?
──────────────────────────────

bcrypt is a one-way hashing function designed for passwords. It is intentionally slow — making brute-force attacks expensive.

  hash = bcrypt.hash("mypassword123", 10)
  → "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHO"

The 10 is the "salt rounds" — how many times bcrypt iterates. Higher = slower = more secure. 10-12 is standard for production.

Verification:
  bcrypt.compare("mypassword123", hash) → true
  bcrypt.compare("wrongpassword",  hash) → false

bcrypt never decrypts — it re-hashes the submitted password and compares. If the database is leaked, attackers cannot reverse the hashes.

──────────────────────────────
INSTALLING DEPENDENCIES
──────────────────────────────

TRY IT NOW
$ cd backend
$ npm install jsonwebtoken bcryptjs
---

Add to backend/.env:

CODE EXAMPLE
JWT_SECRET=a-long-random-string-at-least-32-characters
JWT_REFRESH_SECRET=a-different-long-random-string-also-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
---

Generate strong secrets in the terminal:
TRY IT NOW
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
---

Run it twice — once for JWT_SECRET, once for JWT_REFRESH_SECRET. Never use a short or guessable string.

──────────────────────────────
THE USER MODEL
──────────────────────────────

CODE EXAMPLE
// prisma/schema.prisma — add the User model
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         Role     @default(STUDENT)
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

enum Role {
  STUDENT
  ADMIN
}
---

TRY IT NOW
$ npx prisma migrate dev --name add_user_auth
$ npx prisma generate
---

──────────────────────────────
THE AUTH SERVICE — BUSINESS LOGIC IN ONE PLACE
──────────────────────────────

Keep token generation and hashing logic out of route files. One service, imported everywhere.

CODE EXAMPLE
// src/lib/auth.js
const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcryptjs')
const config  = require('./config')

function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

function signAccessToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
}

function signRefreshToken(payload) {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpires })
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret)
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwtRefreshSecret)
}

module.exports = { hashPassword, comparePassword, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken }
---

──────────────────────────────
THE AUTH ROUTES
──────────────────────────────

CODE EXAMPLE
// src/routes/auth.js
const express      = require('express')
const router       = express.Router()
const prisma       = require('../lib/prisma')
const authLib      = require('../lib/auth')
const asyncHandler = require('../lib/asyncHandler')
const AppError     = require('../lib/AppError')

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) throw new AppError('name, email, and password are required', 400)
  if (password.length < 8)         throw new AppError('Password must be at least 8 characters', 400)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new AppError('Email already registered', 409)

  const passwordHash = await authLib.hashPassword(password)
  const user = await prisma.user.create({
    data: { name, email, passwordHash }
  })

  const payload      = { userId: user.id, role: user.role }
  const accessToken  = authLib.signAccessToken(payload)
  const refreshToken = authLib.signRefreshToken(payload)

  await prisma.refreshToken.create({
    data: {
      token:     refreshToken,
      userId:    user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user:  { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    }
  })
}))

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new AppError('email and password are required', 400)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new AppError('Invalid credentials', 401)

  const valid = await authLib.comparePassword(password, user.passwordHash)
  if (!valid) throw new AppError('Invalid credentials', 401)

  const payload      = { userId: user.id, role: user.role }
  const accessToken  = authLib.signAccessToken(payload)
  const refreshToken = authLib.signRefreshToken(payload)

  await prisma.refreshToken.create({
    data: {
      token:     refreshToken,
      userId:    user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user:  { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    }
  })
}))

// POST /api/auth/logout
router.post('/logout', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
  }
  res.json({ success: true, message: 'Logged out', data: null })
}))

module.exports = router
---

Register these routes in server.js (no auth middleware — they are public):
CODE EXAMPLE
app.use('/api/auth', authRouter)
---

──────────────────────────────
THE AUTHENTICATE MIDDLEWARE
──────────────────────────────

CODE EXAMPLE
// src/middleware/auth.js
const authLib  = require('../lib/auth')
const AppError = require('../lib/AppError')
const prisma   = require('../lib/prisma')

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401)
    }

    const token   = header.split(' ')[1]
    const payload = authLib.verifyAccessToken(token)  // throws if expired or invalid

    const user = await prisma.user.findUnique({
      where:  { id: payload.userId },
      select: { id: true, name: true, email: true, role: true }
    })
    if (!user) throw new AppError('User not found', 401)

    req.user = user  // available in all downstream route handlers
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError')  return next(new AppError('Token expired', 401))
    if (err.name === 'JsonWebTokenError') return next(new AppError('Invalid token', 401))
    next(err)
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403))
  }
  next()
}

module.exports = { authenticate, requireAdmin }
---

Apply it to protected routes:
CODE EXAMPLE
const { authenticate, requireAdmin } = require('./middleware/auth')

app.use('/api/leads',   authenticate, leadsRouter)
app.use('/api/admin',   authenticate, requireAdmin, adminRouter)
---

──────────────────────────────
TESTING AUTH IN POSTMAN
──────────────────────────────

Test in this exact order:

  1. POST /api/auth/register
     Body: { "name": "Ravi", "email": "ravi@test.com", "password": "password123" }
     Expected: 201 with accessToken and refreshToken

  2. POST /api/auth/login  (same credentials)
     Expected: 200 with tokens

  3. GET /api/leads  (no token)
     Expected: 401 "No token provided"

  4. GET /api/leads  (add Authorization: Bearer <accessToken> header)
     Expected: 200 with leads

  5. POST /api/auth/register  (same email again)
     Expected: 409 "Email already registered"

  6. POST /api/auth/login  (wrong password)
     Expected: 401 "Invalid credentials"

All 6 pass? Your auth backend is working.

SUBMISSION CHECKLIST
☐ User and RefreshToken models in schema.prisma, migration ran
☐ bcryptjs used for hashing — plain-text passwords never stored
☐ JWT_SECRET and JWT_REFRESH_SECRET are long random strings in .env
☐ Register returns 409 on duplicate email (not 500)
☐ Login always returns 401 "Invalid credentials" — never reveals which field was wrong
☐ authenticate middleware attaches req.user on success
☐ requireAdmin returns 403 (not 401) when role is not ADMIN
☐ All 6 Postman tests pass
☐ PR: feat/day-1-auth-backend

COMMON MISTAKES
• Storing plain-text passwords — always hash with bcrypt, always
• Short JWT_SECRET — use crypto.randomBytes(32).toString('hex') to generate
• "Email not found" vs "Invalid credentials" — the first leaks user existence, use generic message
• 401 vs 403 — 401 means not authenticated, 403 means authenticated but not allowed
• Not checking token expiry in middleware — expired tokens must be rejected
• Attaching the whole user to req.user without select — passwordHash ends up in req.user
`,

// ─────────────────────────────────────────────────────────────────────────────

'W4D2': `
PROTECTED ROUTES AND FRONTEND AUTH
Yesterday you built a complete auth backend. Today you build the frontend side: login form, storing tokens, attaching them to every API request, protecting routes, and handling the logged-in user in global state.

──────────────────────────────
WHERE TOKENS LIVE ON THE FRONTEND
──────────────────────────────

After login, you receive an accessToken and a refreshToken. Where you store them is a security decision:

  localStorage   → survives page refresh. Vulnerable to XSS — if any JavaScript on the page is compromised, the attacker reads it. Acceptable for most applications where XSS is mitigated.
  sessionStorage → cleared when tab closes. Same XSS risk.
  Memory (state) → safest — no XSS risk. But gone on page refresh — user must re-login every tab.
  HttpOnly cookie → browser handles it, never accessible to JavaScript. Best for high-security apps. Requires backend to set it.

For this program: accessToken in memory (Zustand store), refreshToken in localStorage. This is the industry standard balance between security and usability.

──────────────────────────────
THE AUTH STORE — ZUSTAND
──────────────────────────────

Zustand is a lightweight state management library. It replaces the need for Context + useReducer for global auth state. The auth store holds the user and tokens, persisted to localStorage so the user stays logged in after refresh.

TRY IT NOW
$ npm install zustand
---

CODE EXAMPLE
// src/store/authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),

      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name:    'devforge-auth',   // localStorage key
      partialize: (state) => ({   // only persist what is needed
        user:         state.user,
        refreshToken: state.refreshToken,
        // accessToken intentionally NOT persisted — short-lived
      }),
    }
  )
)

export default useAuthStore
---

persist saves to localStorage automatically. partialize controls which fields are saved — do not persist the accessToken since it expires in 15 minutes anyway.

──────────────────────────────
THE AXIOS INSTANCE WITH AUTH INTERCEPTOR
──────────────────────────────

Update src/lib/api.js to attach the access token to every request automatically.

CODE EXAMPLE
// src/lib/api.js
import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

export default api
---

useAuthStore.getState() reads the current store value outside a React component. This is correct — interceptors run outside the React tree.

Day 3 adds a response interceptor that handles 401 errors and refreshes the token automatically.

──────────────────────────────
THE LOGIN PAGE
──────────────────────────────

CODE EXAMPLE
// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import useAuthStore from '../store/authStore'

function LoginPage() {
  const navigate  = useNavigate()
  const setAuth   = useAuthStore(state => state.setAuth)

  const [form,     setForm]     = useState({ email: '', password: '' })
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Email and password are required')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await api.post('/auth/login', form)
      setAuth(res.data.data) // { user, accessToken, refreshToken }
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>Sign in</h1>
        <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: 14 }}>DevForge Learning Platform</p>

        {error && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            autoComplete="email"
            style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
            style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px', background: loading ? '#93c5fd' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: loading ? 'default' : 'pointer', fontSize: 14 }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
---

──────────────────────────────
PROTECTED ROUTE — USING THE AUTH STORE
──────────────────────────────

Update ProtectedRoute from Day 4 to read from the Zustand store instead of localStorage directly.

CODE EXAMPLE
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function ProtectedRoute({ children }) {
  const user = useAuthStore(state => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
---

CODE EXAMPLE
// src/components/AdminRoute.jsx — only for ADMIN role
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function AdminRoute({ children }) {
  const user = useAuthStore(state => state.user)

  if (!user)                    return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN')    return <Navigate to="/"      replace />

  return children
}

export default AdminRoute
---

──────────────────────────────
SHOWING USER INFO AND LOGOUT
──────────────────────────────

CODE EXAMPLE
// src/components/layout/Header.jsx
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'

function Header() {
  const navigate     = useNavigate()
  const user         = useAuthStore(state => state.user)
  const refreshToken = useAuthStore(state => state.refreshToken)
  const logout       = useAuthStore(state => state.logout)

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', { refreshToken })
    } catch {
      // ignore — logout locally regardless
    } finally {
      logout()
      navigate('/login', { replace: true })
    }
  }

  return (
    <header style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: 700, color: '#1e293b' }}>DevForge</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 14, color: '#6b7280' }}>{user?.name}</span>
        <button
          onClick={handleLogout}
          style={{ padding: '6px 14px', background: 'none', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

export default Header
---

──────────────────────────────
REDIRECT ALREADY-LOGGED-IN USERS
──────────────────────────────

If a logged-in user navigates to /login, redirect them to the dashboard.

CODE EXAMPLE
// src/pages/LoginPage.jsx — add at the top of the component
import { Navigate } from 'react-router-dom'

function LoginPage() {
  const user = useAuthStore(state => state.user)
  if (user) return <Navigate to="/" replace />

  // ... rest of component
}
---

──────────────────────────────
THE COMPLETE AUTH FLOW — END TO END
──────────────────────────────

  1. User visits /leads — ProtectedRoute checks store — no user → redirect to /login
  2. User fills login form → POST /api/auth/login
  3. Backend returns { user, accessToken, refreshToken }
  4. setAuth() stores in Zustand — persisted to localStorage via persist middleware
  5. navigate('/') — user lands on dashboard
  6. api.js interceptor reads accessToken from store, attaches to every request header
  7. Express authenticate middleware verifies token, attaches req.user
  8. Route handler returns data → React Query caches it → component renders
  9. User clicks Sign out → POST /api/auth/logout (deletes refresh token from DB) → logout() clears store → redirect to /login

──────────────────────────────
TESTING THE FULL FLOW
──────────────────────────────

  1. Open http://localhost:5173/leads — should redirect to /login
  2. Register or login — should land on dashboard
  3. Check localStorage in DevTools → Application → Local Storage → devforge-auth
  4. Open /leads — leads load with auth
  5. Click Sign out — redirected to /login
  6. Try navigating to /leads directly — back to /login

SUBMISSION CHECKLIST
☐ Zustand installed, authStore.js created with setAuth, setTokens, logout
☐ accessToken NOT in localStorage (persisted only refreshToken and user)
☐ api.js interceptor attaches Authorization: Bearer token to every request
☐ LoginPage calls setAuth on success and navigates to /
☐ ProtectedRoute reads from authStore, redirects to /login if no user
☐ AdminRoute redirects non-admin users to / (not /login)
☐ Header shows user name and Sign out button
☐ Logout clears store and navigates to /login
☐ PR: feat/day-2-frontend-auth — screenshots of login, dashboard, and DevTools localStorage

COMMON MISTAKES
• Reading accessToken from localStorage directly — use the Zustand store, it has logic
• Not persisting refreshToken — user is logged out on every page refresh
• Persisting accessToken — it expires in 15 minutes, no point persisting it
• Calling logout() without revoking the refreshToken on the backend — token remains valid on server
• Not redirecting logged-in users away from /login — they can navigate there manually
`,

// ─────────────────────────────────────────────────────────────────────────────

'W4D3': `
REFRESH TOKENS AND ROLE-BASED ACCESS
Yesterday you built login and protected routes. One problem remains: the access token expires in 15 minutes. Without a refresh mechanism, the user gets logged out every 15 minutes — a terrible experience. Today you fix that silently and add role-based access control.

──────────────────────────────
WHY TWO TOKENS?
──────────────────────────────

Access token — short-lived (15 minutes):
  • Sent with every API request in the Authorization header
  • If intercepted by an attacker, it only works for 15 minutes
  • Cannot be revoked individually — the server does not track them

Refresh token — long-lived (7 days):
  • Stored in the database — can be revoked (logout invalidates it immediately)
  • Never sent to general API endpoints — only to POST /api/auth/refresh
  • Used only to get a new access token when the old one expires

The flow:
  Request → 401 Token expired → Send refresh token → Get new access token → Retry original request → Success

The user never sees any of this. It happens silently in the Axios interceptor.

──────────────────────────────
THE REFRESH ENDPOINT
──────────────────────────────

CODE EXAMPLE
// src/routes/auth.js — add the refresh route
const { verifyRefreshToken, signAccessToken, signRefreshToken } = require('../lib/auth')

// POST /api/auth/refresh
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw new AppError('Refresh token required', 401)

  // Verify the token is cryptographically valid
  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw new AppError('Invalid or expired refresh token', 401)
  }

  // Check it exists in the database (not revoked by logout)
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Refresh token revoked or expired', 401)
  }

  // Issue a new access token (rotate refresh token for extra security)
  const user = await prisma.user.findUnique({
    where:  { id: payload.userId },
    select: { id: true, role: true }
  })
  if (!user) throw new AppError('User not found', 401)

  const newPayload      = { userId: user.id, role: user.role }
  const newAccessToken  = signAccessToken(newPayload)
  const newRefreshToken = signRefreshToken(newPayload)

  // Delete old refresh token, save new one
  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { token: refreshToken } }),
    prisma.refreshToken.create({
      data: {
        token:     newRefreshToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
  ])

  res.json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken }
  })
}))
---

──────────────────────────────
THE AXIOS RESPONSE INTERCEPTOR — SILENT TOKEN REFRESH
──────────────────────────────

This is the most important piece. When any API call returns 401, the interceptor:
  1. Pauses and queues the failed request
  2. Uses the refresh token to get a new access token
  3. Retries all queued requests with the new token
  4. If refresh fails — logs the user out

CODE EXAMPLE
// src/lib/api.js — complete version with both interceptors
import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// ── Request interceptor — attach access token ──────────────────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = \`Bearer \${token}\`
  return config
})

// ── Response interceptor — silent token refresh ────────────────────────────
let isRefreshing = false
let failedQueue  = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        original.headers.Authorization = \`Bearer \${token}\`
        return api(original)
      })
    }

    original._retry   = true
    isRefreshing      = true

    const { refreshToken, setTokens, logout } = useAuthStore.getState()

    try {
      const res = await axios.post(
        \`\${import.meta.env.VITE_API_URL}/auth/refresh\`,
        { refreshToken }
      )
      const { accessToken: newAccess, refreshToken: newRefresh } = res.data.data

      setTokens({ accessToken: newAccess, refreshToken: newRefresh })
      processQueue(null, newAccess)

      original.headers.Authorization = \`Bearer \${newAccess}\`
      return api(original)
    } catch (err) {
      processQueue(err)
      logout()
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
---

The queue prevents multiple simultaneous refresh calls when several requests fail with 401 at the same time. Only one refresh happens — the rest wait for the result.

──────────────────────────────
ROLE-BASED ACCESS CONTROL (RBAC)
──────────────────────────────

RBAC restricts what users can see and do based on their role. You have two roles: STUDENT and ADMIN.

Backend — already done in Day 1 with requireAdmin middleware:
  app.use('/api/admin', authenticate, requireAdmin, adminRouter)

Frontend — show/hide UI elements based on role:

CODE EXAMPLE
// Show different UI based on role
import useAuthStore from '../store/authStore'

function Sidebar() {
  const user = useAuthStore(state => state.user)

  return (
    <nav>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/leads">Leads</NavLink>

      {/* Only visible to ADMINs */}
      {user?.role === 'ADMIN' && (
        <>
          <NavLink to="/admin/students">Students</NavLink>
          <NavLink to="/admin/cohorts">Cohorts</NavLink>
        </>
      )}
    </nav>
  )
}
---

IMPORTANT: Hiding UI elements is NOT security. A user can open DevTools and call admin API routes directly. The requireAdmin middleware on the backend is what actually enforces access. The frontend just improves UX by not showing irrelevant options.

CODE EXAMPLE
// AdminRoute — redirect non-admins silently
function AdminRoute({ children }) {
  const user = useAuthStore(state => state.user)
  if (!user)                 return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/"     replace />
  return children
}
---

──────────────────────────────
CREATING AN ADMIN USER
──────────────────────────────

The default role is STUDENT. To create an admin for testing, update directly in Prisma Studio or seed script — do not expose a "make me admin" API endpoint.

TRY IT NOW
$ npx prisma studio
---

Find your user, change role from STUDENT to ADMIN, save. Or add to seed.js:

CODE EXAMPLE
// prisma/seed.js
await prisma.user.upsert({
  where:  { email: 'admin@devforge.com' },
  update: {},
  create: {
    name:         'Admin',
    email:        'admin@devforge.com',
    passwordHash: await bcrypt.hash('Admin@123', 12),
    role:         'ADMIN'
  }
})
---

──────────────────────────────
SECURING SENSITIVE OPERATIONS
──────────────────────────────

Beyond role checks, consider what each endpoint exposes:

CODE EXAMPLE
// Student can only see their own data — never another student's
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where:  { id: req.user.id },  // always use req.user.id, never req.params.id
    select: { id: true, name: true, email: true, role: true }
  })
  res.json({ success: true, message: 'Profile fetched', data: user })
}))

// Admin can see any student — but still validate the id exists
router.get('/admin/students/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const student = await prisma.user.findUnique({
    where:  { id: req.params.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })
  if (!student) throw new AppError('Student not found', 404)
  res.json({ success: true, message: 'Student fetched', data: student })
}))
---

──────────────────────────────
TOKEN EXPIRY EDGE CASES
──────────────────────────────

Four scenarios to handle:

  Access token expired, refresh token valid:
  → Interceptor refreshes silently. User notices nothing.

  Access token expired, refresh token also expired (>7 days inactive):
  → Refresh returns 401. Interceptor calls logout(). User sent to /login.

  User logs out on another device:
  → Their refresh token is deleted from the database.
  → Next refresh attempt returns 401. User sent to /login.

  Access token tampered with:
  → jwt.verify() throws JsonWebTokenError. User gets 401.
  → They must log in again to get a valid token.

──────────────────────────────
WEEK 4 WRAP-UP — WHAT YOU NOW HAVE
──────────────────────────────

You have completed the auth system — one of the hardest parts of any full-stack application:

  Backend:
  • bcrypt password hashing — plain text never stored
  • JWT access tokens (15m) + refresh tokens (7d)
  • authenticate middleware — protects all routes
  • requireAdmin middleware — restricts admin routes
  • Refresh token rotation — revokes old token on each refresh
  • Logout — deletes refresh token from database

  Frontend:
  • Zustand auth store — user and tokens in global state
  • persist middleware — survives page refresh
  • Axios request interceptor — attaches token automatically
  • Axios response interceptor — silent token refresh on 401
  • ProtectedRoute — redirects unauthenticated users
  • AdminRoute — redirects non-admin users
  • RBAC in sidebar — shows/hides nav items by role

Week 4 Day 4 is the Project 1 kickoff. You will take everything from Weeks 1-4 and start building Lead Bill — a real CRM and billing SaaS.

SUBMISSION CHECKLIST
☐ POST /api/auth/refresh issues new access + refresh token
☐ Old refresh token deleted on rotation — tested in Prisma Studio
☐ Axios response interceptor retries failed requests after refresh
☐ Multiple simultaneous 401s trigger only one refresh call (queue logic)
☐ Logout deletes refresh token from DB and clears Zustand store
☐ requireAdmin returns 403 on backend, AdminRoute redirects on frontend
☐ ADMIN user seeded or created via Prisma Studio
☐ Admin-only nav links hidden from STUDENT users
☐ End-to-end test: login → use app → wait 15 mins → make request → token refreshes silently
☐ PR: feat/day-3-refresh-tokens

COMMON MISTAKES
• Not rotating the refresh token — old token remains valid after use, increases attack window
• Storing refresh token in memory only — user is logged out on every page refresh
• Using the access token for refresh — it has a different secret, verification will fail
• Calling api.post('/auth/refresh') inside the interceptor using the same api instance — causes infinite loop on refresh failure, use a plain axios call instead
• Hiding admin UI without protecting the backend route — frontend hiding is UX, backend middleware is security
• Not clearing the queue on refresh failure — queued requests hang forever if refresh throws
`,

// ─────────────────────────────────────────────────────────────────────────────

'W4D4': `
PROJECT 1 KICKOFF — LEADBILL
YOU ARE NOT STARTING FROM ZERO
Before you read anything else, look at what you already have:

  Week 1: A GitHub repo called mini-lead-manager with JS scripts that filter leads by status, calculate totals, and fetch data from APIs.
  Week 2: A working Express + PostgreSQL backend with full CRUD for leads — POST /leads, GET /leads, PUT /leads/:id, DELETE /leads/:id.
  Week 3: A React frontend connected to that exact backend — lead list page, add lead form, TanStack Query, React Router.
  Week 4 (Days 1–3): JWT auth added. Protected routes. Login page. Token stored in Zustand, attached to every request.

That is Lead Bill. You have already built the core of it.

Starting today you do not rebuild it — you evolve it. The mini-lead-manager repo becomes the Lead Bill repo. Every feature from here is an addition, not a restart.

What changes from today:
  • The product has a real name, a real purpose, and real ticket codes (LB-001, LB-002, ...)
  • You add modules the mini version was missing: clients, quotations, invoices, PDF download, payments, dashboard, AI proposals
  • The code quality standard goes up: each feature must match the acceptance criteria on the ticket before it is submitted
  • Every PR is reviewed — by the AI reviewer first, then manually if flagged

──────────────────────────────

Weeks 1 through 4 taught you every tool you need. Starting today you use them all together to build a real product — a full-stack SaaS application that freelancers and agencies would actually pay for.

──────────────────────────────
WHAT IS LEADBILL?
──────────────────────────────

LeadBill is a CRM and billing SaaS for freelancers, agencies, consultants, interior designers, and service providers. The problem it solves is real:

  • Leads tracked in WhatsApp contacts and phone notes
  • Quotations made in Word or Excel, sent over email, never followed up
  • Invoices created manually, GST calculations wrong, PDF formatting inconsistent
  • No visibility into pending payments, overdue invoices, or won/lost pipeline

LeadBill puts everything in one place — from the first lead conversation to the final payment.

Core workflow:
  Lead → Proposal → Quotation → Invoice → Payment Tracking

Target users: freelancers, interior designers, digital marketing agencies, web development agencies, consultants, event planners, creative agencies, small service businesses.

This is the product you will present in your interview:
"I built a CRM and billing SaaS where users track leads, convert them into clients, generate GST quotations and invoices, record payments, and use AI to create proposal content."

──────────────────────────────
WHAT YOU ARE BUILDING — THE 8 MODULES
──────────────────────────────

Module 1 — Authentication
  Register, login, logout with JWT. Protected routes. User profile page.
  Everything from Week 4 — already built. This is your foundation.

Module 2 — Lead Management
  CRM pipeline with source, status, notes, and follow-up date.
  Lead detail page showing full history.
  Statuses: New → Contacted → Proposal Sent → Negotiation → Won → Lost

Module 3 — Client Management
  Convert a Won lead into a Client with one click.
  Store: business name, contact person, phone, email, GST number, state, billing address.
  Client detail page shows all their quotations, invoices, and payment history.

Module 4 — Proposal / Quotation Builder
  Create quotations with service line items: name, quantity, price, discount.
  Auto-calculate subtotal, GST (CGST + SGST or IGST), total.
  Statuses: Draft, Sent, Accepted, Rejected.
  Validity date field. Terms and conditions text.

Module 5 — Invoice Generation
  Create an invoice from an accepted quotation (one click) or manually.
  GST logic: CGST + SGST for same-state, IGST for inter-state.
  Auto-generate invoice number (INV-2024-001 format).
  Statuses: Draft, Sent, Partially Paid, Paid, Overdue.
  PDF download.

Module 6 — Payment Tracking
  Record payments against an invoice: Cash, UPI, Bank Transfer, Card.
  Partial payments — record multiple payments until invoice is fully paid.
  Show payment history, pending balance, and overdue invoices.
  Auto-mark invoice as Paid when balance reaches zero.

Module 7 — Dashboard
  Total leads this month. Won vs Lost breakdown.
  Total revenue (sum of paid invoices). Pending payments amount.
  Overdue invoices count and value. Recent invoice list.
  All numbers calculated from real database data using Prisma aggregates.

Module 8 — AI Proposal Writer
  User fills: client name, service type, project requirement, budget, timeline.
  Calls Claude/OpenAI/Gemini API to generate: proposal description, scope of work, deliverables, terms draft.
  Output is editable before saving to the quotation.

──────────────────────────────
TECH STACK — WHAT YOU WILL USE
──────────────────────────────

  Frontend:  React + Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod
  Backend:   Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, bcrypt, PDF generation
  AI:        Claude API (Anthropic) for AI Proposal Writer
  Deploy:    Vercel (frontend), Railway or Render (backend), Neon or Supabase (database)

Two new tools this project introduces:
  React Hook Form + Zod → form management and validation (replaces manual useState forms)
  PDF library           → generate downloadable invoice PDFs (Week 6)

──────────────────────────────
DATABASE SCHEMA — DESIGN BEFORE YOU CODE
──────────────────────────────

Never write a route before your schema is finalised. Schema changes midway through a project cause cascading refactors. Plan it now.

Core models and relationships:

  User
    id, name, email, passwordHash, role, businessName, gstin, phone
    has many: Lead, Client, Quotation, Invoice

  Lead
    id, userId, name, phone, email, source, status, notes, followUpDate, createdAt
    source: WEBSITE | REFERRAL | SOCIAL | COLD_CALL | OTHER
    status: NEW | CONTACTED | PROPOSAL_SENT | NEGOTIATION | WON | LOST
    on WON → creates a Client

  Client
    id, userId, leadId (optional link back), businessName, contactPerson
    phone, email, gstin, state, address, createdAt
    has many: Quotation, Invoice

  Quotation
    id, userId, clientId, title, lineItems (JSON), subtotal, discount
    gstRate, gstType (CGST_SGST | IGST), gstAmount, total
    status: DRAFT | SENT | ACCEPTED | REJECTED
    validUntil, terms, notes, createdAt

  Invoice
    id, userId, clientId, quotationId (optional), invoiceNumber
    lineItems (JSON), subtotal, gstType, gstAmount, total
    status: DRAFT | SENT | PARTIALLY_PAID | PAID | OVERDUE
    dueDate, notes, createdAt

  Payment
    id, invoiceId, userId, amount, method, reference, notes, paidAt

Relationships:
  User → Lead (1:many)
  User → Client (1:many)
  Client → Quotation (1:many)
  Client → Invoice (1:many)
  Quotation → Invoice (1:1 optional)
  Invoice → Payment (1:many)

lineItems stored as JSON — a quotation can have any number of line items without a separate table:
  [{ name: "Logo Design", qty: 1, price: 15000, discount: 0 }]

──────────────────────────────
PROJECT SETUP — DO THIS TODAY
──────────────────────────────

Step 1 — Create the GitHub repository:
TRY IT NOW
$ mkdir leadbill && cd leadbill
$ git init
$ git checkout -b main
$ touch README.md .gitignore
$ echo "node_modules/" >> .gitignore
$ echo ".env" >> .gitignore
$ git add . && git commit -m "chore: initial repo setup"
---

Create the repo on GitHub and push:
TRY IT NOW
$ git remote add origin git@github.com:yourusername/leadbill.git
$ git push -u origin main
---

Step 2 — Backend setup:
TRY IT NOW
$ mkdir backend && cd backend
$ npm init -y
$ npm install express cors dotenv @prisma/client jsonwebtoken bcryptjs
$ npm install --save-dev prisma nodemon
$ mkdir -p src/routes src/middleware src/lib
$ touch src/server.js .env
$ npx prisma init
---

Step 3 — Frontend setup:
TRY IT NOW
$ cd ..
$ npm create vite@latest frontend -- --template react
$ cd frontend
$ npm install
$ npm install axios react-router-dom @tanstack/react-query zustand
$ npm install react-hook-form zod @hookform/resolvers
$ npm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init -p
---

Step 4 — Configure Tailwind:
CODE EXAMPLE
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      }
    }
  },
  plugins: []
}
---

CODE EXAMPLE
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
---

Step 5 — Add the schema and run first migration:
CODE EXAMPLE
// prisma/schema.prisma — paste the full schema from the section above
---

TRY IT NOW
$ cd backend
$ npx prisma migrate dev --name init_leadbill
$ npx prisma generate
$ npx prisma studio
---

Confirm all tables exist in Prisma Studio before writing any routes.

──────────────────────────────
REACT HOOK FORM + ZOD — YOUR NEW FORM STANDARD
──────────────────────────────

React Hook Form manages forms without re-rendering on every keystroke. Zod validates the schema. Together they replace the manual useState + validation approach from Week 3.

CODE EXAMPLE
// Example: Lead creation form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const leadSchema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  source: z.enum(['WEBSITE', 'REFERRAL', 'SOCIAL', 'COLD_CALL', 'OTHER']),
})

function CreateLeadForm({ onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { source: 'WEBSITE' }
  })

  const submit = async (data) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <input
          {...register('name')}
          placeholder="Lead name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register('phone')}
          placeholder="10-digit phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>
      <select {...register('source')} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
        <option value="WEBSITE">Website</option>
        <option value="REFERRAL">Referral</option>
        <option value="SOCIAL">Social Media</option>
        <option value="COLD_CALL">Cold Call</option>
        <option value="OTHER">Other</option>
      </select>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-60"
      >
        {isSubmitting ? 'Adding...' : 'Add Lead'}
      </button>
    </form>
  )
}
---

No useState for form fields. No manual validation. Zod schema is the single source of truth for what is valid. Use this pattern for every form in LeadBill.

──────────────────────────────
WEEK 5 AND 6 PLAN — WHAT YOU WILL BUILD WHEN
──────────────────────────────

WEEK 5 — Core Features:
  W5L1 → Finalise schema, run migration, confirm all tables in Studio
  W5L2 → Auth routes working (already built in Week 4), leads CRUD API
  W5L3 → Leads list page, lead detail page, status pipeline view
  W5L4 → Client management, quotation builder with line items and GST calc
  W5L5 → Invoice generation from quotation, payment recording

WEEK 6 — Polish and Deploy:
  W6L1 → Cloudinary setup for any file uploads
  W6L2 → PDF generation for invoices using pdf-lib or puppeteer
  W6L3 → AI Proposal Writer using Claude API
  W6L4 → Dashboard with real aggregated stats
  W6L5 → Deploy frontend to Vercel, backend to Railway, database to Neon

──────────────────────────────
GIT WORKFLOW FOR THIS PROJECT
──────────────────────────────

Branch naming for LeadBill:
  feat/auth-backend          → register, login, logout, middleware
  feat/lead-management       → full lead CRUD and pipeline
  feat/client-management     → client create, list, detail
  feat/quotation-builder     → quotation CRUD with line items
  feat/invoice-generation    → invoice create, PDF download
  feat/payment-tracking      → record and track payments
  feat/dashboard             → stats and recent activity
  feat/ai-proposal-writer    → Claude API integration

One branch per module. One PR per branch. Every PR goes through the DevForge AI review system — your code is checked against the project rubric automatically.

PR description for every submission must include:
  • What was built
  • Postman screenshots for all backend endpoints
  • Browser screenshot of the working UI
  • Any decisions you made about the schema or business logic

──────────────────────────────
HOW THE AI CODE REVIEW WORKS
──────────────────────────────

When you submit a PR URL in the DevForge platform, it automatically:
  1. Fetches your PR diff from GitHub
  2. Checks it against the LeadBill project rubric
  3. Reviews: code quality, security, schema correctness, API design, error handling
  4. Returns a verdict: MERGE_READY, NEEDS_WORK, or CRITICAL_ISSUES
  5. On MERGE_READY, the PR is auto-merged into main

The rubric checks for:
  • No plain-text passwords stored
  • JWT_SECRET not hardcoded — reads from process.env
  • All routes protected with authenticate middleware
  • Input validation before database writes
  • Correct HTTP status codes (201 for create, 404 for not found, etc.)
  • No sensitive data (passwordHash) returned in API responses
  • GST calculation logic correct for same-state vs inter-state

Read the feedback carefully. Fix every item before resubmitting. The review is the same process a senior developer would do before approving your PR at a company.

──────────────────────────────
THE GST CALCULATION — UNDERSTAND THIS BEFORE MODULE 4
──────────────────────────────

India has three GST types depending on whether the transaction is within the same state or across states:

  Same state (seller state = buyer state):
    CGST = half the GST rate   (e.g., 9% if total GST is 18%)
    SGST = half the GST rate   (e.g., 9% if total GST is 18%)
    Total GST = CGST + SGST = 18%

  Inter-state (seller state ≠ buyer state):
    IGST = full GST rate       (e.g., 18%)
    No CGST or SGST

  GST rates used most by freelancers: 18% (services), 12% (some goods)

CODE EXAMPLE
function calculateGST(subtotal, gstRate, gstType) {
  const gstAmount = subtotal * (gstRate / 100)
  const total     = subtotal + gstAmount

  if (gstType === 'CGST_SGST') {
    return {
      subtotal,
      cgst:      gstAmount / 2,
      sgst:      gstAmount / 2,
      igst:      0,
      gstAmount,
      total
    }
  }

  return {
    subtotal,
    cgst:      0,
    sgst:      0,
    igst:      gstAmount,
    gstAmount,
    total
  }
}
---

Build this utility once in src/lib/gst.js and use it in both the quotation builder and invoice generator.

SUBMISSION CHECKLIST — DAY 4
☐ LeadBill schema understood — can draw the entity relationship diagram from memory
☐ GitHub repository created with main branch protected
☐ Backend: all dependencies installed, folder structure created, .env configured
☐ Frontend: Vite + React + Tailwind + React Router + TanStack Query + React Hook Form + Zod installed
☐ Prisma schema written with all 6 models (User, Lead, Client, Quotation, Invoice, Payment)
☐ First migration ran — all tables visible in Prisma Studio
☐ React Hook Form example form working — validation errors showing correctly
☐ GST calculation utility written and tested in the Node REPL
☐ PR: feat/project-setup — screenshot of Prisma Studio showing all tables

WHAT MAKES A GOOD LEADBILL PROJECT
The difference between a passing project and one that impresses in an interview:
  • Every module works end-to-end — not just the happy path
  • GST calculation is correct for both same-state and inter-state
  • PDF invoice downloads look professional
  • Dashboard numbers are accurate and come from real database aggregates
  • AI Proposal Writer produces useful, formatted output
  • The UI is clean and usable — not just functional
  • Code is structured — reviewers can read any file and understand it in 30 seconds
`,

// ─── PROJECT KICKOFFS ────────────────────────────────────────────────────────

'W5L1': `
PROJECT KICKOFF — RESTAURANT FLOW
You are about to build a real food ordering system from scratch. By the end of Week 6, customers will be able to browse a menu, place orders, and pay online. Restaurant staff will see those orders arrive live on a kitchen dashboard and push status updates that customers see in real time — no page refresh.

This is not a tutorial. There is no step-by-step guide. You will get tickets, acceptance criteria, and a tech stack. The rest is on you.

──────────────────────────────
WHAT YOU ARE BUILDING
──────────────────────────────

Restaurant Flow has two sides:

Customer side
• Browse a restaurant's menu grouped by category
• Add items to a cart, see running total in ₹
• Enter name and phone, place an order
• Pay via Razorpay (UPI, card, netbanking)
• Get an order ID and see live status updates: PENDING → CONFIRMED → PREPARING → READY → DELIVERED

Staff side (kitchen dashboard)
• Protected route — requires login
• See all active orders in real time as they come in
• Click a button to move each order through status stages
• New orders appear at the top instantly — no refresh

──────────────────────────────
THE TECH STACK AND WHY
──────────────────────────────

• Node.js + Express — REST API for menu, orders, payment
• PostgreSQL + Prisma — stores restaurants, menus, orders, payments
• Razorpay — payment gateway. You create an order server-side, verify the payment signature server-side with HMAC-SHA256. The client never handles money logic
• Socket.io — real-time communication. When a staff member updates an order status, that update is pushed to the customer's browser instantly over a persistent connection
• React + TanStack Query — customer ordering page and kitchen dashboard
• Railway (backend) + Vercel (frontend) — production deployment

──────────────────────────────
HOW THE 8 TICKETS FIT TOGETHER
──────────────────────────────

  RFC1-1  Schema setup — defines every model in Prisma before writing a single API
  RFC1-2  Menu + Order API — customers can browse and place orders
  RFC1-3  Razorpay — customers pay, you verify server-side before confirming
  RFC1-4  Order Status API — staff move orders through stages with validation
  RFC1-5  Socket.io — wire up real-time events for both customers and staff
  RFC1-6  Customer page — React UI: menu → cart → checkout → live status
  RFC1-7  Kitchen dashboard — React UI: live order feed, status controls
  RFC1-8  Deploy — Railway backend, Vercel frontend, production Razorpay keys

Do them in order. RFC1-2 depends on RFC1-1 being done. RFC1-5 depends on RFC1-4.

──────────────────────────────
A NOTE ON AI TOOLS
──────────────────────────────

You can and should use Cursor, Claude, or Copilot while building. Use them to write faster, understand errors, and explore options.

The rule: every line of code you submit in a PR must be code you can explain. If a mentor asks "why is the Razorpay signature verified this way?" you need to be able to answer. That is what you are training — judgment, not typing speed.

──────────────────────────────
BEFORE YOU START RFC1-1
──────────────────────────────

☐ Create a new GitHub repository called restaurant-flow (fresh repo — not your Mini Lead Manager)
☐ Clone it locally and open in VS Code
☐ Run git checkout -b rfc1-1-schema-setup
☐ Create folder structure: src/routes/, src/lib/, prisma/
☐ Run npm init -y and install: express, @prisma/client, prisma, dotenv, cors, jsonwebtoken, bcryptjs
☐ Create .env with DATABASE_URL and JWT_SECRET
☐ Create .env.example with the same keys but no values
☐ Run npx prisma init
☐ You are ready. Open RFC1-1 and start with the schema

COMMON MISTAKES
• Starting the schema without planning all the relationships first — draw it on paper first
• Storing prices as decimal/float — always use integers (paise). ₹150 = 15000 paise
• Instantiating Prisma Client in every route file — export one singleton from src/lib/prisma.js
• Committing .env to GitHub — add it to .gitignore before your first commit
`,

'W7L1': `
PROJECT KICKOFF — LEAD BILL
You are not starting from scratch. Lead Bill is a direct evolution of the Mini Lead Manager you built in Weeks 1–4. Same repository. Same database. You are adding a full GST billing system on top of existing code.

This is intentional. In real companies, you never build from scratch. You extend what exists. Week 7 is your first experience working in a live codebase — adding features without breaking what already works.

──────────────────────────────
WHAT YOU ARE BUILDING
──────────────────────────────

Lead Bill is a billing SaaS for freelancers and small businesses. Users manage their clients, create GST invoices, generate downloadable PDFs, upload supporting documents, and track which invoices are paid or overdue.

The final product has:

Invoice management
• Create invoices with multiple line items
• GST auto-calculated (CGST + SGST for same state, IGST for different state)
• Invoice total = subtotal + GST — always calculated server-side
• Invoice status: DRAFT → SENT → PAID → OVERDUE

PDF generation
• Every invoice can be downloaded as a PDF
• Generated server-side using pdf-lib — not a third-party API
• PDF includes company logo, line items table, GST breakdown, total

File storage
• Clients can upload logos and supporting documents
• Files stored on Cloudinary — not on your server filesystem
• Server stores only the Cloudinary URL, never the file itself

Dashboard
• Revenue this month vs last month
• Overdue invoices count and amount
• Recent activity feed
• All numbers come from real database aggregates — not hardcoded

──────────────────────────────
THE TECH STACK AND WHY
──────────────────────────────

• Express + Prisma — same backend you already have, extended
• pdf-lib — generate PDFs in Node.js without any browser or external service
• Cloudinary — file upload and storage API. You send a file, it returns a URL
• React + TanStack Query — the frontend dashboard you built in Week 3, extended
• GST logic — Indian tax rules: same state = CGST + SGST (9% + 9%), different state = IGST (18%)

──────────────────────────────
HOW THE 8 TICKETS FIT TOGETHER
──────────────────────────────

  LBC1-1  Extend the Express server — add Invoice, InvoiceItem, Payment models to your existing schema
  LBC1-2  Invoice API — create invoices with line items, server-side totals, GST calculation
  LBC1-3  GST logic — same-state vs inter-state detection, correct tax breakdown
  LBC1-4  PDF generation — server-side invoice PDF with pdf-lib
  LBC1-5  Cloudinary upload — file upload endpoint, store URL in DB
  LBC1-6  Dashboard aggregates — revenue, overdue, activity from real queries
  LBC1-7  React frontend — invoice list, create form, PDF download, dashboard
  LBC1-8  Deploy — updated Railway backend, updated Vercel frontend

──────────────────────────────
CRITICAL: NEVER RESTART THE REPO
──────────────────────────────

This is the most important rule for Lead Bill:
  • Do NOT create a new repository
  • Do NOT delete your Mini Lead Manager code
  • Add new models to your existing schema
  • Add new routes alongside your existing routes
  • The Lead and Client tables from Week 4 stay — you are building on top of them

If you think "I will just start fresh" — that is the wrong instinct. Learning to extend a live codebase is the skill.

──────────────────────────────
BEFORE YOU START LBC1-1
──────────────────────────────

☐ Pull the latest main branch of your Mini Lead Manager repo
☐ Run git checkout -b lbc1-1-schema-extension
☐ Make sure npm run dev works — the existing server boots without errors
☐ Open your existing schema.prisma — you will add Invoice, InvoiceItem, Payment models here
☐ Have your .env ready with DATABASE_URL pointing to your existing database

COMMON MISTAKES
• Creating a new repo — do not do this
• Rounding GST amounts — store as integers (paise), calculate with integer math
• Generating PDFs on the client — always server-side with pdf-lib
• Storing uploaded files on the server filesystem — Railway's filesystem is ephemeral (deleted on deploy). Always use Cloudinary
`,

'W10L1': `
PROJECT KICKOFF — CLIENTDESK AI
This is your final project. ClientDesk AI is an AI-powered customer support desk. Companies register on the platform, their support agents log in, customers raise support tickets, and the AI assistant (Claude API) drafts responses that agents review and send.

By the end of Week 11, you will have a multi-tenant SaaS application with a full CI/CD pipeline running on GitHub Actions. Every push to main automatically runs tests, builds Docker, and deploys to production.

──────────────────────────────
WHAT YOU ARE BUILDING
──────────────────────────────

ClientDesk AI serves three types of users:

Company admin
• Registers the company on the platform
• Manages agents and their permissions
• Sees analytics: ticket volume, response time, resolution rate

Support agent
• Logs in, sees their assigned support tickets
• Opens a ticket, reads the customer's message
• Clicks "Generate AI Draft" — Claude API generates a response based on ticket context
• Agent reviews the draft, edits if needed, and sends it
• Agent can approve or reject the AI draft — this trains future behaviour

Customer
• Submits a support ticket (no account needed for basic tier)
• Gets email notification when their ticket is resolved
• Can see ticket status via a public link

──────────────────────────────
THE TECH STACK AND WHY
──────────────────────────────

• Express + Prisma — multi-tenant backend (every query scoped to companyId)
• Claude API (Anthropic) — AI draft generation. You send the ticket subject + message history, Claude returns a professional response draft
• Nodemailer — send email notifications to customers when tickets are updated
• GitHub Actions — CI/CD pipeline. On push to main: run lint → run tests → build → deploy to Railway
• React — agent dashboard, ticket view, AI draft interface
• Railway (backend) + Vercel (frontend) — same production stack as before

──────────────────────────────
THE KEY CONCEPT — MULTI-TENANCY
──────────────────────────────

Multi-tenancy means multiple companies share the same database but never see each other's data.

Every query in your backend must be scoped:
  ✓  prisma.ticket.findMany({ where: { companyId: req.user.companyId } })
  ✗  prisma.ticket.findMany()   ← this leaks all companies' data

This is the most important architectural discipline in ClientDesk. One missing companyId filter is a data breach.

──────────────────────────────
HOW THE 8 TICKETS FIT TOGETHER
──────────────────────────────

  CAC1-1  Schema — Company, Agent, Customer, SupportTicket, Message, AiDraft models
  CAC1-2  Auth — company registration, agent login, JWT with companyId in payload
  CAC1-3  Ticket API — create tickets, list with filters, assign to agents
  CAC1-4  AI Draft — Claude API integration, prompt engineering, draft storage
  CAC1-5  Email notifications — Nodemailer, send on ticket create and resolve
  CAC1-6  React frontend — agent dashboard, ticket detail, AI draft UI
  CAC1-7  GitHub Actions CI/CD — lint, test, build, deploy pipeline
  CAC1-8  Production polish — environment variables, error monitoring, final deploy

──────────────────────────────
HOW TO CALL THE CLAUDE API
──────────────────────────────

CODE EXAMPLE
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const response = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 500,
  messages: [{
    role: 'user',
    content: \`You are a support agent for \${company.name}.
A customer submitted this ticket:
Subject: \${ticket.subject}
Message: \${ticket.message}

Write a professional, helpful response in 3-4 sentences.\`
  }]
})

const draft = response.content[0].text
---

The prompt is everything. A vague prompt gives a vague response. Experiment with how you describe the company's tone and the context you provide.

──────────────────────────────
BEFORE YOU START CAC1-1
──────────────────────────────

☐ Create a new GitHub repository called clientdesk-ai
☐ This is a fresh repo — not Lead Bill, not Restaurant Flow
☐ Plan the multi-tenant schema on paper before writing any code
☐ Every model must have a companyId — draw the relationships before opening Prisma
☐ Add ANTHROPIC_API_KEY to your .env — get a key from console.anthropic.com
☐ You will set up GitHub Actions in CAC1-7 — do not skip it, CI/CD is a core skill

COMMON MISTAKES
• Missing companyId on a model — adds it later and breaks everything
• Calling Claude API from the frontend — API keys must never leave your backend
• Building CI/CD last as an afterthought — it is a ticket, treat it like one
• Not validating that the agent belongs to the same company as the ticket they are accessing
`,

}
