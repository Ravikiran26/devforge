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
    const email_clean = email.trim().toLowerCase()
    const application = await prisma.application.upsert({
      where: { email: email_clean },
      update: { name: name.trim(), phone: phone.trim(), college: college.trim(), plan: plan || 'LIVE_COHORT' },
      create: { name: name.trim(), email: email_clean, phone: phone.trim(), college: college.trim(), plan: plan || 'LIVE_COHORT' },
    })
    res.status(201).json({ success: true, id: application.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
