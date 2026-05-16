const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/dashboard
router.get('/', async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      atRiskStudents,
      completedStudents,
      pendingReviews,
      totalRevenue,
      recentSubmissions,
      activeCohort,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { status: 'ACTIVE' } }),
      prisma.student.count({ where: { status: 'AT_RISK' } }),
      prisma.student.count({ where: { status: 'COMPLETED' } }),
      prisma.pRSubmission.count({ where: { status: 'IN_REVIEW' } }),
      prisma.payment.aggregate({
        where: { status: { in: ['PAID', 'PARTIAL'] } },
        _sum: { amount: true }
      }),
      prisma.pRSubmission.findMany({
        orderBy: { submittedAt: 'desc' },
        take: 5,
        include: {
          student: { include: { user: { select: { name: true } } } },
          ticket: { select: { ticketCode: true, title: true } }
        }
      }),
      prisma.cohort.findFirst({ where: { status: 'ACTIVE' } }),
    ])

    res.json({
      stats: {
        totalStudents,
        activeStudents,
        atRiskStudents,
        completedStudents,
        pendingReviews,
        totalRevenue: totalRevenue._sum.amount ?? 0,
      },
      activeCohort,
      recentSubmissions: recentSubmissions.map(s => ({
        id: s.id,
        studentName: s.student.user.name,
        ticketCode: s.ticket.ticketCode,
        ticketTitle: s.ticket.title,
        prUrl: s.prUrl,
        status: s.status,
        submittedAt: s.submittedAt,
      }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
