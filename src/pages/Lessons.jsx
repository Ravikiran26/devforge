import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useTheme } from '../hooks/useTheme'
import { THEMES } from '../lib/themes'
import {
  CheckCircle, Lock, BookOpen, ChevronRight, ChevronLeft,
  Copy, Check, Terminal, Code2, Monitor, Clock, ArrowLeft, Map, Sun, Moon,
} from 'lucide-react'
import api from '../lib/api'

const glow = (color = '#3B82F6', size = 10) => `0 0 ${size}px ${color}44`

const WEEK_LABELS = [
  '',
  'Git, JavaScript, APIs & Developer Workflow',
  'Node.js, Express, PostgreSQL & Prisma',
  'React',
  'Authentication + Mini Lead Manager',
  'Restaurant Flow — Core Features',
  'Restaurant Flow — Razorpay & Socket.io',
  'Lead Bill — GST Billing & PDF',
  'Lead Bill — Cloudinary & Advanced Features',
  'Lead Bill — Polish & Deploy',
  'ClientDesk AI — Claude API & CI/CD',
  'ClientDesk AI — GitHub Actions & Polish',
  'Career Week',
]

const WEEK_THEMES = [
  '',
  { emoji:'⚡', tag:'Week 1',  color:'#3B82F6', bg:'rgba(59,130,246,0.08)',   border:'rgba(59,130,246,0.2)'   },
  { emoji:'🛠',  tag:'Week 2',  color:'#60B8D4', bg:'rgba(96,184,212,0.08)',   border:'rgba(96,184,212,0.2)'   },
  { emoji:'⚛️', tag:'Week 3',  color:'#A78BFA', bg:'rgba(167,139,250,0.08)',  border:'rgba(167,139,250,0.2)'  },
  { emoji:'🔐', tag:'Week 4',  color:'#F4A942', bg:'rgba(244,169,66,0.08)',   border:'rgba(244,169,66,0.2)'   },
  { emoji:'🍽️', tag:'Week 5',  color:'#3FB950', bg:'rgba(63,185,80,0.08)',    border:'rgba(63,185,80,0.2)'    },
  { emoji:'💳', tag:'Week 6',  color:'#E07070', bg:'rgba(224,112,112,0.08)',  border:'rgba(224,112,112,0.2)'  },
  { emoji:'🧾', tag:'Week 7',  color:'#22D3EE', bg:'rgba(34,211,238,0.08)',   border:'rgba(34,211,238,0.2)'   },
  { emoji:'☁️', tag:'Week 8',  color:'#FBBF24', bg:'rgba(251,191,36,0.08)',   border:'rgba(251,191,36,0.2)'   },
  { emoji:'🚀', tag:'Week 9',  color:'#E879A0', bg:'rgba(232,121,160,0.08)',  border:'rgba(232,121,160,0.2)'  },
  { emoji:'🤖', tag:'Week 10', color:'#D4954A', bg:'rgba(212,149,74,0.08)',   border:'rgba(212,149,74,0.2)'   },
  { emoji:'⚙️', tag:'Week 11', color:'#8B5CF6', bg:'rgba(139,92,246,0.08)',   border:'rgba(139,92,246,0.2)'   },
  { emoji:'🎯', tag:'Week 12', color:'#10B981', bg:'rgba(16,185,129,0.08)',   border:'rgba(16,185,129,0.2)'   },
]

const WEEK_SKILLS = {
  1:  ['Terminal', 'Git', 'GitHub', 'JavaScript', 'Functions', 'Arrays', 'Objects'],
  2:  ['Node.js', 'Express', 'REST API', 'PostgreSQL', 'Prisma ORM'],
  3:  ['React', 'JSX', 'useState', 'useEffect', 'Components', 'Props'],
  4:  ['JWT Auth', 'bcrypt', 'Protected Routes', 'Full-Stack Architecture'],
  5:  ['Socket.io', 'Real-time Events', 'Event-Driven Architecture'],
  6:  ['Razorpay', 'Payment Gateway', 'Webhooks', 'Order Management'],
  7:  ['PDF Generation', 'GST Billing', 'pdf-lib', 'Invoice Design'],
  8:  ['Cloudinary', 'File Upload', 'Image Optimization', 'Storage APIs'],
  9:  ['Production Deploy', 'Railway/Render', 'Environment Variables', 'DevOps'],
  10: ['Claude API', 'LLM Integration', 'Prompt Engineering', 'AI Products'],
  11: ['GitHub Actions', 'CI/CD Pipelines', 'Docker Basics', 'Automation'],
  12: ['Portfolio', 'Resume Writing', 'System Design', 'Mock Interviews'],
}

