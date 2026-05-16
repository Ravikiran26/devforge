const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/students?status=ACTIVE&cohortId=1&search=ravi
router.get('/', async (req, res) => {
  const { status, cohortId, search } = req.query
  try {
    const students = await prisma.student.findMany({
      where: {
        ...(status && { status }),
        ...(cohortId && { cohortId: parseInt(cohortId) }),
        ...(search && {
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        })
      },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
        cohort: { select: { name: true } },
        _count: { select: { prSubmissions: true } }
      },
      orderBy: { user: { name: 'asc' } }
    })
    res.json(students)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/students/:id
router.get('/:id', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
        cohort: true,
        prSubmissions: {
          include: { ticket: { select: { ticketCode: true, title: true, week: true } } },
          orderBy: { submittedAt: 'desc' }
        },
        lessonProgress: { include: { lesson: { select: { title: true, week: true } } } }
      }
    })
    if (!student) return res.status(404).json({ error: 'Not found' })
    res.json(student)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/admin/students/:id  — update status, cohort, week
router.put('/:id', async (req, res) => {
  const { status, cohortId, currentWeek } = req.body
  try {
    const student = await prisma.student.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(status && { status }),
        ...(cohortId !== undefined && { cohortId }),
        ...(currentWeek && { currentWeek }),
      }
    })
    res.json(student)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/admin/students/:id/review  — score a PR submission
router.post('/submissions/:submissionId/review', async (req, res) => {
  const { score, feedback, status } = req.body
  try {
    const submission = await prisma.pRSubmission.update({
      where: { id: parseInt(req.params.submissionId) },
      data: {
        score,
        feedback,
        status: status ?? 'APPROVED',
        reviewedAt: new Date()
      }
    })
    res.json(submission)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
