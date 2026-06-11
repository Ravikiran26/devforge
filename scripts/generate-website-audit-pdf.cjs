const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const htmlPath = path.resolve(__dirname, '../DevForge_Website_Audit.html')
const pdfPath  = path.resolve(__dirname, '../DevForge_Website_Audit.pdf')

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>DevForge — Website Audit & Launch Readiness Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  :root {
    --amber:   #F59E0B;
    --amber-d: #D97706;
    --bg:      #0A0A0A;
    --bg2:     #111111;
    --bg3:     #1A1A1A;
    --border:  #2A2A2A;
    --text:    #E5E5E5;
    --muted:   #888888;
    --green:   #22C55E;
    --red:     #EF4444;
    --blue:    #3B82F6;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    font-size: 11pt;
    line-height: 1.65;
  }

  /* ── COVER PAGE ── */
  .cover {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 80px 72px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    page-break-after: always;
  }
  .cover-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10pt;
    color: var(--amber);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 28px;
    border: 1px solid var(--amber);
    display: inline-block;
    padding: 4px 12px;
    border-radius: 3px;
  }
  .cover h1 {
    font-size: 38pt;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 18px;
  }
  .cover h1 span { color: var(--amber); }
  .cover .sub {
    font-size: 13pt;
    color: var(--muted);
    max-width: 540px;
    line-height: 1.6;
    margin-bottom: 48px;
  }
  .cover-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    color: var(--muted);
    line-height: 2;
  }
  .cover-meta strong { color: var(--text); }
  .cover-divider {
    width: 60px;
    height: 3px;
    background: var(--amber);
    margin-bottom: 32px;
  }

  /* ── TOC ── */
  .toc-page {
    padding: 64px 72px;
    page-break-after: always;
  }
  .toc-page h2 {
    font-size: 10pt;
    font-family: 'JetBrains Mono', monospace;
    color: var(--amber);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .toc-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid var(--border);
    padding: 12px 0;
    font-size: 11pt;
  }
  .toc-item .num {
    font-family: 'JetBrains Mono', monospace;
    color: var(--amber);
    font-size: 9pt;
    margin-right: 16px;
    min-width: 28px;
  }
  .toc-item .title { flex: 1; }
  .toc-item .dots { color: var(--border); flex: 1; margin: 0 8px; overflow: hidden; }

  /* ── CONTENT ── */
  .page {
    padding: 56px 72px;
    page-break-before: always;
  }
  .page:first-of-type { page-break-before: avoid; }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    color: var(--amber);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  h2.section-title {
    font-size: 22pt;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 28px;
    color: #fff;
  }
  h2.section-title span { color: var(--amber); }

  h3 {
    font-size: 13pt;
    font-weight: 700;
    color: #fff;
    margin: 28px 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border);
  }

  h4 {
    font-size: 11pt;
    font-weight: 600;
    color: var(--amber);
    margin: 20px 0 8px;
  }

  p { margin-bottom: 12px; color: var(--text); }

  a { color: var(--amber); text-decoration: none; }

  /* ── TABLE ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 10pt;
  }
  th {
    background: var(--bg3);
    color: var(--amber);
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid var(--amber);
  }
  td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    vertical-align: top;
  }
  tr:last-child td { border-bottom: none; }

  /* ── CALLOUT ── */
  .callout {
    background: var(--bg3);
    border-left: 3px solid var(--amber);
    padding: 14px 18px;
    margin: 16px 0;
    border-radius: 0 4px 4px 0;
    font-size: 10.5pt;
  }
  .callout.red   { border-color: var(--red); }
  .callout.green { border-color: var(--green); }
  .callout.blue  { border-color: var(--blue); }

  /* ── CODE BLOCK ── */
  pre {
    background: #0D1117;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 16px 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    line-height: 1.7;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    margin: 16px 0;
    color: #C9D1D9;
  }
  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    background: #1A1A1A;
    padding: 2px 6px;
    border-radius: 3px;
    color: var(--amber);
  }
  pre code { background: none; padding: 0; color: inherit; }

  /* ── CHECKLIST ── */
  .checklist { list-style: none; margin: 12px 0; }
  .checklist li {
    padding: 7px 0;
    border-bottom: 1px solid var(--border);
    font-size: 10.5pt;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .checklist li:last-child { border-bottom: none; }
  .checklist li::before {
    content: '☐';
    color: var(--amber);
    font-size: 12pt;
    line-height: 1.2;
    flex-shrink: 0;
  }
  .checklist.done li::before { content: '✓'; color: var(--green); }

  /* ── TAG / BADGE ── */
  .badge {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 3px;
    margin-right: 6px;
  }
  .badge-red    { background: rgba(239,68,68,0.15);  color: var(--red);   border: 1px solid rgba(239,68,68,0.3); }
  .badge-green  { background: rgba(34,197,94,0.15);  color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .badge-amber  { background: rgba(245,158,11,0.15); color: var(--amber); border: 1px solid rgba(245,158,11,0.3); }
  .badge-blue   { background: rgba(59,130,246,0.15); color: var(--blue);  border: 1px solid rgba(59,130,246,0.3); }

  /* ── TWO-COL ── */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 16px 0;
  }
  .card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 18px 20px;
  }
  .card h4 { margin-top: 0; }

  /* ── PRIORITY ROW ── */
  .priority-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 10.5pt;
  }
  .priority-row:last-child { border-bottom: none; }
  .pnum {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    color: var(--muted);
    min-width: 24px;
  }
  .ptime {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    color: var(--amber);
    min-width: 60px;
    text-align: right;
  }

  /* ── UL / OL ── */
  ul, ol { margin: 10px 0 10px 20px; }
  li { margin-bottom: 6px; line-height: 1.6; }

  /* ── QUOTE ── */
  blockquote {
    border-left: 3px solid var(--amber);
    margin: 16px 0;
    padding: 10px 18px;
    font-style: italic;
    color: var(--muted);
    background: var(--bg3);
  }

  /* ── SECTION DIVIDER ── */
  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 32px 0;
  }

  /* ── FOOTER ── */
  @page { margin: 0; }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: var(--bg);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 72px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    color: var(--muted);
  }
  .page-footer span { color: var(--amber); }

  /* ── COPY BLOCK (quoted copy) ── */
  .copy-block {
    background: #0D1117;
    border: 1px solid var(--border);
    border-left: 3px solid var(--blue);
    border-radius: 0 6px 6px 0;
    padding: 14px 18px;
    margin: 14px 0;
    font-size: 10.5pt;
    color: #C9D1D9;
  }
  .copy-block .label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    color: var(--blue);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  /* print helpers */
  .no-break { page-break-inside: avoid; }
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════ COVER -->
<div class="cover">
  <div class="cover-badge">Confidential · Internal Report</div>
  <h1>DevForge<br/><span>Website Audit</span><br/>& Launch Report</h1>
  <div class="cover-divider"></div>
  <p class="sub">A complete audit of the DevForge landing page — covering positioning, copy, CTAs, conversion flow, college-demo readiness, and a prioritised launch checklist.</p>
  <div class="cover-meta">
    <strong>Prepared for</strong> Ravikiran (DevForge Founder)<br/>
    <strong>Date</strong> June 11, 2026<br/>
    <strong>Sections</strong> 13<br/>
    <strong>Status</strong> Pre-launch review
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ TOC -->
<div class="toc-page">
  <h2>Table of Contents</h2>
  <div class="toc-item"><span class="num">01</span><span class="title">Content Audit — Summary</span></div>
  <div class="toc-item"><span class="num">02</span><span class="title">Revised Homepage Structure</span></div>
  <div class="toc-item"><span class="num">03</span><span class="title">Section-by-Section Copy Revisions</span></div>
  <div class="toc-item"><span class="num">04</span><span class="title">Course / Program Positioning</span></div>
  <div class="toc-item"><span class="num">05</span><span class="title">Pricing & Package Presentation</span></div>
  <div class="toc-item"><span class="num">06</span><span class="title">Demo Booking CTA</span></div>
  <div class="toc-item"><span class="num">07</span><span class="title">WhatsApp Enquiry CTA</span></div>
  <div class="toc-item"><span class="num">08</span><span class="title">FAQ Section — Expansion</span></div>
  <div class="toc-item"><span class="num">09</span><span class="title">College Demo Pitch Section</span></div>
  <div class="toc-item"><span class="num">10</span><span class="title">Mobile Responsiveness Feedback</span></div>
  <div class="toc-item"><span class="num">11</span><span class="title">Lead Capture Form Review</span></div>
  <div class="toc-item"><span class="num">12</span><span class="title">Final Launch Checklist</span></div>
  <div class="toc-item"><span class="num">13</span><span class="title">Demo Pitch Deck / Script</span></div>
