const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const prisma = require('../lib/prisma')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' })
}

function signRefresh(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' })
}

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('college').optional().trim(),
  body('plan').optional().isIn(['SELF_PACED', 'LIVE_COHORT', 'MENTORED']),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { name, email, password, college, location, githubUrl, plan = 'LIVE_COHORT' } = req.body

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name, email, password: hashed,
        student: {
          create: { college, location, githubUrl, plan }
        }
      },
      include: { student: true }
    })

    const payload = { userId: user.id, role: user.role }
    const accessToken = signAccess(payload)
    const refreshToken = signRefresh(payload)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
    res.status(201).json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: { include: { cohort: true } } }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const payload = { userId: user.id, role: user.role }
    const accessToken = signAccess(payload)
    const refreshToken = signRefresh(payload)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
    res.json({
      accessToken,
      user: {
        id: user.id, name: user.name, email: user.email, role: user.role,
        student: user.student
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' })

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored || stored.expiresAt < new Date()) {
      res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
      return res.status(401).json({ error: 'Refresh token invalid or expired' })
    }

    const newAccess = signAccess({ userId: payload.userId, role: payload.role })
    res.json({ accessToken: newAccess })
  } catch {
    res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } }).catch(() => {})
  }
  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
  res.json({ message: 'Logged out' })
})

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { student: { include: { cohort: true } } }
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    const { password, ...safe } = user
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
