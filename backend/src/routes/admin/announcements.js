const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/announcements?cohortId=1
router.get('/', async (req, res) => {
  const { cohortId } = req.query
  try {
    const announcements = await prisma.announcement.findMany({
      where: cohortId ? { cohortId: parseInt(cohortId) } : {},
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      include: { cohort: { select: { name: true } } }
    })
    res.json(announcements)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/admin/announcements
router.post('/', [
  body('title').trim().notEmpty(),
  body('body').trim().notEmpty(),
  body('type').isIn(['SPRINT', 'SESSION', 'GENERAL', 'UPDATE']),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { title, body: msgBody, type, audience, pinned, cohortId } = req.body
  try {
    const announcement = await prisma.announcement.create({
      data: { title, body: msgBody, type, audience: audience ?? 'All', pinned: pinned ?? false, cohortId }
    })
    res.status(201).json(announcement)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/admin/announcements/:id
router.put('/:id', async (req, res) => {
  const { title, body: msgBody, type, audience, pinned } = req.body
  try {
    const announcement = await prisma.announcement.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(title && { title }),
        ...(msgBody && { body: msgBody }),
        ...(type && { type }),
        ...(audience && { audience }),
        ...(pinned !== undefined && { pinned }),
      }
    })
    res.json(announcement)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/admin/announcements/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.announcement.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
