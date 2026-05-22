const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/student/notifications
router.get('/', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.userId } })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const notifications = await prisma.notification.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/student/notifications/read  — mark all unread as read
router.post('/read', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.userId } })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    await prisma.notification.updateMany({
      where: { studentId: student.id, read: false },
      data: { read: true },
    })
    res.json({ message: 'Marked as read' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
