const Anthropic = require('@anthropic-ai/sdk')
const { Octokit } = require('@octokit/rest')

let anthropic, octokit

function getClients() {
  if (!anthropic) anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  if (!octokit)   octokit   = new Octokit({ auth: process.env.GITHUB_TOKEN })
}

// ─── Project detection ────────────────────────────────────────────────────────

function detectProject(ticketCode = '') {
  if (ticketCode.startsWith('P2')) return 'classpro'
  if (ticketCode.startsWith('P3')) return 'deliverdesk'
  return 'invoicewala'
}

// ─── Fetch PR diff from GitHub ────────────────────────────────────────────────

async function fetchPRDiff(prUrl) {
  const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  if (!match) throw new Error('Invalid GitHub PR URL')
  const [, owner, repo, num] = match
  const pull_number = parseInt(num)

  const [{ data: pr }, { data: files }] = await Promise.all([
    octokit.pulls.get({ owner, repo, pull_number }),
    octokit.pulls.listFiles({ owner, repo, pull_number }),
  ])

  let diffText = ''
  for (const file of files) {
    diffText += `File: ${file.filename}\n${file.patch || 'Binary file'}\n\n`
    if (diffText.length > 12000) { diffText += '\n[diff truncated — too large]'; break }
  }

  return { pr, diffText, owner, repo, pull_number }
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior full-stack developer and technical mentor reviewing a student Pull Request for a coding bootcamp.
The student is learning. Give specific, actionable feedback that helps them grow.

Rules:
- Mention at least 2 things done WELL with specific line/file references
- Mention 2-3 specific improvements with exact file/function names
- Check every acceptance criterion one by one
- Flag security issues immediately (hardcoded secrets, missing validation, wrong auth patterns)
- Be encouraging but honest — harsh tone kills motivation, but sugarcoating wastes their time
- NEVER say "good job" without being specific about exactly what is good

Output: return ONLY valid JSON, no markdown, no extra text outside the JSON object.`

const PROJECT_CHECKS = {
  invoicewala: `- JWT: access token in memory or httpOnly cookie, NOT localStorage
- Passwords hashed with bcrypt (cost factor >= 10) — never stored plain text
- .env used for all secrets — no hardcoded DB URLs, JWT secrets, or API keys
- express-validator validation runs BEFORE any database query
- Prisma used for all DB queries — no raw SQL strings
- GST calculated server-side only — client never sends tax amount
- API returns consistent shape: { success: true/false, data: {...} }
- All money amounts stored as integers (paise) — no floating point math
- React calls API through src/lib/api.js axios instance — not raw fetch inside components`,

  classpro: `- Razorpay: HMAC-SHA256 signature verified server-side using razorpay_order_id + "|" + razorpay_payment_id
- Fee DB record created ONLY after successful payment verification — never before
- roleGuard middleware used on all role-restricted routes — not just auth middleware
- Parents can only access their own child's data — enforced server-side, not just hidden in UI
- Razorpay keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) loaded from .env — never hardcoded
- Passwords hashed with bcrypt — never stored plain
- JWT payload contains role field used by roleGuard middleware
- Attendance duplication prevented — same batch+date combination blocked`,

  deliverdesk: `- MongoDB schema has proper validation — required fields, enum values, and field types defined
- Cloudinary keys (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) from .env — never hardcoded
- Files stored in Cloudinary — NEVER as base64 strings in MongoDB documents or on local disk
- File version number auto-incremented — old versions never overwritten
- Socket.io: JWT verified in socket handshake (auth.token) — unauthenticated connections rejected
- Activity log written to DB BEFORE socket event emitted — durability first
- Magic link tokens are cryptographically random (UUID or 32-byte hex) — not sequential IDs
- Client JWT scope limited to single projectId — cross-project access returns 403`,
}

function buildUserPrompt(ticket, diffText, projectType) {
  const projectName = { invoicewala: 'InvoiceWala (GST Invoice Manager)', classpro: 'ClassPro (Coaching Center Management)', deliverdesk: 'DeliverDesk (Agency Client Portal)' }[projectType]
  return `Review this student Pull Request for the ${projectName} project.

