const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/cohorts
router.get('/', async (req, res) => {
  try {
    const cohorts = await prisma.cohort.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: { select: { students: true, tickets: true, lessons: true } }
      }
    })
    res.json(cohorts)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/cohorts/:id
router.get('/:id', async (req, res) => {
  try {
    const cohort = await prisma.cohort.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        students: { include: { user: { select: { name: true, email: true } } } },
        tickets: true,
        lessons: true,
      }
    })
    if (!cohort) return res.status(404).json({ error: 'Not found' })
    res.json(cohort)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/admin/cohorts
router.post('/', [
  body('name').trim().notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('maxStudents').optional().isInt({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { name, startDate, endDate, maxStudents = 15 } = req.body
  try {
    const cohort = await prisma.cohort.create({
      data: { name, startDate: new Date(startDate), endDate: new Date(endDate), maxStudents }
    })
    res.status(201).json(cohort)
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Cohort name already exists' })
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/admin/cohorts/:id
router.put('/:id', async (req, res) => {
  const { name, startDate, endDate, maxStudents, status } = req.body
  try {
    const cohort = await prisma.cohort.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(name && { name }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(maxStudents && { maxStudents }),
        ...(status && { status }),
      }
    })
    res.json(cohort)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/admin/cohorts/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.cohort.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