const BLOCK_STYLES = {
  'TRY IT NOW':    { bg:'#052e16', border:'#166534', labelBg:'#15803d', labelColor:'#fff', codeColor:'#86efac', icon:Terminal, label:'TRY IT NOW' },
  'TRY IN CONSOLE':{ bg:'#0c1a2e', border:'#1e3a5f', labelBg:'#1d4ed8', labelColor:'#fff', codeColor:'#93c5fd', icon:Monitor,  label:'TRY IN CONSOLE' },
  'CODE EXAMPLE':  { bg:'#0f172a', border:'#1e293b', labelBg:'#334155', labelColor:'#e2e8f0', codeColor:'#e2e8f0', icon:Code2, label:'CODE EXAMPLE' },
}
const BLOCK_TRIGGERS = ['TRY IT NOW','TRY IN CONSOLE','CODE EXAMPLE']

function parseSegments(description) {
  const lines = description.split('\n')
  const segments = []
  let i = 0
  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (BLOCK_TRIGGERS.includes(trimmed)) {
      const blockType = trimmed
      const codeLines = []
      i++
      while (i < lines.length && lines[i].trim() !== '---') { codeLines.push(lines[i]); i++ }
      segments.push({ type:'block', blockType, code: codeLines.join('\n').trimEnd() })
      i++
    } else {
      segments.push({ type:'text', line: lines[i] })
      i++
    }
  }
  return segments
}

