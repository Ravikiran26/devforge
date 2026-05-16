const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/lessons?cohortId=1&week=3
router.get('/', async (req, res) => {
  const { cohortId, week } = req.query
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        ...(cohortId && { cohortId: parseInt(cohortId) }),
        ...(week && { week: parseInt(week) }),
      },
      orderBy: [{ week: 'asc' }, { id: 'asc' }],
      include: {
        _count: { select: { progress: { where: { watched: true } } } }
      }
    })
    res.json(lessons.map(l => ({ ...l, views: l._count.progress, _count: undefined })))
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/admin/lessons
router.post('/', [
  body('lessonCode').trim().notEmpty(),
  body('title').trim().notEmpty(),
  body('week').isInt({ min: 1, max: 8 }),
  body('duration').trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { lessonCode, title, week, duration, description, videoUrl, cohortId } = req.body
  try {
    const lesson = await prisma.lesson.create({
      data: { lessonCode, title, week, duration, description, videoUrl, cohortId }
    })
    res.status(201).json(lesson)
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Lesson code already exists' })
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/admin/lessons/:id
router.put('/:id', async (req, res) => {
  const { title, week, duration, description, videoUrl, status } = req.body
  try {
    const lesson = await prisma.lesson.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(title && { title }),
        ...(week && { week }),
        ...(duration && { duration }),
        ...(description !== undefined && { description }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(status && { status }),
      }
    })
    res.json(lesson)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/admin/lessons/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.lesson.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