</div>

<!-- ═══════════════════════════════════════════════════ 01 -->
<div class="page">
  <div class="section-label">Section 01</div>
  <h2 class="section-title">Content Audit — <span>Summary</span></h2>

  <h3>What's Working</h3>
  <div class="callout green">
    <strong>"The process is the product"</strong> — exceptional positioning line. Keep it front and centre.
  </div>
  <div class="callout green">
    <strong>"This is not a course. It is a work environment."</strong> — honest and differentiated. Leave it exactly as-is.
  </div>
  <ul>
    <li>Concrete projects (Ordering/Payments, SaaS Billing, AI app) — not generic "build a todo app" filler</li>
    <li>GitHub-centric proof (65+ PRs, live URLs) directly addresses what actual hirers look for</li>
    <li>Transparent pricing with honest urgency — no fake crossed-out prices</li>
    <li>Strong "Tutorials teach you to watch. This program teaches you to build." differentiation line</li>
    <li>All 3 project stacks are named and real, which builds credibility for developers</li>
  </ul>

  <h3>Critical Issues to Fix Before Launch</h3>
  <table>
    <thead><tr><th>#</th><th>Issue</th><th>Impact</th><th>Effort</th></tr></thead>
    <tbody>
      <tr>
        <td><span class="badge badge-red">1</span></td>
        <td><strong>Branding split</strong> — "DevForge" in header, "SprintForge" in footer. Two different support emails (devforge.in vs sprintforge.in).</td>
        <td>Kills trust immediately. Visitors think the site is unfinished or scammy.</td>
        <td>30 min</td>
      </tr>
      <tr>
        <td><span class="badge badge-red">2</span></td>
        <td><strong>Batch 1 date is June 1</strong> — today is June 11, 2026. The batch has already passed.</td>
        <td>Looks abandoned. Urgency becomes confusion.</td>
        <td>15 min</td>
      </tr>
      <tr>
        <td><span class="badge badge-red">3</span></td>
        <td><strong>No WhatsApp CTA</strong> anywhere on the page.</td>
        <td>Indian audience expects and uses WhatsApp. Missing this leaks leads.</td>
        <td>1 hour</td>
      </tr>
      <tr>
        <td><span class="badge badge-amber">4</span></td>
        <td><strong>No college-facing section.</strong> All copy is student-directed. TPOs landing on the page have no anchor.</td>
        <td>Blocks the B2B college outreach path entirely.</td>
        <td>2 hours</td>
      </tr>
      <tr>
        <td><span class="badge badge-amber">5</span></td>
        <td><strong>"15 SEATS" hardcoded</strong> — if the batch date has passed, this urgency looks stale or false.</td>
        <td>Destroys credibility for any visitor arriving after June 1.</td>
        <td>15 min</td>
      </tr>
      <tr>
        <td><span class="badge badge-amber">6</span></td>
        <td><strong>Project cards have no live links.</strong> "3 deployed products" is the central claim but there's nothing to click.</td>
        <td>Biggest claim on the page has zero proof attached.</td>
        <td>30 min</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- ═══════════════════════════════════════════════════ 02 -->
