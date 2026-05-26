const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/analytics/criteria
// Aggregate which AI checklist criteria fail most often
router.get('/criteria', async (req, res) => {
  try {
    const submissions = await prisma.pRSubmission.findMany({
      where: { aiReview: { not: null } },
      select: { aiReview: true, ticket: { select: { ticketCode: true } } },
    })

    const counts = {}

    for (const sub of submissions) {
      try {
        const review = JSON.parse(sub.aiReview)
        for (const c of (review.criteria_results || [])) {
          if (!counts[c.criterion]) counts[c.criterion] = { pass: 0, fail: 0 }
          if (c.pass) counts[c.criterion].pass++
          else counts[c.criterion].fail++
        }
      } catch {}
    }

    const criteria = Object.entries(counts).map(([criterion, { pass, fail }]) => ({
      criterion,
      pass,
      fail,
      total: pass + fail,
      failRate: Math.round((fail / (pass + fail)) * 100),
    })).sort((a, b) => b.failRate - a.failRate)

    res.json({ criteria, totalReviewed: submissions.length })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/analytics/at-risk
// Students inactive for 7+ days
router.get('/at-risk', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { name: true, email: true } },
        prSubmissions: { orderBy: { submittedAt: 'desc' }, take: 1, select: { submittedAt: true } },
        lessonProgress: {
          where: { watchedAt: { not: null } },
          orderBy: { watchedAt: 'desc' },
          take: 1,
          select: { watchedAt: true },
        },
      },
    })

    const now = Date.now()
    const atRisk = students.map(s => {
      const lastPR = s.prSubmissions[0]?.submittedAt
      const lastLesson = s.lessonProgress[0]?.watchedAt
      const lastActivity = [lastPR, lastLesson].filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0]
      const daysInactive = lastActivity
        ? Math.floor((now - new Date(lastActivity)) / 86400000)
        : 999
      return { id: s.id, name: s.user.name, email: s.user.email, currentWeek: s.currentWeek, daysInactive }
    }).filter(s => s.daysInactive >= 7).sort((a, b) => b.daysInactive - a.daysInactive)

    // Auto-update status for students inactive 14+ days
    const longInactive = atRisk.filter(s => s.daysInactive >= 14).map(s => s.id)
    if (longInactive.length) {
      await prisma.student.updateMany({
        where: { id: { in: longInactive } },
        data: { status: 'AT_RISK' },
      })
    }

    res.json({ atRisk })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
