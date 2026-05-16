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

Week 1 — Mini Lead Manager
  React: Login page, Dashboard, Lead list, Add lead form
  Express: Auth routes, Lead CRUD API
  PostgreSQL: users table, leads table

Week 2-4 — InvoiceWala (GST Invoice Tool for service businesses)
  Add: PDF invoice generation, GST calculation, payment tracking

Week 4-6 — ClassPro (Tuition Centre Management)
  Add: Multi-role auth (owner/staff/student), fee management, attendance

Week 6-8 — DeliverDesk (Local Delivery Management)
  Add: Real-time tracking, document upload, full deployment to production

By the end you will have built 3 complete full-stack products using this exact stack — frontend, backend, database, auth, payments, and deployment.

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

'W1D1': `
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
WHAT IS REACT AND WHY TEAMS USE IT
React is a JavaScript library for building user interfaces. Created by Facebook, used at Instagram, Airbnb, Notion, Swiggy, Razorpay, and almost every modern product company.

The core idea: instead of updating HTML manually when data changes, you describe what the UI should look like for a given set of data — and React handles all the updates automatically. This makes building complex, interactive UIs manageable.

Vite is the build tool that runs React in development. It starts fast and reloads changes instantly.

──────────────────────────────
COMPONENTS — THE CORE IDEA
──────────────────────────────

A component is a reusable piece of UI. Think of it like a LEGO brick — you build small pieces and assemble them into a full screen.

Every React component is just a JavaScript function that returns JSX. JSX looks like HTML but it is JavaScript — you can embed any JS expression inside {} curly braces.

CODE EXAMPLE
// LeadCard.jsx — displays one single lead
function LeadCard({ lead }) {
  return (
    <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <h3>{lead.name}</h3>
      <p>Phone: {lead.phone}</p>
      <p>Service: {lead.service}</p>
      <span style={{
        background: lead.status === 'NEW' ? '#dbeafe' : '#dcfce7',
        padding: '2px 8px',
        borderRadius: 4
      }}>
        {lead.status}
      </span>
    </div>
  )
}

export default LeadCard
---

{lead.name} injects the JavaScript variable into the HTML. This is how React connects data to the screen automatically.

──────────────────────────────
STATE — DATA THAT CHANGES
──────────────────────────────

State is data your component remembers. When state changes, React automatically re-renders the UI to show the new data. You don't touch the DOM directly — ever.

useState is the hook that adds state to a component.

CODE EXAMPLE
import { useState } from 'react'

function LeadForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: '',
    status: 'NEW'
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Lead name"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone number"
      />
      <button type="submit">Add Lead</button>
    </form>
  )
}
---

This is called a controlled input. React controls the input's value through state. This is the only correct way to handle forms in React — without it, you cannot validate or reset the form programmatically.

──────────────────────────────
HANDLING FORM SUBMISSION
──────────────────────────────

When a form submits, always call e.preventDefault() first. Without it, the browser reloads the page and you lose all state — a very common mistake on Day 2.

CODE EXAMPLE
function App() {
  const [leads, setLeads] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', service: '' })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.phone || !form.service) {
      alert('Name, phone, and service are required')
      return
    }

    // Add new lead to the list
    setLeads([...leads, { ...form, id: Date.now() }])

    // Reset form fields
    setForm({ name: '', phone: '', service: '' })
  }

  return (
    <div>
      <LeadForm form={form} setForm={setForm} onSubmit={handleSubmit} />
      <LeadList leads={leads} />
    </div>
  )
}
---

──────────────────────────────
DISPLAYING A LIST WITH .MAP()
──────────────────────────────

To display an array in JSX, use .map() to transform each item into a JSX element. Every item must have a unique key prop — React uses this to track which items changed.

CODE EXAMPLE
function LeadList({ leads }) {
  if (leads.length === 0) {
    return <p>No leads yet. Add one above.</p>
  }

  return (
    <div>
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  )
}
---

TRY IN CONSOLE
> const leads = [{id:1, name:"Ravi"}, {id:2, name:"Priya"}, {id:3, name:"Rahul"}]
> const names = leads.map(l => l.name)
> console.log(names)
---

──────────────────────────────
HOW TO STRUCTURE YOUR COMPONENTS
──────────────────────────────

Do not put everything in App.jsx. Real teams split the UI into small, focused files:

  App.jsx        → manages leads state, renders LeadForm + LeadList
  LeadForm.jsx   → handles input and validation, calls onSubmit from props
  LeadList.jsx   → receives leads array, renders a LeadCard for each
  LeadCard.jsx   → displays one lead's data

One file = one responsibility. This makes code easy to find, debug, and review.

Note: data in React state disappears on page refresh. That is expected today. Day 4 fixes this with a real database.

SUBMISSION CHECKLIST
☐ LeadForm with controlled inputs for all 6 fields
☐ Validation — name, phone, service required before submit
☐ On submit, lead appears in the list immediately without page reload
☐ Components split into separate files (LeadForm, LeadList, LeadCard)
☐ Basic Tailwind styling applied
☐ PR: feat/day-2-lead-form with screenshot

COMMON MISTAKES
• Input missing value={} — it looks like it works but you cannot control or reset it
• Mutating state directly: leads.push(newLead) — ALWAYS use setLeads([...leads, newLead])
• Missing key prop on .map() — React warns in console and performance degrades
• Everything inside one App.jsx file — create separate component files
• Form reloads page — missing e.preventDefault() in the submit handler
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D3': `
WHAT IS A BACKEND?
The backend is the part of your application that runs on a server — invisible to the user, but every single interaction goes through it. When a user fills a form, clicks submit, logs in, or views data — the backend handles all of it.