<div class="page">
  <div class="section-label">Section 02</div>
  <h2 class="section-title">Revised Homepage <span>Structure</span></h2>

  <p>The current section order is mostly sound. Two changes are recommended:</p>
  <ul>
    <li><strong>Stats moves above the Dashboard Mockup</strong> — a visitor needs a reason to care before seeing the product UI</li>
    <li><strong>College/TPO section added</strong> before FAQ — it needs to be discoverable without being in the navbar</li>
  </ul>

  <table>
    <thead><tr><th>#</th><th>Section</th><th>Change</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Navbar</td><td>Add WhatsApp icon link</td></tr>
      <tr><td>2</td><td>Hero</td><td>Update date, urgency copy, trust badge text</td></tr>
      <tr><td>3</td><td><strong>Stats (moved up)</strong></td><td>Social proof before product preview</td></tr>
      <tr><td>4</td><td>Dashboard Mockup</td><td>No change</td></tr>
      <tr><td>5</td><td>Tools Marquee</td><td>No change</td></tr>
      <tr><td>6</td><td>Projects</td><td>Add "See live →" placeholder links</td></tr>
      <tr><td>7</td><td>How It Works</td><td>Fix Step 4 copy (see Section 03)</td></tr>
      <tr><td>8</td><td>Who Is This For</td><td>Fix "NOT A FIT (YET)" label</td></tr>
      <tr><td>9</td><td>Curriculum</td><td>No change</td></tr>
      <tr><td>10</td><td>Outcomes</td><td>No change</td></tr>
      <tr><td>11</td><td>Pricing</td><td>Rename plans, add anchoring, add "what you don't get"</td></tr>
      <tr><td>12</td><td><strong>College / TPO Section (new)</strong></td><td>See Section 09</td></tr>
      <tr><td>13</td><td>FAQ</td><td>Expand from 8 to 12 questions</td></tr>
      <tr><td>14</td><td>Final CTA</td><td>Minor copy update</td></tr>
      <tr><td>15</td><td>Footer</td><td>Fix branding + add WhatsApp</td></tr>
    </tbody>
  </table>
</div>

<!-- ═══════════════════════════════════════════════════ 03 -->
<div class="page">
  <div class="section-label">Section 03</div>
  <h2 class="section-title">Section-by-Section <span>Copy Revisions</span></h2>

  <h3>Hero Section</h3>
  <div class="two-col no-break">
    <div class="card">
      <h4>Current Subheadline</h4>
      <p style="color:#888; font-style:italic;">"Merge 65+ real pull requests, ship 3 production-grade apps, and build a GitHub profile that holds up in a technical interview."</p>
    </div>
    <div class="card">
      <h4>Revised Subheadline</h4>
      <p>"65+ merged pull requests. 3 deployed apps. A GitHub profile that gets you past the first screening call."</p>
    </div>
  </div>

  <h4>Trust Badges</h4>
  <table>
    <thead><tr><th>Current</th><th>Revised</th><th>Why</th></tr></thead>
    <tbody>
      <tr><td>"No CS degree"</td><td>"ECE / Mech / Any branch welcome"</td><td>More specific and resonant for Indian audience</td></tr>
      <tr><td>"12-week program"</td><td>Keep as-is</td><td>—</td></tr>
      <tr><td>"GitHub workflow"</td><td>"Real PRs, real feedback"</td><td>Action-oriented, clarifies what GitHub workflow means</td></tr>
    </tbody>
  </table>

  <h4>Urgency Pill (fix the date)</h4>
  <div class="copy-block">
    <div class="label">Revised urgency pill</div>
    BATCH 2 · JULY 6 · 12 SEATS · EARLY PRICE ENDS JUNE 25
  </div>

  <h3>How It Works — Step 4</h3>
  <div class="callout red">
    <strong>Current:</strong> "Ship &amp; get placed" — misleading if you don't guarantee placement. Indian students have been burned by placement guarantee scams. This wording implies a guarantee you haven't made.
  </div>
  <div class="copy-block">
    <div class="label">Revised Step 4</div>
    <strong>Ship &amp; interview</strong><br/>
    "Leave with 3 deployed products, 65+ merged PRs, and a structured approach to job applications. No guarantee — but real proof."
  </div>

  <h3>Who Is This For — "Not a Fit" Section</h3>
  <div class="callout red">
    <strong>Current label:</strong> "NOT A FIT (YET)" — the "(YET)" reads passive-aggressive and confuses the message.
  </div>
  <div class="copy-block">
    <div class="label">Revised label + copy</div>
    <strong>This isn't the right fit if:</strong><br/>
    • You haven't written any JavaScript yet <em>(try freeCodeCamp first, then come back)</em><br/>
    • You're looking for live classes or recorded lectures
  </div>
  <p>The redirect to freeCodeCamp is a trust signal — you're helping visitors, not just rejecting them. It shows confidence in your own positioning.</p>

  <h3>Final CTA Section</h3>
  <p>Current headline "Your GitHub should speak for itself." is strong — keep it. Update the button copy:</p>
  <table>
    <thead><tr><th>Current button</th><th>Revised button</th></tr></thead>
    <tbody>
      <tr><td>APPLY FOR BATCH 1 →</td><td>APPLY FOR BATCH 2 →</td></tr>
    </tbody>
  </table>

  <h3>One Master One-Liner</h3>
  <div class="callout">
    Use this consistently across all CTAs, social bios, and the demo deck:<br/><br/>
    <strong>"Build like a developer. Get hired like one."</strong>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ 04 -->
