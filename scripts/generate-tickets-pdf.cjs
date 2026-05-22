const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const htmlPath = path.resolve(__dirname, '../DevForge_Jira_Tickets.html')
const pdfPath  = path.resolve(__dirname, '../DevForge_Jira_Tickets.pdf')

// ─── Ticket data ──────────────────────────────────────────────────────────────

const tickets = [

  // ── RESTAURANT FLOW ──────────────────────────────────────────────────────────
  {
    code: 'RF-1', project: 'Restaurant Flow', sprint: 'Sprint 1 — Week 5',
    summary: 'Restaurant + Menu Schema Setup',
    type: 'Task', priority: 'Low', points: 2,
    labels: ['backend', 'database', 'setup'],
    userStory: 'As a developer, I want the database schema and Express server set up correctly so that every other ticket in this project has a working foundation to build on.',
    description: 'This is the first ticket every cohort works on. It has no UI — it is purely backend scaffolding. Getting the schema right here prevents painful migrations later. Every price must be stored as an integer (paise) from day one — changing this later breaks everything downstream.',
    criteria: [
      'Express server connects to PostgreSQL via Prisma — DATABASE_URL from .env, never hardcoded',
      'Prisma schema defines: Restaurant, MenuCategory, MenuItem, Order, OrderItem models',
      'All prices stored as integers (paise) — no floating point anywhere in schema',
      'Order status enum: PENDING | CONFIRMED | PREPARING | READY | DELIVERED | CANCELLED',
      'npm run db:push applies schema — no migration errors',
      'Prisma client exported from src/lib/prisma.js — not instantiated in route files',
      'GET /api/health returns { status: "ok", timestamp: ISO string }',
      '.env.example lists all required variable names — no hardcoded values anywhere',
    ],
    dod: 'Schema pushed to local DB, health endpoint returns 200, .env.example committed, PR merged.',
  },
  {
    code: 'RF-2', project: 'Restaurant Flow', sprint: 'Sprint 1 — Week 5',
    summary: 'Menu API + Place Order API',
    type: 'Story', priority: 'High', points: 5,
    labels: ['backend', 'api', 'orders'],
    userStory: 'As a customer, I want to browse the menu and place an order so that I can get food delivered without needing to create an account.',
    description: 'Customers never send prices to the server — the server always looks up the current price from the database and calculates the total. This is a security principle: never trust client-sent money values. The order number format (ORD-YYYYMMDD-XXXX) must be sequential and never repeat.',
    criteria: [
      'GET /api/menu/:restaurantId — returns full menu grouped by category with id, name, description, price (paise), available',
      'Only available: true items returned — out-of-stock items excluded automatically',
      'POST /api/orders — body: { restaurantId, customerName, customerPhone, items: [{ menuItemId, quantity }] }',
      'Server calculates subtotal per item: unitPrice × quantity — client never sends prices',
      'totalAmount calculated server-side as sum of all item subtotals',
      'Order number auto-generated: ORD-YYYYMMDD-XXXX (e.g. ORD-20240101-0001), sequential per day',
      'POST /api/orders returns { orderId, orderNumber, status: "PENDING", totalAmount }',
      'GET /api/orders/:id — returns order with all items and status, no auth required (customer tracks by ID)',
    ],
    dod: 'Menu endpoint returns grouped data, order placement calculates server-side totals, tested in Postman, PR merged.',
  },
  {
    code: 'RF-3', project: 'Restaurant Flow', sprint: 'Sprint 1 — Week 5',
    summary: 'Razorpay Payment Integration',
    type: 'Story', priority: 'High', points: 5,
    labels: ['backend', 'payments', 'security'],
    userStory: 'As a customer, I want to pay for my order securely online so that my order is only confirmed after a successful, verified payment.',
    description: 'The most security-critical ticket in this project. The HMAC-SHA256 signature verification is what prevents someone from sending a fake "payment succeeded" request to your server. Without it, anyone could confirm orders without paying. The order must stay PENDING until verification passes — never change status before that.',
    criteria: [
      'POST /api/orders/:id/payment/create — creates a Razorpay order, returns { razorpayOrderId, amount, currency: "INR", keyId }',
      'Amount for Razorpay order exactly matches order.totalAmount in DB — never a different value',
      'POST /api/orders/:id/payment/verify — body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }',
      'HMAC-SHA256 verification: expected = HMAC(razorpayOrderId + "|" + razorpayPaymentId, RAZORPAY_KEY_SECRET). Signature mismatch → 400',
      'Order status updated to CONFIRMED only after successful verification — NEVER before',
      'Payment record created with: orderId, razorpayOrderId, razorpayPaymentId, amount, status: PAID, paidAt',
      'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET loaded from .env — never hardcoded in any file',
      'Failed payment → order stays PENDING, no status change, no payment record created',
    ],
    dod: 'End-to-end payment flow tested in Razorpay test mode, signature verification rejects tampered requests, PR merged.',
  },
  {
    code: 'RF-4', project: 'Restaurant Flow', sprint: 'Sprint 1 — Week 5',
    summary: 'Order Status Management API',
    type: 'Story', priority: 'Medium', points: 3,
    labels: ['backend', 'api', 'orders'],
    userStory: 'As a kitchen staff member, I want to update order status as it progresses so that customers and the system always reflect the correct stage of their order.',
    description: 'Status transitions must be enforced on the server — not left to the client to decide. A PENDING order cannot jump straight to PREPARING; it must be paid (CONFIRMED) first. This prevents edge cases where kitchen staff accidentally confirm unpaid orders.',
    criteria: [
      'PUT /api/orders/:id/status — body: { status }, requires staff JWT',
      'Valid transitions enforced server-side: CONFIRMED → PREPARING → READY → DELIVERED. Invalid → 400',
      'PENDING orders cannot go to PREPARING — must be CONFIRMED (paid) first',
      'CANCELLED only allowed from PENDING or CONFIRMED — not from PREPARING or later',
      'GET /api/orders?status=PREPARING — filter orders by status, staff only',
      'GET /api/orders?restaurantId=X&date=YYYY-MM-DD — filter by restaurant and date',
      'Each status change records a timestamp: confirmedAt, preparingAt, readyAt, deliveredAt on Order model',
      'Response includes the full updated order with new status and relevant timestamp',
    ],
    dod: 'All invalid transitions return 400 with a clear error message, valid transitions save timestamps, tested via Postman, PR merged.',
  },
  {
    code: 'RF-5', project: 'Restaurant Flow', sprint: 'Sprint 2 — Week 6',
    summary: 'Socket.io Real-Time Order Updates',
    type: 'Story', priority: 'High', points: 5,
    labels: ['backend', 'real-time', 'websockets'],
    userStory: 'As a kitchen staff member, I want new orders to appear on my screen instantly, and as a customer I want my order status to update live — without either of us refreshing the page.',
    description: 'Socket.io runs on the same HTTP server as Express — not a separate process. Two room types keep concerns separated: the customer only sees their own order, the kitchen sees all orders for the restaurant. Critical rule: the database write must complete before emitting the socket event — if the socket fails, data must still be saved.',
    criteria: [
      'Socket.io server initialized on the same HTTP server as Express — not a separate server',
      'Two room types: order:{orderId} (customer tracks their order), restaurant:{restaurantId} (staff sees all orders)',
      'Staff send JWT in socket handshake — unauthenticated staff connections rejected immediately',
      'New order placed → emit new_order to room restaurant:{restaurantId} with { orderId, orderNumber, customerName, totalAmount, items }',
      'Order status updated → emit order_status_updated to room order:{orderId} with { status, updatedAt }',
      'Order status updated → also emit to room restaurant:{restaurantId}',
      'DB write completes BEFORE socket event emitted — if socket fails, DB record is still saved',
      'CORS configured for Socket.io matching Express CORS — CLIENT_URL from .env',
    ],
    dod: 'Open two browser tabs: one as kitchen, one as customer. Place an order — kitchen sees it instantly. Update status — customer sees it instantly. No page refresh needed. PR merged.',
  },
  {
    code: 'RF-6', project: 'Restaurant Flow', sprint: 'Sprint 2 — Week 6',
    summary: 'React — Customer Ordering Page',
    type: 'Story', priority: 'High', points: 5,
    labels: ['frontend', 'react', 'payments'],
    userStory: 'As a customer, I want to browse the menu, build a cart, pay with Razorpay, and track my live order status — all from one seamless mobile-friendly experience.',
    description: 'Cart state lives in React (no API call per item added — that would be too slow). The Razorpay checkout widget is opened after order creation, not before. The order tracking page connects to Socket.io to show live status — the customer should see their order move from CONFIRMED → PREPARING → READY without touching the browser.',
    criteria: [
      '/menu/:restaurantId — fetch and display menu grouped by category using TanStack Query',
      'Add to cart button — cart state managed in React only, no API call per add',
      'Cart panel shows: item name, quantity controls, item subtotal, cart total in ₹ format (Intl.NumberFormat en-IN)',
      'Place Order form collects customerName and customerPhone — validated before submit',
      'POST /api/orders on submit — on success redirect to /order/:id (tracking page)',
      '/order/:id — fetches initial order state, then connects to Socket.io room order:{orderId} for live updates',
      'Status timeline: PENDING → CONFIRMED → PREPARING → READY → DELIVERED — current status highlighted',
      'Razorpay checkout widget opens after order is placed — payment must complete before order is confirmed',
    ],
    dod: 'Full flow tested end-to-end: browse menu → add to cart → place order → pay via Razorpay test mode → see status update live on the tracking page. PR merged.',
  },
  {
    code: 'RF-7', project: 'Restaurant Flow', sprint: 'Sprint 2 — Week 6',
    summary: 'React — Kitchen Dashboard (Real-Time)',
    type: 'Story', priority: 'High', points: 5,
    labels: ['frontend', 'react', 'real-time'],
    userStory: 'As a kitchen staff member, I want a live dashboard that shows all incoming orders and lets me update their status — so I can manage the kitchen without refreshing or leaving the page.',
    description: 'This page must authenticate with a JWT before connecting to Socket.io — the kitchen dashboard is not public. Optimistic updates make the UI feel instant: when staff click "Preparing", the card updates immediately on-screen before the API responds. If the API call fails, the card reverts.',
    criteria: [
      '/kitchen — protected route, requires staff JWT, redirects to /login if unauthenticated',
      'On mount: fetch all active orders (not DELIVERED or CANCELLED) via GET /api/orders?status=ACTIVE',
      'Socket.io: join room restaurant:{restaurantId}, listen for new_order events',
      'new_order event → add order to top of list with a "NEW" badge — no page refresh',
      'Order card shows: order number, customer name, phone, items, total, time since placed, current status',
      'Status buttons on each card: Confirm → Preparing → Ready → Delivered. Calls PUT /api/orders/:id/status',
      'Status change optimistically updates the card — reverts on API error with error toast',
      'Orders auto-sorted: PENDING/CONFIRMED first, then PREPARING, then READY — DELIVERED hidden',
    ],
    dod: 'Open kitchen dashboard — new orders appear without refresh. Click status buttons — card updates instantly. If API fails, card reverts with error message. PR merged.',
  },
  {
    code: 'RF-8', project: 'Restaurant Flow', sprint: 'Sprint 2 — Week 6',
    summary: 'Full Stack Deploy — Railway + Vercel',
    type: 'Task', priority: 'Medium', points: 3,
    labels: ['deployment', 'devops', 'production'],
    userStory: 'As a product owner, I want the complete app deployed to production so that real customers can use it and the team can share the live URL.',
    description: 'This is the ticket where everything comes together. The most common failure point is Socket.io CORS — the production Vercel domain must match exactly what is set in CLIENT_URL on Railway. Test the end-to-end flow in production after deploy, not just the health endpoint.',
    criteria: [
      'Backend deployed to Railway — npm start runs the production server',
      'PostgreSQL on Neon or Supabase — NOT Railway ephemeral filesystem (data would be lost on restart)',
      'All env vars set in Railway: DATABASE_URL, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, CLIENT_URL',
      'Frontend deployed to Vercel — VITE_API_URL points to Railway backend URL',
      'Socket.io CORS configured for production Vercel domain — connections not blocked',
      'GET https://{railway-url}/api/health returns { status: "ok" }',
      '.env.example in repo documents every required variable',
      'End-to-end test in production: browse menu → place order → pay via Razorpay → staff sees in kitchen → status updates live on customer page',
    ],
    dod: 'Live URL shared in Jira ticket comments. End-to-end test passes in production. README has live link. PR merged.',
  },

  // ── LEAD BILL ─────────────────────────────────────────────────────────────────
  {
    code: 'LB-1', project: 'Lead Bill', sprint: 'Sprint 1 — Week 7',
    summary: 'Express Server + Prisma Setup',
    type: 'Task', priority: 'Low', points: 2,
    labels: ['backend', 'database', 'setup'],
    userStory: 'As a developer, I want the Lead Bill backend scaffolded cleanly so that every invoice and client feature has a solid, well-structured foundation.',
    description: 'Students already have a Mini Lead Manager Express + Prisma setup from Weeks 1–4. This ticket extends that codebase — they do not start from scratch. The key additions are the Client and Invoice models. The Prisma client must remain a singleton exported from lib/prisma.js.',
    criteria: [
      'Express server starts on port from .env — NOT a hardcoded port number',
      'Prisma schema defined with at least: User, Client, Invoice, InvoiceItem models',
      'DATABASE_URL read from .env — no hardcoded connection strings anywhere',
      'Server has /api/health endpoint returning { status: "ok", timestamp: ISO string }',
      'npm run dev starts server with nodemon — no manual restart needed for code changes',
      '.env.example file exists with all required variable names (values can be placeholders)',
      '.gitignore includes node_modules/, .env, *.log',
      'Prisma client exported from a single src/lib/prisma.js — not instantiated in every route file',
    ],
    dod: 'Schema pushed, health endpoint returns 200, nodemon restarts on file save, .env.example committed, PR merged.',
  },
  {
    code: 'LB-2', project: 'Lead Bill', sprint: 'Sprint 1 — Week 7',
    summary: 'Client Management API',
    type: 'Story', priority: 'Medium', points: 3,
    labels: ['backend', 'api', 'clients'],
    userStory: 'As a freelancer, I want to create and manage clients so that I can track who I am invoicing and store the GST details I need for correct tax calculation.',
    description: 'Clients are scoped to the authenticated user — a freelancer must never see another user\'s clients. Soft delete (setting deletedAt instead of removing the row) preserves invoice history even when a client relationship ends. Input validation must run before any database query — never hit the DB with unvalidated data.',
    criteria: [
      'POST /api/clients — creates a client. Required: name, email. Optional: gstNumber, address, state, phone',
      'GET /api/clients — lists all clients belonging to the authenticated user only — no other user\'s clients visible',
      'GET /api/clients/:id — get single client. Returns 404 if client belongs to another user',
      'PUT /api/clients/:id — update client fields. Partial updates allowed (not all fields required)',
      'DELETE /api/clients/:id — soft delete: set deletedAt = now(). Do NOT hard delete the row',
      'All routes protected by JWT auth middleware — unauthenticated requests get 401',
      'Input validated with express-validator BEFORE any database query runs',
      'Consistent response shape: { success: true, data: {...} } or { success: false, error: "message" }',
    ],
    dod: 'All 5 routes tested in Postman with valid and invalid data. Another user\'s client returns 404. Soft deleted client does not appear in list. PR merged.',
  },
  {
    code: 'LB-3', project: 'Lead Bill', sprint: 'Sprint 1 — Week 7',
    summary: 'Invoice Creation API with GST Calculation',
    type: 'Story', priority: 'High', points: 5,
    labels: ['backend', 'api', 'gst', 'invoicing'],
    userStory: 'As a freelancer, I want to create invoices with automatically calculated GST so that I never have to do tax math manually and my invoices are always legally correct.',
    description: 'GST in India depends on whether the freelancer and client are in the same state. Same state = CGST + SGST (split equally). Different state = IGST (full rate). The server detects this automatically from the stored state fields — the client never sends tax amounts. All calculated amounts are stored in the DB pre-computed to avoid re-calculating on every read.',
    criteria: [
      'POST /api/invoices — body: { clientId, items: [{ description, quantity, unitPrice }], gstRate, dueDate }',
      'GST auto-calculated server-side — client NEVER sends tax amount in the request body',
      'Same-state: freelancer.state === client.state → cgst = gstRate/2, sgst = gstRate/2, igst = 0',
      'Different-state: states differ → igst = gstRate, cgst = 0, sgst = 0',
      'subtotal, cgst, sgst, igst, totalAmount all stored in DB — pre-computed, never recalculated on fetch',
      'invoiceNumber auto-generated in format INV-YYYY-XXXX (e.g. INV-2024-0001). Sequential, never repeats',
      'GET /api/invoices — list all invoices for auth user with client name and status',
      'GET /api/invoices/:id — full invoice detail with all line items',
      'PUT /api/invoices/:id/status — update status: DRAFT | SENT | PAID | OVERDUE. Only owner can update',
    ],
    dod: 'Create invoices for same-state and different-state clients — verify CGST/SGST vs IGST switches correctly. Invoice number increments correctly. PR merged.',
  },
  {
    code: 'LB-4', project: 'Lead Bill', sprint: 'Sprint 2 — Week 8',
    summary: 'PDF Invoice Generation',
    type: 'Story', priority: 'High', points: 5,
    labels: ['backend', 'pdf', 'invoicing'],
    userStory: 'As a freelancer, I want to download a professional PDF of any invoice so that I can email it to my client as a formal billing document.',
    description: 'PDF is generated server-side using pdf-lib — not a screenshot of HTML, not a frontend print. This matters because the server-generated PDF is identical every time and matches exactly what is in the database. The GST row display changes based on the invoice type: IGST invoices show only the IGST row, CGST+SGST invoices show both rows.',
    criteria: [
      'GET /api/invoices/:id/pdf — returns a PDF file with Content-Type: application/pdf',
      'PDF contains: Invoice number, dates, freelancer + client details with GST numbers, itemized table, GST breakdown, subtotal, total in ₹',
      'PDF generated server-side using pdf-lib — NOT a screenshot of HTML',
      'Only the invoice owner can download the PDF — 403 for other authenticated users',
      'All amounts on PDF exactly match what is stored in DB — no rounding differences',
      'If GST type is IGST: show only IGST row. If CGST+SGST: show both rows. Never show inapplicable rows',
      'Response header: Content-Disposition: attachment; filename="INV-2024-0001.pdf"',
    ],
    dod: 'Download PDF for a same-state invoice (CGST+SGST rows visible) and a different-state invoice (IGST row only). Amounts match DB exactly. PR merged.',
  },
  {
    code: 'LB-5', project: 'Lead Bill', sprint: 'Sprint 2 — Week 8',
    summary: 'Payment Tracking + Overdue Detection',
    type: 'Story', priority: 'Medium', points: 3,
    labels: ['backend', 'api', 'payments'],
    userStory: 'As a freelancer, I want to record payments against invoices and see which ones are overdue so that I always know exactly how much money I am owed.',
    description: 'Partial payments are common in freelance work — a client may pay 50% upfront and 50% on delivery. Each payment is appended as a new record, never overwriting the previous one. All amounts are stored in paise (integers) — never use floating point for money calculations.',
    criteria: [
      'PUT /api/invoices/:id/payment — body: { amountPaid, paymentMethod, paymentDate }. Supports partial payments',
      'If amountPaid >= invoice.totalAmount → status automatically set to PAID',
      'If amountPaid < invoice.totalAmount → status set to PARTIALLY_PAID, remaining amount stored',
      'GET /api/invoices/overdue — returns all invoices where dueDate < now() AND status is NOT PAID',
      'GET /api/dashboard/summary — returns { totalOutstanding, totalPaid, overdueCount, invoiceCount, thisMonthRevenue }',
      'All amounts in paise (integer) — no floating point money math anywhere in the codebase',
      'Payment history preserved — do NOT overwrite previous payment records, append each new payment',
    ],
    dod: 'Record two partial payments on one invoice — both saved, status becomes PARTIALLY_PAID then PAID. Dashboard summary returns correct totals. PR merged.',
  },
  {
    code: 'LB-6', project: 'Lead Bill', sprint: 'Sprint 2 — Week 8',
    summary: 'React — Client Management UI',
    type: 'Story', priority: 'Medium', points: 5,
    labels: ['frontend', 'react', 'clients'],
    userStory: 'As a freelancer, I want a React page to add and manage clients so that I can maintain my client list without using Postman or any other tool.',
    description: 'All API calls go through the Axios instance in src/lib/api.js — never raw fetch() inside a component. Loading skeletons (not spinners) show while data fetches. The client list is filterable on the frontend without an extra API call. Edit opens inline or in a modal — no separate page navigation.',
    criteria: [
      '/clients route renders client list fetched from GET /api/clients using TanStack Query',
      'Add client form validates before submit: name required, email must be valid format, GST number must be 15 chars if provided',
      'Successful client creation invalidates query cache — new client appears immediately without page reload',
      'All API calls go through src/lib/api.js (Axios instance with JWT interceptor) — no raw fetch() inside components',
      'Loading skeleton shown while data is fetching — not a spinner, not a blank screen',
      'Error state shown if API returns an error — not a blank screen or console-only error',
      'Client list is searchable by name on the frontend — client-side filter, no extra API call',
      'Edit client opens inline form or modal — not a separate page',
    ],
    dod: 'Add a client → appears in list immediately. Search filters the list. Edit opens inline. Delete removes from list. Skeleton shows during loading. PR merged.',
  },
  {
    code: 'LB-7', project: 'Lead Bill', sprint: 'Sprint 3 — Week 9',
    summary: 'React — Invoice Form with Live GST Preview',
    type: 'Story', priority: 'High', points: 5,
    labels: ['frontend', 'react', 'gst', 'invoicing'],
    userStory: 'As a freelancer, I want an invoice form where I can add line items and instantly see the GST breakdown update as I type — so I know exactly what the client will be charged before I submit.',
    description: 'This is the most complex React form in the program. Line items are dynamic — rows are added and removed without a page navigation. The GST type (CGST+SGST vs IGST) switches automatically based on whether the selected client\'s state matches the freelancer\'s state. All calculations happen in React state — no "Calculate" button needed.',
    criteria: [
      '/invoices/new — invoice form with: client dropdown (fetches from API), dynamic line item rows, GST rate selector (0%, 5%, 12%, 18%, 28%)',
      'Line items calculate live — subtotal updates as user types quantity or unit price. No Calculate button',
      'GST preview panel: if client.state === user.state → show CGST + SGST rows. If different → show IGST row',
      'Add line item button adds a blank row. Remove button deletes that row. Minimum 1 line item enforced',
      'Submit calls POST /api/invoices — not PDF endpoint. PDF is a separate action',
      'On success: navigate to /invoices/:id (new invoice detail page), not back to list',
      'All money values displayed in Indian format: ₹1,23,456.00 using Intl.NumberFormat(\'en-IN\')',
      'Form state preserved if API call fails — user does not lose their entered data on error',
    ],
    dod: 'Add 3 line items — subtotals and GST update live. Switch client to different-state — GST type switches. Submit — navigates to new invoice detail. PR merged.',
  },
  {
    code: 'LB-8', project: 'Lead Bill', sprint: 'Sprint 3 — Week 9',
    summary: 'React — Dashboard with Outstanding Summary',
    type: 'Story', priority: 'Medium', points: 3,
    labels: ['frontend', 'react', 'dashboard'],
    userStory: 'As a freelancer, I want a home screen that shows my total outstanding amount, overdue invoices, and this month\'s revenue — so I can see my financial position at a glance the moment I log in.',
    description: 'Dashboard data comes entirely from the API — no hardcoded numbers. TanStack Query caches the data so after the first load there is no loading flash when returning to the dashboard. The PDF download button triggers a browser download without navigating away from the page.',
    criteria: [
      '/dashboard — shows 4 stat cards: Total Outstanding, Overdue, This Month Revenue, Total Invoices',
      'Data fetched from GET /api/dashboard/summary — no hardcoded numbers anywhere',
      'Recent invoices list (last 5) fetched from GET /api/invoices?limit=5&sort=desc',
      'Each invoice row shows: invoice number, client name, amount (₹ formatted), status badge, due date',
      'Status badges are colour-coded: PAID (green), SENT (blue), OVERDUE (red), DRAFT (grey)',
      'Download PDF button on each invoice row — calls GET /api/invoices/:id/pdf and triggers browser download',
      'Overdue invoices section highlighted separately with count and total overdue amount',
      'Page loads with skeleton → data → no loading flash on return visits (TanStack Query cache hit)',
    ],
    dod: 'Dashboard shows correct numbers from DB. Stat cards match what you see in Postman. PDF download works from the list. Skeleton shows on first load only. PR merged.',
  },

  // ── CLIENTDESK AI ─────────────────────────────────────────────────────────────
  {
    code: 'CA-1', project: 'ClientDesk AI', sprint: 'Sprint 1 — Week 10',
    summary: 'Support Desk Schema + Express Setup',
    type: 'Task', priority: 'Low', points: 2,
    labels: ['backend', 'database', 'setup'],
    userStory: 'As a developer, I want the ClientDesk AI schema and server set up so that every feature in this project has a clean, correct data foundation.',
    description: 'This project introduces a more complex multi-tenant schema: Companies have Agents, Agents manage SupportTickets from Customers. The AiDraft model stores both the AI-generated reply and the exact prompt used — logging the prompt is essential for debugging why the AI gave a bad answer.',
    criteria: [
      'Prisma schema: Company, Agent (role: ADMIN|AGENT), Customer, SupportTicket, Message (isAI flag), AiDraft (promptUsed field)',
      'SupportTicket status enum: OPEN | WAITING_REPLY | REPLIED | CLOSED',
      'SupportTicket priority enum: LOW | MEDIUM | HIGH | URGENT',
      'Prisma client exported from src/lib/prisma.js',
      'Express server starts on PORT from .env — GET /api/health returns { status: "ok" }',
      'npm run db:push applies schema without errors',
      '.env.example documents: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, PORT, CLIENT_URL',
      '.gitignore includes node_modules/, .env, *.log',
    ],
    dod: 'Schema pushed, health endpoint returns 200, .env.example committed, ANTHROPIC_API_KEY in .env.example (not .env), PR merged.',
  },
  {
    code: 'CA-2', project: 'ClientDesk AI', sprint: 'Sprint 1 — Week 10',
    summary: 'Ticket CRUD API + Agent Auth',
    type: 'Story', priority: 'Medium', points: 3,
    labels: ['backend', 'api', 'auth'],
    userStory: 'As a customer, I want to submit a support ticket without creating an account. As an agent, I want to log in and manage the ticket queue.',
    description: 'Two different auth flows in one ticket. Customers are identified by email only — no passwords. Agents use standard JWT login. Ticket numbers (TKT-XXXX) are sequential and never repeat — this is what customers use to track their request.',
    criteria: [
      'POST /api/tickets — public endpoint. Body: { customerEmail, subject, body }. Creates ticket + customer if new email. Returns { ticketId, ticketNumber }',
      'Ticket number auto-generated: TKT-XXXX (e.g. TKT-0047). Sequential, never repeated',
      'POST /api/auth/login — agent login. Returns JWT with { agentId, role, companyId }',
      'GET /api/tickets — agents only. Paginated, newest first. Filter by status and priority',
      'GET /api/tickets/:id — agents only. Returns ticket with full message thread',
      'PUT /api/tickets/:id/status — agents only. Valid status transitions enforced',
      'GET /api/tickets/:id/messages — all messages: customer, agent, and AI replies',
      'POST /api/tickets/:id/messages — agent posts a reply. Status auto-updates to REPLIED',
    ],
    dod: 'Submit ticket without auth — gets ticket number. Agent login returns JWT. Agent can view and reply to ticket. Status updates correctly. PR merged.',
  },
  {
    code: 'CA-3', project: 'ClientDesk AI', sprint: 'Sprint 1 — Week 10',
    summary: 'Claude AI Auto-Reply Generation',
    type: 'Story', priority: 'High', points: 5,
    labels: ['backend', 'ai', 'claude-api'],
    userStory: 'As an agent, I want an AI-generated draft reply waiting for me when I open a new ticket so that I can respond faster with less effort.',
    description: 'The AI runs asynchronously — the customer should not wait for Claude to respond before getting their ticket confirmation. The AiDraft stores both the generated reply AND the exact prompt used. This is critical: when the AI gives a bad answer, you need the prompt to understand why. Agents always review before sending — AI drafts never go to customers automatically.',
    criteria: [
      'After POST /api/tickets, trigger AI draft generation asynchronously — customer gets ticketId immediately, Claude runs in background',
      'Claude API called with: system prompt (agent persona, company name, helpful tone) + user message (customer subject + body)',
      'Model: claude-haiku-4-5-20251001',
      'AiDraft created: ticketId, body (Claude response), promptUsed (exact prompt logged), approved: false',
      'PUT /api/ai-drafts/:id/approve — agent approves. Creates Message with isAI: true. approved = true, agentId recorded',
      'PUT /api/ai-drafts/:id — agent edits draft body before approving. Original prompt preserved even after edit',
      'ANTHROPIC_API_KEY loaded from .env — never hardcoded in any file',
      'If Claude API fails: AiDraft created with body: null and an error field. Ticket still works, agent replies manually',
    ],
    dod: 'Submit a ticket — wait 3-5 seconds — check GET /api/tickets/:id — AiDraft should exist with body from Claude. Approve it — Message created with isAI: true. Kill the API key — ticket still submits, AiDraft.error is set. PR merged.',
  },
  {
    code: 'CA-4', project: 'ClientDesk AI', sprint: 'Sprint 1 — Week 10',
    summary: 'Email Notifications via Nodemailer',
    type: 'Story', priority: 'Medium', points: 3,
    labels: ['backend', 'email', 'notifications'],
    userStory: 'As a customer, I want to receive an email when my ticket is received and when an agent replies so that I know my request is being handled without having to check the portal.',
    description: 'Email must be non-blocking — the API response should not wait for the SMTP server to respond. If the email fails, the ticket or reply must still succeed. Use Mailtrap for development (it catches all emails without sending them to real addresses). HTML emails, not plain text.',
    criteria: [
      'Ticket created → email customer: subject "We received your request — TKT-XXXX", body includes ticket number and tracking link',
      'Agent replies → email customer: subject "Reply to your request TKT-XXXX", body includes reply text',
      'Nodemailer configured from env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS — never hardcoded',
      'Email sending is async and non-blocking — API response is not delayed by the SMTP call',
      'If SMTP is not configured: log a warning and continue — the app does not crash',
      'Email failures are caught and logged — do not cause ticket or reply API to return 500',
      'FROM address from SMTP_FROM env var — defaults to "ClientDesk AI <noreply@clientdesk.ai>"',
      'HTML email template — not plain text. Minimal but professional: ticket number, message body, tracking link',
    ],
    dod: 'Submit a ticket with Mailtrap configured — check Mailtrap inbox, confirmation email received. Agent replies — reply notification received. Remove SMTP vars — ticket submission still succeeds, error logged. PR merged.',
  },
  {
    code: 'CA-5', project: 'ClientDesk AI', sprint: 'Sprint 2 — Week 11',
    summary: 'GitHub Actions CI/CD Pipeline',
    type: 'Task', priority: 'High', points: 5,
    labels: ['devops', 'ci-cd', 'github-actions'],
    userStory: 'As a developer, I want automated tests to run on every PR so that broken code is caught before it reaches production and the team can merge with confidence.',
    description: 'This is the first time students write a GitHub Actions workflow file. The key principle: secrets belong in GitHub Actions secrets, never in the YAML file itself. Tests must hit a real test database — mocked tests would have passed when a real production migration failed.',
    criteria: [
      '.github/workflows/ci.yml — triggers on: push to main, pull_request to main',
      'Steps: checkout → setup-node@v4 (Node 20) → npm ci → npm run lint → npm test',
      'npm test runs at least 3 integration tests: POST /api/tickets creates ticket, POST /api/auth/login returns JWT, GET /api/health returns 200',
      'Tests use a real test database (TEST_DATABASE_URL) — no mocked DB queries anywhere',
      'Railway auto-deploy triggered after CI passes via Railway GitHub integration',
      'Secrets in GitHub Actions secrets: TEST_DATABASE_URL, RAILWAY_TOKEN, ANTHROPIC_API_KEY — not in the YAML file',
      'Failing test → CI fails → Railway deployment does NOT trigger',
      'Branch protection rule set: "ci" check must pass before merge is allowed',
    ],
    dod: 'Open a PR with a broken test — CI fails, merge blocked. Fix the test — CI passes, Railway deploys. Secrets are not visible anywhere in the YAML. PR merged.',
  },
  {
    code: 'CA-6', project: 'ClientDesk AI', sprint: 'Sprint 2 — Week 11',
    summary: 'React — Customer Support Portal',
    type: 'Story', priority: 'High', points: 5,
    labels: ['frontend', 'react', 'customer-portal'],
    userStory: 'As a customer, I want a simple portal to submit a support ticket and track its status — without creating an account or remembering a password.',
    description: 'Customers identify themselves by email + ticket number. The thread auto-refreshes every 30 seconds so customers see replies without manual refreshing. AI-generated replies are labelled "[AI Assistant]" so customers know the difference.',
    criteria: [
      '/ — "Submit a Support Request" form. Fields: name, email, subject, message. All required',
      'Form validation with React Hook Form + Zod before submit',
      'POST /api/tickets on submit — success shows: "Ticket received! Your number is TKT-0047. Track at /track/TKT-0047"',
      '/track/:ticketNumber — customer enters email to verify ownership. Fetches ticket and thread',
      'Thread shows: customer messages (right-aligned), agent replies (left-aligned), AI replies labelled "[AI Assistant]"',
      'Status badge: OPEN (blue), WAITING_REPLY (orange), REPLIED (green), CLOSED (grey)',
      'Page auto-refreshes thread every 30 seconds — customer sees reply without manual refresh',
      'All API calls through src/lib/api.js — no raw fetch',
    ],
    dod: 'Submit ticket → see confirmation with ticket number. Open tracking page → enter email → see ticket. Wait for agent reply → auto-refresh shows it within 30 seconds. PR merged.',
  },
  {
    code: 'CA-7', project: 'ClientDesk AI', sprint: 'Sprint 2 — Week 11',
    summary: 'React — Agent Dashboard',
    type: 'Story', priority: 'High', points: 5,
    labels: ['frontend', 'react', 'agent-dashboard'],
    userStory: 'As an agent, I want a dashboard to manage my ticket queue, review AI-generated drafts, and reply to customers — all without leaving a single page.',
    description: 'The AI draft panel is the centrepiece of this page. When an agent opens a ticket, they see the AI\'s suggested reply alongside an Edit and "Approve & Send" button. Approving sends it to the customer and marks it as an AI reply. Manual replies use optimistic updates — the reply appears in the thread before the API confirms.',
    criteria: [
      '/agent/login — login page. POST /api/auth/login. Stores JWT in Zustand. Redirects to /agent/tickets on success',
      '/agent/tickets — protected route. Ticket list with filter tabs: All / Open / Replied / Closed',
      'List shows: ticket number, customer email, subject, priority badge, status badge, time since created',
      'Click ticket → /agent/tickets/:id — full ticket view with complete message thread',
      'AI draft panel: if unreviewed AiDraft exists, show draft with Edit and "Approve & Send" buttons',
      'Approve calls PUT /api/ai-drafts/:id/approve — on success, draft appears in thread with "[AI]" label',
      'Manual reply box — POST /api/tickets/:id/messages. Reply appears instantly via optimistic update',
      'Priority and status dropdowns allow updates without navigating away from the page',
    ],
    dod: 'Log in as agent → see ticket list → open ticket → AI draft visible → approve it → appears in thread with [AI] label → customer portal shows it. Manual reply also works. PR merged.',
  },
  {
    code: 'CA-8', project: 'ClientDesk AI', sprint: 'Sprint 2 — Week 11',
    summary: 'Production Deploy + Health Monitoring',
    type: 'Task', priority: 'Medium', points: 3,
    labels: ['deployment', 'devops', 'production', 'monitoring'],
    userStory: 'As a product owner, I want ClientDesk AI deployed to production with CI/CD running so that every merged PR automatically deploys and the system is live for real users.',
    description: 'Final ticket of the entire program. The health endpoint should confirm a real DB connection — not just that the process is running. After deploy, run the full end-to-end test in production before closing this ticket.',
    criteria: [
      'Backend deployed to Railway — env vars set: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, SMTP_* vars, CLIENT_URL',
      'PostgreSQL on Neon or Supabase — not Railway ephemeral storage',
      'Frontend deployed to Vercel — VITE_API_URL points to Railway backend URL',
      'GitHub Actions CI pipeline passes on main — CI badge visible in README',
      'GET /api/health returns { status: "ok", db: "connected", timestamp: ISO string } — db field confirms Prisma can query',
      'End-to-end test in production: submit ticket → AI draft generated → agent approves → customer receives email reply',
      '.env.example documents all variables — another developer can deploy from scratch without asking',
      'README has: project description, local setup instructions, live URL, CI badge',
    ],
    dod: 'Live URL shared. CI badge is green in README. Full end-to-end test passes in production. Another developer can set up the project from README alone. PR merged.',
  },
]