The backend's job:
  • Receive requests from the frontend (HTTP calls)
  • Validate all input — frontend validation can be bypassed by anyone with basic dev tools
  • Apply business rules — GST calculation, role checks, pricing logic
  • Read from and write to the database
  • Return a consistent, structured response every time

Think of it this way: the frontend is the face of the app. The backend is the brain. A beautiful UI that talks to a broken backend is useless. A plain UI that talks to a solid backend ships real products.

──────────────────────────────
THE FOLDER STRUCTURE REAL TEAMS USE
──────────────────────────────

Before writing a single line of code, set up a proper folder structure. This is how production backends are organized — not everything dumped in one file.

  backend/
    src/
      routes/       → one file per feature (leads.js, auth.js)
      middleware/   → reusable middleware (auth.js, errorHandler.js)
      lib/          → shared utilities (prisma.js, mailer.js)
      server.js     → Express app setup only — no business logic here
    prisma/
      schema.prisma
    .env
    package.json

This matters from Day 1. If you put all routes in server.js, it becomes unmanageable by Day 4.

──────────────────────────────
SETTING UP EXPRESS
──────────────────────────────

Express is the most widely used Node.js web framework. Razorpay, Zerodha, CRED, Swiggy — most Indian product companies use it for their APIs. It is minimal, fast, and you are in full control of every decision.

TRY IT NOW
$ mkdir backend && cd backend
$ npm init -y
$ npm install express cors dotenv
$ npm install --save-dev nodemon
---

Add to package.json:
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }

CODE EXAMPLE
// src/server.js
const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json()) // without this, req.body is always undefined

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => console.log(\`Server on http://localhost:\${PORT}\`))
---

TRY IT NOW
$ npm run dev
---

Open http://localhost:5000/api/health in your browser. You should see JSON. If you do — your server is alive. Teams use this endpoint to monitor uptime in production.

──────────────────────────────
THE STANDARD RESPONSE FORMAT — PICK ONE AND NEVER DEVIATE
──────────────────────────────

Every company decides on one response shape and every single endpoint follows it. If formats differ between routes, the frontend code to handle them becomes chaotic.

For this entire program use exactly this:
  Success → { "success": true,  "message": "Lead created",     "data": { ...lead } }
  Error   → { "success": false, "message": "Name is required", "data": null        }

This is not optional. Consistency in API responses is a team contract.

──────────────────────────────
WHAT IS HTTP METHOD AND WHY IT MATTERS
──────────────────────────────

Every API request has an HTTP method that declares the intent:
  GET    → retrieve data (no body)
  POST   → create something new (sends body)
  PATCH  → update part of a record (sends body)
  PUT    → replace an entire record (sends body)
  DELETE → remove a record (no body usually)

Using the wrong method is like walking into a store and shouting "DELETE" when you want to buy something. It breaks the contract.

──────────────────────────────
FULL CRUD API — LEADS (IN-MEMORY)
──────────────────────────────

Today we use an in-memory array. Tomorrow (Day 4) this gets replaced by a real database. The API shape stays exactly the same — only the data layer changes.

CODE EXAMPLE
// src/routes/leads.js
const express = require('express')
const router  = express.Router()

let leads = [] // temporary — replaced with Prisma on Day 4

// GET /api/leads — fetch all leads
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Leads fetched', data: leads })
})

// POST /api/leads — create a lead
router.post('/', (req, res) => {
  const { name, phone, service } = req.body

  if (!name || !phone || !service) {
    return res.status(400).json({
      success: false, message: 'Name, phone, and service are required', data: null
    })
  }

  const lead = {
    id:      Date.now().toString(),
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
  lead.status = req.body.status || lead.status
  res.json({ success: true, message: 'Lead updated', data: lead })
})

// DELETE /api/leads/:id — remove a lead
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

CODE EXAMPLE
// In src/server.js — register the routes
const leadsRouter = require('./routes/leads')
app.use('/api/leads', leadsRouter)
---

──────────────────────────────
HTTP STATUS CODES — USE THEM CORRECTLY
──────────────────────────────

Status codes tell the client what happened. Using wrong codes is a red flag in code review.

  200 OK           → request succeeded, data returned
  201 Created      → a new record was created (use for POST)
  400 Bad Request  → client sent invalid input (missing field, wrong format)
  401 Unauthorized → not authenticated (no token or invalid token)
  403 Forbidden    → authenticated but not allowed (wrong role)
  404 Not Found    → the record does not exist
  500 Server Error → something broke on the backend (database down, code crash)

Rule: never return 200 for an error. Never return 500 for bad input that the client can fix.

──────────────────────────────
TESTING IN POSTMAN — BEFORE TOUCHING FRONTEND
──────────────────────────────

Always test every API endpoint in Postman before connecting the frontend. If the API fails in Postman, the frontend cannot fix it — it will just hide the problem.

Test in this exact order:
  1. GET  /api/health              → confirms server is alive
  2. POST /api/leads               → body: { "name": "Ravi", "phone": "9876543210", "service": "Website" }
  3. GET  /api/leads               → confirm the lead appears
  4. PATCH /api/leads/:id          → body: { "status": "CONTACTED" }
  5. DELETE /api/leads/:id         → confirm it disappears
  6. POST /api/leads (missing name) → confirm 400 with error message

SUBMISSION CHECKLIST
☐ Folder structure: src/routes/leads.js, src/server.js (not all in one file)
☐ Server starts with npm run dev on port from .env
☐ GET /api/health returns 200 with timestamp
☐ POST /api/leads validates required fields — returns 400 if missing
☐ GET, PATCH, DELETE all work and return correct status codes
☐ All responses use { success, message, data } format
☐ PR: feat/day-3-express-api — Postman screenshots for all 5 endpoints

COMMON MISTAKES
• Missing app.use(express.json()) — req.body is undefined for every POST/PATCH request
• Putting all routes in server.js — breaks as the app grows, fails code review
• Using 200 for validation errors — always 400 for bad client input
• Testing in browser — browser can only send GET requests, use Postman for everything else
• Hardcoded port number — always read from process.env.PORT with a fallback
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D4': `
WHY IN-MEMORY DATA IS NOT ENOUGH
The in-memory array from Day 3 resets every time you restart the server. Every lead you created is gone. A real application cannot work this way — data must survive server restarts, deployments, and crashes.

A database stores data permanently on disk. A lead created today must still exist tomorrow, next week, and after every deployment. This is what databases exist to solve.

──────────────────────────────
SQL vs NoSQL — THE MOST IMPORTANT DECISION ON DAY 1 OF ANY PROJECT
──────────────────────────────

Every time a new project starts, the team makes one foundational choice: SQL or NoSQL? Getting this wrong costs months of refactoring. Here is how real teams think about it.

SQL DATABASES (PostgreSQL, MySQL, SQLite)

Data is stored in tables with rows and columns — like a spreadsheet with relationships between sheets.
The structure (schema) is defined upfront. You cannot store a lead without specifying every column first.

Strengths:
  • Strong data integrity — the database enforces rules (required fields, unique values, foreign keys)
  • Relationships between data — a Lead belongs to a User, an Invoice has many LineItems
  • Complex queries — filter, join, group, aggregate across multiple tables in one query
  • ACID transactions — multiple operations succeed or fail together (no partial data corruption)
  • Mature and battle-tested — PostgreSQL has run in production for 35+ years

Best for:
  • Financial data (invoices, payments, transactions)
  • User management (accounts, roles, permissions)
  • Any app where data relationships matter
  • Anything where data correctness is non-negotiable

Real-world examples: Razorpay, Zerodha, HDFC banking systems, Swiggy orders — all use PostgreSQL.

NoSQL DATABASES (MongoDB, DynamoDB, Redis, Firestore)

Data is stored as documents (JSON-like objects), key-value pairs, or graphs. No rigid schema — each record can have different fields.

Strengths:
  • Flexible schema — great when data shape is unpredictable or changes often
  • Horizontal scaling — easier to distribute across many servers for massive write loads
  • Fast for simple lookups by ID — document stores retrieve the full record in one operation
  • Natural fit for unstructured data — logs, user events, product catalogs with varied attributes

Best for:
  • Content management (articles, products with different attributes)
  • Real-time event logging and analytics
  • Caching (Redis)
  • Mobile apps where offline sync matters (Firestore)

Real-world examples: Instagram's media metadata (MongoDB), Twitter's timeline cache (Redis), gaming leaderboards (DynamoDB).

THE HONEST ANSWER — WHEN TO CHOOSE WHICH

Use SQL (PostgreSQL) when:
  → Your data has clear relationships (User has many Leads, Invoice has many Items)
  → Correctness matters more than flexibility (financial, medical, legal data)
  → You need complex queries across related data

Use NoSQL (MongoDB) when:
  → Your data structure varies widely per record
  → You need to scale writes across millions of events per second
  → You are building a cache, real-time feed, or search index

For Mini Lead Manager → PostgreSQL. For DeliverDesk activity logs → MongoDB. Both in the same company, two different databases for two different problems.

──────────────────────────────
WHAT IS POSTGRESQL?
──────────────────────────────

PostgreSQL is the world's most advanced open-source relational database. It is what runs Apple's App Store data, Instagram's early backend, Spotify's playlist data, and almost every serious fintech in India.

Key features that matter to you as a developer:
  • Strict data types — phone stored as String is always a String, never a number by accident
  • Unique constraints — duplicate email addresses impossible at the database level
  • Foreign keys — a Lead cannot reference a User that doesn't exist
  • Transactions — multiple writes either all succeed or all fail (no half-saved records)

──────────────────────────────
WHAT IS PRISMA?
──────────────────────────────

Prisma is an ORM (Object Relational Mapper). It lets Node.js talk to PostgreSQL using clean JavaScript instead of raw SQL.

Without Prisma — raw SQL, easy to make mistakes:
  db.query("INSERT INTO leads (name, phone, service) VALUES ($1, $2, $3)", [name, phone, service])

With Prisma — JavaScript, type-safe, readable:
  await prisma.lead.create({ data: { name, phone, service } })

Prisma also generates Prisma Studio — a visual browser-based editor for your database. Think of it as pgAdmin but beautiful and zero configuration.

──────────────────────────────
SETTING UP PRISMA
──────────────────────────────

TRY IT NOW
$ npm install @prisma/client prisma
$ npx prisma init
---

This creates:
  prisma/schema.prisma  → your database model definitions
  .env                  → DATABASE_URL added automatically

Update .env with your PostgreSQL connection string:
  DATABASE_URL="postgresql://your_user:your_password@localhost:5432/mini_lead_manager"

Create the database first if it does not exist:

TRY IT NOW
$ psql -U postgres
$ CREATE DATABASE mini_lead_manager;
$ \q
---

──────────────────────────────
DEFINING YOUR DATA MODEL IN PRISMA
──────────────────────────────

The schema.prisma file defines your tables. Prisma reads it and creates the actual PostgreSQL tables.

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
  id        String   @id @default(cuid())  // unique ID auto-generated
  name      String                          // required — cannot be empty
  phone     String
  email     String?                         // ? means optional, can be null
  service   String
  budget    Int?                            // optional number
  status    String   @default("NEW")       // default value if not provided
  createdAt DateTime @default(now())       // set automatically on create
  updatedAt DateTime @updatedAt            // updated automatically on every change
}
---