<div class="page">
  <div class="section-label">Section 04</div>
  <h2 class="section-title">Course / Program <span>Positioning</span></h2>

  <h3>Current vs. Recommended Positioning</h3>
  <div class="two-col no-break">
    <div class="card">
      <h4>Current</h4>
      <p style="color:#888; font-style:italic;">"Practical bootcamp for job-ready developers"</p>
      <p style="color:var(--red); font-size:9.5pt;">Generic. Competes with 50 other Indian bootcamps on the same terms.</p>
    </div>
    <div class="card">
      <h4>Recommended</h4>
      <p>"The only Indian program where your portfolio is built entirely through pull requests — the same workflow real companies use to hire."</p>
      <p style="color:var(--green); font-size:9.5pt;">Specific, ownable, and directly maps to recruiter behaviour.</p>
    </div>
  </div>

  <h3>Why the PR-first Positioning Wins</h3>
  <ul>
    <li>It doesn't compete with YouTube, Udemy, or NPTEL — none of them have a PR workflow</li>
    <li>It explains the GitHub-centric proof without requiring an explanation</li>
    <li>It maps directly to what IT companies filter for in fresher technical screens</li>
    <li>It's defensible: even if a competitor copies the projects, the PR workflow takes months to operationalise</li>
  </ul>

  <h3>The Competitive Map</h3>
  <table>
    <thead><tr><th>Competitor type</th><th>Their positioning</th><th>DevForge gap</th></tr></thead>
    <tbody>
      <tr><td>YouTube channels</td><td>"Learn for free"</td><td>No accountability, no output</td></tr>
      <tr><td>Udemy / recorded courses</td><td>"Self-paced learning"</td><td>No feedback, no portfolio</td></tr>
      <tr><td>Indian bootcamps (Scaler, Newton)</td><td>"Placement guarantee"</td><td>DevForge is more honest; avoids guarantee trap</td></tr>
      <tr><td>College placement cells</td><td>"Company tie-ups"</td><td>No real code produced; students can't explain their work</td></tr>
    </tbody>
  </table>

  <h3>Positioning Statement for College Demos</h3>
  <blockquote>"Companies have raised the bar. A resume without proof of GitHub activity gets filtered before a human reads it. DevForge is the only program in India where students build their portfolio entirely through pull requests — the same process real dev teams use every day."</blockquote>
</div>

<!-- ═══════════════════════════════════════════════════ 05 -->
<div class="page">
  <div class="section-label">Section 05</div>
  <h2 class="section-title">Pricing &amp; Package <span>Presentation</span></h2>

  <h3>Plan Rename Recommendation</h3>
  <table>
    <thead><tr><th>Current Name</th><th>Recommended Name</th><th>Why</th></tr></thead>
    <tbody>
      <tr><td>Core</td><td><strong>Builder</strong></td><td>Action-oriented, communicates what you're doing</td></tr>
      <tr><td>Career</td><td><strong>Builder + Placement Prep</strong></td><td>Explicit about the added value; removes ambiguity</td></tr>
    </tbody>
  </table>

  <h3>Price Anchoring — Make Batch 2 Prices More Visible</h3>
  <p>Currently the Batch 2 price is shown in small text. Move it directly under the price, styled as a strikethrough preview:</p>
  <div class="two-col no-break">
    <div class="card">
      <h4>Builder (Batch 1)</h4>
      <p style="font-size:22pt; font-weight:800; color:var(--amber);">₹7,000</p>
      <p style="color:var(--muted); font-size:9.5pt;">Batch 2 price: ₹12,000</p>
      <p style="color:var(--green); font-size:9.5pt;">You save ₹5,000 by joining now</p>
    </div>
    <div class="card">
      <h4>Builder + Placement Prep (Batch 1)</h4>
      <p style="font-size:22pt; font-weight:800; color:var(--amber);">₹12,000</p>
      <p style="color:var(--muted); font-size:9.5pt;">Batch 2 price: ₹18,000</p>
      <p style="color:var(--green); font-size:9.5pt;">You save ₹6,000 by joining now</p>
    </div>
  </div>

  <h3>Add a "What You Don't Get" Line</h3>
  <div class="callout">
    Adding this under the pricing cards builds trust — especially with students who've been burned by fake placement guarantees:<br/><br/>
    <strong>"No live classes. No certificate mill. No placement guarantee. Just 12 weeks of real work."</strong>
  </div>

  <h3>Group / College Discount Callout</h3>
  <p>Add this as a small callout below both plan cards:</p>
  <div class="copy-block">
    <div class="label">Group discount callout</div>
    Enrolling 5+ students from the same college? Ask about group rates. → WhatsApp us
  </div>

  <h3>Refund Policy Consistency</h3>
  <p>The refund policy is stated in the Pricing section as "7-day full refund if you haven't opened your first pull request." Make sure this exactly matches the Refund Policy legal page — any divergence creates a support risk.</p>
</div>