// ─── HTML generation ──────────────────────────────────────────────────────────

const priorityColor = { Low: '#16a34a', Medium: '#2563eb', High: '#dc2626' }
const typeColor = { Story: '#7c3aed', Task: '#0891b2' }

function badge(text, color, bg) {
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:8.5pt;font-weight:700;color:${color};background:${bg};border:1px solid ${color}22;">${text}</span>`
}

function ticketHtml(t) {
  const pColor = priorityColor[t.priority] || '#666'
  const tColor = typeColor[t.type] || '#666'
  const acItems = t.criteria.map((c,i) =>
    `<tr><td style="width:24px;padding:4pt 6pt;vertical-align:top;color:#6b7280;font-size:9pt;">${i+1}</td><td style="padding:4pt 6pt;font-size:9.5pt;line-height:1.5;">${c}</td></tr>`
  ).join('')
  const labels = t.labels.map(l =>
    `<span style="display:inline-block;padding:1px 7px;border-radius:3px;font-size:8pt;background:#f1f5f9;border:1px solid #cbd5e1;color:#475569;margin-right:4px;">${l}</span>`
  ).join('')

  return `
<div style="page-break-inside:avoid;margin-bottom:28pt;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
  <!-- Header -->
  <div style="background:#0f172a;padding:10pt 14pt;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <span style="font-family:monospace;font-size:11pt;font-weight:700;color:#60a5fa;letter-spacing:0.5px;">${t.code}</span>
      <span style="color:#94a3b8;font-size:9pt;margin-left:10px;">${t.project}</span>
    </div>
    <div style="display:flex;gap:8px;align-items:center;">
      ${badge(t.type, tColor, tColor+'15')}
      ${badge(t.priority + ' Priority', pColor, pColor+'15')}
      <span style="background:#1e293b;color:#fbbf24;padding:2px 10px;border-radius:4px;font-size:8.5pt;font-weight:700;">${t.points} SP</span>
    </div>
  </div>
  <!-- Summary -->
  <div style="padding:10pt 14pt 6pt;border-bottom:1px solid #f1f5f9;">
    <div style="font-size:14pt;font-weight:700;color:#0f172a;margin-bottom:4pt;">${t.summary}</div>
    <div style="font-size:8.5pt;color:#64748b;">Sprint: <strong>${t.sprint}</strong>&nbsp;&nbsp;|&nbsp;&nbsp;Labels: ${labels}</div>
  </div>
  <!-- Body -->
  <div style="padding:10pt 14pt;">
    <!-- User Story -->
    <div style="margin-bottom:10pt;">
      <div style="font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#7c3aed;margin-bottom:4pt;">User Story</div>
      <div style="background:#faf5ff;border-left:3px solid #7c3aed;padding:7pt 10pt;font-size:9.5pt;color:#1e293b;line-height:1.5;border-radius:0 4px 4px 0;font-style:italic;">${t.userStory}</div>
    </div>
    <!-- Description -->
    <div style="margin-bottom:10pt;">
      <div style="font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#0891b2;margin-bottom:4pt;">Description</div>
      <div style="background:#f0f9ff;border-left:3px solid #0891b2;padding:7pt 10pt;font-size:9.5pt;color:#1e293b;line-height:1.55;border-radius:0 4px 4px 0;">${t.description}</div>
    </div>
    <!-- Acceptance Criteria -->
    <div style="margin-bottom:10pt;">
      <div style="font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#059669;margin-bottom:6pt;">Acceptance Criteria</div>
      <table style="width:100%;border-collapse:collapse;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;">
        ${acItems}
      </table>
    </div>
    <!-- Definition of Done -->
    <div>
      <div style="font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#92400e;margin-bottom:4pt;">Definition of Done</div>
      <div style="background:#fffbeb;border-left:3px solid #f59e0b;padding:7pt 10pt;font-size:9.5pt;color:#1e293b;line-height:1.5;border-radius:0 4px 4px 0;">${t.dod}</div>
    </div>
  </div>
</div>`
}

