import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../hooks/useTheme'
import api from '../lib/api'
import {
  BookOpen, GitMerge, Star, ArrowRight, AlertCircle,
  TrendingUp, Zap, ChevronRight, Code2, Flame,
  Terminal, Target, Trophy, Play, Lock,
} from 'lucide-react'

const TOTAL_WEEKS = 12

const WEEK_FOCUS = [
  '', // 0
  { focus: 'Terminal, Git & JavaScript Fundamentals', milestone: 'Push your first commit', emoji: '⚡' },
  { focus: 'Node.js, Express & PostgreSQL',           milestone: 'Ship your first API',    emoji: '🛠' },
  { focus: 'React — Components & State',              milestone: 'Build your first UI',     emoji: '⚛️' },
  { focus: 'Authentication & Mini Lead Manager',      milestone: 'Implement JWT auth',      emoji: '🔐' },
  { focus: 'Restaurant Flow — Core Features',         milestone: 'Launch Project 1',        emoji: '🍽️' },
  { focus: 'Restaurant Flow — Razorpay & Socket.io',  milestone: 'Live payments working',   emoji: '💳' },
  { focus: 'Lead Bill — GST Billing & PDF',           milestone: 'Generate first invoice',  emoji: '🧾' },
  { focus: 'Lead Bill — Cloudinary & Features',       milestone: 'File uploads live',       emoji: '☁️' },
  { focus: 'Lead Bill — Polish & Deploy',             milestone: 'Ship to production',      emoji: '🚀' },
  { focus: 'ClientDesk AI — Claude API & CI/CD',      milestone: 'AI feature shipped',      emoji: '🤖' },
  { focus: 'ClientDesk AI — GitHub Actions & Polish', milestone: 'CI/CD pipeline live',     emoji: '⚙️' },
  { focus: 'Career Week — Portfolio & Interviews',    milestone: 'Land your first offer',   emoji: '🎯' },
]

function formatPlan(plan) {
  if (!plan) return 'DevForge'
  if (plan === 'LIVE_COHORT') return 'Live Batch'
  if (plan === 'SELF_PACED')  return 'Self-Paced'
  if (plan === 'MENTORED')    return 'Mentored'
  return plan.replace(/_/g, ' ')
}

function useCount(target, duration = 1000) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect() }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started || !target) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const t = Math.min((now - t0) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(ease * target))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setVal(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target, duration])
  return [ref, val]
}

