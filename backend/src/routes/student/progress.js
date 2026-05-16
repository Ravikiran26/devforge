const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/student/progress
router.get('/', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.userId },
      include: {
        prSubmissions: {
          include: { ticket: { select: { week: true, title: true, ticketCode: true } } },
          orderBy: { submittedAt: 'desc' }
        },
        lessonProgress: {
          include: { lesson: { select: { week: true, title: true } } }
        }
      }
    })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    // Per-week stats
    const weekMap = {}
    for (let w = 1; w <= 8; w++) {
      weekMap[w] = { week: w, submissions: 0, avgScore: null, scores: [] }
    }

    for (const pr of student.prSubmissions) {
      const w = pr.ticket.week
      if (!weekMap[w]) continue
      weekMap[w].submissions++
      if (pr.score !== null) weekMap[w].scores.push(pr.score)
    }

    for (const w of Object.values(weekMap)) {
      if (w.scores.length) {
        w.avgScore = Math.round(w.scores.reduce((a, b) => a + b, 0) / w.scores.length)
      }
      delete w.scores
    }

    const allScores = student.prSubmissions.filter(p => p.score !== null).map(p => p.score)
    const overallGrade = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0

    res.json({
      currentWeek: student.currentWeek,
      status: student.status,
      overallGrade,
      totalPRs: student.prSubmissions.length,
      mergedPRs: student.prSubmissions.filter(p => p.status === 'APPROVED').length,
      lessonsWatched: student.lessonProgress.filter(l => l.watched).length,
      weeklyData: Object.values(weekMap),
      recentPRs: student.prSubmissions.slice(0, 10).map(pr => ({
        id: pr.id,
        ticketCode: pr.ticket.ticketCode,
        title: pr.ticket.title,
        prUrl: pr.prUrl,
        score: pr.score,
        status: pr.status,
        feedback: pr.feedback,
        submittedAt: pr.submittedAt,
      }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
