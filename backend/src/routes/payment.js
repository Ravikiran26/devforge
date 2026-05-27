const express = require('express')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const prisma = require('../lib/prisma')

const router = express.Router()

const PLANS = {
  LIVE_COHORT: { label: 'Core',                          amount: 700000  }, // ₹7,000
  MENTORED:    { label: 'Career (Resume + Mock Interview)', amount: 1200000 }, // ₹12,000
}

function getRazorpay() {
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

// POST /api/payment/order
// Body: { name, email, phone, college, plan }
router.post('/order', async (req, res) => {
  const { name, email, phone, college, plan } = req.body
  if (!name || !email || !phone || !plan) return res.status(400).json({ error: 'Missing required fields' })

  const planConfig = PLANS[plan]
  if (!planConfig) return res.status(400).json({ error: 'Invalid plan' })

  try {
    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount:   planConfig.amount,
      currency: 'INR',
      notes:    { name, email, phone, college: college || '', plan },
    })

    await prisma.application.upsert({
      where: { email },
      update: { name, phone, college: college || '', plan, razorpayOrderId: order.id },
      create: { name, email, phone, college: college || '', plan, razorpayOrderId: order.id },
    })

    res.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
      name, email, phone,
      planLabel: planConfig.label,
    })
  } catch (err) {
    console.error('[payment/order]', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// POST /api/payment/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return res.status(400).json({ error: 'Missing payment fields' })

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature)
    return res.status(400).json({ error: 'Invalid signature' })

  try {
    await prisma.application.update({
      where: { razorpayOrderId: razorpay_order_id },
      data:  { paid: true, razorpayPaymentId: razorpay_payment_id },
    })
    res.json({ success: true })
  } catch (err) {
    console.error('[payment/verify]', err)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
})

module.exports = router