<!-- ═══════════════════════════════════════════════════ 06 -->
<div class="page">
  <div class="section-label">Section 06</div>
  <h2 class="section-title">Demo Booking <span>CTA</span></h2>

  <h3>Current State</h3>
  <div class="callout red">
    There is no dedicated "book a demo" CTA on the page. The only conversion action is the Apply modal. This means visitors who aren't ready to commit have no low-friction next step — they bounce.
  </div>

  <h3>Two-CTA Model (Primary + Secondary)</h3>
  <p>Add a secondary CTA alongside every primary "Apply" button:</p>
  <table>
    <thead><tr><th>Location</th><th>Primary CTA</th><th>Secondary CTA</th></tr></thead>
    <tbody>
      <tr><td>Navbar</td><td>Apply for Batch 2 →</td><td>WhatsApp us</td></tr>
      <tr><td>Hero</td><td>Apply for Batch 2 →</td><td>Talk to us on WhatsApp</td></tr>
      <tr><td>Pricing section</td><td>Enroll in Builder →</td><td>Not sure? WhatsApp us</td></tr>
      <tr><td>College/TPO section</td><td>Book a 30-min call →</td><td>WhatsApp the team</td></tr>
      <tr><td>Final CTA</td><td>Apply for Batch 2 →</td><td>(omit — keep final CTA clean)</td></tr>
    </tbody>
  </table>

  <h3>College Demo Booking</h3>
  <p>For the B2B path (TPOs, placement coordinators), use a Calendly link or a dedicated WhatsApp message:</p>
  <div class="copy-block">
    <div class="label">College demo CTA copy</div>
    Are you a college coordinator or TPO? → Book a free 30-min intro session
  </div>
  <p>Don't build a custom booking system. Use Calendly (free tier) or a WhatsApp pre-fill link. The friction of a custom form will kill conversions from this audience.</p>

  <h3>Post-Apply Confirmation Message</h3>
  <p>After a student submits the Apply modal, the confirmation copy matters. Current confirmation is unknown — make sure it says:</p>
  <div class="copy-block">
    <div class="label">Post-submit confirmation</div>
    You're in the queue. We'll WhatsApp you within 24 hours with next steps.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ 07 -->
<div class="page">
  <div class="section-label">Section 07</div>
  <h2 class="section-title">WhatsApp Enquiry <span>CTA</span></h2>

  <h3>Three Required Touchpoints</h3>

  <h4>1 — Floating Button (Bottom-Right, All Pages)</h4>
  <pre><code>&lt;a
  href="https://wa.me/91XXXXXXXXXX?text=Hi%2C+I+want+to+know+more+about+DevForge+Batch+2"
  style={{
    position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
    background: '#25D366', color: '#fff',
    padding: '12px 18px', borderRadius: 8,
    fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
    display: 'flex', alignItems: 'center', gap: 8,
    boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
    textDecoration: 'none'
  }}
&gt;
  💬 WhatsApp Us
&lt;/a&gt;</code></pre>

  <h4>2 — In Pricing Section (Below Plan Cards)</h4>
  <div class="copy-block">
    <div class="label">Copy</div>
    Not sure which plan is right for you? WhatsApp us and we'll help you decide in 5 minutes. → [WhatsApp]
  </div>

  <h4>3 — After the Last FAQ Item</h4>
  <div class="copy-block">
    <div class="label">Copy</div>
    Have a question not answered here? → Ask on WhatsApp
  </div>

  <h3>Pre-Fill Message Variations by Entry Point</h3>
  <table>
    <thead><tr><th>Entry point</th><th>Pre-filled WhatsApp message</th></tr></thead>
    <tbody>
      <tr><td>Hero button</td><td>"Hi, I want to join DevForge Batch 2"</td></tr>
      <tr><td>Pricing section</td><td>"Hi, can you help me choose between Builder and Builder + Placement?"</td></tr>
      <tr><td>College/TPO section</td><td>"Hi, I'm a college coordinator and want to discuss DevForge for our students"</td></tr>
      <tr><td>FAQ end</td><td>"Hi, I have a question about DevForge"</td></tr>
      <tr><td>Floating button</td><td>"Hi, I want to know more about DevForge Batch 2"</td></tr>
    </tbody>
  </table>

  <div class="callout">
    <strong>Important:</strong> The floating button must not overlap the "Apply" button on mobile. Test at 375px. Set <code>bottom: 80px</code> if the Apply CTA is sticky at the bottom on mobile.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ 08 -->
