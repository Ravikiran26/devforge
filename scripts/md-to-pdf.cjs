const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const mdPath = path.resolve(__dirname, '../DevForge_12Week_Curriculum.md')
const htmlPath = path.resolve(__dirname, '../DevForge_12Week_Curriculum.html')
const pdfPath = path.resolve(__dirname, '../DevForge_12Week_Curriculum.pdf')

let md = fs.readFileSync(mdPath, 'utf8')

function escape(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function inlineFormat(s) {
  s = s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  return s
}

function processTable(block) {
  const rows = block.trim().split('\n').filter(r => !/^\|[-| :]+\|$/.test(r.trim()))
  if (rows.length < 2) return `<p>${block}</p>`
  const toCell = (row, tag) =>
    '<tr>' + row.trim().replace(/^\||\|$/g,'').split('|')
      .map(c => `<${tag}>${inlineFormat(c.trim())}</${tag}>`).join('') + '</tr>'
  return `<table><thead>${toCell(rows[0],'th')}</thead><tbody>${rows.slice(1).map(r=>toCell(r,'td')).join('')}</tbody></table>`
}

const lines = md.split('\n')
const html = []
let i = 0

while (i < lines.length) {
  const line = lines[i]

  // Fenced code block
  if (line.startsWith('```')) {
    const lang = line.slice(3).trim()
    const code = []
    i++
    while (i < lines.length && !lines[i].startsWith('```')) {
      code.push(escape(lines[i]))
      i++
    }
    html.push(`<pre><code class="language-${lang}">${code.join('\n')}</code></pre>`)
    i++
    continue
  }

  // Table
  if (line.startsWith('|')) {
    const tableLines = []
    while (i < lines.length && lines[i].startsWith('|')) {
      tableLines.push(lines[i])
      i++
    }
    html.push(processTable(tableLines.join('\n')))
    continue
  }

  // Headings
  if (/^#{1,4} /.test(line)) {
    const m = line.match(/^(#{1,4}) (.+)/)
    const level = m[1].length
    html.push(`<h${level}>${inlineFormat(m[2])}</h${level}>`)
    i++; continue
  }

  // Blockquote
  if (line.startsWith('> ')) {
    const bqLines = []
    while (i < lines.length && lines[i].startsWith('> ')) {
      bqLines.push(inlineFormat(lines[i].slice(2)))
      i++
    }
    html.push(`<blockquote><p>${bqLines.join('<br>')}</p></blockquote>`)
    continue
  }

  // HR
  if (/^---+$/.test(line.trim())) {
    html.push('<hr>')
    i++; continue
  }

  // Unordered list
  if (/^[-*] /.test(line)) {
    const items = []
    while (i < lines.length && /^[-*] /.test(lines[i])) {
      items.push(`<li>${inlineFormat(lines[i].slice(2))}</li>`)
      i++
    }
    html.push(`<ul>${items.join('')}</ul>`)
    continue
  }

  // Ordered list
  if (/^\d+\. /.test(line)) {
    const items = []
    while (i < lines.length && /^\d+\. /.test(lines[i])) {
      items.push(`<li>${inlineFormat(lines[i].replace(/^\d+\. /,''))}</li>`)
      i++
    }
    html.push(`<ol>${items.join('')}</ol>`)
    continue
  }

  // Blank line
  if (line.trim() === '') {
    i++; continue
  }

  // Paragraph
  html.push(`<p>${inlineFormat(line)}</p>`)
  i++
}

const CSS = `
@page { size: A4; margin: 18mm 16mm; }
body {
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif;
  font-size: 10.5pt;
  line-height: 1.55;
  max-width: 840px;
  margin: 0 auto;
}
h1, h2, h3, h4 { color: #0f172a; line-height: 1.2; page-break-after: avoid; }
h1 { font-size: 26pt; margin: 0 0 12pt; }
h2 { font-size: 17pt; margin: 24pt 0 8pt; border-top: 2px solid #2563eb; padding-top: 14pt; }
h3 { font-size: 13.5pt; margin: 18pt 0 6pt; }
h4 { font-size: 11.5pt; margin: 14pt 0 4pt; }
p { margin: 0 0 8pt; }
blockquote {
  margin: 0 0 14pt;
  padding: 8pt 12pt;
  background: #f8fafc;
  border-left: 4px solid #2563eb;
  color: #334155;
}
blockquote p { margin: 0 0 4pt; }
ul, ol { margin: 0 0 10pt 18pt; padding: 0; }
li { margin: 2pt 0; }
table {
  border-collapse: collapse;
  width: 100%;
  margin: 10pt 0 14pt;
  page-break-inside: avoid;
  font-size: 9.5pt;
}
th, td { border: 1px solid #d1d5db; padding: 6pt 7pt; vertical-align: top; }
th { background: #eef2ff; color: #1e1b4b; text-align: left; font-weight: 700; }
tr:nth-child(even) td { background: #f9fafb; }
code {
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 1px 4px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.92em;
}
pre {
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 12pt;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  page-break-inside: avoid;
}
pre code { background: transparent; border: 0; color: inherit; padding: 0; font-size: 9pt; }
hr { border: 0; border-top: 1px solid #e5e7eb; margin: 18pt 0; }
strong { color: #0f172a; }
`

const fullHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>DevForge 12-Week Curriculum</title>
  <style>${CSS}</style>
</head>
<body>
${html.join('\n')}
</body>
</html>`

fs.writeFileSync(htmlPath, fullHtml)
console.log(`✓ HTML written → ${htmlPath}`)

// Use Chrome headless to print PDF
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
execSync(`"${chrome}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "file://${htmlPath}"`, { stdio: 'inherit' })
console.log(`✓ PDF written  → ${pdfPath}`)
