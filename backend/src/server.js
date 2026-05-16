require('dotenv').config()
const express = require('express')
const cors = require('cors')

const { authenticate, requireAdmin } = require('./middleware/auth')

const authRoutes         = require('./routes/auth')
const dashboardRoute     = require('./routes/student/dashboard')
const ticketsRoute       = require('./routes/student/tickets')
const lessonsRoute       = require('./routes/student/lessons')
const progressRoute      = require('./routes/student/progress')
const profileRoute       = require('./routes/student/profile')
const adminDashboard     = require('./routes/admin/dashboard')
const adminCohorts       = require('./routes/admin/cohorts')
const adminStudents      = require('./routes/admin/students')
const adminTickets       = require('./routes/admin/tickets')
const adminLessons       = require('./routes/admin/lessons')
const adminAnnouncements = require('./routes/admin/announcements')
const adminPayments      = require('./routes/admin/payments')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

// ─── Public ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ─── Student (authenticated) ──────────────────────────────────────────────────
app.use('/api/student/dashboard',  authenticate, dashboardRoute)
app.use('/api/student/tickets',    authenticate, ticketsRoute)
app.use('/api/student/lessons',    authenticate, lessonsRoute)
app.use('/api/student/progress',   authenticate, progressRoute)
app.use('/api/student/profile',    authenticate, profileRoute)

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

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`DevForge API running on http://localhost:${PORT}`))
