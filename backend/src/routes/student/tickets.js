const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../../lib/prisma')
const { runAIReview } = require('../../services/aiReview')
const { prSubmittedEmail, prReviewedEmail } = require('../../services/emailService')
const { notify } = require('../../services/notificationService')

const router = express.Router()

async function withRetry(fn, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try { return await fn() }
    catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, 3000))
    }
  }
}

// GET /api/student/tickets
router.get('/', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.userId } })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const tickets = await prisma.ticket.findMany({
      where: { cohortId: student.cohortId },
      orderBy: [{ week: 'asc' }, { priority: 'desc' }],
      include: {
        submissions: {
          where: { studentId: student.id },
          select: {
            id: true, prUrl: true, score: true, status: true,
            submittedAt: true, feedback: true, reviewedAt: true,
            aiReview: true, aiReviewedAt: true, verdict: true,
          }
        }
      }
    })

    const result = tickets.map(t => ({
      ...t,
      mySubmission: t.submissions[0] ?? null,
      submissions: undefined,
    }))

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/student/tickets/:id/submit
router.post('/:id/submit', [
  body('prUrl').isURL().withMessage('Valid PR URL required'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const ticketId = parseInt(req.params.id)
  const { prUrl } = req.body

  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.userId },
      include: { user: { select: { name: true, email: true } } },
    })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    if (ticket.cohortId !== student.cohortId) {
      return res.status(403).json({ error: 'Ticket not in your cohort' })
    }

    // Save submission + reset any previous AI review
    const submission = await prisma.pRSubmission.upsert({
      where: { studentId_ticketId: { studentId: student.id, ticketId } },
      update: { prUrl, status: 'IN_REVIEW', verdict: null, aiReview: null, aiReviewedAt: null, reviewError: null },
      create: { studentId: student.id, ticketId, prUrl, status: 'IN_REVIEW' },
    })

    // Move ticket to IN_REVIEW
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'IN_REVIEW' },
    })

    // Respond immediately — don't make student wait for AI
    res.json({ ...submission, message: 'Submitted. AI review starting…' })

    // Non-blocking: notify student of submission
    prSubmittedEmail({
      name: student.user.name,
      email: student.user.email,
      ticketCode: ticket.ticketCode,
      title: ticket.title,
      prUrl,
    })

    // ── Background: run AI review (retries 2x on failure) ─────────────────
    withRetry(() => runAIReview(ticket, submission))
      .then(async (review) => {
        if (!review) return

        const prStatus    = review.verdict === 'MERGE_READY'  ? 'APPROVED'
                          : review.verdict === 'NEEDS_CHANGES' ? 'NEEDS_CHANGES'
                          : 'REJECTED'

        const ticketStatus = review.verdict === 'MERGE_READY'  ? 'REVIEWED'
                           : review.verdict === 'MAJOR_REWORK' ? 'ACTIVE'
                           : 'IN_REVIEW'

        await Promise.all([
          prisma.pRSubmission.update({
            where: { id: submission.id },
            data: {
              aiReview:     JSON.stringify(review),
              aiReviewedAt: new Date(),
              verdict:      review.verdict,
              status:       prStatus,
            },
          }),
          prisma.ticket.update({
            where: { id: ticketId },
            data: { status: ticketStatus },
          }),
        ])

        console.log(`[aiReview] ${ticket.ticketCode} — ${review.verdict}`)

        const verdictLabel = review.verdict === 'MERGE_READY' ? '✅ Merge Ready'
                           : review.verdict === 'NEEDS_CHANGES' ? '🔄 Needs Changes'
                           : '❌ Major Rework'
        notify(student.id, {
          type: 'PR_REVIEWED',
          title: `${ticket.ticketCode} reviewed — ${verdictLabel}`,
          body: review.summary || '',
          link: '/tasks',
        })

        // Non-blocking: notify student of review result
        prReviewedEmail({
          name:       student.user.name,
          email:      student.user.email,
          ticketCode: ticket.ticketCode,
          title:      ticket.title,
          verdict:    review.verdict,
          summary:    review.summary,
          prUrl,
        })
      })
      .catch(async (err) => {
        console.error('[aiReview] failed after retries:', err.message)
        await prisma.pRSubmission.update({
          where: { id: submission.id },
          data: { reviewError: err.message },
        }).catch(() => {})
      })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/student/tickets/:id/stuck
router.post('/:id/stuck', async (req, res) => {
  const ticketId = parseInt(req.params.id)
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.userId },
      include: { user: { select: { name: true } } },
    })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })

    await notify(student.id, {
      type: 'HELP_REQUESTED',
      title: `Help requested on ${ticket.ticketCode}`,
      body: `You raised a hand on "${ticket.title}". A mentor will reach out soon on Discord.`,
      link: '/tasks',
    })

    if (process.env.DISCORD_WEBHOOK_URL) {
      const body = JSON.stringify({
        content: `🆘 **${student.user.name}** is stuck on **${ticket.ticketCode} — ${ticket.title}**\nWeek ${ticket.week} · Please check in with them!`,
      })
      fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
      }).catch(e => console.error('[stuck webhook]', e.message))
    }

    res.json({ ok: true, message: 'Mentor notified. Check Discord for help soon.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