<div class="page">
  <div class="section-label">Section 08</div>
  <h2 class="section-title">FAQ Section — <span>Expansion</span></h2>

  <p>Current: 8 questions. Recommended: expand to 12. The existing 8 are solid — add these 4:</p>

  <h3>4 New FAQ Items</h3>

  <div class="callout blue no-break">
    <strong>Q9: How does the AI code review work?</strong><br/><br/>
    Every pull request you open is automatically reviewed by an AI trained on the project rubric. It checks for logic correctness, naming conventions, security issues, and code structure. You see the feedback inline within minutes. Your mentor then grades it within 24 hours.
  </div>

  <div class="callout blue no-break">
    <strong>Q10: Will I build alone or with other students?</strong><br/><br/>
    You build independently — there are no group projects. The Discord community is active, and other students often review each other's PRs informally. But your portfolio is 100% your own work.
  </div>

  <div class="callout blue no-break">
    <strong>Q11: Is this for freshers or experienced developers?</strong><br/><br/>
    Primarily for freshers (0–1 years). Experienced developers switching tracks also find it useful, particularly for getting GitHub-based proof of full-stack work. It moves fast — if you have 2+ years of experience, you may find Weeks 1–4 slow.
  </div>

  <div class="callout blue no-break">
    <strong>Q12: What is the program language — English or Hindi?</strong><br/><br/>
    All lesson content is in English. Mentor feedback is in English. WhatsApp and Discord conversations are mixed — use whichever you're comfortable with.
  </div>

  <h3>FAQ End Cap</h3>
  <p>After the last FAQ item, add a short line to capture the overflow:</p>
  <div class="copy-block">
    <div class="label">End cap</div>
    Still have questions? We usually respond within a few hours. → Ask on WhatsApp
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ 09 -->
<div class="page">
  <div class="section-label">Section 09</div>
  <h2 class="section-title">College Demo <span>Pitch Section</span></h2>

  <p>Add this as a full-width section above the FAQ. It should be discoverable on scroll but not in the navbar — TPOs who find the page will scroll; they don't need a nav item.</p>

  <h3>Proposed Section Copy (Ready to Implement)</h3>

  <div class="copy-block" style="font-size:11pt; line-height:1.8;">
    <div class="label">Section headline</div>
    <strong style="font-size:15pt;">Placing your students is harder than it was five years ago.</strong>
  </div>

  <div class="copy-block" style="font-size:10.5pt; line-height:1.8;">
    <div class="label">Body copy</div>
    Companies have raised the bar for freshers. Resumes without proof of work get filtered before a human reads them. DevForge prepares students the way companies actually hire — through pull requests, deployed projects, and a GitHub history that survives a technical screen.<br/><br/>
    <strong>What your students leave with:</strong><br/>
    • 3 deployed full-stack applications (live URLs, not local projects)<br/>
    • 65+ merged pull requests on public GitHub repositories<br/>
    • Hands-on experience with tools used in real dev teams: Node.js, React, PostgreSQL, CI/CD, AI APIs<br/><br/>
    <strong>What we offer for college partnerships:</strong><br/>
    • Group discount for 5+ enrollments from the same institution<br/>
    • Free demo session for your students (online, 45 min)<br/>
    • Certificate of completion on institutional letterhead (on request)<br/>
    • Dedicated WhatsApp group for batch coordinators
  </div>

  <div class="copy-block">
    <div class="label">CTAs</div>
    [Book a college demo call →] or [WhatsApp the team →]
  </div>

  <h3>Why This Section Doubles as Your B2B Pitch</h3>
  <ul>
    <li>If a TPO Googles "practical coding program for engineering students" and lands on your page, they need this section immediately</li>
    <li>The same bullet points above can go directly onto Slide 3 of your demo deck</li>
    <li>After Batch 1 completes, add 1–2 college logos or student outcome stats here</li>
  </ul>

  <h3>For the In-Person / Zoom College Demo</h3>
  <p>The one visual that wins every college demo:</p>
  <div class="callout">
    <strong>Side-by-side GitHub profile comparison:</strong><br/>
    Left: Typical CS fresher — 0 contributions, private repositories, 2 projects uploaded as ZIP files<br/>
    Right: DevForge graduate — 65+ contributions, 3 public repos, all PRs merged with review comments visible
  </div>
  <p>No recruiter needs this explained. The visual is self-closing.</p>
</div>

<!-- ═══════════════════════════════════════════════════ 10 -->
<div class="page">
  <div class="section-label">Section 10</div>
  <h2 class="section-title">Mobile Responsiveness <span>Feedback</span></h2>

  <h3>Likely Issues (Based on Code Patterns)</h3>
  <table>
    <thead><tr><th>Component</th><th>Risk</th><th>Fix</th></tr></thead>
    <tbody>
      <tr>
        <td>Dashboard Mockup</td>
        <td>Complex inline-styled component. Almost always breaks below 375px.</td>
        <td>Add <code>overflow: hidden</code> wrapper + scale transform at &lt;480px</td>
      </tr>
      <tr>
        <td>4-column Stats grid</td>
        <td>Flex row without wrap will overflow on mobile</td>
        <td>Add <code>flex-wrap: wrap</code>, 2×2 layout at &lt;640px</td>
      </tr>
      <tr>
        <td>Pricing cards (side-by-side)</td>
        <td>Will overlap or overflow on 375px if no column stacking</td>
        <td>Verify <code>flex-direction: column</code> is applied at &lt;640px</td>
      </tr>
      <tr>
        <td>Hero urgency pill</td>
        <td>"BATCH 1 · JUNE 1 · 15 SEATS · PRICE GOES UP AFTER THIS" is long</td>
        <td>Truncate or wrap to 2 lines on mobile</td>
      </tr>
      <tr>
        <td>WhatsApp floating button</td>
        <td>May overlap sticky Apply button if one is added later</td>
        <td>Test at 375px; use <code>bottom: 80px</code> if needed</td>
      </tr>
      <tr>
        <td>Tools Marquee</td>
        <td>Usually fine but check <code>overflow: hidden</code> on parent</td>
        <td>Low risk — verify only</td>
      </tr>
    </tbody>
  </table>

  <h3>Recommended Test Checklist</h3>
  <ul class="checklist">
    <li>iPhone SE — 375px — Hero section (urgency pill, trust badges)</li>
    <li>iPhone 14 — 390px — Pricing cards stack correctly</li>
    <li>iPad — 768px — Curriculum 3-column grid</li>
    <li>Android mid-range — 360px — Full scroll test</li>
    <li>Floating WhatsApp button — doesn't overlap Apply CTA</li>
    <li>Modal (ApplyModal) — scrollable, input fields accessible above keyboard</li>
  </ul>

  <div class="callout">
    <strong>Tip:</strong> Use Chrome DevTools device emulation for initial checks, then test on a real Android device. iOS simulator is not needed for this audience — most Indian users are on Android mid-range devices.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ 11 -->
