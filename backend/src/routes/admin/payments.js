const express = require('express')
const prisma = require('../../lib/prisma')

const router = express.Router()

// GET /api/admin/payments?status=PAID&search=ravi
router.get('/', async (req, res) => {
  const { status, search } = req.query
  try {
    const payments = await prisma.payment.findMany({
      where: {
        ...(status && status !== 'All' && { status }),
        ...(search && {
          OR: [
            { txnId: { contains: search, mode: 'insensitive' } },
            { student: { user: { name: { contains: search, mode: 'insensitive' } } } }
          ]
        })
      },
      orderBy: { createdAt: 'desc' },
      include: {
        student: { include: { user: { select: { name: true, email: true } } } }
      }
    })

    const summary = await prisma.payment.aggregate({
      where: { status: { in: ['PAID', 'PARTIAL'] } },
      _sum: { amount: true },
      _count: true,
    })

    const byStatus = await prisma.payment.groupBy({
      by: ['status'],
      _count: true,
    })

    res.json({ payments, summary: { totalRevenue: summary._sum.amount ?? 0 }, byStatus })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/admin/payments/:id  — update status
router.put('/:id', async (req, res) => {
  const { status } = req.body
  try {
    const payment = await prisma.payment.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    })
    res.json(payment)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