function Spinner() {
  const C = useTheme()
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
      <div style={{ width:28, height:28, border:`2px solid ${C.border}`, borderTop:`2px solid ${C.accent}`, borderRadius:'50%', animation:'dfSpin 0.8s linear infinite' }}/>
      <style>{`@keyframes dfSpin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}

// ─── First Mission card (shown only on day 1 / zero progress) ─────────────────
function FirstMission({ week, navigate }) {
  const C = useTheme()
  const w = WEEK_FOCUS[week] || WEEK_FOCUS[1]
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.surface} 0%, ${C.accent}14 100%)`,
      border: `1px solid ${C.accent}44`,
      borderLeft: `3px solid ${C.accent}`,
      padding: '28px 32px',
      marginBottom: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle, ${C.accent}12 0%, transparent 70%)`, pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <div style={{ background:`${C.accent}22`, border:`1px solid ${C.accent}44`, padding:'3px 10px', display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:C.accent, boxShadow:`0 0 6px ${C.accent}`, animation:'pulse 1.5s infinite' }}/>
              <span style={{ fontSize:9, fontWeight:800, color:C.accent, letterSpacing:'0.12em', fontFamily:'JetBrains Mono,monospace' }}>YOUR FIRST MISSION</span>
            </div>
          </div>

          <div style={{ fontSize:22, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif", marginBottom:8, letterSpacing:'-0.01em' }}>
            {w.emoji} Week {week} — {w.focus}
          </div>
          <div style={{ fontSize:13, color:C.text2, fontFamily:"'Inter', sans-serif", marginBottom:20, lineHeight:1.6 }}>
            Your goal this week: <span style={{ color:C.yellow, fontWeight:600 }}>{w.milestone}</span>. Start with Day 1 — it's already unlocked and waiting.
          </div>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button
              onClick={() => navigate('/lessons')}
              style={{ display:'flex', alignItems:'center', gap:8, background:C.accent, border:'none', cursor:'pointer', padding:'11px 22px', color:'#fff', fontWeight:700, fontSize:12, fontFamily:"'Inter', sans-serif", letterSpacing:'0.02em', transition:'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Play size={13}/> Start Week {week} Lessons
            </button>
            <button
              onClick={() => navigate('/tasks')}
              style={{ display:'flex', alignItems:'center', gap:8, background:'transparent', border:`1px solid ${C.border2}`, cursor:'pointer', padding:'11px 22px', color:C.text2, fontWeight:600, fontSize:12, fontFamily:"'Inter', sans-serif", transition:'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.text }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.text2 }}
            >
              <Terminal size={13}/> View Your Tickets
            </button>
          </div>
        </div>

        {/* Roadmap preview */}
        <div style={{ flexShrink:0, display:'flex', flexDirection:'column', gap:6, minWidth:180 }}>
          <div style={{ fontSize:9, fontWeight:700, color:C.text3, letterSpacing:'0.12em', fontFamily:'JetBrains Mono,monospace', marginBottom:4 }}>WHAT YOU'LL BUILD</div>
          {[
            { label:'Restaurant Flow',  weeks:'W5–6',   color:C.green,  locked:false },
            { label:'Lead Bill SaaS',   weeks:'W7–9',   color:C.cyan,   locked:true  },
            { label:'ClientDesk AI',    weeks:'W10–11', color:C.purple, locked:true  },
          ].map(p => (
            <div key={p.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 12px', background:`${p.color}0A`, border:`1px solid ${p.color}${p.locked ? '22':'44'}`, opacity: p.locked ? 0.5 : 1 }}>
              {p.locked ? <Lock size={9} color={C.text3}/> : <Trophy size={9} color={p.color}/>}
              <span style={{ fontSize:11, fontWeight:600, color: p.locked ? C.text3 : p.color, fontFamily:"'Inter', sans-serif" }}>{p.label}</span>
              <span style={{ fontSize:9, color:C.text3, fontFamily:'JetBrains Mono,monospace', marginLeft:'auto' }}>{p.weeks}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Hero banner ──────────────────────────────────────────────────────────────
function HeroBanner({ student, weekPct, firstName }) {
  const C = useTheme()
  const w = WEEK_FOCUS[student.currentWeek] || WEEK_FOCUS[1]
  const isActive = student.currentWeek > 1 || weekPct > 0

  return (
    <div style={{
      position:'relative', background:C.bg, border:`1px solid ${C.border}`,
      borderTop:`2px solid ${C.accent}`, padding:'28px 32px', marginBottom:20,
      overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'space-between', gap:32,
    }}>
      <div style={{ position:'absolute', right:-60, top:-60, width:320, height:320, background:`radial-gradient(circle, ${C.accent}15 0%, transparent 65%)`, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', left:0, bottom:0, right:0, height:1, background:`linear-gradient(90deg, ${C.accent}55, transparent 60%)` }}/>

      <div style={{ position:'relative', zIndex:1, flex:1 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, border:`1px solid ${C.border2}`, padding:'4px 14px', marginBottom:16, fontFamily:'JetBrains Mono, monospace', fontSize:10, fontWeight:700, color:C.text3, letterSpacing:'0.1em' }}>
          <span style={{ width:6, height:6, background:C.green, borderRadius:'50%', boxShadow:`0 0 6px ${C.green}` }}/>
          {student.cohort ? student.cohort.replace(/cohort/i, 'Batch') : 'Batch 3'} · {formatPlan(student.plan)}
        </div>

        <div style={{ fontSize:11, color:C.text3, marginBottom:6, letterSpacing:'0.04em', fontFamily:"'Inter', sans-serif" }}>
          <span style={{ color:C.accent, fontFamily:'JetBrains Mono,monospace' }}>// </span>
          week {student.currentWeek} of {TOTAL_WEEKS}
        </div>
        <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:32, fontWeight:700, color:C.text, letterSpacing:'-0.02em', margin:'0 0 6px', lineHeight:1.1 }}>
          Welcome back, <span style={{ color:C.accent }}>{firstName}</span>
        </h2>

        <div style={{ fontSize:12, color:C.text2, fontFamily:"'Inter', sans-serif", marginBottom:20 }}>
          {w.emoji} This week — <span style={{ color:C.text, fontWeight:600 }}>{w.focus}</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ position:'relative', width:220, height:5, background:C.border, overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, width:`${weekPct}%`, background:`linear-gradient(90deg, ${C.accent}, ${C.cyan})`, transition:'width 0.8s ease', boxShadow:`0 0 8px ${C.accent}88` }}/>
          </div>
          <span style={{ fontSize:11, fontWeight:700, color:C.accent, fontFamily:'JetBrains Mono,monospace', whiteSpace:'nowrap' }}>
            {student.currentWeek} / {TOTAL_WEEKS}
          </span>
          <span style={{ fontSize:11, color:C.text3, fontFamily:"'Inter', sans-serif" }}>
            {TOTAL_WEEKS - student.currentWeek} weeks left
          </span>
        </div>
      </div>

      <div style={{ textAlign:'center', flexShrink:0, position:'relative', zIndex:1 }}>
        <ProgressRing pct={weekPct} size={100}/>
        <div style={{ fontSize:9, color:C.text3, marginTop:8, fontWeight:700, letterSpacing:'0.1em', fontFamily:"'Inter', sans-serif" }}>PROGRAM PROGRESS</div>
        {isActive && (
          <div style={{ marginTop:10, fontSize:10, color:C.yellow, fontFamily:'JetBrains Mono,monospace', fontWeight:700 }}>
            🏆 {w.milestone}
          </div>
        )}
      </div>
    </div>
  )
}

function ProgressRing({ pct, size = 96 }) {
  const C = useTheme()
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter:`drop-shadow(0 0 8px ${C.accent}55)` }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.accent} strokeWidth={6} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4} strokeLinecap="round" style={{ transition:'stroke-dasharray 0.8s ease' }}/>
      <text x={size/2} y={size/2-4} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.text} fontFamily="Inter,sans-serif">{pct}%</text>
      <text x={size/2} y={size/2+13} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.text3} fontFamily="Inter,sans-serif" letterSpacing="1">DONE</text>
    </svg>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, rawValue, suffix = '', accent, sub, emptyMsg }) {
  const C = useTheme()
  const numVal = typeof rawValue === 'number' ? rawValue : null
  const [ref, count] = useCount(numVal || 0)
  const isEmpty = numVal === 0

  return (
    <div ref={ref} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${accent}`, padding:'22px 24px', cursor:'default', transition:'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = C.surface2}
      onMouseLeave={e => e.currentTarget.style.background = C.surface}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <span style={{ fontSize:10, fontWeight:700, color:C.text3, letterSpacing:'0.1em', fontFamily:"'Inter', sans-serif" }}>{label}</span>
        <div style={{ width:28, height:28, background:`${accent}18`, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${accent}33` }}>
          <Icon size={13} color={accent}/>
        </div>
      </div>
      <div style={{ fontSize:36, fontWeight:700, color: isEmpty ? C.text3 : C.text, letterSpacing:'-0.03em', fontFamily:"'Inter', sans-serif", lineHeight:1 }}>
        {numVal !== null ? `${count}${suffix}` : (rawValue ?? '—')}
      </div>
      <div style={{ fontSize:11, color: isEmpty ? `${accent}99` : C.text3, marginTop:8, fontFamily:"'Inter', sans-serif" }}>
        {isEmpty && emptyMsg ? emptyMsg : sub}
      </div>
    </div>
  )
}

// ─── Active tickets ───────────────────────────────────────────────────────────
function TicketCard({ ticket: t }) {
  const C = useTheme()
  const P_COLOR = { HIGH: C.red, MEDIUM: C.accent, LOW: C.green }
  const STATUS_MAP = {
    UPCOMING:  { color:C.text3,  dot:'#6E7681', label:'Todo'        },
    ACTIVE:    { color:C.yellow, dot:C.yellow,  label:'In Progress' },
    IN_REVIEW: { color:C.purple, dot:C.purple,  label:'In Review'   },
    REVIEWED:  { color:C.green,  dot:C.green,   label:'Done'        },
  }
  const pColor = P_COLOR[t.priority] || C.border2
  const s = STATUS_MAP[t.submissionStatus || t.status] || STATUS_MAP.UPCOMING
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${pColor}`, padding:'16px 20px', transition:'background 0.1s', cursor:'pointer', display:'flex', flexDirection:'column', gap:10 }}
      onMouseEnter={e => e.currentTarget.style.background = C.surface2}
      onMouseLeave={e => e.currentTarget.style.background = C.surface}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:C.text3, marginBottom:5, fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.06em' }}>{t.ticketCode} · Week {t.week}</div>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, lineHeight:1.35, fontFamily:"'Inter', sans-serif" }}>{t.title}</div>
        </div>
        <span style={{ fontSize:9, fontWeight:700, color:P_COLOR[t.priority]||C.text3, border:`1px solid ${(P_COLOR[t.priority]||C.text3)}55`, padding:'2px 8px', fontFamily:'JetBrains Mono,monospace', flexShrink:0 }}>{t.priority}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:s.dot, boxShadow:`0 0 4px ${s.dot}` }}/>
          <span style={{ fontSize:11, fontWeight:600, color:s.color, fontFamily:"'Inter', sans-serif" }}>{s.label}</span>
        </div>
        <span style={{ fontSize:10, color:C.text3, fontFamily:'JetBrains Mono,monospace', border:`1px solid ${C.border}`, padding:'2px 7px' }}>{t.storyPoints} pts</span>
      </div>
    </div>
  )
}