<div class="page">
  <div class="section-label">Section 11</div>
  <h2 class="section-title">Lead Capture Form <span>Review</span></h2>

  <h3>Recommended Field Structure</h3>
  <table>
    <thead><tr><th>Field</th><th>Keep / Remove / Add</th><th>Reason</th></tr></thead>
    <tbody>
      <tr><td>Full Name</td><td><span class="badge badge-green">Keep</span></td><td>Required for personalisation</td></tr>
      <tr><td>Email</td><td><span class="badge badge-green">Keep</span></td><td>Primary contact channel</td></tr>
      <tr><td>Phone / WhatsApp</td><td><span class="badge badge-green">Keep</span></td><td>Essential for Indian market — WhatsApp follow-up</td></tr>
      <tr><td>Which plan?</td><td><span class="badge badge-green">Keep</span></td><td>Helps qualify leads before the follow-up call</td></tr>
      <tr><td>Current role / background</td><td><span class="badge badge-red">Remove (make optional)</span></td><td>Adds friction; collect post-enrollment</td></tr>
      <tr><td>"How did you hear about us"</td><td><span class="badge badge-amber">Optional</span></td><td>Useful for marketing attribution but reduce friction at signup</td></tr>
      <tr><td>Prerequisites checkbox</td><td><span class="badge badge-green">Add</span></td><td>"I've read the prerequisites" reduces refund requests</td></tr>
      <tr><td>WhatsApp opt-in</td><td><span class="badge badge-green">Add</span></td><td>"Receive batch updates on WhatsApp" — pre-checked</td></tr>
    </tbody>
  </table>

  <h3>Submit Button Copy</h3>
  <table>
    <thead><tr><th>Avoid</th><th>Use instead</th></tr></thead>
    <tbody>
      <tr><td>Submit</td><td rowspan="3"><strong style="color:var(--amber)">Reserve my seat →</strong></td></tr>
      <tr><td>Apply Now</td></tr>
      <tr><td>Register</td></tr>
    </tbody>
  </table>

  <h3>Post-Submit Confirmation</h3>
  <div class="copy-block">
    <div class="label">Success message copy</div>
    <strong>You're in the queue.</strong><br/>
    We'll WhatsApp you within 24 hours with next steps. If you don't hear from us, message us directly at [WhatsApp link].
  </div>

  <h3>Form UX Notes</h3>
  <ul>
    <li>Keep the modal scrollable on mobile — long forms with keyboard open often clip the submit button</li>
    <li>Show a loading state on the submit button after tap (prevents double submissions)</li>
    <li>Auto-focus the first field when the modal opens</li>
    <li>Validate phone number format client-side (Indian 10-digit) before submission</li>
  </ul>
</div>

<!-- ═══════════════════════════════════════════════════ 12 -->
<div class="page">
  <div class="section-label">Section 12</div>
  <h2 class="section-title">Final Launch <span>Checklist</span></h2>

  <h3>Priority 1 — Blockers (Fix Before Any Outreach)</h3>
  <ul class="checklist">
    <li>Unify branding to "DevForge" everywhere — remove all "SprintForge" references from footer, logo, and meta tags</li>
    <li>Pick one support email (devforge.in or sprintforge.in) and use it everywhere consistently</li>
    <li>Update Batch 1 → Batch 2. Set a real date (e.g. July 6) and update the seat count</li>
    <li>Update footer logo and name to match the chosen brand</li>
  </ul>

  <h3>Priority 2 — Conversion (Add Before College Demos)</h3>
  <ul class="checklist">
    <li>Add floating WhatsApp button (bottom-right, all pages)</li>
    <li>Add secondary WhatsApp CTA in Pricing section</li>
    <li>Add "Book a college demo" CTA in the new TPO section</li>
    <li>Add College / TPO section (Section 09 of this report)</li>
    <li>Update Apply modal submit button copy → "Reserve my seat →"</li>
    <li>Add post-submit WhatsApp confirmation message</li>
  </ul>

  <h3>Priority 3 — Copy Polish</h3>
  <ul class="checklist">
    <li>Rename plans: Core → Builder, Career → Builder + Placement Prep</li>
    <li>Add "What you don't get" line under pricing cards</li>
    <li>Add group discount callout in pricing</li>
    <li>Fix Step 4 "ship &amp; get placed" → honest version</li>
    <li>Fix "NOT A FIT (YET)" label → "This isn't the right fit if:"</li>
    <li>Expand FAQ from 8 to 12 questions (add Q9–Q12 from Section 08)</li>
    <li>Add "See live →" placeholder links on project cards</li>
  </ul>

  <h3>Priority 4 — Technical &amp; Trust</h3>
  <ul class="checklist">
    <li>Test mobile at 375px, 390px, and 768px</li>
    <li>Set page meta title: "DevForge — Build 3 Real Products in 12 Weeks"</li>
    <li>Set meta description (155 chars) for Google preview</li>
    <li>Add og:image (1200×630px) for WhatsApp / social link previews</li>
    <li>Verify Apply modal form works end-to-end (submission, confirmation message)</li>
    <li>Confirm refund policy on pricing page matches Refund Policy legal page exactly</li>
  </ul>

  <h3>Estimated Time Investment</h3>
  <table>
    <thead><tr><th>#</th><th>Task</th><th>Time</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Fix branding split (DevForge everywhere)</td><td>30 min</td></tr>
      <tr><td>2</td><td>Update batch date and seat count</td><td>15 min</td></tr>
      <tr><td>3</td><td>Add floating WhatsApp button</td><td>1 hour</td></tr>
      <tr><td>4</td><td>Add College / TPO section</td><td>2 hours</td></tr>
      <tr><td>5</td><td>Expand FAQ + copy tweaks</td><td>1 hour</td></tr>
      <tr><td>6</td><td>Pricing rename + callouts</td><td>1 hour</td></tr>
      <tr><td>7</td><td>Mobile test and fix</td><td>2 hours</td></tr>
      <tr><td colspan="2"><strong>Total</strong></td><td><strong>~8 hours (one focused day)</strong></td></tr>
    </tbody>
  </table>
</div>

