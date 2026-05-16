require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()
const content = require('./lesson-content')

async function main() {
  console.log('🌱 Seeding database...')

  // ── Cohorts ─────────────────────────────────────────────────────────────────
  const cohort3 = await prisma.cohort.upsert({
    where: { name: 'Cohort 3' },
    update: {},
    create: {
      name: 'Cohort 3',
      startDate: new Date('2025-06-02'),
      endDate: new Date('2025-07-25'),
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
    { name:'Ravikiran',     email:'ravi@devforge.com',    college:'JNTU Hyderabad',     week:4, status:'ACTIVE',    plan:'LIVE_COHORT', cohortId: cohort3.id },
    { name:'Priya Sharma',  email:'priya@devforge.com',   college:'NIT Warangal',        week:4, status:'ACTIVE',    plan:'LIVE_COHORT', cohortId: cohort3.id },
    { name:'Rahul Verma',   email:'rahul@devforge.com',   college:'BITS Pilani',          week:4, status:'ACTIVE',    plan:'LIVE_COHORT', cohortId: cohort3.id },
    { name:'Sneha Kapur',   email:'sneha@devforge.com',   college:'VIT Vellore',          week:3, status:'ACTIVE',    plan:'LIVE_COHORT', cohortId: cohort3.id },
    { name:'Amit Rajan',    email:'amit@devforge.com',    college:'DTU Delhi',            week:4, status:'ACTIVE',    plan:'MENTORED',    cohortId: cohort3.id },
    { name:'Divya Nair',    email:'divya@devforge.com',   college:'CUSAT Kerala',         week:2, status:'AT_RISK',   plan:'LIVE_COHORT', cohortId: cohort3.id },
    { name:'Vikram Singh',  email:'vikram@devforge.com',  college:'Thapar University',    week:4, status:'ACTIVE',    plan:'LIVE_COHORT', cohortId: cohort3.id },
    { name:'Ananya Roy',    email:'ananya@devforge.com',  college:'Jadavpur University',  week:4, status:'ACTIVE',    plan:'LIVE_COHORT', cohortId: cohort3.id },
    { name:'Karan Mehta',   email:'karan@devforge.com',   college:'IIIT Hyderabad',       week:8, status:'COMPLETED', plan:'LIVE_COHORT', cohortId: cohort2.id },
    { name:'Nisha Patel',   email:'nisha@devforge.com',   college:'Nirma University',     week:8, status:'COMPLETED', plan:'LIVE_COHORT', cohortId: cohort2.id },
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
  const lessonsRaw = [
    // Week 1 — Foundation prerequisites (pre-day lessons)
    { lessonCode:'L01', week:1, title:'Foundation — Git and the Terminal',         duration:'35 mins', status:'PUBLISHED', description: content['L01'] },
    { lessonCode:'L02', week:1, title:'Foundation — Frontend & Backend Overview', duration:'40 mins', status:'PUBLISHED', description: content['L02'] },
    { lessonCode:'L03', week:1, title:'Foundation — JavaScript Essentials',        duration:'30 mins', status:'PUBLISHED', description: content['L03'] },
    // Week 1 — Mini Lead Manager (7-day curriculum)
    {
      lessonCode:'W1D1', week:1, title:'Day 1 — GitHub Workflow and First Pull Request', duration:'40 mins', status:'PUBLISHED',
      description: content['W1D1'],
    },
    {
      lessonCode:'W1D2', week:1, title:'Day 2 — React Frontend Foundation', duration:'50 mins', status:'PUBLISHED',
      description: content['W1D2'],
    },
    {
      lessonCode:'W1D3', week:1, title:'Day 3 — Express Backend Foundation', duration:'45 mins', status:'PUBLISHED',
      description: content['W1D3'],
    },
    {
      lessonCode:'W1D4', week:1, title:'Day 4 — PostgreSQL and Prisma', duration:'55 mins', status:'PUBLISHED',
      description: content['W1D4'],
    },
    {
      lessonCode:'W1D5', week:1, title:'Day 5 — Full-Stack Connection', duration:'45 mins', status:'PUBLISHED',
      description: content['W1D5'],
    },
    {
      lessonCode:'W1D6', week:1, title:'Day 6 — Authentication and Protected Routes', duration:'50 mins', status:'PUBLISHED',
      description: content['W1D6'],
    },
    {
      lessonCode:'W1D7', week:1, title:'Day 7 — Deployment, Demo, and Final Submission', duration:'40 mins', status:'PUBLISHED',
      description: content['W1D7'],
    },
    // Week 2 — InvoiceWala backend
    { lessonCode:'L04', week:2, title:'Express.js from scratch — routes and middleware', duration:'28 mins', status:'PUBLISHED' },
    { lessonCode:'L05', week:2, title:'Prisma ORM — schema, migrations, and queries',  duration:'31 mins', status:'PUBLISHED' },
    { lessonCode:'L06', week:2, title:'JWT authentication — access and refresh tokens', duration:'26 mins', status:'PUBLISHED' },
    // Week 3 — InvoiceWala features
    { lessonCode:'L07', week:3, title:'GST rules for Indian developers',               duration:'18 mins', status:'PUBLISHED' },
    { lessonCode:'L08', week:3, title:'Generating PDFs with pdf-lib',                  duration:'22 mins', status:'PUBLISHED' },
    { lessonCode:'L09', week:3, title:'express-validator — input validation patterns', duration:'15 mins', status:'PUBLISHED' },
    // Week 4 — InvoiceWala frontend + ClassPro kickoff
    { lessonCode:'L10', week:4, title:'React with TanStack Query — useQuery and useMutation', duration:'31 mins', status:'PUBLISHED' },
    { lessonCode:'L11', week:4, title:'Building forms in React — controlled inputs + validation', duration:'24 mins', status:'PUBLISHED' },
    { lessonCode:'L12', week:4, title:'Multi-role auth — RBAC middleware patterns',    duration:'20 mins', status:'PUBLISHED' },
    // Week 5 — ClassPro features
    { lessonCode:'L13', week:5, title:'Razorpay integration — orders, verify, webhooks', duration:'32 mins', status:'PUBLISHED' },
    { lessonCode:'L14', week:5, title:'HMAC-SHA256 signature verification in Node.js', duration:'18 mins', status:'PUBLISHED' },
    { lessonCode:'L15', week:5, title:'Bulk operations and transactions in Prisma',    duration:'22 mins', status:'PUBLISHED' },
    // Week 6 — ClassPro frontend + DeliverDesk kickoff
    { lessonCode:'L16', week:6, title:'MongoDB and Mongoose — schema design for documents', duration:'28 mins', status:'DRAFT' },
    { lessonCode:'L17', week:6, title:'Cloudinary — upload, transform, and CDN delivery', duration:'24 mins', status:'DRAFT' },
    { lessonCode:'L18', week:6, title:'Building data-heavy dashboards in React',       duration:'30 mins', status:'DRAFT' },
    // Week 7 — DeliverDesk backend
    { lessonCode:'L19', week:7, title:'Socket.io — rooms, auth, and event patterns',  duration:'35 mins', status:'DRAFT' },
    { lessonCode:'L20', week:7, title:'Magic link auth — stateless and stateful approaches', duration:'20 mins', status:'DRAFT' },
    // Week 8 — DeliverDesk frontend + deploy
    { lessonCode:'L21', week:8, title:'Deploying to Railway and Vercel — production setup', duration:'28 mins', status:'DRAFT' },
    { lessonCode:'L22', week:8, title:'White labeling — custom domains and branding',  duration:'18 mins', status:'DRAFT' },
  ]

  const lessons = []
  for (const l of lessonsRaw) {
    const lesson = await prisma.lesson.upsert({
      where: { lessonCode: l.lessonCode },
      update: { description: l.description ?? null, title: l.title, status: l.status },
      create: { ...l, cohortId: cohort3.id }
    })
    lessons.push(lesson)
  }

  console.log('✓ Lessons seeded')

  // ── Tickets ──────────────────────────────────────────────────────────────────
  const ticketsRaw = [
    // ── PRODUCT 1: InvoiceWala ──────────────────────────────────────────────────
    {
      ticketCode: 'P1-001',
      title: 'Express Server + Prisma Setup',
      week: 2, priority: 'LOW', status: 'REVIEWED', storyPoints: 2,
      description: `Bootstrap the InvoiceWala backend. Create the Express server with proper folder structure and connect it to PostgreSQL using Prisma.

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
      ticketCode: 'P1-002',
      title: 'Client Management API',
      week: 2, priority: 'MEDIUM', status: 'REVIEWED', storyPoints: 3,
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
      ticketCode: 'P1-003',
      title: 'Invoice Creation API with GST Calculation',
      week: 2, priority: 'HIGH', status: 'REVIEWED', storyPoints: 5,
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
      ticketCode: 'P1-004',
      title: 'PDF Invoice Generation',
      week: 3, priority: 'HIGH', status: 'IN_REVIEW', storyPoints: 5,
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
      ticketCode: 'P1-005',
      title: 'Payment Tracking + Overdue Detection',
      week: 3, priority: 'MEDIUM', status: 'ACTIVE', storyPoints: 3,
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
      ticketCode: 'P1-006',
      title: 'React — Client Management UI',
      week: 4, priority: 'MEDIUM', status: 'ACTIVE', storyPoints: 5,
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
      ticketCode: 'P1-007',
      title: 'React — Invoice Form with Live GST Preview',
      week: 4, priority: 'HIGH', status: 'UPCOMING', storyPoints: 8,
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
      ticketCode: 'P1-008',
      title: 'React — Dashboard with Outstanding Summary',
      week: 4, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
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

    // ── PRODUCT 2: ClassPro ─────────────────────────────────────────────────────
    {
      ticketCode: 'P2-001',
      title: 'Multi-Role Auth System (Owner / Teacher / Parent)',
      week: 4, priority: 'HIGH', status: 'UPCOMING', storyPoints: 8,
      description: `ClassPro has 3 roles: Owner (full access), Teacher (manage batches/attendance/marks), Parent (read-only). Build JWT auth supporting all three roles.

Acceptance Criteria:
1. POST /api/auth/register — supports role field: OWNER | TEACHER | PARENT. Default role: TEACHER
2. POST /api/auth/login — returns JWT containing { userId, role, centerId } in payload
3. roleGuard(roles) middleware — accepts array of allowed roles, returns 403 if caller's role not in list
4. Owner routes use roleGuard(['OWNER']) — teachers cannot access them
5. Parent routes use roleGuard(['PARENT', 'OWNER']) — teachers cannot see parent portal data
6. Passwords hashed with bcrypt (cost factor >= 10) — never stored plain
7. JWT secret from .env — not hardcoded
8. /api/auth/me endpoint returns current user with role — used by frontend to decide which nav to show
9. Refresh token flow implemented — access token expires in 15m, refresh token in 7d`,
    },
    {
      ticketCode: 'P2-002',
      title: 'Student Enrollment + Batch Management API',
      week: 4, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Owner creates batches and enrolls students. A student can be in multiple batches. Parent accounts are linked to student records at enrollment time.

Acceptance Criteria:
1. POST /api/batches — create batch. Required: name, subject, schedule, monthlyFee. Owner only
2. GET /api/batches — list all batches for this center. Teachers see all; Parents see only their child's batches
3. POST /api/students — enroll student. Required: name, phone, batchId, parentEmail. Owner/Teacher only
4. Student enrollment auto-creates a Parent User account if parentEmail doesn't exist yet
5. GET /api/students — list students. Owner/Teacher sees all; Parent sees ONLY their own child's record
6. POST /api/students/:id/batches — add student to another batch
7. GET /api/batches/:id/students — list all students in a batch with their fee status
8. Student profile includes: name, phone, parentName, parentPhone, batchIds, enrolledAt, feeStatus`,
    },
    {
      ticketCode: 'P2-003',
      title: 'Attendance Marking API',
      week: 5, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `Teachers mark attendance for each class session. Parents see if their child attended. System generates daily and monthly attendance reports.

Acceptance Criteria:
1. POST /api/attendance — mark attendance for a session. Body: { batchId, date, records: [{studentId, present: bool}] }
2. Bulk attendance — one API call marks all students in the batch for that session
3. GET /api/attendance/batch/:batchId?month=YYYY-MM — returns attendance matrix: rows=students, cols=dates
4. GET /api/attendance/student/:studentId?month=YYYY-MM — returns attendance % and day-by-day record
5. Duplicate attendance prevention — cannot mark attendance twice for the same batch+date combination
6. Parents can only see their own child's attendance — enforced server-side, 403 otherwise
7. Attendance percentage computed server-side: present_count / total_sessions * 100
8. Missing attendance (no record for a date) treated as absent in percentage calculation`,
    },
    {
      ticketCode: 'P2-004',
      title: 'Fee Management + Razorpay Integration',
      week: 5, priority: 'HIGH', status: 'UPCOMING', storyPoints: 8,
      description: `Handle fee collection with Razorpay. Track paid/partial/due status per student per month. Auto-generate PDF receipts.

Acceptance Criteria:
1. POST /api/fees/orders — create Razorpay order for a student's monthly fee. Returns { orderId, amount, currency }
2. POST /api/fees/verify — verify Razorpay payment. HMAC-SHA256 signature verified server-side using razorpay_order_id + "|" + razorpay_payment_id — any signature mismatch returns 400
3. Fee record created in DB only after successful payment verification — NEVER before
4. GET /api/fees/student/:studentId — list all fee records with paid/due/partial status per month
5. GET /api/fees/center?month=YYYY-MM — owner view: total collected, total due, per-student breakdown
6. GET /api/fees/:feeId/receipt — download PDF receipt (Content-Type: application/pdf)
7. Razorpay keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) loaded from .env — never hardcoded
8. Partial fee payment supported — student pays 50% now, 50% later — both recorded`,
    },
    {
      ticketCode: 'P2-005',
      title: 'Batch Announcements System',
      week: 5, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 3,
      description: `Teachers post announcements to specific batches. Parents only see announcements for their child's batch. Replaces WhatsApp groups with targeted communication.

Acceptance Criteria:
1. POST /api/announcements — create announcement. Body: { title, body, batchId, pinned }. Teacher/Owner only
2. GET /api/announcements?batchId=X — list announcements for a batch, newest first
3. Parents can only GET announcements for their child's batch — enforced server-side, 403 otherwise
4. Pinned announcements always appear at top regardless of date
5. DELETE /api/announcements/:id — only the creator or Owner can delete an announcement
6. Announcement has audience field: "All" means all batches in center, or specific batchId
7. GET /api/announcements/center — Owner sees all announcements across all batches
8. PUT /api/announcements/:id/pin — toggle pin status. Owner only`,
    },
    {
      ticketCode: 'P2-006',
      title: 'Test Marks + Progress Reports API',
      week: 6, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 5,
      description: `Teachers record test scores for students. System calculates averages and generates progress report cards visible to parents.

Acceptance Criteria:
1. POST /api/tests — create a test. Body: { batchId, testName, date, maxMarks }. Teacher/Owner only
2. POST /api/tests/:id/marks — bulk submit marks. Body: [{ studentId, marksObtained }]
3. Mark validation: marksObtained must be between 0 and test.maxMarks — reject invalid values
4. GET /api/tests/student/:studentId — list all tests with marks for that student
5. Percentage calculated server-side: (marksObtained / maxMarks) * 100
6. GET /api/reports/student/:studentId — full report: attendance %, average test score, fee status
7. Parents can only access their own child's report — 403 for others
8. Report data aggregated via Prisma aggregation functions, not manual JS loops`,
    },
    {
      ticketCode: 'P2-007',
      title: 'React — Teacher Dashboard',
      week: 6, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `The main screen teachers use daily. Shows today's attendance status across batches, fee defaulters list, and upcoming tests.

Acceptance Criteria:
1. /dashboard (Teacher role) — fetches and shows: today's attendance status per batch, total students, pending fee payments, this month's collection
2. Mark Attendance quick action — opens batch selector → shows student list with Present/Absent toggle → one-click submit
3. Fee defaulters section — shows students with overdue fees, name + amount due + days overdue
4. Data fetched using TanStack Query — no useEffect(() => fetch(...)) pattern
5. All API calls use the api.js axios instance — not raw fetch
6. Role check on mount: if not TEACHER or OWNER → redirect to /login
7. Loading state shown for each section independently — one slow section doesn't block the whole page
8. Batch selector persists in local state — switching batches doesn't re-fetch all data, only the batch-specific query`,
    },
    {
      ticketCode: 'P2-008',
      title: 'React — Parent Portal',
      week: 6, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 5,
      description: `Read-only portal for parents. Shows child's attendance, fee status, test marks, and batch announcements. Clean and mobile-friendly.

Acceptance Criteria:
1. /parent route — protected, accessible only with PARENT role JWT
2. Attendance section — shows monthly attendance percentage with a visual calendar showing P/A per day
3. Fee status section — shows this month's fee status (PAID/DUE/PARTIAL) with amount and payment button if due
4. Razorpay payment widget integrated — parent can pay directly from portal
5. Test marks section — list of tests with score and percentage, average at top
6. Announcements — shows last 5 announcements from child's batch
7. Mobile responsive layout — readable on a 375px width screen without horizontal scrolling
8. Parent sees ONLY their child's data — no selector for "choose student" — locked to their child from JWT`,
    },

    // ── PRODUCT 3: DeliverDesk ──────────────────────────────────────────────────
    {
      ticketCode: 'P3-001',
      title: 'MongoDB Setup + Project Workspace Schema',
      week: 6, priority: 'LOW', status: 'UPCOMING', storyPoints: 3,
      description: `Switch to MongoDB for DeliverDesk. Design Mongoose schemas for project workspaces, deliverables, feedback, and activity logs.

Acceptance Criteria:
1. Express server connects to MongoDB using MONGODB_URI from .env — not hardcoded
2. Project schema: title, clientEmail, clientName, agencyId (ref User), status (enum: BRIEF|IN_PROGRESS|REVIEW|APPROVED|DELIVERED), revisionLimit, revisionsUsed, createdAt
3. Deliverable schema: projectId (ref Project), version, filename, cloudinaryUrl, uploadedAt, notes
4. Feedback schema: deliverableId (ref Deliverable), authorEmail, message, annotationX, annotationY, createdAt
5. Activity schema: projectId, action (string), actorEmail, timestamp — append-only log
6. All schemas have proper validation: required fields, enum values, field types
7. Mongoose connection exported from src/lib/db.js — not initialized in every route
8. npm run dev starts with nodemon — MongoDB connection error is logged clearly if URI is wrong`,
    },
    {
      ticketCode: 'P3-002',
      title: 'File Upload to Cloudinary + Versioning',
      week: 6, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Agencies upload deliverables to Cloudinary. Each upload creates a new version — old versions never deleted.

Acceptance Criteria:
1. POST /api/projects/:id/deliverables — multipart upload endpoint. File goes to Cloudinary, URL stored in DB
2. Cloudinary keys (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) from .env — never hardcoded
3. Files stored in Cloudinary folder: deliverdesk/{projectId}/ — organized, not flat
4. Version number auto-incremented: first upload is v1, second is v2 — never overwrites previous version
5. GET /api/projects/:id/deliverables — list all versions for a project, newest first
6. Activity log entry created on every upload: "Agency uploaded v2: filename.pdf"
7. File size limit enforced: reject files > 50MB with 413 error before sending to Cloudinary
8. Only the project owner (agencyId) can upload — 403 for others`,
    },
    {
      ticketCode: 'P3-003',
      title: 'Client Magic Link Authentication',
      week: 7, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Clients access their project via a magic link emailed to them — no password, no account creation. Link expires after 7 days.

Acceptance Criteria:
1. POST /api/auth/magic-link — agency calls this with { clientEmail, projectId }. Sends email with unique link
2. Magic link format: /client/token/{unique_token} — token is a UUID or cryptographically random 32-byte hex
3. Token stored in DB with: token, clientEmail, projectId, expiresAt (7 days), usedAt (null until clicked)
4. GET /api/auth/magic-link/verify?token=XXX — validates token, checks not expired, returns short-lived JWT (1 hour). Token marked usedAt = now() but NOT invalidated (client can reuse within 7 days)
5. Client JWT payload: { role: 'CLIENT', clientEmail, projectId } — scope is single project only
6. Client using another project's token → 403 (token's projectId doesn't match requested project)
7. Expired token → 401 with message "Link expired — please request a new one"
8. Email sending uses nodemailer with SMTP_* env vars — graceful error if SMTP not configured (logs warning, doesn't crash)`,
    },
    {
      ticketCode: 'P3-004',
      title: 'Approval and Feedback System',
      week: 7, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Clients view deliverables, leave annotated feedback (click on image to comment), and Approve or Request Changes. All actions logged with timestamps.

Acceptance Criteria:
1. POST /api/deliverables/:id/feedback — client submits feedback. Body: { message, annotationX?, annotationY? }. Client JWT required
2. annotationX and annotationY are percentage values (0–100) representing click position on the deliverable image
3. PUT /api/projects/:id/approval — client submits decision. Body: { decision: 'APPROVED' | 'CHANGES_REQUESTED' }. Client JWT required
4. APPROVED → project status set to APPROVED. Activity log: "Client approved the project"
5. CHANGES_REQUESTED → project.revisionsUsed incremented. If revisionsUsed >= revisionLimit → return 400 "Revision limit reached"
6. GET /api/deliverables/:id/feedback — list all feedback. Agency sees all; Client sees all feedback
7. Agency can reply to feedback: POST /api/feedback/:id/reply with { message }. Agency JWT required
8. Every approval/feedback action writes an Activity log entry before returning response (durability: log first, then respond)`,
    },
    {
      ticketCode: 'P3-005',
      title: 'Socket.io Real-Time Notifications',
      week: 7, priority: 'HIGH', status: 'UPCOMING', storyPoints: 8,
      description: `Both agency and client get instant notifications when the other party acts. Built with Socket.io rooms keyed by projectId.

Acceptance Criteria:
1. Socket.io server initialized on the same HTTP server as Express — not a separate server
2. Authentication: client must send JWT in socket handshake (auth.token) — unauthenticated connections rejected
3. Each user joins a room named by their projectId: socket.join("project:" + projectId) on connection
4. Agency uploads deliverable → emit deliverable_uploaded to room project:{id} with { version, filename, uploadedAt }
5. Client submits feedback → emit feedback_received to room project:{id} with { message, annotationX, annotationY, timestamp }
6. Client approves/requests changes → emit approval_decision to room project:{id} with { decision, timestamp }
7. Activity log written to DB BEFORE socket event emitted — if socket emit fails, the log still exists
8. CORS configured for Socket.io matching the Express CORS settings — same CLIENT_URL from .env`,
    },
    {
      ticketCode: 'P3-006',
      title: 'React — Agency Project Dashboard',
      week: 8, priority: 'HIGH', status: 'UPCOMING', storyPoints: 5,
      description: `Agency's main workspace. Create projects, upload deliverables, send magic links to clients, and see all client activity in real time.

Acceptance Criteria:
1. /projects — list all projects for the authenticated agency. Status badge for each project
2. Create Project modal — fields: project title, client name, client email, revision limit (default 3)
3. Individual project page /projects/:id — shows: current deliverable (latest version), version history, feedback thread, activity timeline, approval status
4. File upload component — drag & drop or click to select. Shows upload progress bar. Calls POST /api/projects/:id/deliverables
5. Send Magic Link button — calls POST /api/auth/magic-link. Shows success toast "Email sent to client@example.com"
6. Socket.io connection on project page mount — listens for feedback_received and approval_decision events. New events appear in activity feed without page refresh
7. Feedback items show annotation marker position visually on the deliverable image preview (small dot at annotationX%, annotationY%)
8. All API calls through src/lib/api.js axios instance — no raw fetch`,
    },
    {
      ticketCode: 'P3-007',
      title: 'React — Client Review Portal',
      week: 8, priority: 'HIGH', status: 'UPCOMING', storyPoints: 8,
      description: `Client opens a magic link, sees their deliverable, leaves annotated feedback by clicking on the image, and approves or requests changes. Zero setup for the client.

Acceptance Criteria:
1. /client/token/:token — verifies magic link token via GET /api/auth/magic-link/verify?token=X, stores returned JWT in sessionStorage (not localStorage)
2. Client sees: project title, current deliverable file (image preview if image, download link if not), version history, revision counter ("2 of 3 revisions used")
3. Image annotation — clicking on the deliverable image captures click coordinates as percentage (clientX/offsetWidth * 100), opens a comment input at that position
4. POST /api/deliverables/:id/feedback called on comment submit — x/y percentages sent
5. Annotation dots shown on image at correct position for all existing feedback items
6. Approve button → calls PUT /api/projects/:id/approval with APPROVED. Button disabled after approval (can't un-approve)
7. Request Changes button → calls with CHANGES_REQUESTED. Shows revision limit warning if at limit
8. Socket.io: client joins project room. When agency uploads new version → deliverable_uploaded event → show toast "Agency uploaded a new version — refresh to view"`,
    },
    {
      ticketCode: 'P3-008',
      title: 'White Label + Deploy to Railway + Vercel',
      week: 8, priority: 'MEDIUM', status: 'UPCOMING', storyPoints: 5,
      description: `Final ticket. Configure DeliverDesk for white-label use (agency's logo and domain) and deploy the full stack to Railway (backend + MongoDB) and Vercel (frontend).

Acceptance Criteria:
1. Agency profile endpoint: PUT /api/agency/branding — stores: agencyName, logoUrl, primaryColor (hex), customDomain
2. GET /api/projects/:id response includes agency branding fields — client portal uses these to show agency's logo/colors
3. Client portal reads branding from project response and applies: agency logo in header, primary color as CSS custom property --brand-color
4. Backend Dockerfile or Railway config deploys correctly — npm start runs production build
5. All environment variables documented in .env.example — no secrets in code or Dockerfile
6. Frontend deployed to Vercel: VITE_API_URL env var points to Railway backend URL
7. GET /api/health returns { status: "ok" } on the deployed Railway URL
8. MongoDB Atlas used for production DB — not Railway's ephemeral filesystem — MONGODB_URI points to Atlas connection string`,
    },
  ]

  // Remove any old tickets not in the current ticket bank (cascade delete submissions first)
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
    const ticket = await prisma.ticket.upsert({
      where: { ticketCode: t.ticketCode },
      update: updateData,
      create: { ...t, cohortId: cohort3.id }
    })
    tickets.push(ticket)
  }

  console.log('✓ Tickets seeded  (24 tickets across 3 products)')

  // ── PR Submissions (for Ravikiran = students[0]) ──────────────────────────────
  const ravi = students[0]
  const submissionsData = [
    { ticketId: tickets[0].id, prUrl:'https://github.com/ravi/invoicewala/pull/1',  score:94, status:'APPROVED',   feedback:'Clean setup. Prisma exported correctly from lib/, nodemon configured. Excellent start.' },
    { ticketId: tickets[1].id, prUrl:'https://github.com/ravi/invoicewala/pull/3',  score:89, status:'APPROVED',   feedback:'CRUD looks solid. Soft delete implemented correctly. Validation runs before DB queries.' },
    { ticketId: tickets[2].id, prUrl:'https://github.com/ravi/invoicewala/pull/6',  score:85, status:'APPROVED',   feedback:'GST logic correct. Server-side calculation only. invoiceNumber format matches spec.' },
    { ticketId: tickets[3].id, prUrl:'https://github.com/ravi/invoicewala/pull/9',  score:null, status:'IN_REVIEW', feedback:null },
  ]

  for (const s of submissionsData) {
    await prisma.pRSubmission.upsert({
      where: { studentId_ticketId: { studentId: ravi.id, ticketId: s.ticketId } },
      update: {},
      create: { studentId: ravi.id, ...s, reviewedAt: s.score ? new Date() : null }
    })
  }

  console.log('✓ PR submissions seeded')

  // ── Lesson progress for Ravikiran ─────────────────────────────────────────────
  // Delete all existing progress first so re-seeding gives a clean state
  await prisma.lessonProgress.deleteMany({ where: { studentId: ravi.id } })

  // Week 1 is intentionally left at 0% so students can experience it fresh.
  // Mark only 3 Week 2 lessons as watched (L04, L05, L06 → index 10, 11, 12 in lessons[])
  // Lesson order: L01(0), L02(1), L03(2), W1D1(3)…W1D7(9), L04(10), L05(11), L06(12)…
  for (let i = 10; i <= 12; i++) {
    if (lessons[i]) {
      await prisma.lessonProgress.create({
        data: { studentId: ravi.id, lessonId: lessons[i].id, watched: true, watchedAt: new Date() }
      })
    }
  }

  console.log('✓ Lesson progress seeded  (Week 1 fresh, Week 2 partially done)')

  // ── Announcements ────────────────────────────────────────────────────────────
  const announcementsRaw = [
    { title:'InvoiceWala Week 4 Sprint is Live!', body:"Hey Cohort 3! Your Week 4 tickets for InvoiceWala are live on the Task Board. Focus on P1-007 (Invoice Form with GST Preview) first — it's the hardest ticket this week. PR deadline is Friday 11:59 PM.", audience:'Cohort 3', type:'SPRINT', pinned:true, cohortId:cohort3.id },
    { title:'Live Session: Building the Invoice Form — Friday 6 PM', body:'Week 4 live session — we will build the invoice creation form together with live GST calculation. Join link in Discord 30 mins before. Attendance mandatory.', audience:'Cohort 3', type:'SESSION', pinned:true, cohortId:cohort3.id },
    { title:'Cohort 2 Graduates — Congratulations!', body:'Cohort 2 has officially wrapped up! 18 students completed all 3 products. Average grade: 88%. Placement support begins next week. Alumni Discord channel now open.', audience:'All', type:'GENERAL', pinned:false, cohortId:null },
    { title:'ClassPro Preview — Week 5 Preview', body:'Starting next week you move to ClassPro — a coaching center management system with Razorpay integration. Watch L13 (Razorpay integration) and L14 (HMAC-SHA256) this weekend to prepare.', audience:'Cohort 3', type:'UPDATE', pinned:false, cohortId:cohort3.id },
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
  console.log('   Products: InvoiceWala (P1, weeks 2-4) | ClassPro (P2, weeks 4-6) | DeliverDesk (P3, weeks 6-8)\n')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
