const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/tickets?cohortId=1&week=4&status=ACTIVE
router.get('/', async (req, res) => {
  const { cohortId, week, status } = req.query
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        ...(cohortId && { cohortId: parseInt(cohortId) }),
        ...(week && { week: parseInt(week) }),
        ...(status && { status }),
      },
      orderBy: [{ week: 'asc' }, { priority: 'desc' }],
      include: {
        _count: { select: { submissions: true } },
        submissions: { select: { score: true, status: true } }
      }
    })

    const result = tickets.map(t => {
      const scores = t.submissions.filter(s => s.score !== null).map(s => s.score)
      return {
        ...t,
        submissionCount: t._count.submissions,
        avgScore: scores.length ? Math.round(scores.reduce((a,b) => a+b,0) / scores.length) : null,
        submissions: undefined,
        _count: undefined,
      }
    })

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/admin/tickets
router.post('/', [
  body('ticketCode').trim().notEmpty(),
  body('title').trim().notEmpty(),
  body('week').isInt({ min: 1, max: 12 }),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH']),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { ticketCode, title, description, week, priority, storyPoints, cohortId } = req.body
  try {
    const ticket = await prisma.ticket.create({
      data: { ticketCode, title, description, week, priority, storyPoints, cohortId }
    })
    res.status(201).json(ticket)
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Ticket code already exists' })
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/admin/tickets/:id
router.put('/:id', async (req, res) => {
  const { title, description, week, priority, status, storyPoints } = req.body
  try {
    const ticket = await prisma.ticket.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(week && { week }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(storyPoints && { storyPoints }),
      }
    })
    res.json(ticket)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/admin/tickets/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.ticket.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/tickets/:id/submissions  — all student submissions for a ticket
router.get('/:id/submissions', async (req, res) => {
  try {
    const submissions = await prisma.pRSubmission.findMany({
      where: { ticketId: parseInt(req.params.id) },
      include: {
        student: { include: { user: { select: { name: true, email: true } } } }
      },
      orderBy: { submittedAt: 'desc' }
    })
    res.json(submissions)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/admin/submissions/:id/reset  — unlock a student's submission attempts
router.post('/submissions/:id/reset', async (req, res) => {
  try {
    const submission = await prisma.pRSubmission.update({
      where: { id: parseInt(req.params.id) },
      data: { submissionCount: 0, status: 'IN_REVIEW', verdict: null, aiReview: null, aiReviewedAt: null, reviewError: null },
    })
    res.json({ ok: true, submission })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Submission not found' })
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
