const nodemailer = require('nodemailer')

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return transporter
}

async function send({ to, subject, html }) {
  const t = getTransporter()
  if (!t) { console.warn('[email] SMTP not configured — skipping:', subject); return }
  try {
    await t.sendMail({ from: process.env.SMTP_FROM || 'DevForge <noreply@devforge.in>', to, subject, html })
  } catch (err) {
    console.error('[email] send failed:', err.message)
  }
}

function prSubmittedEmail({ name, email, ticketCode, title, prUrl }) {
  return send({
    to: email,
    subject: `PR Submitted — ${ticketCode}`,
    html: `<div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:24px;color:#374151">
      <h2 style="color:#4f46e5;margin:0 0 16px">PR Submitted ✅</h2>
      <p style="margin:0 0 12px">Hey ${name},</p>
      <p style="margin:0 0 16px">Your PR for <strong>${ticketCode} — ${title}</strong> has been received and the AI review is queued.</p>
      <a href="${prUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;margin-bottom:20px">View PR on GitHub →</a>
      <p style="color:#6b7280;font-size:13px">You'll get another email when the AI review completes. Human grade from your mentor arrives within 24 hours.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
      <p style="color:#9ca3af;font-size:12px">DevForge Platform</p>
    </div>`,
  })
}

function prReviewedEmail({ name, email, ticketCode, title, verdict, summary, prUrl }) {
  const verdictMap = {
    MERGE_READY:   { color: '#059669', label: '✅ Merge Ready' },
    NEEDS_CHANGES: { color: '#2563eb', label: '🔄 Needs Changes' },
    MAJOR_REWORK:  { color: '#dc2626', label: '❌ Major Rework' },
  }
  const v = verdictMap[verdict] || { color: '#6b7280', label: verdict }

  return send({
    to: email,
    subject: `AI Review Done — ${ticketCode}: ${v.label}`,
    html: `<div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:24px;color:#374151">
      <h2 style="color:${v.color};margin:0 0 16px">AI Review Complete</h2>
      <p style="margin:0 0 12px">Hey ${name},</p>
      <p style="margin:0 0 12px">Your PR for <strong>${ticketCode} — ${title}</strong> has been reviewed.</p>
      <div style="background:#f9fafb;border-left:4px solid ${v.color};padding:14px 16px;border-radius:4px;margin:16px 0">
        <div style="font-weight:700;color:${v.color};margin-bottom:8px">${v.label}</div>
        <div style="font-size:14px;line-height:1.6">${summary || ''}</div>
      </div>
      <a href="${prUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;margin-bottom:20px">View Full Review on GitHub →</a>
      <p style="color:#6b7280;font-size:13px">Human grade from your mentor will arrive within 24 hours.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
      <p style="color:#9ca3af;font-size:12px">DevForge Platform</p>
    </div>`,
  })
}

module.exports = { prSubmittedEmail, prReviewedEmail }