function CopyButton({ text }) {
  const C = useTheme()
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }) }}
      style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', border:`1px solid ${C.border2}`, cursor:'pointer', background: copied ? `${C.green}22` : C.surface2, color: copied ? C.green : C.text3, fontSize:11, fontWeight:600, fontFamily:'JetBrains Mono,monospace' }}
    >
      {copied ? <Check size={11}/> : <Copy size={11}/>} {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function CodeBlock({ blockType, code }) {
  const s = BLOCK_STYLES[blockType]
  const Icon = s.icon
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`, overflow:'hidden', margin:'20px 0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 16px', background:'rgba(0,0,0,0.3)', borderBottom:`1px solid ${s.border}` }}>
        <span style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 10px', background:s.labelBg, color:s.labelColor, fontSize:11, fontWeight:800, letterSpacing:'0.07em', fontFamily:'JetBrains Mono,monospace' }}>
          <Icon size={11}/>{s.label}
        </span>
        <CopyButton text={code}/>
      </div>
      <pre style={{ margin:0, padding:'18px 22px', overflowX:'auto', fontFamily:'JetBrains Mono, Menlo, Consolas, monospace', fontSize:13, lineHeight:1.75, color:s.codeColor, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{code}</pre>
    </div>
  )
}

function renderTextLine(line, i, R) {
  const t = line.trim()
  if (/^[A-Z][A-Z0-9\s\-]{3,}$/.test(t) && t.length < 55 && !t.startsWith('•') && !t.startsWith('☐'))
    return <div key={i} style={{ fontSize:11, fontWeight:800, color:R.accent, letterSpacing:'0.1em', marginTop: i===0 ? 0 : 32, marginBottom:10, fontFamily:"'Inter', sans-serif" }}>{t}</div>
  if (/^─+$/.test(t))
    return <hr key={i} style={{ border:'none', borderTop:`1px solid ${R.border}`, margin:'24px 0' }}/>
  if (t.startsWith('☐'))
    return <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10, padding:'10px 14px', background: R.surface, border:`1px solid ${R.border}` }}>
      <span style={{ fontSize:16, color: R.text3, marginTop:1, flexShrink:0 }}>☐</span>
      <span style={{ fontSize:14, color: R.text2, lineHeight:1.6, fontFamily:"'Inter', sans-serif" }}>{t.slice(1).trim()}</span>
    </div>
  if (t.startsWith('•'))
    return <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:8 }}>
      <span style={{ width:6, height:6, background: R.accent, flexShrink:0, marginTop:10 }}/>
      <span style={{ fontSize:14, color: R.text2, lineHeight:1.75, fontFamily:"'Inter', sans-serif" }}>{t.slice(1).trim()}</span>
    </div>
  if (/^\d+\./.test(t)) {
    const num = t.match(/^(\d+)\./)[1]
    const text = t.replace(/^\d+\.\s*/,'')
    return <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:10 }}>
      <span style={{ width:24, height:24, background:`${R.accent}18`, color: R.accent, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, fontFamily:'JetBrains Mono,monospace' }}>{num}</span>
      <span style={{ fontSize:14, color: R.text2, lineHeight:1.75, fontFamily:"'Inter', sans-serif" }}>{text}</span>
    </div>
  }
  if (line.startsWith('  ') && t.length > 0)
    return <div key={i} style={{ background: R.surface, border:`1px solid ${R.border}`, borderLeft:`2px solid ${R.accent}`, padding:'4px 14px', margin:'3px 0', fontFamily:'JetBrains Mono, monospace', fontSize:13, color: R.text, lineHeight:1.85 }}>{t}</div>
  if (!t) return <div key={i} style={{ height:10 }}/>
  if (t.endsWith('?') || /^What |^Why |^How /.test(t))
    return <div key={i} style={{ fontSize:16, fontWeight:700, color: R.text, marginTop:20, marginBottom:8, fontFamily:"'Inter', sans-serif" }}>{t}</div>
  return <p key={i} style={{ fontSize:14, color: R.text2, lineHeight:1.85, margin:'0 0 6px', fontFamily:"'Inter', sans-serif" }}>{t}</p>
}

function Spinner() {
  const C = useTheme()
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
      <div style={{ width:32, height:32, border:`3px solid ${C.border2}`, borderTop:`3px solid ${C.accent}`, borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── Map view ──────────────────────────────────────────────────────────────────
function MapView({ byWeek, maxUnlockedWeek, onSelectWeek }) {
  const C = useTheme()
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1)

  const weekStatus = (w) => {
    const wl = byWeek[w] || []
    if (wl.length && wl.every(l => l.watched)) return 'done'
    if (w <= maxUnlockedWeek) return 'available'
    return 'locked'
  }

  const currentWeek = weeks.find(w => weekStatus(w) === 'available') || 1

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <Map size={18} color={C.accent}/>
          <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:26, fontWeight:600, color: C.text, margin:0, letterSpacing:'-0.02em' }}>Your Learning Journey</h2>
        </div>
        <p style={{ fontSize: 13, color: C.text3, margin: 0, fontFamily: "'Inter', sans-serif" }}>
          12-week full-stack developer training · Click any week to open lessons
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {weeks.map(w => {
          const st       = weekStatus(w)
          const wl       = byWeek[w] || []
          const done     = wl.filter(l => l.watched).length
          const total    = wl.length
          const pct      = total ? Math.round((done / total) * 100) : 0
          const locked   = st === 'locked'
          const isDone   = st === 'done'
          const isCurrent = w === currentWeek
          const theme    = WEEK_THEMES[w]

          const accentColor = isDone ? C.green : isCurrent ? theme.color : C.text3

          return (
            <div
              key={w}
              onClick={() => !locked && onSelectWeek(w)}
              style={{
                background: isDone ? 'rgba(63,185,80,0.07)' : isCurrent ? theme.bg : locked ? `${C.surface}44` : C.surface,
                border: `1px solid ${isDone ? 'rgba(63,185,80,0.25)' : isCurrent ? theme.border : C.border}`,
                padding: '20px',
                cursor: locked ? 'not-allowed' : 'pointer',
                opacity: locked ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { if (!locked) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor = isCurrent ? theme.color : isDone ? 'rgba(63,185,80,0.4)' : C.border2 }}}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor = isDone ? 'rgba(63,185,80,0.25)' : isCurrent ? theme.border : C.border }}
            >
              <div style={{ position:'absolute', top:8, right:12, fontFamily:'JetBrains Mono,monospace', fontSize:48, fontWeight:700, color: accentColor, lineHeight:1, userSelect:'none', pointerEvents:'none', opacity:0.12 }}>{w}</div>

              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                <span style={{ fontSize:14 }}>{locked ? '🔒' : theme.emoji}</span>
                <span style={{ fontSize:9, fontWeight:700, color: accentColor, letterSpacing:'0.12em', fontFamily:'JetBrains Mono,monospace' }}>{theme.tag}</span>
              </div>

              {isCurrent && !isDone && (
                <div style={{ marginBottom:8 }}>
                  <span style={{ fontSize:9, fontWeight:700, color: theme.color, border:`1px solid ${theme.border}`, padding:'2px 8px', letterSpacing:'0.08em', fontFamily:'JetBrains Mono,monospace' }}>● CURRENT</span>
                </div>
              )}
              {isDone && (
                <div style={{ marginBottom:8 }}>
                  <span style={{ fontSize:9, fontWeight:700, color: C.green, border:`1px solid ${C.green}44`, padding:'2px 8px', letterSpacing:'0.08em', fontFamily:'JetBrains Mono,monospace' }}>✓ DONE</span>
                </div>
              )}

              <div style={{ fontSize:12, fontWeight:600, color: locked ? C.text3 : C.text, lineHeight:1.45, marginBottom:16, minHeight:36, fontFamily:"'Inter', sans-serif" }}>
                {WEEK_LABELS[w]}
              </div>

              {!locked && total > 0 ? (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                    <span style={{ fontSize:10, color: C.text3, fontFamily:'JetBrains Mono,monospace' }}>{done}/{total} lessons</span>
                    <span style={{ fontSize:10, fontWeight:700, color: accentColor, fontFamily:'JetBrains Mono,monospace' }}>{pct}%</span>
                  </div>
                  <div style={{ height:2, background: C.border }}>
                    <div style={{ width:`${pct}%`, height:'100%', background: accentColor, transition:'width 0.4s', boxShadow: pct > 0 ? glow(accentColor, 6) : 'none' }}/>
                  </div>
                </>
              ) : locked ? (
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color: C.text3, fontFamily:'JetBrains Mono,monospace' }}>
                  <Lock size={11}/> Complete earlier weeks
                </div>
              ) : (
                <div style={{ fontSize:11, color: C.text3, fontFamily:'JetBrains Mono,monospace' }}>No lessons yet</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Skills Unlocked card ──────────────────────────────────────────────────────
function SkillsUnlocked({ completedWeeks, C }) {
  const allSkills = completedWeeks.flatMap(w => WEEK_SKILLS[w] || [])
  if (!allSkills.length) return null

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, marginTop: 14, padding: '14px 20px' }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: C.green, letterSpacing: '0.14em', marginBottom: 10, fontFamily: 'JetBrains Mono, monospace' }}>
        ✦ RESUME KEYWORDS UNLOCKED ({allSkills.length})
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {allSkills.map(skill => (
          <span key={skill} style={{ fontSize: 11, fontWeight: 600, color: C.text2, background: `${C.accent}12`, border: `1px solid ${C.accent}22`, padding: '3px 10px', fontFamily: "'Inter', sans-serif" }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Browse view ───────────────────────────────────────────────────────────────
function BrowseView({ activeWeek, weekLessons, onSelectLesson, onBackToMap, byWeek }) {
  const C = useTheme()
  const watched = weekLessons.filter(l => l.watched).length
  const total   = weekLessons.length
  const pct     = total ? Math.round((watched / total) * 100) : 0
  const theme   = WEEK_THEMES[activeWeek]

  // Weeks completed up to and including activeWeek
  const completedWeeks = Object.entries(byWeek)
    .filter(([w, lessons]) => parseInt(w) <= activeWeek && lessons.length && lessons.every(l => l.watched))
    .map(([w]) => parseInt(w))

  const foundations = weekLessons.filter(l => l.lessonCode.startsWith('L'))
  const dailies     = weekLessons.filter(l => !l.lessonCode.startsWith('L'))

  function LessonRow({ l, last }) {
    return (
      <div
        onClick={() => onSelectLesson(l.id)}
        style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 24px', borderBottom: last ? 'none' : `1px solid ${C.border}`, cursor:'pointer', transition:'background 0.12s' }}
        onMouseEnter={e => e.currentTarget.style.background = C.surface2}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{
          width:9, height:9, flexShrink:0,
          background: l.watched ? C.green : 'transparent',
          border: `1px solid ${l.watched ? C.green : C.border2}`,
          boxShadow: l.watched ? glow(C.green, 6) : 'none',
        }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:500, color: l.watched ? C.text3 : C.text, marginBottom:3, fontFamily:"'Inter', sans-serif" }}>{l.title}</div>
          {l.duration && (
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color: C.text3, fontFamily:'JetBrains Mono,monospace' }}>
              <Clock size={10}/>{l.duration}
            </div>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          {l.watched && <span style={{ fontSize:9, fontWeight:700, color: C.green, letterSpacing:'0.08em', fontFamily:'JetBrains Mono,monospace' }}>✓ DONE</span>}
          <span style={{ fontSize:10, fontWeight:500, color: C.text3, background: C.surface2, border:`1px solid ${C.border}`, padding:'3px 9px', fontFamily:'JetBrains Mono, monospace' }}>{l.lessonCode}</span>
          <ChevronRight size={13} color={C.text3}/>
        </div>
      </div>
    )
  }

  function SectionLabel({ label }) {
    return (
      <div style={{ padding:'7px 24px', fontSize:9, fontWeight:700, color: C.text3, letterSpacing:'0.14em', background: C.surface, borderBottom:`1px solid ${C.border}`, borderTop:`1px solid ${C.border}`, fontFamily:'JetBrains Mono,monospace' }}>
        {label}
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
        <button onClick={onBackToMap} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:`1px solid ${C.border2}`, background: C.surface, color: C.text3, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'JetBrains Mono,monospace' }}>
          <Map size={12}/> All Weeks
        </button>
        <ChevronRight size={13} color={C.text3}/>
        <span style={{ fontSize:12, fontWeight:700, color: C.text, fontFamily:"'Inter', sans-serif" }}>{theme.emoji} Week {activeWeek} — {WEEK_LABELS[activeWeek]}</span>
      </div>

      <div style={{ background: C.surface, border:`1px solid ${C.border2}`, overflow:'hidden', borderTop:`2px solid ${theme.color}` }}>
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}`, background: theme.bg }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:"'Inter', sans-serif", fontSize:17, fontWeight:700, color: C.text, letterSpacing:'-0.01em' }}>Week {activeWeek} — {WEEK_LABELS[activeWeek]}</div>
              <div style={{ fontSize:12, marginTop:4, color: pct === 100 ? C.green : C.text3, fontFamily:'JetBrains Mono,monospace' }}>
                {pct === 100 ? '✓ All lessons complete' : `${watched} of ${total} lessons completed`}
              </div>
            </div>
            {total > 0 && (
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:26, fontWeight:700, color: pct === 100 ? C.green : theme.color, lineHeight:1, textShadow: glow(pct === 100 ? C.green : theme.color, 12) }}>{pct}%</div>
            )}
          </div>
          {total > 0 && (
            <div style={{ height:2, background: C.border }}>
              <div style={{ width:`${pct}%`, height:'100%', background: pct === 100 ? C.green : theme.color, transition:'width 0.4s ease', boxShadow: pct > 0 ? glow(pct === 100 ? C.green : theme.color, 8) : 'none' }}/>
            </div>
          )}
        </div>

        {foundations.length > 0 && (
          <>
            <SectionLabel label="PREREQUISITES"/>
            {foundations.map((l, i) => <LessonRow key={l.id} l={l} last={i === foundations.length - 1 && dailies.length === 0}/>)}
          </>
        )}

        {dailies.length > 0 && (
          <>
            {foundations.length > 0 && <SectionLabel label="DAILY LESSONS"/>}
            {dailies.map((l, i) => <LessonRow key={l.id} l={l} last={i === dailies.length - 1}/>)}
          </>
        )}

        {weekLessons.length === 0 && (
          <div style={{ padding:48, textAlign:'center', color: C.text3 }}>
            <BookOpen size={32} style={{ opacity:0.3, marginBottom:12 }}/>
            <p style={{ fontSize:13, fontFamily:"'Inter', sans-serif" }}>No lessons for this week yet.</p>
          </div>
        )}
      </div>

      <SkillsUnlocked completedWeeks={completedWeeks} C={C}/>
    </div>
  )
}