// Group tickets by project
const projects = [
  { name: 'Project 1 — Restaurant Flow', key: 'RF', color: '#0891b2', weeks: 'Weeks 5–6', tickets: tickets.filter(t => t.code.startsWith('RF')) },
  { name: 'Project 2 — Lead Bill', key: 'LB', color: '#7c3aed', weeks: 'Weeks 7–9', tickets: tickets.filter(t => t.code.startsWith('LB')) },
  { name: 'Project 3 — ClientDesk AI', key: 'CA', color: '#dc2626', weeks: 'Weeks 10–11', tickets: tickets.filter(t => t.code.startsWith('CA')) },
]

const guideHtml = `
<div style="page-break-after:always;">
  <h1 style="font-size:26pt;color:#0f172a;margin:0 0 4pt;">DevForge — Jira Ticket Reference</h1>
  <p style="color:#64748b;font-size:10pt;margin:0 0 20pt;">24 tickets · 3 projects · RF, LB, CA · May 2025</p>

  <h2 style="font-size:16pt;color:#0f172a;border-top:2px solid #2563eb;padding-top:12pt;margin:0 0 12pt;">How to Read a Jira Ticket</h2>
  <table style="width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:16pt;">
    <thead><tr style="background:#eef2ff;"><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">Field</th><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">What it means</th><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">What to do</th></tr></thead>
    <tbody>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Ticket Code</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">e.g. RF-3 — Project key + auto number</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Use in your branch name: <code>feat/RF-3-razorpay</code></td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Summary</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">One-line title of the work</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Copy exactly as shown into Jira</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Issue Type</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;"><strong>Story</strong> = user-facing feature &nbsp;·&nbsp; <strong>Task</strong> = technical/setup work</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Select from the Jira dropdown</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Priority</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Low / Medium / High — how critical it is</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Set in Jira. Do High tickets first in a sprint</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Story Points</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Effort estimate — 2=easy, 5=medium, 8=hard</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Enter the number in the Story Points field</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">User Story</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Who wants this and why — the human reason</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Paste into the Description field at the top</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Description</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Technical context — why this is built this way</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Paste below User Story in Description field</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Acceptance Criteria</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Specific, testable conditions — if all pass, ticket is done</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Paste numbered list into Description. Students check each one before submitting PR</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Definition of Done</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">The final test — exactly how to verify the work is complete</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Paste at the bottom of Description</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Labels</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Tags to filter and group tickets</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Add as Labels in Jira — type each one</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">Sprint</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Which sprint this ticket belongs to</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Assign from the Sprint dropdown after creating the sprint</td></tr>
    </tbody>
  </table>

  <h2 style="font-size:16pt;color:#0f172a;border-top:2px solid #2563eb;padding-top:12pt;margin:0 0 12pt;">Daily Workflow for Students</h2>
  <table style="width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:16pt;">
    <thead><tr style="background:#eef2ff;"><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;width:40px;color:#1e1b4b;">Step</th><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">Action</th><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">Example</th></tr></thead>
    <tbody>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;text-align:center;">1</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Pick a ticket from To Do → move to In Progress</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">RF-3 moves to In Progress on the board</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;text-align:center;">2</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Create a branch using the ticket code</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;"><code>git checkout -b feat/RF-3-razorpay-integration</code></td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;text-align:center;">3</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Commit with ticket code in the message</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;"><code>git commit -m "feat(RF-3): add razorpay order endpoint"</code></td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;text-align:center;">4</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Open PR → write "Closes RF-3" in the description</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">GitHub for Jira links the PR to the ticket automatically</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;text-align:center;">5</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Move ticket to In Review while waiting for AI review</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">RF-3 moves to In Review column</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;text-align:center;">6</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Fix AI review feedback → push to same branch</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">New commits auto-update the PR</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;text-align:center;">7</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">PR merged → Jira auto-moves ticket to Done</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">RF-3 appears in Done column automatically</td></tr>
    </tbody>
  </table>

  <h2 style="font-size:16pt;color:#0f172a;border-top:2px solid #2563eb;padding-top:12pt;margin:0 0 8pt;">Story Points — How Many to Add Per Ticket</h2>
  <p style="font-size:9pt;color:#64748b;margin:0 0 12pt;"><strong>What are story points?</strong> They measure effort, not hours. 2 = simple setup, 3 = straightforward feature, 5 = complex feature or new technology. In Jira, find the field called <strong>"Story point estimate"</strong> in the right panel when you open a ticket.</p>

  <!-- RF table -->
  <div style="font-size:9pt;font-weight:700;color:#0891b2;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4pt;">Project 1 — Restaurant Flow (RF)</div>
  <table style="width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:14pt;">
    <thead><tr style="background:#0891b2;"><th style="padding:6pt 8pt;border:1px solid #0e7490;color:white;text-align:left;">Ticket</th><th style="padding:6pt 8pt;border:1px solid #0e7490;color:white;text-align:left;">Summary</th><th style="padding:6pt 8pt;border:1px solid #0e7490;color:white;text-align:center;width:50px;">Points</th><th style="padding:6pt 8pt;border:1px solid #0e7490;color:white;text-align:left;">Why this many?</th></tr></thead>
    <tbody>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF-1</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Restaurant + Menu Schema Setup</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">2</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Pure scaffolding — schema + health endpoint, no logic</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF-2</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Menu API + Place Order API</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Two endpoints with server-side total calculation and order numbering</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF-3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Razorpay Payment Integration</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Guided by W5L3 lesson — HMAC verification is the main new concept, all steps covered in class</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF-4</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Order Status Management API</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Single endpoint with transition validation — familiar CRUD pattern</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF-5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Socket.io Real-Time Order Updates</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Guided by W6L1 lesson — Socket.io rooms and JWT handshake taught end-to-end</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF-6</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">React — Customer Ordering Page</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Cart state + Razorpay widget + Socket.io tracking — three parts</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF-7</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">React — Kitchen Dashboard (Real-Time)</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Socket.io in React + optimistic updates + JWT in handshake</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF-8</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Full Stack Deploy — Railway + Vercel</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Deployment steps are clear but Socket.io CORS in prod needs care</td></tr>
    </tbody>
  </table>

  <!-- LB table -->
  <div style="font-size:9pt;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4pt;">Project 2 — Lead Bill (LB)</div>
  <table style="width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:14pt;">
    <thead><tr style="background:#7c3aed;"><th style="padding:6pt 8pt;border:1px solid #6d28d9;color:white;text-align:left;">Ticket</th><th style="padding:6pt 8pt;border:1px solid #6d28d9;color:white;text-align:left;">Summary</th><th style="padding:6pt 8pt;border:1px solid #6d28d9;color:white;text-align:center;width:50px;">Points</th><th style="padding:6pt 8pt;border:1px solid #6d28d9;color:white;text-align:left;">Why this many?</th></tr></thead>
    <tbody>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB-1</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Express Server + Prisma Setup</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">2</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Extends Mini Lead Manager — students already know this pattern</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB-2</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Client Management API</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Standard CRUD — soft delete is the only new concept</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB-3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Invoice Creation API with GST Calculation</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">GST same-state/different-state logic requires careful implementation</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB-4</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">PDF Invoice Generation</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">New library (pdf-lib) + conditional GST row display</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB-5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Payment Tracking + Overdue Detection</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Partial payment logic + aggregation query — moderate complexity</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB-6</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">React — Client Management UI</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Skeleton loading + inline edit + client-side search — three UX patterns</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB-7</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">React — Invoice Form with Live GST Preview</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Guided by W9L1 lesson — dynamic rows and live GST switching covered in class</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB-8</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">React — Dashboard with Outstanding Summary</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Display-only page — data comes from one API endpoint</td></tr>
    </tbody>
  </table>

  <!-- CA table -->
  <div style="font-size:9pt;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4pt;">Project 3 — ClientDesk AI (CA)</div>
  <table style="width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:16pt;">
    <thead><tr style="background:#dc2626;"><th style="padding:6pt 8pt;border:1px solid #b91c1c;color:white;text-align:left;">Ticket</th><th style="padding:6pt 8pt;border:1px solid #b91c1c;color:white;text-align:left;">Summary</th><th style="padding:6pt 8pt;border:1px solid #b91c1c;color:white;text-align:center;width:50px;">Points</th><th style="padding:6pt 8pt;border:1px solid #b91c1c;color:white;text-align:left;">Why this many?</th></tr></thead>
    <tbody>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA-1</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Support Desk Schema + Express Setup</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">2</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Familiar pattern by now — schema + health endpoint</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA-2</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Ticket CRUD API + Agent Auth</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Two auth flows (customer emailonly + agent JWT) but familiar CRUD</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA-3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Claude AI Auto-Reply Generation</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Guided by W10L3 lesson — Claude API integration and async patterns taught end-to-end</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA-4</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Email Notifications via Nodemailer</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Non-blocking async email — the pattern is straightforward once understood</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA-5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">GitHub Actions CI/CD Pipeline</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">New concept (YAML workflow) + integration tests + branch protection setup</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA-6</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">React — Customer Support Portal</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">React Hook Form + Zod + auto-refresh polling — three new patterns</td></tr>
      <tr><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA-7</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">React — Agent Dashboard</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">5</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">AI draft approval panel + optimistic reply — complex but familiar React</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA-8</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;">Production Deploy + Health Monitoring</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:11pt;">3</td><td style="padding:5pt 8pt;border:1px solid #d1d5db;font-size:8.5pt;color:#64748b;">Third deployment — students know the process by now</td></tr>
    </tbody>
  </table>

  <h2 style="font-size:16pt;color:#0f172a;border-top:2px solid #2563eb;padding-top:12pt;margin:0 0 10pt;">Sprint Plan Overview</h2>
  <table style="width:100%;border-collapse:collapse;font-size:9.5pt;">
    <thead><tr style="background:#eef2ff;"><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">Sprint</th><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">Week</th><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">Tickets</th><th style="padding:7pt 8pt;border:1px solid #d1d5db;text-align:left;color:#1e1b4b;">Total SP</th></tr></thead>
    <tbody>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF Sprint 1</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Week 5</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">RF-1, RF-2, RF-3, RF-4</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">15 SP</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">RF Sprint 2</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Week 6</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">RF-5, RF-6, RF-7, RF-8</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">18 SP</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB Sprint 1</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Week 7</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">LB-1, LB-2, LB-3</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">10 SP</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB Sprint 2</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Week 8</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">LB-4, LB-5, LB-6</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">13 SP</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">LB Sprint 3</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Week 9</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">LB-7, LB-8</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">8 SP</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA Sprint 1</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Week 10</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">CA-1, CA-2, CA-3, CA-4</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">13 SP</td></tr>
      <tr><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">CA Sprint 2</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">Week 11</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;">CA-5, CA-6, CA-7, CA-8</td><td style="padding:6pt 8pt;border:1px solid #d1d5db;font-weight:700;">18 SP</td></tr>
    </tbody>
  </table>
</div>`

