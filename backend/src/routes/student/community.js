const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/student/community
// Returns all students in the same cohort (or all active students if no cohort)
router.get('/', async (req, res) => {
  try {
    const me = await prisma.student.findUnique({
      where: { userId: req.user.userId },
      select: { cohortId: true },
    })

    const students = await prisma.student.findMany({
      where: {
        cohortId: me?.cohortId ?? undefined,
        ...(me?.cohortId == null && { status: 'ACTIVE' }),
      },
      include: {
        user: { select: { name: true } },
        prSubmissions: { select: { status: true, score: true } },
      },
      orderBy: { currentWeek: 'desc' },
    })

    const result = students.map(s => {
      const approved = s.prSubmissions.filter(p => p.status === 'APPROVED')
      const scores = approved.map(p => p.score).filter(Boolean)
      const avgGrade = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0

      return {
        id: s.id,
        name: s.user.name,
        currentWeek: s.currentWeek,
        mergedPRs: approved.length,
        avgGrade,
        status: s.status,
      }
    })

    res.json(result)
  } catch (err) {
    console.error('[community]', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
