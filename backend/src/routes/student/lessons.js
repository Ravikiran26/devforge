const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/student/lessons  — lessons with student's watch progress
router.get('/', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.userId } })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const whereClause = { status: 'PUBLISHED' }
    if (student.cohortId) whereClause.cohortId = student.cohortId

    const lessons = await prisma.lesson.findMany({
      where: whereClause,
      orderBy: [{ week: 'asc' }, { id: 'asc' }],
      include: {
        progress: {
          where: { studentId: student.id },
          select: { watched: true, watchedAt: true }
        }
      }
    })

    const result = lessons.map(l => ({
      ...l,
      watched: l.progress[0]?.watched ?? false,
      watchedAt: l.progress[0]?.watchedAt ?? null,
      progress: undefined,
    }))

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/student/lessons/:id/watch  — mark lesson as watched
router.post('/:id/watch', async (req, res) => {
  const lessonId = parseInt(req.params.id)

  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.userId } })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const progress = await prisma.lessonProgress.upsert({
      where: { studentId_lessonId: { studentId: student.id, lessonId } },
      update: { watched: true, watchedAt: new Date() },
      create: { studentId: student.id, lessonId, watched: true, watchedAt: new Date() }
    })

    res.json(progress)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
