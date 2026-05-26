const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/student/dashboard
router.get('/', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.userId },
      include: {
        cohort: true,
        prSubmissions: { include: { ticket: true } },
        lessonProgress: true,
      }
    })

    if (!student) return res.status(404).json({ error: 'Student profile not found' })

    const mergedPRs = student.prSubmissions.filter(p => p.status === 'APPROVED').length
    const totalPRs = student.prSubmissions.length
    const scores = student.prSubmissions.filter(p => p.score !== null).map(p => p.score)
    const avgGrade = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    const lessonsWatched = student.lessonProgress.filter(l => l.watched).length

    const activeSubmissions = await prisma.pRSubmission.findMany({
      where: {
        studentId: student.id,
        status: { in: ['PENDING', 'IN_REVIEW'] }
      },
      include: { ticket: true },
      take: 3,
      orderBy: { createdAt: 'desc' }
    })
    const activeTickets = activeSubmissions.map(s => ({
      ...s.ticket,
      submissionStatus: s.status,
      prUrl: s.prUrl,
    }))

    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { cohortId: student.cohortId },
          { audience: 'All' }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    })

    res.json({
      student: {
        id: student.id,
        currentWeek: student.currentWeek,
        status: student.status,
        plan: student.plan,
        cohort: student.cohort?.name ?? null,
        onboardingCompleted: student.onboardingCompleted,
      },
      stats: {
        mergedPRs,
        totalPRs,
        avgGrade,
        lessonsWatched,
        currentWeek: student.currentWeek,
      },
      activeTickets,
      announcements,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