## Ticket: ${ticket.ticketCode} — ${ticket.title}

## Acceptance criteria / description:
${ticket.description || 'No description provided for this ticket.'}

## PR diff:
${diffText}

## Project-specific checks:
${PROJECT_CHECKS[projectType]}

## Return this exact JSON structure:
{
  "criteria_results": [
    { "criterion": "string", "pass": true, "note": "string" }
  ],
  "done_well": ["specific point with file/line reference", "specific point 2"],
  "improve": ["specific improvement 1", "specific improvement 2"],
  "security_issues": [],
  "verdict": "MERGE_READY",
  "summary": "2-3 sentence overall summary written directly to the student"
}

verdict must be exactly one of: MERGE_READY | NEEDS_CHANGES | MAJOR_REWORK`
}

// ─── Claude API call ──────────────────────────────────────────────────────────

async function reviewWithClaude(ticket, diffText) {
  const projectType = detectProject(ticket.ticketCode)
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(ticket, diffText, projectType) }],
  })
  return JSON.parse(response.content[0].text)
}

// ─── Format GitHub comment ────────────────────────────────────────────────────

function formatReviewComment(ticket, review) {
  const verdictBadge = {
    MERGE_READY:   '✅ MERGE READY',
    NEEDS_CHANGES: '🔄 NEEDS CHANGES',
    MAJOR_REWORK:  '❌ MAJOR REWORK',
  }[review.verdict] || review.verdict

  const criteria = (review.criteria_results || [])
    .map(c => `${c.pass ? '✅' : '❌'} **${c.criterion}**${c.note ? ` — ${c.note}` : ''}`)
    .join('\n')

  const doneWell = (review.done_well || []).map((d, i) => `${i + 1}. ${d}`).join('\n')
  const improve  = (review.improve || []).map((d, i) => `${i + 1}. ${d}`).join('\n')
  const security = (review.security_issues || []).map(s => `⚠️ ${s}`).join('\n')

  return `## 🤖 AI Code Review — ${ticket.ticketCode}

### ${verdictBadge}

---

### Acceptance Criteria
${criteria || '_No criteria listed for this ticket._'}

---

### What You Did Well
${doneWell || '_No specific points._'}

---

### What to Improve
${improve || '_No improvements needed._'}
${security ? `\n---\n\n### ⚠️ Security Issues\n${security}\n` : ''}
---

> ${review.summary}

---
*🤖 AI Review by Claude · Human review + grade coming within 24 hours*`
}

// ─── Post GitHub comment ──────────────────────────────────────────────────────

async function postGitHubComment(prUrl, ticket, review) {
  const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  if (!match) return
  const [, owner, repo, num] = match
  await octokit.issues.createComment({
    owner, repo,
    issue_number: parseInt(num),
    body: formatReviewComment(ticket, review),
  })
}

// ─── Auto-merge PR ────────────────────────────────────────────────────────────

async function mergePR(owner, repo, pull_number) {
  await octokit.pulls.merge({
    owner, repo, pull_number,
    merge_method: 'squash',
    commit_title: `${pull_number}: auto-merged — AI review passed ✅`,
  })
}

// ─── Main entry point ─────────────────────────────────────────────────────────

async function runAIReview(ticket, submission) {
  if (!process.env.ANTHROPIC_API_KEY || !process.env.GITHUB_TOKEN) {
    console.warn('[aiReview] ANTHROPIC_API_KEY or GITHUB_TOKEN not set — skipping')
    return null
  }

  getClients()

  const { diffText, owner, repo, pull_number } = await fetchPRDiff(submission.prUrl)
  const review = await reviewWithClaude(ticket, diffText)

  await postGitHubComment(submission.prUrl, ticket, review)

  if (review.verdict === 'MERGE_READY') {
    await mergePR(owner, repo, pull_number)
  }

  return review
}

module.exports = { runAIReview }
