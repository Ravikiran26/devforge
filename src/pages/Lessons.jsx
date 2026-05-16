import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '../components/layout/DashboardLayout'
import {
  CheckCircle, Lock, BookOpen, ChevronRight, ChevronLeft,
  Copy, Check, Terminal, Code2, Monitor, Clock, ArrowLeft, Map,
} from 'lucide-react'
import api from '../lib/api'

const WEEK_LABELS = ['','Foundation — Mini Lead Manager','Backend Basics','Auth + React','Task Board Build','Advanced Features','Project 2 Start','Interview Prep','Final Mock']

const WEEK_THEMES = [
  '',
  { emoji:'⚡', tag:'Week 1', color:'#3B82F6', bg:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.2)'  },
  { emoji:'🛠', tag:'Week 2', color:'#60B8D4', bg:'rgba(96,184,212,0.08)',  border:'rgba(96,184,212,0.2)'  },
  { emoji:'🔐', tag:'Week 3', color:'#A78BFA', bg:'rgba(167,139,250,0.08)', border:'rgba(167,139,250,0.2)' },
  { emoji:'📋', tag:'Week 4', color:'#F4A942', bg:'rgba(244,169,66,0.08)',  border:'rgba(244,169,66,0.2)'  },
  { emoji:'🚀', tag:'Week 5', color:'#E07070', bg:'rgba(224,112,112,0.08)', border:'rgba(224,112,112,0.2)' },
  { emoji:'🌐', tag:'Week 6', color:'#3FB950', bg:'rgba(63,185,80,0.08)',  border:'rgba(63,185,80,0.2)'  },
  { emoji:'🎤', tag:'Week 7', color:'#E879A0', bg:'rgba(232,121,160,0.08)', border:'rgba(232,121,160,0.2)' },
  { emoji:'🏁', tag:'Week 8', color:'#D4954A', bg:'rgba(212,149,74,0.08)',  border:'rgba(212,149,74,0.2)'  },
]

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
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }) }}
      style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:6, border:'none', cursor:'pointer', background: copied ? '#166534' : 'rgba(255,255,255,0.1)', color: copied ? '#86efac' : 'rgba(255,255,255,0.7)', fontSize:11, fontWeight:600 }}
    >
      {copied ? <Check size={11}/> : <Copy size={11}/>} {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function CodeBlock({ blockType, code }) {
  const s = BLOCK_STYLES[blockType]
  const Icon = s.icon
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:12, overflow:'hidden', margin:'20px 0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 16px', background:'rgba(0,0,0,0.3)', borderBottom:`1px solid ${s.border}` }}>
        <span style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 10px', borderRadius:5, background:s.labelBg, color:s.labelColor, fontSize:11, fontWeight:800, letterSpacing:'0.07em' }}>
          <Icon size={11}/>{s.label}
        </span>
        <CopyButton text={code}/>
      </div>
      <pre style={{ margin:0, padding:'18px 22px', overflowX:'auto', fontFamily:'JetBrains Mono, Menlo, Consolas, monospace', fontSize:14, lineHeight:1.75, color:s.codeColor, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{code}</pre>
    </div>
  )
}

