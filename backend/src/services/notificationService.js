const prisma = require('../lib/prisma')

async function notify(studentId, { type, title, body, link }) {
  try {
    await prisma.notification.create({
      data: { studentId, type, title, body, link: link ?? null }
    })
  } catch (err) {
    console.error('[notify] failed:', err.message)
  }
}

module.exports = { notify }