<!-- ═══════════════════════════════════════════════════ 13 -->
<div class="page">
  <div class="section-label">Section 13</div>
  <h2 class="section-title">Demo Pitch Deck <span>/ Script</span></h2>

  <h3>Student Demo — Online, 20 Minutes</h3>
  <table>
    <thead><tr><th>Time</th><th>Topic</th><th>Notes</th></tr></thead>
    <tbody>
      <tr>
        <td>0:00–2:00</td>
        <td>The problem</td>
        <td>"You can't get a job without experience, but you can't get experience without a job." Let it land.</td>
      </tr>
      <tr>
        <td>2:00–5:00</td>
        <td>What DevForge is</td>
        <td>Show the live student portal — 30 seconds of screen share of the actual dashboard. Do not use slides here.</td>
      </tr>
      <tr>
        <td>5:00–10:00</td>
        <td>Walk through 1 project</td>
        <td>Use Restaurant Flow (RF). Show the Jira ticket → branch → PR → AI review → mentor grade flow live. This is the money moment.</td>
      </tr>
      <tr>
        <td>10:00–13:00</td>
        <td>Pricing &amp; batch details</td>
        <td>Be direct. "₹7,000 for Builder, ₹12,000 for Builder + Placement Prep. Batch 2 starts July 6. 12 seats."</td>
      </tr>
      <tr>
        <td>13:00–20:00</td>
        <td>Q&amp;A</td>
        <td>Let it run. Questions here are buying signals. Have the WhatsApp number ready to share.</td>
      </tr>
    </tbody>
  </table>

  <h3>College / TPO Demo — 45 Minutes (In-person or Zoom)</h3>
  <table>
    <thead><tr><th>Time</th><th>Topic</th><th>Notes</th></tr></thead>
    <tbody>
      <tr>
        <td>0:00–5:00</td>
        <td>The placement problem</td>
        <td>Open with a recruiter stat if you have one: "X% of IT companies now check GitHub before calling a candidate." If not, use the GitHub activity visual.</td>
      </tr>
      <tr>
        <td>5:00–15:00</td>
        <td>What companies actually filter for</td>
        <td>GitHub activity &gt; resume. Project depth &gt; project count. Use the side-by-side GitHub profile visual here. No explanation needed.</td>
      </tr>
      <tr>
        <td>15:00–25:00</td>
        <td>DevForge walkthrough</td>
        <td>Portal demo, live PR review demo, project outcomes. Show one complete ticket-to-merged-PR flow.</td>
      </tr>
      <tr>
        <td>25:00–35:00</td>
        <td>Student outcomes</td>
        <td>Use Batch 1 data when available. Before that: show the program structure, the 3 deployed projects, and the 65+ PR count as the outcome proxy.</td>
      </tr>
      <tr>
        <td>35:00–40:00</td>
        <td>Partnership offer</td>
        <td>Group discount for 5+, free demo session for students, certificate option. Have a one-page PDF leave-behind ready.</td>
      </tr>
      <tr>
        <td>40:00–45:00</td>
        <td>Q&amp;A + next steps</td>
        <td>Close with a clear ask: "Can I schedule a 20-min session for your final-year students?" Don't leave without a date.</td>
      </tr>
    </tbody>
  </table>

  <h3>The One Visual That Wins Every College Demo</h3>
  <div class="callout">
    <strong>Side-by-side GitHub profile comparison:</strong><br/><br/>
    <strong>Left — Typical CS fresher:</strong> 0 contributions in the last year. 2 repositories (both private). README says "Todo App using HTML CSS JS".<br/><br/>
    <strong>Right — DevForge graduate:</strong> 65+ contributions. 3 public repositories. All PRs visible with inline review comments. Deployment links in the repo description.<br/><br/>
    No recruiter needs this explained. The visual closes itself.
  </div>

  <h3>Recommended Deck Structure (8 slides)</h3>
  <table>
    <thead><tr><th>#</th><th>Slide title</th><th>Content</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Cover</td><td>DevForge · "Build like a developer. Get hired like one."</td></tr>
      <tr><td>2</td><td>The Problem</td><td>GitHub activity gap between CS freshers and what IT companies filter for</td></tr>
      <tr><td>3</td><td>The Solution</td><td>12 weeks, 3 real products, 65+ merged PRs — the PR-first portfolio</td></tr>
      <tr><td>4</td><td>The 3 Projects</td><td>Ordering/Payments, SaaS Billing, AI App — with tech stacks</td></tr>
      <tr><td>5</td><td>The Workflow</td><td>Jira ticket → branch → PR → AI review → mentor grade (1 slide, visual)</td></tr>
      <tr><td>6</td><td>Student Outcomes</td><td>What a graduate's GitHub looks like vs. a non-graduate</td></tr>
      <tr><td>7</td><td>Partnership Offer</td><td>Group pricing, free student demo, certificate option</td></tr>
      <tr><td>8</td><td>Next Steps</td><td>QR code to WhatsApp + Calendly link for booking</td></tr>
    </tbody>
  </table>

  <div class="callout green" style="margin-top: 32px;">
    <strong>Final note:</strong> The best demo is the live portal. When you screen-share the actual DevForge student dashboard — real tickets, real AI review feedback, real PR history — no slide deck can compete with that. Build the deck for the async follow-up, not for the live demo.
  </div>
</div>

<!-- FOOTER -->
<div class="page-footer">
  <span>DevForge</span>
  <span style="color: var(--muted);">Website Audit & Launch Readiness Report · June 2026 · Confidential</span>
  <span style="color: var(--muted);">13 Sections</span>
</div>

</body>
</html>`

fs.writeFileSync(htmlPath, html, 'utf8')
console.log('HTML written:', htmlPath)

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const cmd = [
  `"${chrome}"`,
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  `--print-to-pdf="${pdfPath}"`,
  '--print-to-pdf-no-header',
  '--no-pdf-header-footer',
  `"${htmlPath}"`
].join(' ')

console.log('Generating PDF...')
execSync(cmd, { stdio: 'inherit' })
console.log('PDF written:', pdfPath)
