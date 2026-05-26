const express = require('express')
const prisma = require('../lib/prisma')

const router = express.Router()

// POST /api/apply  — public, no auth
router.post('/', async (req, res) => {
  const { name, email, phone, college, plan } = req.body
  if (!name || !email || !phone || !college) {
    return res.status(400).json({ error: 'name, email, phone, and college are required.' })
  }
  try {
    const application = await prisma.application.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), college: college.trim(), plan: plan || 'Pro' }
    })
    res.status(201).json({ success: true, id: application.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