function renderTextLine(line, i) {
  const t = line.trim()
  if (/^[A-Z][A-Z0-9\s\-]{3,}$/.test(t) && t.length < 55 && !t.startsWith('•') && !t.startsWith('☐'))
    return <div key={i} style={{ fontSize:11, fontWeight:800, color:'#3B82F6', letterSpacing:'0.1em', marginTop: i===0 ? 0 : 32, marginBottom:10 }}>{t}</div>
  if (/^─+$/.test(t))
    return <hr key={i} style={{ border:'none', borderTop:'1px solid #30363D', margin:'24px 0' }}/>
  if (t.startsWith('☐'))
    return <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10, padding:'8px 12px', background:'#21262D', borderRadius:8 }}>
      <span style={{ fontSize:17, color:'#6E7681', marginTop:1, flexShrink:0 }}>☐</span>
      <span style={{ fontSize:15, color:'#C9D1D9', lineHeight:1.6 }}>{t.slice(1).trim()}</span>
    </div>
  if (t.startsWith('•'))
    return <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:8 }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:'#3B82F6', flexShrink:0, marginTop:9 }}/>
      <span style={{ fontSize:15, color:'#C9D1D9', lineHeight:1.75 }}>{t.slice(1).trim()}</span>
    </div>
  if (/^\d+\./.test(t)) {
    const num = t.match(/^(\d+)\./)[1]
    const text = t.replace(/^\d+\.\s*/,'')
    return <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:10 }}>
      <span style={{ width:26, height:26, borderRadius:'50%', background:'rgba(59,130,246,0.1)', color:'#3B82F6', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>{num}</span>
      <span style={{ fontSize:15, color:'#C9D1D9', lineHeight:1.75 }}>{text}</span>
    </div>
  }
  if (line.startsWith('  ') && t.length > 0)
    return <div key={i} style={{ background:'#21262D', border:'1px solid #30363D', borderRadius:7, padding:'3px 14px', margin:'3px 0', fontFamily:'JetBrains Mono, monospace', fontSize:13, color:'#C9D1D9', lineHeight:1.85 }}>{t}</div>
  if (!t) return <div key={i} style={{ height:10 }}/>
  if (t.endsWith('?') || /^What |^Why |^How /.test(t))
    return <div key={i} style={{ fontSize:17, fontWeight:700, color:'#E6EDF3', marginTop:20, marginBottom:8 }}>{t}</div>
  return <p key={i} style={{ fontSize:15, color:'#C9D1D9', lineHeight:1.85, margin:'0 0 6px' }}>{t}</p>
}

function Spinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
      <div style={{ width:36, height:36, border:'4px solid #30363D', borderTop:'4px solid #3B82F6', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── Map view — program overview grid ──────────────────────────────────────────
function MapView({ byWeek, maxUnlockedWeek, onSelectWeek }) {
  const weeks = Array.from({ length:8 }, (_, i) => i+1)

  const weekStatus = (w) => {
    const wl = byWeek[w] || []
    if (wl.length && wl.every(l => l.watched)) return 'done'
    if (w <= maxUnlockedWeek) return 'available'
    return 'locked'
  }

  // Find the first non-done available week (current focus)
  const currentWeek = weeks.find(w => weekStatus(w) === 'available') || 1

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <Map size={18} color="#3B82F6"/>
          <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:26, fontWeight:600, color:'#E6EDF3', margin:0, letterSpacing:'-0.02em' }}>Your Learning Journey</h2>
        </div>
        <p style={{ fontSize:13, color:'#8B949E', margin:0, fontFamily:"'Inter', sans-serif" }}>10-week full-stack developer training · Click any week to open lessons</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
        {weeks.map(w => {
          const st     = weekStatus(w)
          const wl     = byWeek[w] || []
          const done   = wl.filter(l => l.watched).length
          const total  = wl.length
          const pct    = total ? Math.round((done / total) * 100) : 0
          const locked = st === 'locked'
          const isDone = st === 'done'
          const isCurrent = w === currentWeek
          const theme  = WEEK_THEMES[w]

          const accent = isDone ? '#3FB950' : isCurrent ? theme.color : '#6E7681'
          const cardBg = isDone ? 'rgba(63,185,80,0.07)' : isCurrent ? theme.bg : locked ? 'rgba(255,255,255,0.01)' : '#161B22'
          const cardBorder = isDone ? 'rgba(63,185,80,0.25)' : isCurrent ? theme.border : '#30363D'

          return (
            <div
              key={w}
              onClick={() => !locked && onSelectWeek(w)}
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                padding: '20px',
                cursor: locked ? 'not-allowed' : 'pointer',
                opacity: locked ? 0.5 : 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!locked) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor=isCurrent?theme.color:isDone?'rgba(63,185,80,0.4)':'#3D444D' }}}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor=cardBorder }}
            >
              {/* Decorative week number watermark */}
              <div style={{ position:'absolute', top:10, right:14, fontFamily:"'Inter', sans-serif", fontSize:44, fontWeight:700, color: accent, lineHeight:1, userSelect:'none', pointerEvents:'none', opacity:0.18 }}>{w}</div>

              {/* Emoji + week tag */}
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <span style={{ fontSize:16 }}>{locked ? '🔒' : theme.emoji}</span>
                <span style={{ fontSize:10, fontWeight:600, color: accent, letterSpacing:'0.1em', fontFamily:"'Inter', sans-serif" }}>{theme.tag}</span>
              </div>

              {/* Status badge — own row */}
              {isCurrent && !isDone && (
                <div style={{ marginBottom:8 }}>
                  <span style={{ fontSize:10, fontWeight:600, color: theme.color, background:'rgba(0,0,0,0.4)', border:`1px solid ${theme.border}`, padding:'2px 9px', letterSpacing:'0.06em', fontFamily:"'Inter', sans-serif" }}>● CURRENT</span>
                </div>
              )}
              {isDone && (
                <div style={{ marginBottom:8 }}>
                  <span style={{ fontSize:10, fontWeight:600, color:'#3FB950', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(63,185,80,0.3)', padding:'2px 9px', letterSpacing:'0.06em', fontFamily:"'Inter', sans-serif" }}>✓ DONE</span>
                </div>
              )}

              {/* Week label */}
              <div style={{ fontSize:13, fontWeight:500, color: locked ? '#6E7681' : '#E6EDF3', lineHeight:1.4, marginBottom:16, minHeight:38, fontFamily:"'Inter', sans-serif" }}>
                {WEEK_LABELS[w]}
              </div>

              {/* Progress */}
              {!locked && total > 0 ? (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontSize:11, color:'#6E7681', fontFamily:"'Inter', sans-serif" }}>{done}/{total} lessons</span>
                    <span style={{ fontSize:11, fontWeight:600, color: accent, fontFamily:"'Inter', sans-serif" }}>{pct}%</span>
                  </div>
                  <div style={{ height:2, background:'#30363D' }}>
                    <div style={{ width:`${pct}%`, height:'100%', background: accent, transition:'width 0.4s' }}/>
                  </div>
                </>
              ) : locked ? (
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#6E7681', fontFamily:"'Inter', sans-serif" }}>
                  <Lock size={12}/> Complete earlier weeks
                </div>
              ) : (
                <div style={{ fontSize:12, color:'#6E7681', fontFamily:"'Inter', sans-serif" }}>No lessons yet</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Browse view — lesson list for a selected week ─────────────────────────────
function BrowseView({ activeWeek, weekLessons, onSelectLesson, onBackToMap }) {
  const watched = weekLessons.filter(l => l.watched).length
  const total   = weekLessons.length
  const pct     = total ? Math.round((watched / total) * 100) : 0
  const theme   = WEEK_THEMES[activeWeek]

  const foundations = weekLessons.filter(l => l.lessonCode.startsWith('L'))
  const dailies     = weekLessons.filter(l => !l.lessonCode.startsWith('L'))

  function LessonRow({ l, last }) {
    return (
      <div
        onClick={() => onSelectLesson(l.id)}
        style={{ display:'flex', alignItems:'center', gap:16, padding:'15px 24px', borderBottom: last ? 'none' : '1px solid #21262D', cursor:'pointer', transition:'background 0.12s' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(59,130,246,0.03)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}
      >
        <div style={{
          width:10, height:10, flexShrink:0,
          background: l.watched ? '#3FB950' : 'transparent',
          border: `1px solid ${l.watched ? '#3FB950' : '#3D444D'}`,
        }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:500, color: l.watched ? '#6E7681' : '#E6EDF3', marginBottom:3, fontFamily:"'Inter', sans-serif" }}>{l.title}</div>
          {l.duration && (
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#6E7681', fontFamily:"'Inter', sans-serif" }}>
              <Clock size={11}/>{l.duration}
            </div>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          {l.watched && <span style={{ fontSize:10, fontWeight:600, color:'#3FB950', letterSpacing:'0.06em', fontFamily:"'Inter', sans-serif" }}>✓ DONE</span>}
          <span style={{ fontSize:11, fontWeight:500, color:'#8B949E', background:'#21262D', border:'1px solid #30363D', padding:'3px 9px', fontFamily:'JetBrains Mono, monospace' }}>{l.lessonCode}</span>
          <ChevronRight size={14} color="#3D444D"/>
        </div>
      </div>
    )
  }

  function SectionLabel({ label }) {
    return (
      <div style={{ padding:'8px 24px 6px', fontSize:10, fontWeight:600, color:'#6E7681', letterSpacing:'0.12em', background:'#21262D', borderBottom:'1px solid #30363D', borderTop:'1px solid #30363D', fontFamily:"'Inter', sans-serif" }}>
        {label}
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
        <button onClick={onBackToMap} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:'1px solid #30363D', background:'#21262D', color:'#8B949E', fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:"'Inter', sans-serif" }}>
          <Map size={13}/> All Weeks
        </button>
        <ChevronRight size={14} color="#cbd5e1"/>
        <span style={{ fontSize:13, fontWeight:700, color:'#E6EDF3' }}>{theme.emoji} Week {activeWeek} — {WEEK_LABELS[activeWeek]}</span>
      </div>

      <div style={{ background:'#161B22', border:'1px solid #30363D', overflow:'hidden' }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #30363D', background: theme.bg }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:"'Inter', sans-serif", fontSize:18, fontWeight:600, color:'#E6EDF3', letterSpacing:'-0.01em' }}>Week {activeWeek} — {WEEK_LABELS[activeWeek]}</div>
              <div style={{ fontSize:12, marginTop:4, color: pct === 100 ? '#3FB950' : '#8B949E', fontFamily:"'Inter', sans-serif" }}>
                {pct === 100 ? '✓ All lessons complete' : `${watched} of ${total} lessons completed`}
              </div>
            </div>
            {total > 0 && (
              <div style={{ fontFamily:"'Inter', sans-serif", fontSize:28, fontWeight:600, color: pct === 100 ? '#3FB950' : theme.color, lineHeight:1 }}>{pct}%</div>
            )}
          </div>
          {total > 0 && (
            <div style={{ height:2, background:'#30363D' }}>
              <div style={{ width:`${pct}%`, height:'100%', background: pct === 100 ? '#3FB950' : theme.color, transition:'width 0.4s ease' }}/>
            </div>
          )}
        </div>

        {/* Foundation prerequisites */}
        {foundations.length > 0 && (
          <>
            <SectionLabel label="PREREQUISITES"/>
            {foundations.map((l, i) => (
              <LessonRow key={l.id} l={l} last={i === foundations.length - 1 && dailies.length === 0}/>
            ))}
          </>
        )}

        {/* Daily lessons */}
        {dailies.length > 0 && (
          <>
            {foundations.length > 0 && <SectionLabel label="DAILY LESSONS"/>}
            {dailies.map((l, i) => (
              <LessonRow key={l.id} l={l} last={i === dailies.length - 1}/>
            ))}
          </>
        )}

        {weekLessons.length === 0 && (
          <div style={{ padding:48, textAlign:'center', color:'#6E7681' }}>
            <BookOpen size={32} style={{ opacity:0.3, marginBottom:12 }}/>
            <p style={{ fontSize:14 }}>No lessons for this week yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Reading view — full content ───────────────────────────────────────────────
function ReadingView({ lesson, onBack, onMarkDone, isPending, weekLessons, onSelectLesson }) {
  const currentIndex = weekLessons.findIndex(l => l.id === lesson.id)
  const prev = weekLessons[currentIndex - 1] || null
  const next = weekLessons[currentIndex + 1] || null
  const segments = parseSegments(lesson.description || '')
  const theme = WEEK_THEMES[lesson.week]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 112px)', background:'#161B22', border:'1px solid #30363D', overflow:'hidden' }}>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 28px', borderBottom:'1px solid #30363D', background:'#161B22', flexShrink:0 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:'1px solid #30363D', background:'#21262D', color:'#8B949E', fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:"'Inter', sans-serif", flexShrink:0 }}>
          <ArrowLeft size={13}/> Week {lesson.week}
        </button>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:10, fontWeight:600, color:'#6E7681', letterSpacing:'0.1em', marginBottom:3, fontFamily:"'Inter', sans-serif" }}>
            {theme.emoji} WEEK {lesson.week} · {lesson.lessonCode} · {currentIndex + 1} of {weekLessons.length}
          </div>
          <div style={{ fontFamily:"'Inter', sans-serif", fontSize:17, fontWeight:600, color:'#E6EDF3', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', letterSpacing:'-0.01em' }}>{lesson.title}</div>
        </div>

        <button
          onClick={() => onMarkDone(lesson.id)}
          disabled={isPending || lesson.watched}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', border:'none', cursor: lesson.watched ? 'default' : 'pointer', background: lesson.watched ? 'rgba(63,185,80,0.12)' : '#3B82F6', color: lesson.watched ? '#3FB950' : '#0D1117', fontWeight:700, fontSize:12, whiteSpace:'nowrap', flexShrink:0, letterSpacing:'0.04em', fontFamily:"'Inter', sans-serif" }}
        >
          <CheckCircle size={14}/>
          {lesson.watched ? 'Completed' : isPending ? 'Saving…' : 'Mark as Complete'}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'36px 72px' }}>
        {lesson.description ? (
          <div style={{ maxWidth:800, margin:'0 auto', fontFamily:"'Inter', sans-serif" }}>
            {segments.map((seg, i) =>
              seg.type === 'block'
                ? <CodeBlock key={i} blockType={seg.blockType} code={seg.code}/>
                : renderTextLine(seg.line, i)
            )}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:64, color:'#6E7681' }}>
            <BookOpen size={40} style={{ marginBottom:14, opacity:0.3 }}/>
            <p style={{ fontSize:15 }}>Content coming soon for this lesson.</p>
          </div>
        )}

        {/* Prev / Next navigation */}
        <div style={{ maxWidth:800, margin:'48px auto 0', display:'flex', justifyContent:'space-between', gap:12, paddingTop:28, borderTop:'1px solid #30363D' }}>
          {prev ? (
            <button onClick={() => onSelectLesson(prev.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 20px', border:'1px solid #30363D', background:'#21262D', cursor:'pointer', color:'#8B949E', fontSize:12, fontWeight:500, fontFamily:"'Inter', sans-serif" }}>
              <ChevronLeft size={16} color="#3B82F6"/>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontSize:10, color:'#6E7681', marginBottom:2 }}>PREVIOUS</div>
                <div>{prev.title}</div>
              </div>
            </button>
          ) : <div/>}

          {next ? (
            <button onClick={() => onSelectLesson(next.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 20px', border:'1px solid #30363D', background:'#21262D', cursor:'pointer', color:'#8B949E', fontSize:12, fontWeight:500, fontFamily:"'Inter', sans-serif" }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:10, color:'#6E7681', marginBottom:2 }}>NEXT</div>
                <div>{next.title}</div>
              </div>
              <ChevronRight size={16} color="#3B82F6"/>
            </button>
          ) : (
            <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', border:'none', background:'#3B82F6', cursor:'pointer', color:'#fff', fontSize:12, fontWeight:700, fontFamily:"'Inter', sans-serif", letterSpacing:'0.04em' }}>
              <CheckCircle size={15}/> Back to Week {lesson.week}
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
  const [view, setView]               = useState('map')    // 'map' | 'browse' | 'reading'
  const [activeWeek, setActiveWeek]   = useState(null)
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

  const handleSelectWeek = (w) => {
    setActiveWeek(w)
    setView('browse')
  }

  const handleSelectLesson = (id) => {
    setActiveLessonId(id)
    setView('reading')
  }

  const handleBackFromReading = () => {
    setActiveLessonId(null)
    setView('browse')
  }

  const handleBackToMap = () => {
    setActiveLessonId(null)
    setActiveWeek(null)
    setView('map')
  }

  return (
    <DashboardLayout title="Lessons">
      {view === 'map' && (
        <MapView
          byWeek={byWeek}
          maxUnlockedWeek={maxUnlockedWeek}
          onSelectWeek={handleSelectWeek}
        />
      )}
      {view === 'browse' && (
        <BrowseView
          activeWeek={activeWeek}
          weekLessons={weekLessons}
          onSelectLesson={handleSelectLesson}
          onBackToMap={handleBackToMap}
        />
      )}
      {view === 'reading' && activeLesson && (
        <ReadingView
          lesson={activeLesson}
          onBack={handleBackFromReading}
          onMarkDone={(id) => watchMutation.mutate(id)}
          isPending={watchMutation.isPending}
          weekLessons={weekLessons}
          onSelectLesson={handleSelectLesson}
        />
      )}
    </DashboardLayout>
  )
}
