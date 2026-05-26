require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()
const content = require('./lesson-content')

// Returns the Friday of the given week number, relative to Cohort 3 start (June 2, 2025)
const COHORT3_START = new Date('2025-06-02')
function weekFriday(week) {
  const d = new Date(COHORT3_START)
  d.setDate(d.getDate() + (week - 1) * 7 + 4)
  return d
}

async function main() {
  console.log('🌱 Seeding database...')

  // ── Cohorts ─────────────────────────────────────────────────────────────────
  const cohort3 = await prisma.cohort.upsert({
    where: { name: 'Cohort 3' },
    update: {},
    create: {
      name: 'Cohort 3',
      startDate: new Date('2025-06-02'),
      endDate: new Date('2025-08-25'),   // 12 weeks from Jun 2
      status: 'ACTIVE',
      maxStudents: 25,
    }
  })

  const cohort2 = await prisma.cohort.upsert({
    where: { name: 'Cohort 2' },
    update: {},
    create: {
      name: 'Cohort 2',
      startDate: new Date('2025-03-03'),
      endDate: new Date('2025-04-25'),
      status: 'COMPLETED',
      maxStudents: 20,
    }
  })

  console.log('✓ Cohorts seeded')

  // ── Admin user ───────────────────────────────────────────────────────────────
  const adminPwd = await bcrypt.hash('Admin@123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@devforge.com' },
    update: {},
    create: {
      name: 'Ravi Kumar',
      email: 'admin@devforge.com',
      password: adminPwd,
      role: 'ADMIN',
    }
  })

  console.log('✓ Admin user seeded  →  admin@devforge.com / Admin@123')

  // ── Students ─────────────────────────────────────────────────────────────────
  const studentData = [
    { name:'Ravikiran',  email:'ravi@devforge.com',  college:'JNTU Hyderabad',  week:1, status:'ACTIVE',  plan:'LIVE_COHORT', cohortId: cohort3.id },
  ]

  const pwd = await bcrypt.hash('Student@123', 10)
  const students = []

  for (const s of studentData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        name: s.name, email: s.email, password: pwd, role: 'STUDENT',
        student: {
          create: {
            college: s.college, currentWeek: s.week, status: s.status,
            plan: s.plan, cohortId: s.cohortId,
          }
        }
      },
      include: { student: true }
    })
    students.push(user.student)
  }

  console.log('✓ Students seeded  →  any student email / Student@123')

  // ── Lessons ──────────────────────────────────────────────────────────────────
  await prisma.lessonProgress.deleteMany({})
  await prisma.lesson.deleteMany({})

  const lessonsRaw = [
    // ── WEEK 1 — Git, JavaScript, APIs & Developer Workflow ──────────────────
    { lessonCode:'W1D1', week:1, title:'Day 1 — Terminal and Git',                              duration:'40 mins', status:'PUBLISHED', description: content['W1D1'] },
    { lessonCode:'W1D2', week:1, title:'Day 2 — JavaScript Fundamentals (Part 1)',              duration:'45 mins', status:'PUBLISHED', description: content['W1D2'] },
    { lessonCode:'W1D3', week:1, title:'Day 3 — JavaScript Fundamentals (Part 2)',              duration:'45 mins', status:'PUBLISHED', description: content['W1D3'] },
    { lessonCode:'W1D4', week:1, title:'Day 4 — Async JavaScript and APIs',                     duration:'40 mins', status:'PUBLISHED', description: content['W1D4'] },
    { lessonCode:'W1D5', week:1, title:'Day 5 — Frontend vs Backend + Git Branch Workflow',     duration:'35 mins', status:'PUBLISHED', description: content['W1D5'] },

    // ── WEEK 2 — Node.js, Express, PostgreSQL & Prisma ──────────────────────
    { lessonCode:'W2D1', week:2, title:'Day 1 — Node.js and npm',                               duration:'35 mins', status:'PUBLISHED', description: content['W2D1'] },
    { lessonCode:'W2D2', week:2, title:'Day 2 — Express and Routes',                            duration:'45 mins', status:'PUBLISHED', description: content['W2D2'] },
    { lessonCode:'W2D3', week:2, title:'Day 3 — PostgreSQL and Prisma Setup',                   duration:'50 mins', status:'PUBLISHED', description: content['W2D3'] },
    { lessonCode:'W2D4', week:2, title:'Day 4 — Full CRUD with Prisma',                         duration:'50 mins', status:'PUBLISHED', description: content['W2D4'] },
    { lessonCode:'W2D5', week:2, title:'Day 5 — Error Handling and Project Structure',          duration:'40 mins', status:'PUBLISHED', description: content['W2D5'] },

    // ── WEEK 3 — React ────────────────────────────────────────────────────────
    { lessonCode:'W3D1', week:3, title:'Day 1 — React Basics and Components',                   duration:'40 mins', status:'PUBLISHED', description: content['W3D1'] },
    { lessonCode:'W3D2', week:3, title:'Day 2 — State with useState',                           duration:'40 mins', status:'PUBLISHED', description: content['W3D2'] },
    { lessonCode:'W3D3', week:3, title:'Day 3 — Fetching Data from Your Own API',               duration:'45 mins', status:'PUBLISHED', description: content['W3D3'] },
    { lessonCode:'W3D4', week:3, title:'Day 4 — React Router and Navigation',                   duration:'40 mins', status:'PUBLISHED', description: content['W3D4'] },
    { lessonCode:'W3D5', week:3, title:'Day 5 — TanStack Query (React Query)',                  duration:'45 mins', status:'PUBLISHED', description: content['W3D5'] },

    // ── WEEK 4 — Authentication + Project Kickoff ────────────────────────────
    { lessonCode:'W4D1', week:4, title:'Day 1 — Auth Concepts and Backend Implementation',      duration:'50 mins', status:'PUBLISHED', description: content['W4D1'] },
    { lessonCode:'W4D2', week:4, title:'Day 2 — Protected Routes and Frontend Auth',            duration:'45 mins', status:'PUBLISHED', description: content['W4D2'] },
    { lessonCode:'W4D3', week:4, title:'Day 3 — Refresh Tokens and Role-Based Access',          duration:'45 mins', status:'PUBLISHED', description: content['W4D3'] },
    { lessonCode:'W4D4', week:4, title:'Day 4 — Restaurant Flow Kickoff',                       duration:'40 mins', status:'PUBLISHED', description: content['W4D4'] },

    // ── WEEK 5 — Project 1: Restaurant Flow (Backend + Payments) ─────────────
    { lessonCode:'W5L1', week:5, title:'Restaurant Flow — Schema and Project Setup',            duration:'30 mins', status:'PUBLISHED' },
    { lessonCode:'W5L2', week:5, title:'Menu API and Order Placement',                          duration:'40 mins', status:'PUBLISHED' },
    { lessonCode:'W5L3', week:5, title:'Razorpay Payment Integration',                          duration:'45 mins', status:'PUBLISHED' },
    { lessonCode:'W5L4', week:5, title:'Order Status Management and Transitions',               duration:'35 mins', status:'PUBLISHED' },
    { lessonCode:'W5L5', week:5, title:'React — Menu Browsing and Cart',                        duration:'40 mins', status:'PUBLISHED' },

    // ── WEEK 6 — Project 1: Restaurant Flow (Real-time + Deploy) ─────────────
    { lessonCode:'W6L1', week:6, title:'Socket.io — Real-Time Order Updates',                   duration:'40 mins', status:'PUBLISHED' },
    { lessonCode:'W6L2', week:6, title:'React — Customer Order Tracking Page',                  duration:'35 mins', status:'PUBLISHED' },
    { lessonCode:'W6L3', week:6, title:'React — Kitchen Dashboard with Live Orders',            duration:'35 mins', status:'PUBLISHED' },
    { lessonCode:'W6L4', week:6, title:'Socket.io in Production — CORS and Deployment',         duration:'30 mins', status:'PUBLISHED' },
    { lessonCode:'W6L5', week:6, title:'Deploying Restaurant Flow — Vercel + Railway',          duration:'40 mins', status:'PUBLISHED' },

    // ── WEEK 7 — Project 2: Lead Bill (Backend + GST) ─────────────────────────
    { lessonCode:'W7L1', week:7, title:'Lead Bill — Schema Design and Express Setup',           duration:'30 mins', status:'DRAFT' },
    { lessonCode:'W7L2', week:7, title:'Client Management API with Soft Delete',                duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W7L3', week:7, title:'Invoice API — Line Items and Server-Side Totals',       duration:'45 mins', status:'DRAFT' },
    { lessonCode:'W7L4', week:7, title:'GST Logic — Same-State vs Different-State Calculation', duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W7L5', week:7, title:'Input Validation with express-validator',               duration:'35 mins', status:'DRAFT' },

    // ── WEEK 8 — Project 2: Lead Bill (PDF + React) ───────────────────────────
    { lessonCode:'W8L1', week:8, title:'PDF Invoice Generation with pdf-lib',                   duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W8L2', week:8, title:'Payment Tracking and Overdue Detection',                duration:'35 mins', status:'DRAFT' },
    { lessonCode:'W8L3', week:8, title:'React — Client Management UI with TanStack Query',     duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W8L4', week:8, title:'Loading Skeletons and Error States in React',           duration:'30 mins', status:'DRAFT' },
    { lessonCode:'W8L5', week:8, title:'Optimistic Updates with useMutation',                   duration:'35 mins', status:'DRAFT' },

    // ── WEEK 9 — Project 2: Lead Bill (Invoice Form + Deploy) ─────────────────
    { lessonCode:'W9L1', week:9, title:'React — Advanced Form State with React Hook Form',      duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W9L2', week:9, title:'Live GST Calculation in the Browser',                   duration:'35 mins', status:'DRAFT' },
    { lessonCode:'W9L3', week:9, title:'Dashboard Data and Prisma Aggregation Queries',         duration:'35 mins', status:'DRAFT' },
    { lessonCode:'W9L4', week:9, title:'Cloudinary PDF Uploads from React',                     duration:'30 mins', status:'DRAFT' },
    { lessonCode:'W9L5', week:9, title:'Deploying Lead Bill — Vercel + Railway',                duration:'40 mins', status:'DRAFT' },

    // ── WEEK 10 — Project 3: ClientDesk AI (Backend + Claude) ─────────────────
    { lessonCode:'W10L1', week:10, title:'ClientDesk AI — Schema and Express Setup',            duration:'30 mins', status:'DRAFT' },
    { lessonCode:'W10L2', week:10, title:'Ticket CRUD API and Agent Authentication',            duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W10L3', week:10, title:'Claude AI Auto-Reply Integration',                    duration:'45 mins', status:'DRAFT' },
    { lessonCode:'W10L4', week:10, title:'Email Notifications with Nodemailer',                 duration:'35 mins', status:'DRAFT' },
    { lessonCode:'W10L5', week:10, title:'React — Customer Support Portal',                    duration:'40 mins', status:'DRAFT' },

    // ── WEEK 11 — Project 3: ClientDesk AI (React + CI/CD + Deploy) ───────────
    { lessonCode:'W11L1', week:11, title:'React — Agent Dashboard',                             duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W11L2', week:11, title:'GitHub Actions — Writing Your First CI Pipeline',     duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W11L3', week:11, title:'Production Deploy — ClientDesk AI',                   duration:'35 mins', status:'DRAFT' },
    { lessonCode:'W11L4', week:11, title:'Production Monitoring and Health Checks',             duration:'30 mins', status:'DRAFT' },
    { lessonCode:'W11L5', week:11, title:'Final Portfolio Review',                              duration:'35 mins', status:'DRAFT' },

    // ── WEEK 12 — Career Week ─────────────────────────────────────────────────
    { lessonCode:'W12D1', week:12, title:'Day 1 — GitHub Profile and Project Presentation',    duration:'40 mins', status:'DRAFT' },
    { lessonCode:'W12D2', week:12, title:'Day 2 — Writing Your Developer Resume',              duration:'45 mins', status:'DRAFT' },
    { lessonCode:'W12D3', week:12, title:'Day 3 — LinkedIn for Developer Job Hunting',         duration:'35 mins', status:'DRAFT' },
    { lessonCode:'W12D4', week:12, title:'Day 4 — Technical Interview Preparation',            duration:'50 mins', status:'DRAFT' },
    { lessonCode:'W12D5', week:12, title:'Day 5 — Job Application Strategy',                   duration:'40 mins', status:'DRAFT' },
  ]

  const lessons = []
  for (const l of lessonsRaw) {
    const lesson = await prisma.lesson.create({
      data: { ...l, cohortId: cohort3.id }
    })
    lessons.push(lesson)
  }

  console.log(`✓ Lessons seeded  (${lessons.length} lessons across 12 weeks)`)

  // ── Tickets ──────────────────────────────────────────────────────────────────
  const ticketsRaw = [

    // ── PROJECT 1: Restaurant Flow (Jira project key: RF) — Weeks 5–6 ─────────
    {
      ticketCode: 'RF-1',
      title: 'Restaurant + Menu Schema Setup',
      week: 5, priority: 'LOW', status: 'REVIEWED', storyPoints: 2,
      description: `Set up the PostgreSQL schema and Express server for Restaurant Flow. Design models for restaurant, menu, orders, and payments.

Acceptance Criteria:
1. Express server connects to PostgreSQL via Prisma — DATABASE_URL from .env, never hardcoded
2. Prisma schema defines: Restaurant (name, address, phone, logoUrl), MenuCategory (restaurantId, name, displayOrder), MenuItem (categoryId, name, description, price, available), Order (restaurantId, customerName, customerPhone, status, totalAmount, createdAt), OrderItem (orderId, menuItemId, quantity, unitPrice, subtotal)
3. All prices stored as integers (paise) — no floating point anywhere in schema
4. Order status enum: PENDING | CONFIRMED | PREPARING | READY | DELIVERED | CANCELLED
5. npm run db:push applies schema — no migration errors
6. Prisma client exported from src/lib/prisma.js — not instantiated in route files
7. GET /api/health returns { status: "ok", timestamp: ISO string }
8. .env.example lists all required variable names — no hardcoded values anywhere`,
    },
    {
      ticketCode: 'RF-2',
      title: 'Menu API + Place Order API',
      week: 5, priority: 'HIGH', status: 'REVIEWED', storyPoints: 5,
      description: `Build the public menu browsing API and the order placement endpoint. Customers don't need accounts — they browse and order.

Acceptance Criteria:
1. GET /api/menu/:restaurantId — returns full menu grouped by category. Each item includes: id, name, description, price (paise), available
2. Only available: true items returned — out-of-stock items excluded
3. POST /api/orders — place an order. Body: { restaurantId, customerName, customerPhone, items: [{ menuItemId, quantity }] }
4. Server calculates subtotal per item: unitPrice * quantity — client never sends prices
5. totalAmount calculated server-side as sum of all item subtotals — never sent by client
6. Order number auto-generated: ORD-YYYYMMDD-XXXX (e.g. ORD-20240101-0001). Sequential per day
7. POST /api/orders returns { orderId, orderNumber, status: "PENDING", totalAmount }
8. GET /api/orders/:id — returns order with all items and status. Available without auth (customer tracks by ID)`,
    },
    {
      ticketCode: 'RF-3',
      title: 'Razorpay Payment Integration',
      week: 5, priority: 'HIGH', status: 'IN_REVIEW', storyPoints: 5,
      description: `Customers pay online using Razorpay before their order is confirmed. Payment must be verified server-side using HMAC-SHA256 before marking any order as paid.

Acceptance Criteria:
1. POST /api/orders/:id/payment/create — creates a Razorpay order. Returns { razorpayOrderId, amount, currency: "INR", keyId }
2. Amount for Razorpay order matches order.totalAmount in DB — never a different value
3. POST /api/orders/:id/payment/verify — verifies payment. Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
4. HMAC-SHA256 verification: expected = HMAC(razorpayOrderId + "|" + razorpayPaymentId, RAZORPAY_KEY_SECRET). Signature mismatch → 400
5. Order updated to CONFIRMED only after successful verification — NEVER before
6. Payment record created with: orderId, razorpayOrderId, razorpayPaymentId, amount, status: PAID, paidAt
7. RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET loaded from .env — never hardcoded
8. Failed payment → order stays PENDING, no status change`,
    },
    {
      ticketCode: 'RF-4',
      title: 'Order Status Management API',
      week: 5, priority: 'MEDIUM', status: 'ACTIVE', storyPoints: 3,
      description: `Restaurant staff update order status as orders progress from kitchen to delivery. Status transitions are enforced — you cannot skip steps.

Acceptance Criteria:
1. PUT /api/orders/:id/status — update order status. Body: { status }. Requires staff JWT
2. Valid transitions enforced: CONFIRMED → PREPARING → READY → DELIVERED. Invalid transitions return 400
3. PENDING orders cannot go to PREPARING — must be CONFIRMED (paid) first
4. CANCELLED only allowed from PENDING or CONFIRMED — not from PREPARING or later
5. GET /api/orders?status=PREPARING — filter orders by status. Staff only
6. GET /api/orders?restaurantId=X&date=YYYY-MM-DD — filter by restaurant and date
7. Each status change recorded with timestamp: confirmedAt, preparingAt, readyAt, deliveredAt on Order model
8. Response includes updated order with new status and relevant timestamp`,
    },
    {
      ticketCode: 'RF-5',
      title: 'Socket.io Real-Time Order Updates',
      week: 6, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Customers see live order status updates without refreshing. Kitchen staff see new orders arrive in real time. Socket.io rooms keyed by orderId and restaurantId.

Acceptance Criteria:
1. Socket.io server initialized on the same HTTP server as Express — not a separate server
2. Two room types: order:{orderId} (customer tracks their order), restaurant:{restaurantId} (staff sees all orders)
3. Staff must send JWT in socket handshake — unauthenticated staff connections rejected. Customers join with orderId only
4. New order placed → emit new_order to room restaurant:{restaurantId} with { orderId, orderNumber, customerName, totalAmount, items }
5. Order status updated → emit order_status_updated to room order:{orderId} with { status, updatedAt }
6. Order status updated → also emit order_status_updated to room restaurant:{restaurantId}
7. DB write completes BEFORE socket event emitted — if socket fails, DB record is still updated
8. CORS configured for Socket.io matching Express CORS settings — CLIENT_URL from .env`,
    },
    {
      ticketCode: 'RF-6',
      title: 'React — Customer Ordering Page',
      week: 6, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Customer-facing page to browse the menu, build a cart, and place + pay for an order. Mobile-friendly, no account needed.

Acceptance Criteria:
1. /menu/:restaurantId — fetch and display menu grouped by category using TanStack Query
2. Add to cart button on each item — cart state managed in React (no API call per add)
3. Cart panel shows: item name, quantity controls, item subtotal, cart total in ₹ format (Intl.NumberFormat en-IN)
4. Place Order form collects: customerName, customerPhone — validated before submit
5. POST /api/orders on submit — on success redirect to /order/:id (tracking page)
6. /order/:id — fetches initial order. Connects to Socket.io room order:{orderId} for live updates
7. Status timeline: PENDING → CONFIRMED → PREPARING → READY → DELIVERED — current status highlighted
8. Razorpay checkout widget opens after order placed — payment must complete before order is confirmed`,
    },
    {
      ticketCode: 'RF-7',
      title: 'React — Kitchen Dashboard (Real-Time)',
      week: 6, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Staff dashboard showing live incoming orders and status controls. New orders appear instantly via Socket.io — no page refresh required.

Acceptance Criteria:
1. /kitchen — protected route, requires staff JWT. Redirects to /login if unauthenticated
2. On mount: fetch all active orders (not DELIVERED or CANCELLED) via GET /api/orders?status=ACTIVE
3. Socket.io: join room restaurant:{restaurantId}. Listen for new_order events
4. new_order event → add order to top of list with a "NEW" badge — no page refresh
5. Order card shows: order number, customer name, phone, items, total, time since placed, current status
6. Status buttons on each card: Confirm → Preparing → Ready → Delivered. Calls PUT /api/orders/:id/status
7. Status change optimistically updates the card — reverts on API error with error toast
8. Orders auto-sorted: PENDING/CONFIRMED first, then PREPARING, then READY — DELIVERED hidden`,
    },
    {
      ticketCode: 'RF-8',
      title: 'Full Stack Deploy — Railway + Vercel',
      week: 6, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `Deploy Restaurant Flow to production. Backend on Railway, frontend on Vercel, PostgreSQL on Neon. Razorpay and Socket.io must work in production.

Acceptance Criteria:
1. Backend deployed to Railway — npm start script runs the production server
2. PostgreSQL on Neon or Supabase — NEVER Railway ephemeral filesystem
3. All env vars set in Railway: DATABASE_URL, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, CLIENT_URL
4. Frontend deployed to Vercel — VITE_API_URL points to Railway backend URL
5. Socket.io CORS configured for production Vercel domain — connections not blocked
6. GET https://{railway-url}/api/health returns { status: "ok" }
7. .env.example documents every required variable
8. End-to-end test in production: browse menu → place order → pay via Razorpay → staff sees order in kitchen → status updates in real time on customer page`,
    },

    // ── PROJECT 2: Lead Bill (Jira project key: LB) — Weeks 7–9 ───────────────
    {
      ticketCode: 'LB-1',
      title: 'Express Server + Prisma Setup',
      week: 7, priority: 'LOW', status: 'UPCOMING', storyPoints: 2,
      description: `Bootstrap the Lead Bill backend. Create the Express server with proper folder structure and connect it to PostgreSQL using Prisma.

Acceptance Criteria:
1. Express server starts on port from .env — NOT hardcoded port number
2. Prisma schema defined with at least: User, Client, Invoice, InvoiceItem models
3. DATABASE_URL read from .env — no hardcoded connection strings anywhere
4. Server has /api/health endpoint that returns { status: "ok", timestamp: ISO string }
5. npm run dev starts server with nodemon — no manual restart needed for code changes
6. .env.example file exists with all required variable names (values can be placeholders)
7. .gitignore includes node_modules/, .env, *.log
8. Prisma client exported from a single src/lib/prisma.js file — not instantiated in every route file`,
    },
    {
      ticketCode: 'LB-2',
      title: 'Client Management API',
      week: 7, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `Build the full CRUD API for managing clients. A client stores details needed for GST-correct invoicing: name, GST number, address, state.

Acceptance Criteria:
1. POST /api/clients — create a client. Required: name, email. Optional: gstNumber, address, state, phone
2. GET /api/clients — list all clients belonging to the authenticated user only (no other user's clients)
3. GET /api/clients/:id — get single client. Returns 404 if client belongs to another user
4. PUT /api/clients/:id — update client fields. Partial updates allowed
5. DELETE /api/clients/:id — soft delete (set deletedAt = now()) — do NOT hard delete
6. All routes protected by JWT auth middleware — unauthenticated requests get 401
7. Input validated with express-validator BEFORE any database query runs
8. Consistent response shape: { success: true, data: {...} } or { success: false, error: "message" }`,
    },
    {
      ticketCode: 'LB-3',
      title: 'Invoice Creation API with GST Calculation',
      week: 7, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Build the invoice API that auto-calculates GST correctly. Same-state: CGST + SGST (9%+9% for 18%). Different-state: IGST (18%). System detects this automatically from stored state fields.

Acceptance Criteria:
1. POST /api/invoices — create invoice with line items. Body: { clientId, items: [{ description, quantity, unitPrice }], gstRate, dueDate }
2. GST auto-calculated server-side — client NEVER sends tax amount. Server computes it
3. Same-state: if freelancer.state === client.state → cgst = gstRate/2, sgst = gstRate/2, igst = 0
4. Different-state: if states differ → igst = gstRate, cgst = 0, sgst = 0
5. subtotal, cgst, sgst, igst, totalAmount all stored in DB — pre-computed, not re-calculated on every fetch
6. invoiceNumber auto-generated in format INV-YYYY-XXXX (e.g. INV-2024-0001). Sequential, never repeats
7. GET /api/invoices — list all invoices for auth user with client name and status
8. GET /api/invoices/:id — full invoice detail with all line items
9. PUT /api/invoices/:id/status — update status: DRAFT | SENT | PAID | OVERDUE. Only owner can update`,
    },
    {
      ticketCode: 'LB-4',
      title: 'PDF Invoice Generation',
      week: 8, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Generate a professional PDF invoice on demand using pdf-lib. The PDF must look like a real invoice: logo area, invoice number, GST breakdown, bank details, itemized table.

Acceptance Criteria:
1. GET /api/invoices/:id/pdf — returns a PDF file (Content-Type: application/pdf)
2. PDF contains: Invoice number, Invoice date, Due date, Freelancer name + GST number, Client name + GST number, Itemized table (description, qty, unit price, amount), GST breakdown (CGST/SGST or IGST as applicable), Subtotal, Total amount in ₹
3. PDF generated server-side using pdf-lib — NOT a screenshot of HTML
4. Only the invoice owner can download the PDF — 403 for other users
5. Invoice number and all amounts on PDF exactly match what's stored in DB — no rounding differences
6. If GST type is IGST, only show IGST row; if CGST+SGST, show both rows — never show inapplicable rows
7. Response headers: Content-Disposition: attachment; filename="INV-2024-0001.pdf"`,
    },
    {
      ticketCode: 'LB-5',
      title: 'Payment Tracking + Overdue Detection',
      week: 8, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `Track which invoices are paid and which are overdue. Add a dashboard summary endpoint.

Acceptance Criteria:
1. PUT /api/invoices/:id/payment — record a payment. Body: { amountPaid, paymentMethod, paymentDate }. Supports partial payments
2. If amountPaid >= invoice.totalAmount → status automatically set to PAID
3. If amountPaid < invoice.totalAmount → status set to PARTIALLY_PAID, store remaining amount
4. GET /api/invoices/overdue — returns all invoices where dueDate < now() AND status is NOT PAID
5. GET /api/dashboard/summary — returns: { totalOutstanding, totalPaid, overdueCount, invoiceCount, thisMonthRevenue }
6. All amounts in paise (integer) — no floating point money math anywhere in the codebase
7. Payment history preserved — do NOT overwrite previous payment records, append each payment`,
    },
    {
      ticketCode: 'LB-6',
      title: 'React — Client Management UI',
      week: 8, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 5,
      description: `Build the client management page in React. Add clients, see the list, edit details. Clean and instant — no page reloads.

Acceptance Criteria:
1. /clients route renders client list fetched from GET /api/clients using TanStack Query
2. Add client form — validates fields before submit: name required, email must be valid format, GST number must be 15 chars if provided
3. Successful client creation invalidates the query cache and shows new client immediately without page reload
4. API calls go through src/lib/api.js (axios instance with JWT interceptor) — no raw fetch() inside components
5. Loading skeleton shown while data is fetching — not a spinner, not blank screen
6. Error state shown if API returns error — not a blank screen or console error only
7. Client list is searchable by name on the frontend (client-side filter, no extra API call)
8. Edit client opens inline form or modal — not a separate page`,
    },
    {
      ticketCode: 'LB-7',
      title: 'React — Invoice Form with Live GST Preview',
      week: 9, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Dynamic invoice creation form. Pick client, add line items, select GST rate, see live GST breakdown. GST type (CGST+SGST vs IGST) shows automatically based on selected client's state.

Acceptance Criteria:
1. /invoices/new — invoice creation page with: client dropdown (fetches from API), line item rows (add/remove rows dynamically), GST rate selector (0%, 5%, 12%, 18%, 28%)
2. Line items calculated live — subtotal updates as user types quantity or price. No Calculate button needed
3. GST preview panel shows correct type: if client.state === user.state → show CGST + SGST rows. If different → show IGST row
4. Add line item button adds a new blank row. Remove button deletes that row. Minimum 1 line item enforced
5. Invoice submit calls POST /api/invoices — not POST /api/invoices/pdf — PDF is separate
6. On success: navigate to /invoices/:id (the new invoice detail page), not back to list
7. All money values displayed in Indian format: ₹1,23,456.00 — using Intl.NumberFormat('en-IN')
8. Form state preserved if API call fails — user does not lose their entered data`,
    },
    {
      ticketCode: 'LB-8',
      title: 'React — Dashboard with Outstanding Summary',
      week: 9, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `The freelancer's home screen. Shows total outstanding, overdue invoices, this month's revenue, and recent invoices. All real data from the API.

Acceptance Criteria:
1. /dashboard — shows 4 stat cards: Total Outstanding, Overdue, This Month Revenue, Total Invoices
2. Data fetched from GET /api/dashboard/summary — no hardcoded numbers
3. Recent invoices list (last 5) fetched from GET /api/invoices?limit=5&sort=desc
4. Each invoice row shows: invoice number, client name, amount (₹ formatted), status badge, due date
5. Status badges: PAID (green), SENT (blue), OVERDUE (red), DRAFT (grey) — color-coded
6. Download PDF button on each invoice row — calls GET /api/invoices/:id/pdf and triggers browser download
7. Overdue invoices section highlighted separately with count and total amount
8. Page loads with skeleton → data → no loading flash after first successful fetch (TanStack Query cache)`,
    },

    // ── PROJECT 3: ClientDesk AI (Jira project key: CA) — Weeks 10–11 ─────────
    {
      ticketCode: 'CA-1',
      title: 'Support Desk Schema + Express Setup',
      week: 10, priority: 'LOW', status: 'UPCOMING', storyPoints: 2,
      description: `Design the PostgreSQL schema for ClientDesk AI — a support desk where customers submit tickets and AI generates the first draft reply. Agents review and approve before it is sent.

Acceptance Criteria:
1. Prisma schema: Company (name, domain), Agent (companyId, email, passwordHash, role: ADMIN|AGENT), Customer (companyId, email, name), SupportTicket (companyId, customerId, subject, status, priority, createdAt), Message (ticketId, authorEmail, body, isAI, sentAt), AiDraft (ticketId, body, promptUsed, approved, agentId)
2. SupportTicket status enum: OPEN | WAITING_REPLY | REPLIED | CLOSED
3. SupportTicket priority enum: LOW | MEDIUM | HIGH | URGENT
4. Prisma client exported from src/lib/prisma.js
5. Express server starts on PORT from .env — GET /api/health returns { status: "ok" }
6. npm run db:push applies schema without errors
7. .env.example documents: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, PORT, CLIENT_URL
8. .gitignore includes node_modules/, .env, *.log`,
    },
    {
      ticketCode: 'CA-2',
      title: 'Ticket CRUD API + Agent Auth',
      week: 10, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `Customers submit support tickets without accounts (email only). Agents log in and manage tickets. Different auth flows for each type of user.

Acceptance Criteria:
1. POST /api/tickets — public endpoint. Body: { customerEmail, subject, body }. Creates ticket + customer if email is new. Returns { ticketId, ticketNumber }
2. Ticket number auto-generated: TKT-XXXX (e.g. TKT-0047). Sequential, never repeated
3. POST /api/auth/login — agent login. Returns JWT with { agentId, role, companyId }
4. GET /api/tickets — agents only. Paginated, newest first. Filter by status and priority
5. GET /api/tickets/:id — agents only. Returns ticket with full message thread
6. PUT /api/tickets/:id/status — agents only. Valid transitions enforced
7. GET /api/tickets/:id/messages — all messages: customer, agent, AI replies
8. POST /api/tickets/:id/messages — agent posts a reply. Status auto-updates to REPLIED`,
    },
    {
      ticketCode: 'CA-3',
      title: 'Claude AI Auto-Reply Generation',
      week: 10, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `When a new ticket arrives, automatically generate an AI draft reply using the Claude API. The agent reviews, edits if needed, and approves before it is sent to the customer.

Acceptance Criteria:
1. After POST /api/tickets, trigger AI draft generation asynchronously — customer gets ticketId immediately, AI runs in background
2. Claude API called with: system prompt (agent persona, company name, helpful tone), user message (customer subject + body)
3. Model: claude-haiku-4-5-20251001 — balance of quality and speed for auto-replies
4. AiDraft created in DB: ticketId, body (Claude response), promptUsed (log exact prompt for debugging), approved: false
5. PUT /api/ai-drafts/:id/approve — agent approves. Creates Message with isAI: true. AiDraft.approved = true, agentId recorded
6. PUT /api/ai-drafts/:id — agent edits draft body before approving. Original prompt preserved
7. ANTHROPIC_API_KEY loaded from .env — never hardcoded
8. If Claude API fails: AiDraft created with body: null and error field — ticket still works, agent replies manually`,
    },
    {
      ticketCode: 'CA-4',
      title: 'Email Notifications via Nodemailer',
      week: 10, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `Send email to customers: ticket received confirmation and reply notification. Use Nodemailer with SMTP — Mailtrap for testing.

Acceptance Criteria:
1. Ticket created → email customer: subject "We received your request — TKT-XXXX", body includes ticket number and tracking link
2. Agent replies → email customer: subject "Reply to your request TKT-XXXX", body includes agent's reply text
3. Nodemailer configured from env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS — never hardcoded
4. Email sending is async (non-blocking) — API response is not delayed by SMTP call
5. If SMTP not configured, log a warning and continue — app does not crash
6. Email failures caught and logged — do not cause the ticket or reply API to return 500
7. FROM address from SMTP_FROM env var — defaults to "ClientDesk AI <noreply@clientdesk.ai>"
8. HTML email template — not plain text. Minimal but professional: ticket number, message, link`,
    },
    {
      ticketCode: 'CA-5',
      title: 'GitHub Actions CI/CD Pipeline',
      week: 11, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Set up GitHub Actions to run tests on every push. PRs that fail checks do not get merged. Passing CI triggers Railway auto-deploy.

Acceptance Criteria:
1. .github/workflows/ci.yml — runs on: push to main, pull_request to main
2. Steps: checkout → setup-node@v4 (Node 20) → npm ci → npm run lint → npm test
3. npm test runs at least 3 integration tests: POST /api/tickets creates ticket, POST /api/auth/login returns JWT, GET /api/health returns 200
4. Tests use a real test database (TEST_DATABASE_URL) — no mocked DB queries
5. Railway auto-deploy triggered after CI passes via Railway GitHub integration or deploy webhook
6. Secrets in GitHub Actions secrets: TEST_DATABASE_URL, RAILWAY_TOKEN, ANTHROPIC_API_KEY — not in YAML
7. Failing test → CI fails → Railway deployment does NOT trigger
8. Branch protection rule: "ci" check must pass before merge is allowed`,
    },
    {
      ticketCode: 'CA-6',
      title: 'React — Customer Support Portal',
      week: 11, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Customer-facing page to submit tickets and track status. No account needed — customers track by ticket number and email.

Acceptance Criteria:
1. / — "Submit a Support Request" form. Fields: name, email, subject, message. All required
2. Form validation with React Hook Form + Zod before submit
3. POST /api/tickets on submit — on success: "Ticket received! Your number is TKT-0047. Track at /track/TKT-0047"
4. /track/:ticketNumber — customer enters email to verify ownership. Fetches ticket and message thread
5. Thread shows: customer messages (right), agent replies (left), AI replies labeled "[AI Assistant]"
6. Status badge: OPEN (blue), WAITING_REPLY (orange), REPLIED (green), CLOSED (grey)
7. Page auto-refreshes thread every 30 seconds — customer sees reply without manual refresh
8. All API calls through src/lib/api.js — no raw fetch`,
    },
    {
      ticketCode: 'CA-7',
      title: 'React — Agent Dashboard',
      week: 11, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Agent dashboard to manage support tickets. Shows queue, AI drafts awaiting approval, and ability to reply to customers.

Acceptance Criteria:
1. /agent/login — login page. POST /api/auth/login. Stores JWT in Zustand store. Redirects to /agent/tickets
2. /agent/tickets — protected. Ticket list with filter tabs: All / Open / Replied / Closed
3. List shows: ticket number, customer email, subject, priority badge, status badge, time since created
4. Click ticket → /agent/tickets/:id — full ticket view with message thread
5. AI draft panel: if unreviewed AiDraft exists, show draft with Edit and "Approve & Send" buttons
6. Approve calls PUT /api/ai-drafts/:id/approve — on success, draft appears in thread with "[AI]" label
7. Manual reply box — POST /api/tickets/:id/messages. Reply appears instantly (optimistic update)
8. Priority and status dropdowns allow updates without leaving the page`,
    },
    {
      ticketCode: 'CA-8',
      title: 'Production Deploy + Health Monitoring',
      week: 11, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `Final ticket. Deploy ClientDesk AI to production with CI/CD active. Confirm the full system works end-to-end in production including AI replies and email.

Acceptance Criteria:
1. Backend deployed to Railway — env vars set: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, SMTP_* vars, CLIENT_URL
2. PostgreSQL on Neon or Supabase — not Railway ephemeral storage
3. Frontend deployed to Vercel — VITE_API_URL points to Railway backend
4. GitHub Actions CI pipeline passes on main — badge shown in README
5. GET /api/health returns { status: "ok", db: "connected", timestamp: ISO string } — db field confirms Prisma can query
6. End-to-end test in production: submit ticket → AI draft generated → agent approves → customer receives email reply
7. .env.example documents all variables — another developer can deploy from scratch without asking
8. README has: project description, local setup instructions, deployed URL, CI badge`,
    },
  ]

  // Remove old tickets not in the current ticket bank
  const validCodes = ticketsRaw.map(t => t.ticketCode)
  const oldTickets = await prisma.ticket.findMany({ where: { ticketCode: { notIn: validCodes } }, select: { id: true } })
  if (oldTickets.length > 0) {
    const oldIds = oldTickets.map(t => t.id)
    await prisma.pRSubmission.deleteMany({ where: { ticketId: { in: oldIds } } })
    await prisma.ticket.deleteMany({ where: { id: { in: oldIds } } })
  }

  const tickets = []
  for (const t of ticketsRaw) {
    const { cohortId: _ignore, ...updateData } = t
    const due = weekFriday(t.week)
    const ticket = await prisma.ticket.upsert({
      where: { ticketCode: t.ticketCode },
      update: { ...updateData, dueDate: due },
      create: { ...t, cohortId: cohort3.id, dueDate: due }
    })
    tickets.push(ticket)
  }

  console.log('✓ Tickets seeded  (24 tickets: RF-001→008, LB-001→008, CA-001→008)')

  // ── PR Submissions (none for Ravikiran — fresh start) ────────────────────────
  const ravi = students[0]

  console.log('✓ PR submissions seeded  (Ravikiran starts fresh — 0 submissions)')

  // ── Lesson progress for Ravikiran — none (fresh start) ───────────────────────
  console.log('✓ Lesson progress seeded  (Ravikiran starts fresh — 0 lessons watched)')

  // ── Announcements ────────────────────────────────────────────────────────────
  const announcementsRaw = [
    { title:'Lead Bill Week 7 Sprint is Live!', body:"Hey Cohort 3! Your Week 7 tickets for Lead Bill are now live on the board — LB-001, LB-002, LB-003. Start with LB-001 (Express Server + Prisma Setup) first. Make sure your .env has DATABASE_URL before running db:push. PR deadline is Friday 11:59 PM.", audience:'Cohort 3', type:'SPRINT', pinned:true, cohortId:cohort3.id },
    { title:'Live Session: GST Calculation Logic — Friday 6 PM', body:'Week 7 live session — we will implement same-state vs different-state GST logic together for LB-003. This is the trickiest part of Lead Bill. Join link in Discord 30 mins before. Attendance mandatory.', audience:'Cohort 3', type:'SESSION', pinned:true, cohortId:cohort3.id },
    { title:'Cohort 2 Graduates — Congratulations!', body:'Cohort 2 has officially wrapped up! 18 students completed all 3 projects. Average grade: 88%. Placement support begins next week. Alumni Discord channel now open.', audience:'All', type:'GENERAL', pinned:false, cohortId:null },
    { title:'Restaurant Flow Done — Pin It on GitHub Now', body:"Great work on Restaurant Flow everyone! Before starting Lead Bill, add your RF live link to your GitHub README and LinkedIn. Recruiters will see it. Takes 10 minutes, worth it.", audience:'Cohort 3', type:'UPDATE', pinned:false, cohortId:cohort3.id },
  ]

  for (const a of announcementsRaw) {
    await prisma.announcement.create({ data: a }).catch(() => {})
  }

  console.log('✓ Announcements seeded')

  // ── Payments ─────────────────────────────────────────────────────────────────
  const paymentsRaw = [
    { txnId:'TXN-001', studentId:students[1].id, plan:'LIVE_COHORT', amount:14999, method:'UPI',         status:'PAID'    },
    { txnId:'TXN-002', studentId:students[2].id, plan:'LIVE_COHORT', amount:14999, method:'Card',        status:'PAID'    },
    { txnId:'TXN-003', studentId:students[3].id, plan:'LIVE_COHORT', amount:14999, method:'UPI',         status:'PAID'    },
    { txnId:'TXN-004', studentId:students[4].id, plan:'MENTORED',    amount:24999, method:'Net Banking', status:'PAID'    },
    { txnId:'TXN-005', studentId:students[5].id, plan:'LIVE_COHORT', amount:7499,  method:'EMI',         status:'PARTIAL' },
    { txnId:'TXN-006', studentId:students[6].id, plan:'LIVE_COHORT', amount:14999, method:'Card',        status:'PAID'    },
    { txnId:'TXN-007', studentId:students[0].id, plan:'LIVE_COHORT', amount:14999, method:'UPI',         status:'PAID'    },
    { txnId:'TXN-008', studentId:students[7].id, plan:'LIVE_COHORT', amount:14999, method:'UPI',         status:'PAID'    },
  ]

  for (const p of paymentsRaw) {
    await prisma.payment.upsert({ where: { txnId: p.txnId }, update: {}, create: p })
  }

  console.log('✓ Payments seeded')
  console.log('\n✅ Seed complete!\n')
  console.log('   Admin:   admin@devforge.com  /  Admin@123')
  console.log('   Student: ravi@devforge.com   /  Student@123\n')
  console.log('   Projects: Restaurant Flow (RF, weeks 5-6) | Lead Bill (LB, weeks 7-9) | ClientDesk AI (CA, weeks 10-11)\n')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