──────────────────────────────
RUNNING YOUR FIRST MIGRATION
──────────────────────────────

A migration is a versioned database change. It reads your schema and creates the actual tables. Every schema change after this creates a new migration file — the full history of how your database evolved.

TRY IT NOW
$ npx prisma migrate dev --name init_leads
---

You should see: "Your database is now in sync with your schema."

Now open Prisma Studio to see your database visually:

TRY IT NOW
$ npx prisma studio
---

Prisma Studio opens at http://localhost:5555 — you can see the Lead table, add test records, edit them, and delete them. Confirm the table exists with all the correct columns before moving on.

──────────────────────────────
CREATING THE PRISMA CLIENT SINGLETON
──────────────────────────────

Never create a new PrismaClient inside every route file. Create it once and export it. Multiple instances cause database connection exhaustion in production.

CODE EXAMPLE
// src/lib/prisma.js — create this file once
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma
---

CODE EXAMPLE
// In any route file — just import the singleton
const prisma = require('../lib/prisma')
---

──────────────────────────────
UPDATING YOUR LEAD ROUTES TO USE PRISMA
──────────────────────────────

Replace the in-memory array with Prisma queries. Every route becomes async because database operations take time.

CODE EXAMPLE
const prisma = require('../lib/prisma')

// READ — fetch all leads, newest first
router.get('/', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, message: 'Leads fetched', data: leads })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', data: null })
  }
})

