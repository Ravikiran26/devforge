require('dotenv').config()
const Sentry = require('@sentry/node')

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: 0.2,
  })
}

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

const { authenticate, requireAdmin } = require('./middleware/auth')

const authRoutes         = require('./routes/auth')
const applyRoute         = require('./routes/apply')
const paymentRoute       = require('./routes/payment')
const dashboardRoute     = require('./routes/student/dashboard')
const ticketsRoute       = require('./routes/student/tickets')
const lessonsRoute       = require('./routes/student/lessons')
const progressRoute      = require('./routes/student/progress')
const profileRoute       = require('./routes/student/profile')
const notificationsRoute = require('./routes/student/notifications')
const communityRoute     = require('./routes/student/community')
const adminDashboard     = require('./routes/admin/dashboard')
const adminCohorts       = require('./routes/admin/cohorts')
const adminStudents      = require('./routes/admin/students')
const adminTickets       = require('./routes/admin/tickets')
const adminLessons       = require('./routes/admin/lessons')
const adminAnnouncements = require('./routes/admin/announcements')
const adminPayments      = require('./routes/admin/payments')
const adminApplications  = require('./routes/admin/applications')
const adminAnalytics     = require('./routes/admin/analytics')

const app = express()

app.use(helmet())
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  /\.vercel\.app$/,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    )
    cb(allowed ? null : new Error('CORS blocked'), allowed)
  },
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

// 100 requests per 15 minutes per IP
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}))

// 10 login/register attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// ─── Public ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/apply', applyRoute)
app.use('/api/payment', paymentRoute)

// ─── Student (authenticated) ──────────────────────────────────────────────────
app.use('/api/student/dashboard',  authenticate, dashboardRoute)
app.use('/api/student/tickets',    authenticate, ticketsRoute)
app.use('/api/student/lessons',    authenticate, lessonsRoute)
app.use('/api/student/progress',   authenticate, progressRoute)
app.use('/api/student/profile',        authenticate, profileRoute)
app.use('/api/student/notifications',  authenticate, notificationsRoute)
app.use('/api/student/community',      authenticate, communityRoute)

// ─── Admin (authenticated + admin role) ──────────────────────────────────────
app.use('/api/admin/dashboard',      authenticate, requireAdmin, adminDashboard)
app.use('/api/admin/cohorts',        authenticate, requireAdmin, adminCohorts)
app.use('/api/admin/students',       authenticate, requireAdmin, adminStudents)
app.use('/api/admin/tickets',        authenticate, requireAdmin, adminTickets)
app.use('/api/admin/lessons',        authenticate, requireAdmin, adminLessons)
app.use('/api/admin/announcements',  authenticate, requireAdmin, adminAnnouncements)
app.use('/api/admin/payments',       authenticate, requireAdmin, adminPayments)
app.use('/api/admin/applications',   authenticate, requireAdmin, adminApplications)
app.use('/api/admin/analytics',      authenticate, requireAdmin, adminAnalytics)

// ─── Health check ─────────────────────────────────────────────────────────────
const prisma = require('./lib/prisma')

app.get('/api/health', async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected', timestamp: new Date() })
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', error: err.message })
  }
})

if (process.env.SENTRY_DSN) Sentry.setupExpressErrorHandler(app)

app.use((_, res) => res.status(404).json({ error: 'Route not found' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`DevForge API running on http://localhost:${PORT}`)
  const missing = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'].filter(k => !process.env[k])
  if (missing.length) console.error(`[STARTUP] Missing env vars: ${missing.join(', ')}`)
  try {
    await prisma.$connect()
    console.log('[STARTUP] Database connected')
  } catch (err) {
    console.error('[STARTUP] Database connection failed:', err.message)
  }
})