// ─── Empty tickets state ──────────────────────────────────────────────────────
function EmptyTickets({ week, navigate }) {
  const C = useTheme()
  return (
    <div style={{ background:C.surface, border:`1px dashed ${C.border2}`, padding:'32px 24px', textAlign:'center' }}>
      <div style={{ width:44, height:44, background:`${C.accent}12`, border:`1px solid ${C.accent}33`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
        <Target size={18} color={C.accent}/>
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6, fontFamily:"'Inter', sans-serif" }}>No tickets in review yet</div>
      <div style={{ fontSize:12, color:C.text3, fontFamily:"'Inter', sans-serif", marginBottom:20, lineHeight:1.6 }}>
        Complete the Week {week} lesson, then submit your first PR to unlock tickets.
      </div>
      <button
        onClick={() => navigate('/lessons')}
        style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.accent, border:'none', cursor:'pointer', padding:'10px 20px', color:'#fff', fontWeight:700, fontSize:12, fontFamily:"'Inter', sans-serif", transition:'opacity 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity='1'}
      >
        <BookOpen size={13}/> Go to Lessons <ArrowRight size={13}/>
      </button>
    </div>
  )
}

// ─── Active PRs sidebar ───────────────────────────────────────────────────────
function ActivePRs({ tickets }) {
  const C = useTheme()
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, background:C.surface2, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:tickets.length ? C.accent : C.text3, boxShadow: tickets.length ? `0 0 6px ${C.accent}` : 'none', animation: tickets.length ? 'pulse 1.5s infinite' : 'none' }}/>
          <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif" }}>Active PRs</span>
        </div>
        <span style={{ fontSize:11, fontWeight:700, color:C.accent, fontFamily:'JetBrains Mono,monospace', border:`1px solid ${C.border2}`, padding:'1px 8px' }}>{tickets.length}</span>
      </div>
      {tickets.length === 0 ? (
        <div style={{ padding:'24px 20px', textAlign:'center' }}>
          <div style={{ fontSize:12, color:C.text3, fontFamily:"'Inter', sans-serif", lineHeight:1.7 }}>
            No PRs in review yet.<br/>
            <span style={{ color:C.accent, fontWeight:600 }}>Submit your first PR</span> to get AI feedback.
          </div>
        </div>
      ) : tickets.map((t, i) => (
        <div key={t.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 20px', borderBottom: i < tickets.length-1 ? `1px solid ${C.border}` : 'none', transition:'background 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.background=C.surface2}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          <span style={{ width:6, height:6, borderRadius:'50%', background:C.purple, flexShrink:0, marginTop:5 }}/>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:C.text2, fontFamily:"'Inter', sans-serif", lineHeight:1.4 }}>{t.title}</div>
            <div style={{ fontSize:10, color:C.text3, marginTop:3, fontFamily:'JetBrains Mono,monospace' }}>{t.ticketCode} · IN REVIEW</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Announcements ────────────────────────────────────────────────────────────
function Announcements({ announcements }) {
  const C = useTheme()
  const typeColor = { GENERAL:C.accent, IMPORTANT:C.yellow, EVENT:C.green, WARNING:C.red, SPRINT:C.purple, SESSION:C.cyan, UPDATE:C.yellow }
  if (!announcements?.length) return null
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, background:C.surface2, display:'flex', alignItems:'center', gap:8 }}>
        <Zap size={12} color={C.yellow}/>
        <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif" }}>Announcements</span>
      </div>
      {announcements.slice(0,3).map((a, i) => {
        const color = typeColor[a.type] || C.accent
        return (
          <div key={a.id} style={{ padding:'12px 20px', borderBottom: i < Math.min(announcements.length,3)-1 ? `1px solid ${C.border}` : 'none', borderLeft:`3px solid ${color}`, transition:'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background=C.surface2}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <div style={{ fontSize:13, fontWeight:600, color:C.text2, marginBottom:3, fontFamily:"'Inter', sans-serif" }}>{a.title}</div>
            <div style={{ fontSize:9, color:C.text3, letterSpacing:'0.08em', fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase' }}>{a.type} · {a.audience||'All'}</div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Pace predictor ──────────────────────────────────────────────────────────
function PacePredictor({ stats, student }) {
  const C = useTheme()
  const { currentWeek } = student
  const { lessonsWatched } = stats
  if (lessonsWatched === 0) return null

  const weeksElapsed = Math.max(1, currentWeek - 1)
  const expectedLessons = weeksElapsed * 5
  const diff = lessonsWatched - expectedLessons
  const weeklyRate = lessonsWatched / weeksElapsed
  const weeksToFinish = Math.ceil((60 - lessonsWatched) / Math.max(0.5, weeklyRate))
  const projectedFinishWeek = Math.min(currentWeek + weeksToFinish - 1, 12)

  let status, color, msg
  if (Math.abs(diff) <= 2) { status = 'ON TRACK';  color = C.green;  msg = "You're keeping pace well — stay consistent!" }
  else if (diff > 0)        { status = 'AHEAD';     color = C.cyan;   msg = `${diff} lessons ahead of schedule — great momentum` }
  else                      { status = 'BEHIND';    color = C.yellow; msg = `${Math.abs(diff)} lessons behind — one focused session this week will catch you up` }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        <TrendingUp size={12} color={color}/>
        <span style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>PACE: {status}</span>
      </div>
      <div style={{ fontSize: 12, color: C.text2, flex: 1, fontFamily: "'Inter', sans-serif" }}>{msg}</div>
      <div style={{ fontSize: 11, color: C.text3, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
        Est. finish: <span style={{ color: C.accent, fontWeight: 700 }}>Week {projectedFinishWeek}</span>
      </div>
    </div>
  )
}

// ─── Quick actions ────────────────────────────────────────────────────────────
function QuickActions({ week, navigate }) {
  const C = useTheme()
  const actions = [
    { icon:Code2,    label:'Submit PR',    sub:`Week ${week} submission`, color:C.accent,  onClick:() => navigate('/tasks')    },
    { icon:BookOpen, label:'This Week',    sub:'Continue lesson',         color:C.green,   onClick:() => navigate('/lessons')  },
    { icon:Flame,    label:'Join Discord', sub:'Get unblocked fast',      color:C.purple,  onClick:() => window.open('https://discord.gg/XxFSFdHTU','_blank') },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:C.border, border:`1px solid ${C.border}` }}>
      {actions.map(l => (
        <button key={l.label} onClick={l.onClick} style={{ background:C.surface, display:'flex', flexDirection:'column', gap:6, padding:'16px 18px', border:'none', cursor:'pointer', textAlign:'left', transition:'background 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.background=C.surface2}
          onMouseLeave={e => e.currentTarget.style.background=C.surface}
        >
          <div style={{ width:30, height:30, background:`${l.color}18`, border:`1px solid ${l.color}33`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4 }}>
            <l.icon size={13} color={l.color}/>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif" }}>{l.label}</div>
          <div style={{ fontSize:10, color:C.text3, fontFamily:"'Inter', sans-serif" }}>{l.sub}</div>
        </button>
      ))}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const C       = useTheme()
  const user    = useAuthStore(s => s.user)
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn:  () => api.get('/student/dashboard').then(r => r.data),
  })

  if (isLoading) return <DashboardLayout title="Dashboard"><Spinner/></DashboardLayout>
  if (isError)   return (
    <DashboardLayout title="Dashboard">
      <div style={{ background:C.surface, border:`1px solid ${C.red}`, padding:'14px 20px', color:C.red, display:'flex', alignItems:'center', gap:10, fontSize:13, fontFamily:"'Inter', sans-serif" }}>
        <AlertCircle size={15}/> Failed to load dashboard. Is the API running?
      </div>
    </DashboardLayout>
  )

  const { student, stats, activeTickets, announcements } = data
  const firstName   = user?.name?.split(' ')[0] ?? 'Developer'
  const weekPct     = Math.round(((student.currentWeek - 1) / TOTAL_WEEKS) * 100)
  const isNewStudent = student.currentWeek === 1 && stats.lessonsWatched === 0 && stats.mergedPRs === 0

  return (
    <DashboardLayout title="Dashboard">
      <style>{`@keyframes dfSpin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      <HeroBanner student={student} weekPct={weekPct} firstName={firstName}/>

      {isNewStudent && <FirstMission week={student.currentWeek} navigate={navigate}/>}

      <PacePredictor stats={stats} student={student}/>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:C.border, border:`1px solid ${C.border}`, marginBottom:20 }}>
        <StatCard icon={TrendingUp} label="CURRENT WEEK" rawValue={student.currentWeek} suffix={`/${TOTAL_WEEKS}`} accent={C.accent}  sub="weeks into the program"/>
        <StatCard icon={BookOpen}   label="LESSONS DONE" rawValue={stats.lessonsWatched}                           accent={C.cyan}    sub="lessons completed"      emptyMsg="Start Week 1 to unlock →"/>
        <StatCard icon={GitMerge}   label="SUBMITTED"    rawValue={stats.mergedPRs}                                accent={C.green}   sub="assignments submitted"  emptyMsg="Submit your first assignment →"/>
        <StatCard icon={Star}       label="AVG GRADE"    rawValue={typeof stats.avgGrade === 'number' && stats.avgGrade > 0 ? stats.avgGrade : 0} accent={C.yellow} sub="out of 100 points" emptyMsg="Grade appears after first PR"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif" }}>Active Tickets</span>
                <span style={{ fontSize:10, fontWeight:700, color:C.accent, border:`1px solid ${C.border2}`, padding:'1px 8px', fontFamily:'JetBrains Mono,monospace' }}>{activeTickets.length}</span>
              </div>
              <button onClick={() => navigate('/tasks')} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:C.text3, background:'none', border:'none', cursor:'pointer', fontFamily:"'Inter', sans-serif", transition:'color 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.color=C.text}
                onMouseLeave={e => e.currentTarget.style.color=C.text3}
              >View all <ChevronRight size={12}/></button>
            </div>

            {activeTickets.length === 0
              ? <EmptyTickets week={student.currentWeek} navigate={navigate}/>
              : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>{activeTickets.map(t => <TicketCard key={t.id} ticket={t}/>)}</div>
            }
          </div>

          <QuickActions week={student.currentWeek} navigate={navigate}/>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <ActivePRs tickets={activeTickets}/>
          <Announcements announcements={announcements}/>
        </div>
      </div>
    </DashboardLayout>
  )
}