// CREATE — save to database
router.post('/', async (req, res) => {
  const { name, phone, service } = req.body
  if (!name || !phone || !service) {
    return res.status(400).json({
      success: false, message: 'Name, phone, and service are required', data: null
    })
  }
  try {
    const lead = await prisma.lead.create({ data: { name, phone, service } })
    res.status(201).json({ success: true, message: 'Lead created', data: lead })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', data: null })
  }
})

// UPDATE — change status
router.patch('/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data:  { status: req.body.status }
    })
    res.json({ success: true, message: 'Lead updated', data: lead })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    }
    res.status(500).json({ success: false, message: 'Server error', data: null })
  }
})

// DELETE — remove permanently
router.delete('/:id', async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Lead deleted', data: null })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Lead not found', data: null })
    }
    res.status(500).json({ success: false, message: 'Server error', data: null })
  }
})
---

After updating the routes — test every endpoint in Postman. Then restart your server and hit GET /api/leads again. If the leads are still there — your database is working correctly.

SUBMISSION CHECKLIST
☐ SQL vs NoSQL choice documented in PR description (why PostgreSQL for this project)
☐ DATABASE_URL in .env — .env added to .gitignore, never committed
☐ Lead model in schema.prisma with all fields and correct types
☐ npx prisma migrate dev ran successfully — no errors
☐ Prisma Studio screenshot shows Lead table with correct columns
☐ prisma singleton in src/lib/prisma.js
☐ In-memory array completely deleted from routes
☐ Data persists after server restart (confirmed in Postman)
☐ PR: feat/day-4-postgresql-prisma