// ── Reading view ──────────────────────────────────────────────────────────────
function ReadingView({ lesson, onBack, onMarkDone, isPending, weekLessons, onSelectLesson }) {
  const C = useTheme()
  const [bgMode, setBgMode] = useState('theme')
  const R = bgMode === 'light' ? THEMES.light : C
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || lesson.watched) return
    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
        onMarkDone(lesson.id)
      }
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [lesson.id, lesson.watched, onMarkDone])

  const currentIndex = weekLessons.findIndex(l => l.id === lesson.id)
  const prev = weekLessons[currentIndex - 1] || null
  const next = weekLessons[currentIndex + 1] || null
  const segments = parseSegments(lesson.description || '')
  const theme = WEEK_THEMES[lesson.week]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 112px)', background: R.surface, border:`1px solid ${R.border2 ?? R.border}`, borderTop:`2px solid ${theme.color}`, overflow:'hidden' }}>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 24px', borderBottom:`1px solid ${R.border}`, background: R.surface, flexShrink:0 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:`1px solid ${R.border2 ?? R.border}`, background: R.surface2, color: R.text3, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'JetBrains Mono,monospace', flexShrink:0 }}>
          <ArrowLeft size={12}/> Week {lesson.week}
        </button>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:9, fontWeight:700, color: R.text3, letterSpacing:'0.12em', marginBottom:3, fontFamily:'JetBrains Mono,monospace' }}>
            {theme.emoji} WEEK {lesson.week} · {lesson.lessonCode} · {currentIndex + 1} of {weekLessons.length}
          </div>
          <div style={{ fontFamily:"'Inter', sans-serif", fontSize:16, fontWeight:700, color: R.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{lesson.title}</div>
        </div>

        {/* Light / Dark reading toggle */}
        <button
          onClick={() => setBgMode(m => m === 'light' ? 'theme' : 'light')}
          title={bgMode === 'light' ? 'Use theme colors' : 'Switch to light reading mode'}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 13px', border:`1px solid ${R.border2 ?? R.border}`, background: R.surface2, color: R.text3, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'JetBrains Mono,monospace', flexShrink:0, transition:'color 0.15s, border-color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent }}
          onMouseLeave={e => { e.currentTarget.style.color = R.text3; e.currentTarget.style.borderColor = R.border2 ?? R.border }}
        >
          {bgMode === 'light' ? <Moon size={12}/> : <Sun size={12}/>}
          {bgMode === 'light' ? 'Theme' : 'Light'}
        </button>

        <button
          onClick={() => onMarkDone(lesson.id)}
          disabled={isPending || lesson.watched}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', border:'none', cursor: lesson.watched ? 'default' : 'pointer', background: lesson.watched ? `${C.green}18` : C.accent, color: lesson.watched ? C.green : '#fff', fontWeight:700, fontSize:11, whiteSpace:'nowrap', flexShrink:0, letterSpacing:'0.06em', fontFamily:'JetBrains Mono,monospace', boxShadow: lesson.watched ? glow(C.green, 8) : 'none' }}
        >
          <CheckCircle size={13}/>
          {lesson.watched ? 'Completed' : isPending ? 'Saving…' : 'Mark as Complete'}
        </button>
      </div>

      {/* Content */}
      <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:'36px 64px', background: R.bg }}>
        {lesson.description ? (
          <div style={{ maxWidth:760, margin:'0 auto', fontFamily:"'Inter', sans-serif" }}>
            {segments.map((seg, i) =>
              seg.type === 'block'
                ? <CodeBlock key={i} blockType={seg.blockType} code={seg.code}/>
                : renderTextLine(seg.line, i, R)
            )}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:64, color: R.text3 }}>
            <BookOpen size={36} style={{ marginBottom:14, opacity:0.3 }}/>
            <p style={{ fontSize:13, fontFamily:"'Inter', sans-serif" }}>Content coming soon for this lesson.</p>
          </div>
        )}

        {/* Prev / Next */}
        <div style={{ maxWidth:760, margin:'48px auto 0', display:'flex', justifyContent:'space-between', gap:12, paddingTop:24, borderTop:`1px solid ${R.border}` }}>
          {prev ? (
            <button onClick={() => onSelectLesson(prev.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 20px', border:`1px solid ${R.border2 ?? R.border}`, background: R.surface, cursor:'pointer', color: R.text2, fontSize:12, fontWeight:500, fontFamily:"'Inter', sans-serif" }}>
              <ChevronLeft size={15} color={C.accent}/>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontSize:9, color: R.text3, marginBottom:2, fontFamily:'JetBrains Mono,monospace' }}>PREVIOUS</div>
                <div>{prev.title}</div>
              </div>
            </button>
          ) : <div/>}

          {next ? (
            <button onClick={() => onSelectLesson(next.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 20px', border:`1px solid ${R.border2 ?? R.border}`, background: R.surface, cursor:'pointer', color: R.text2, fontSize:12, fontWeight:500, fontFamily:"'Inter', sans-serif" }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:9, color: R.text3, marginBottom:2, fontFamily:'JetBrains Mono,monospace' }}>NEXT</div>
                <div>{next.title}</div>
              </div>
              <ChevronRight size={15} color={C.accent}/>
            </button>
          ) : (
            <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', border:'none', background: C.accent, cursor:'pointer', color:'#fff', fontSize:11, fontWeight:700, fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.06em' }}>
              <CheckCircle size={14}/> Back to Week {lesson.week}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function Lessons() {
  const qc = useQueryClient()
  const [view, setView]                     = useState('map')
  const [activeWeek, setActiveWeek]         = useState(null)
  const [activeLessonId, setActiveLessonId] = useState(null)

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => api.get('/student/lessons').then(r => r.data),
  })

  const watchMutation = useMutation({
    mutationFn: (id) => api.post(`/student/lessons/${id}/watch`),
    onSuccess: () => qc.invalidateQueries({ queryKey:['lessons'] }),
  })

  if (isLoading) return <DashboardLayout title="Lessons"><Spinner/></DashboardLayout>

  const byWeek = {}
  for (const l of lessons) {
    if (!byWeek[l.week]) byWeek[l.week] = []
    byWeek[l.week].push(l)
  }

  const maxUnlockedWeek = lessons.length ? Math.max(...lessons.map(l => l.week)) : 1
  const weekLessons  = activeWeek ? (byWeek[activeWeek] || []) : []
  const activeLesson = activeLessonId ? lessons.find(l => l.id === activeLessonId) || null : null

  const handleSelectWeek   = (w) => { setActiveWeek(w); setView('browse') }
  const handleSelectLesson = (id) => { setActiveLessonId(id); setView('reading') }
  const handleBackFromReading = () => { setActiveLessonId(null); setView('browse') }
  const handleBackToMap    = () => { setActiveLessonId(null); setActiveWeek(null); setView('map') }

  return (
    <DashboardLayout title="Lessons">
      {view === 'map' && (
        <MapView byWeek={byWeek} maxUnlockedWeek={maxUnlockedWeek} onSelectWeek={handleSelectWeek}/>
      )}
      {view === 'browse' && (
        <BrowseView activeWeek={activeWeek} weekLessons={weekLessons} onSelectLesson={handleSelectLesson} onBackToMap={handleBackToMap} byWeek={byWeek}/>
      )}
      {view === 'reading' && activeLesson && (
        <ReadingView lesson={activeLesson} onBack={handleBackFromReading} onMarkDone={(id) => watchMutation.mutate(id)} isPending={watchMutation.isPending} weekLessons={weekLessons} onSelectLesson={handleSelectLesson}/>
      )}
    </DashboardLayout>
  )
}
