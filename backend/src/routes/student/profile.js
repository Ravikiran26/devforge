const express = require('express')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/student/profile
router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        student: {
          include: {
            cohort: true,
            prSubmissions: {
              include: { ticket: { select: { ticketCode: true, title: true, week: true } } },
              orderBy: { submittedAt: 'desc' },
              take: 10
            }
          }
        }
      }
    })
    if (!user) return res.status(404).json({ error: 'Not found' })
    const { password, ...safe } = user
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/student/profile
router.put('/', [
  body('name').optional().trim().notEmpty(),
  body('college').optional().trim(),
  body('location').optional().trim(),
  body('githubUrl').optional().trim(),
  body('bio').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { name, college, location, githubUrl, bio } = req.body

  try {
    const [user, student] = await Promise.all([
      name ? prisma.user.update({ where: { id: req.user.userId }, data: { name } }) : null,
      prisma.student.update({
        where: { userId: req.user.userId },
        data: { college, location, githubUrl, bio },
      })
    ])

    res.json({ message: 'Profile updated', student })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/student/profile/password
router.put('/password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { currentPassword, newPassword } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) return res.status(400).json({ error: 'Current password incorrect' })

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

    res.json({ message: 'Password updated' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