COMMON MISTAKES
• Wrong DATABASE_URL — check username, password, host, database name character by character
• Special characters in DB password not URL-encoded — @ becomes %40, # becomes %23
• New PrismaClient() created in every route file — one connection pool per file causes issues
• Forgetting npx prisma generate after schema changes — the JS client is outdated
• Not running migrations and testing directly — always verify in Postman after every change
• .env committed to GitHub — add it to .gitignore before the first commit
`,

// ─────────────────────────────────────────────────────────────────────────────

'W1D5': `
THE MOMENT THE APP BECOMES REAL
Today you remove all fake data from the frontend. Every lead comes from the real backend API. Every form submission saves to the real database. After today — Mini Lead Manager is a real full-stack application.

──────────────────────────────
HOW FRONTEND AND BACKEND ACTUALLY COMMUNICATE
──────────────────────────────

The React frontend runs at http://localhost:5173 (Vite dev server)
The Express backend runs at http://localhost:5000 (Node.js)

These are two completely separate programs running at the same time. They communicate over HTTP — the same protocol your browser uses to load any website. The frontend sends an HTTP request. The backend receives it, processes it, and sends back a JSON response.

You need both servers running at the same time, in two separate terminal tabs. This is normal — every full-stack developer runs multiple processes during development.

──────────────────────────────
THE AXIOS API CLIENT — ONE FILE, USED EVERYWHERE
──────────────────────────────

Never write fetch() or axios.get() directly inside a React component. Never hardcode the backend URL. Create one API client file and import it in every component that needs data.

This is the pattern every production codebase uses. If the backend URL changes, you change one line in one file.

CODE EXAMPLE
// src/api/client.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL  // never hardcode this
})

export default api
---

In your frontend .env file (root of the project, not backend/):
  VITE_API_URL=http://localhost:5000/api

TRY IT NOW
$ npm install axios
---

──────────────────────────────
WHAT IS CORS AND WHY YOU WILL DEFINITELY HIT IT
──────────────────────────────

CORS (Cross-Origin Resource Sharing) is a browser security rule. When your frontend on port 5173 tries to call your backend on port 5000, the browser blocks it. Different ports = different origins = blocked by default.

The error looks like this in DevTools:
  Access to XMLHttpRequest at 'http://localhost:5000/api/leads' from origin
  'http://localhost:5173' has been blocked by CORS policy.

The fix is ALWAYS on the backend. Never on the frontend.

CODE EXAMPLE
// backend/src/server.js
const cors = require('cors')

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))
---

Add CLIENT_URL=http://localhost:5173 to your backend .env. Then restart the backend. The CORS error disappears.

Important: Postman does NOT check CORS — that is a browser rule only. If it works in Postman but not in the browser, CORS is the reason.

──────────────────────────────
FETCHING LEADS WHEN THE PAGE LOADS
──────────────────────────────

The moment the LeadList component renders, it should fetch leads from the backend. Show a loading indicator while waiting. Show an error message if it fails. Never leave the user staring at a blank screen.

CODE EXAMPLE
import { useState, useEffect } from 'react'
import api from '../api/client'
import LeadCard from './LeadCard'

function LeadList() {
  const [leads,   setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    api.get('/leads')
      .then(res  => setLeads(res.data.data))
      .catch(()  => setError('Failed to load leads. Try refreshing.'))
      .finally(() => setLoading(false))
  }, []) // empty array = runs once when component mounts

  if (loading) return <div>Loading leads...</div>
  if (error)   return <div style={{ color: 'red' }}>{error}</div>
  if (!leads.length) return <div>No leads yet. Add your first lead above.</div>

  return (
    <div>
      {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
    </div>
  )
}
---

