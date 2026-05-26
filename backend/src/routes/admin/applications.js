const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/applications
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const total = applications.length
    const paid  = applications.filter(a => a.paid).length
    res.json({ applications, total, paid, unpaid: total - paid })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
