require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const { authenticate, requireAdmin } = require('./middleware/auth')

const authRoutes         = require('./routes/auth')
const applyRoute         = require('./routes/apply')
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

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
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

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.use((_, res) => res.status(404).json({ error: 'Route not found' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`DevForge API running on http://localhost:${PORT}`))