TRY IN CONSOLE
> // Open the browser DevTools on your running app and try this
> fetch("http://localhost:5000/api/leads")
>   .then(r => r.json())
>   .then(data => console.log(data))
---

You should see your actual leads array from the database. This is exactly what Axios does under the hood.

──────────────────────────────
SUBMITTING THE FORM TO THE BACKEND
──────────────────────────────

Replace setLeads(prev => [...prev, newLead]) with an actual API call. The backend saves the lead to PostgreSQL and returns the saved record with its real database ID.

CODE EXAMPLE
const [form,       setForm]       = useState({ name: '', phone: '', service: '' })
const [submitting, setSubmitting] = useState(false)
const [error,      setError]      = useState(null)

const handleSubmit = async (e) => {
  e.preventDefault()  // stop the page from reloading

  if (!form.name || !form.phone || !form.service) {
    setError('Name, phone, and service are required')
    return
  }

  try {
    setSubmitting(true)
    setError(null)
    const res = await api.post('/leads', form)
    setLeads(prev => [res.data.data, ...prev])   // prepend new lead to the list
    setForm({ name: '', phone: '', service: '' }) // reset the form fields
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create lead')
  } finally {
    setSubmitting(false) // always reset this, success or failure
  }
}
---

──────────────────────────────
UPDATING AND DELETING FROM THE UI
──────────────────────────────

CODE EXAMPLE
// Update lead status
const updateStatus = async (id, newStatus) => {
  try {
    const res = await api.patch(\`/leads/\${id}\`, { status: newStatus })
    setLeads(prev => prev.map(l => l.id === id ? res.data.data : l))
  } catch (err) {
    alert('Failed to update status')
  }
}

// Delete a lead
const deleteLead = async (id) => {
  if (!window.confirm('Delete this lead?')) return
  try {
    await api.delete(\`/leads/\${id}\`)
    setLeads(prev => prev.filter(l => l.id !== id)) // remove from UI immediately
  } catch (err) {
    alert('Failed to delete lead')
  }
}
---

Notice the pattern: after every successful API call, update the local state immediately. Do not refetch the entire list — that causes a flash and an unnecessary network request.

──────────────────────────────
THE DEBUGGING PROCESS WHEN SOMETHING DOES NOT WORK
──────────────────────────────

When the frontend cannot reach the backend, check in this order:
  1. Is the backend server running? Check the terminal where you started it.
  2. Open http://localhost:5000/api/health in your browser — does it respond?
  3. Open DevTools → Network tab — what does the failed request say?
  4. Is it a CORS error? Check the backend cors() config.
  5. Is it 404? The URL is wrong — check VITE_API_URL and the route path.
  6. Is it 400 or 500? The backend is returning an error — check the response body.

Always read the error. Do not guess.

SUBMISSION CHECKLIST
☐ Both servers running (npm run dev in both frontend and backend terminals)
☐ src/api/client.js created with VITE_API_URL base URL
☐ VITE_API_URL=http://localhost:5000/api in frontend .env
☐ Leads fetch from GET /api/leads on page load
☐ Lead form submits to POST /api/leads — lead appears in list immediately
☐ Update status calls PATCH /api/leads/:id
☐ Delete calls DELETE /api/leads/:id — lead disappears from UI immediately
☐ Loading state visible while fetching
☐ Error state visible if API fails (not a blank screen)
☐ PR: feat/day-5-fullstack-connect — screenshots showing leads created and listed

COMMON MISTAKES
• Both servers not running — nothing works if either is stopped
• VITE_API_URL missing /api at the end — all routes return 404
• CORS error not fixed on backend — never try to fix CORS in the frontend
• Missing await on API calls — res is a Promise, not data, causes crashes
• Form not reset after submit — user has to clear fields manually
• Using window.location.reload() after create — causes a full page refresh, destroys all state
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

}