const projectSections = projects.map(p => `
<div style="page-break-before:always;">
  <div style="background:${p.color};padding:14pt 16pt;border-radius:8px;margin-bottom:20pt;">
    <div style="color:white;font-size:20pt;font-weight:800;">${p.name}</div>
    <div style="color:white;opacity:0.85;font-size:10pt;margin-top:3pt;">Jira Project Key: <strong>${p.key}</strong> &nbsp;·&nbsp; ${p.weeks} &nbsp;·&nbsp; ${p.tickets.length} tickets</div>
  </div>
  ${p.tickets.map(ticketHtml).join('')}
</div>`).join('')

const fullHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>DevForge — Jira Tickets Reference</title>
  <style>
    @page { size: A4; margin: 14mm 14mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif;
      font-size: 10pt;
      color: #111827;
      margin: 0;
      line-height: 1.5;
    }
    h1, h2, h3 { page-break-after: avoid; }
    code {
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      padding: 1px 4px;
    }
    table { page-break-inside: avoid; }
  </style>
</head>
<body>
${guideHtml}
${projectSections}
</body>
</html>`

fs.writeFileSync(htmlPath, fullHtml)
console.log(`✓ HTML written → ${htmlPath}`)

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
execSync(`"${chrome}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "file://${htmlPath}"`, { stdio: 'inherit' })
console.log(`✓ PDF written  → ${pdfPath}`)
console.log(`   Size: ${(fs.statSync(pdfPath).size / 1024).toFixed(0)} KB`)
