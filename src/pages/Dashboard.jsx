import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import {
  BookOpen, GitMerge, Star, ArrowRight, Clock,
  AlertCircle, CheckCircle, TrendingUp, Target,
  Zap, ChevronRight, Code2, Flame,
} from 'lucide-react'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:      '#0D1117',
  surface: '#161B22',
  surface2:'#21262D',
  border:  '#30363D',
  border2: '#3D444D',
  text:    '#E6EDF3',
  text2:   '#8B949E',
  text3:   '#6E7681',
  accent:  '#3B82F6',
  green:   '#3FB950',
  red:     '#F85149',
  yellow:  '#E3B341',
  purple:  '#A78BFA',
  cyan:    '#22D3EE',
}

const TOTAL_WEEKS = 12

function formatPlan(plan) {
  if (!plan) return 'DevForge'
  if (plan === 'SOLO') return 'Solo Plan'
  if (plan === 'COHORT') return 'Cohort Plan'
  if (plan.includes('PLACEMENT') || plan.includes('1_1')) return '1:1 Placement'
  return plan.replace(/_/g, ' ')
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCount(target, duration = 1200) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect() }
    }, { threshold: 0.5 })
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

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
      <div style={{
        width:28, height:28,
        border:`2px solid ${C.border}`,
        borderTop:`2px solid ${C.accent}`,
        borderRadius:'50%',
        animation:'dfSpin 0.8s linear infinite',
      }}/>
      <style>{`@keyframes dfSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 96 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter:`drop-shadow(0 0 8px ${C.accent}55)` }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={6}/>
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={C.accent} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition:'stroke-dasharray 0.8s ease' }}
      />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.text} fontFamily="Inter,sans-serif">{pct}%</text>
      <text x={size/2} y={size/2 + 13} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.text3} fontFamily="Inter,sans-serif" letterSpacing="1">DONE</text>
    </svg>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroBanner({ student, weekPct, firstName }) {
  return (
    <div style={{
      position:'relative',
      background: C.bg,
      border:`1px solid ${C.border}`,
      borderTop:`2px solid ${C.accent}`,
      padding:'32px 36px',
      marginBottom:20,
      overflow:'hidden',
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      gap:32,
    }}>
      {/* Background glow */}
      <div style={{
        position:'absolute', right:-60, top:-60,
        width:320, height:320,
        background:`radial-gradient(circle, ${C.accent}18 0%, transparent 65%)`,
        pointerEvents:'none',
      }}/>
      <div style={{
        position:'absolute', left:0, bottom:0, right:0,
        height:1,
        background:`linear-gradient(90deg, ${C.accent}55, transparent 60%)`,
      }}/>

      {/* Left */}
      <div style={{ position:'relative', zIndex:1 }}>
        {/* Cohort badge */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          border:`1px solid ${C.border2}`,
          padding:'4px 14px', marginBottom:18,
          fontFamily:'JetBrains Mono, monospace',
          fontSize:10, fontWeight:700, color:C.text3,
          letterSpacing:'0.1em',
        }}>
          <span style={{ width:6, height:6, background:C.green, borderRadius:'50%', boxShadow:`0 0 6px ${C.green}` }}/>
          {student.cohort} · {formatPlan(student.plan)}
        </div>

        <div style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:C.text3, marginBottom:6, letterSpacing:'0.04em' }}>
          <span style={{ color:C.accent, fontFamily:'JetBrains Mono,monospace' }}>// </span>
          week {student.currentWeek} of {TOTAL_WEEKS} · keep building
        </div>
        <h2 style={{
          fontFamily:"'Inter', sans-serif",
          fontSize:34, fontWeight:700,
          color:C.text, letterSpacing:'-0.02em',
          margin:'0 0 24px', lineHeight:1.1,
        }}>
          Welcome back,{' '}
          <span style={{ color:C.accent }}>{firstName}</span>
        </h2>

        {/* Progress bar */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:6 }}>
          <div style={{ position:'relative', width:240, height:6, background:C.border, overflow:'hidden' }}>
            <div style={{
              position:'absolute', inset:0,
              width:`${weekPct}%`,
              background:`linear-gradient(90deg, ${C.accent}, ${C.cyan})`,
              transition:'width 0.8s ease',
              boxShadow:`0 0 8px ${C.accent}88`,
            }}/>
          </div>
          <span style={{ fontSize:11, fontWeight:700, color:C.accent, fontFamily:'JetBrains Mono,monospace', whiteSpace:'nowrap' }}>
            {student.currentWeek} / {TOTAL_WEEKS}
          </span>
        </div>
        <div style={{ fontSize:11, color:C.text3, fontFamily:"'Inter', sans-serif" }}>
          {TOTAL_WEEKS - student.currentWeek} weeks remaining
        </div>
      </div>

      {/* Right — progress ring */}
      <div style={{ textAlign:'center', flexShrink:0, position:'relative', zIndex:1 }}>
        <ProgressRing pct={weekPct} size={100}/>
        <div style={{ fontSize:9, color:C.text3, marginTop:8, fontWeight:700, letterSpacing:'0.1em', fontFamily:"'Inter', sans-serif" }}>
          PROGRAM PROGRESS
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, rawValue, suffix = '', accent, sub }) {
  const numVal = typeof rawValue === 'number' ? rawValue : null
  const [ref, count] = useCount(numVal || 0)
  const display = numVal !== null ? `${count}${suffix}` : (rawValue ?? '—')

  return (
    <div ref={ref} style={{
      background: C.surface,
      border:`1px solid ${C.border}`,
      borderTop:`2px solid ${accent}`,
      padding:'22px 24px',
      transition:'border-color 0.15s, background 0.15s',
      cursor:'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = C.surface2; e.currentTarget.style.borderColor = accent }}
    onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.border }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <span style={{ fontSize:10, fontWeight:700, color:C.text3, letterSpacing:'0.1em', fontFamily:"'Inter', sans-serif" }}>
          {label}
        </span>
        <div style={{
          width:28, height:28,
          background:`${accent}18`,
          display:'flex', alignItems:'center', justifyContent:'center',
          border:`1px solid ${accent}33`,
        }}>
          <Icon size={13} color={accent}/>
        </div>
      </div>
      <div style={{ fontSize:36, fontWeight:700, color:C.text, letterSpacing:'-0.03em', fontFamily:"'Inter', sans-serif", lineHeight:1 }}>
        {display}
      </div>
      {sub && (
        <div style={{ fontSize:11, color:C.text3, marginTop:8, fontFamily:"'Inter', sans-serif" }}>{sub}</div>
      )}
    </div>
  )
}

// ─── Priority / Status ────────────────────────────────────────────────────────
const P_COLOR = { HIGH: C.red, MEDIUM: C.accent, LOW: C.green }

function PriorityBadge({ priority }) {
  const color = P_COLOR[priority] || C.text3
  return (
    <span style={{
      fontSize:9, fontWeight:700, letterSpacing:'0.1em',
      color, border:`1px solid ${color}55`,
      padding:'2px 8px', fontFamily:'JetBrains Mono,monospace',
    }}>{priority}</span>
  )
}

const STATUS_MAP = {
  UPCOMING:  { color: C.text3,   dot:'#6E7681', label:'Todo'        },
  ACTIVE:    { color: C.yellow,  dot:C.yellow,  label:'In Progress' },
  IN_REVIEW: { color: C.purple,  dot:C.purple,  label:'In Review'   },
  REVIEWED:  { color: C.green,   dot:C.green,   label:'Done'        },
}

function StatusDot({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.UPCOMING
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.dot, flexShrink:0, boxShadow:`0 0 4px ${s.dot}` }}/>
      <span style={{ fontSize:11, fontWeight:600, color:s.color, fontFamily:"'Inter', sans-serif" }}>{s.label}</span>
    </div>
  )
}

// ─── Ticket Card ──────────────────────────────────────────────────────────────
function TicketCard({ ticket: t }) {
  const pColor = P_COLOR[t.priority] || C.border2
  return (
    <div style={{
      background: C.surface,
      border:`1px solid ${C.border}`,
      borderLeft:`3px solid ${pColor}`,
      padding:'16px 20px',
      transition:'background 0.1s, border-color 0.1s',
      cursor:'pointer',
      display:'flex', flexDirection:'column', gap:10,
    }}
    onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.borderColor=pColor }}
    onMouseLeave={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.borderLeftColor=pColor }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:C.text3, marginBottom:5, fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.06em' }}>
            {t.ticketCode} · Week {t.week}
          </div>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, lineHeight:1.35, fontFamily:"'Inter', sans-serif" }}>
            {t.title}
          </div>
        </div>
        <PriorityBadge priority={t.priority}/>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <StatusDot status={t.status}/>
        <span style={{ fontSize:10, color:C.text3, fontFamily:'JetBrains Mono,monospace', border:`1px solid ${C.border}`, padding:'2px 7px' }}>
          {t.storyPoints} pts
        </span>
      </div>
    </div>
  )
}

// ─── Weekly Goals ─────────────────────────────────────────────────────────────
function WeeklyGoals({ tasks, setTasks }) {
  const done = tasks.filter(t => t.done).length
  const pct  = Math.round((done / tasks.length) * 100)
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, overflow:'hidden' }}>
      {/* Header */}
      <div style={{
        padding:'16px 20px', borderBottom:`1px solid ${C.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background:C.surface2,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Target size={13} color={C.accent}/>
          <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif", letterSpacing:'0.02em' }}>
            This Week's Goals
          </span>
        </div>
        <span style={{ fontSize:11, fontWeight:700, color:C.accent, fontFamily:'JetBrains Mono,monospace' }}>
          {done}/{tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div style={{ padding:'8px 0' }}>
        {tasks.map((task, i) => (
          <div
            key={i}
            onClick={() => setTasks(tasks.map((t, j) => j === i ? {...t, done:!t.done} : t))}
            style={{
              display:'flex', alignItems:'flex-start', gap:12,
              padding:'12px 20px', cursor:'pointer',
              borderBottom: i < tasks.length - 1 ? `1px solid ${C.border}` : 'none',
              transition:'background 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background=C.surface2}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <div style={{
              width:16, height:16, flexShrink:0, marginTop:1,
              border:`1.5px solid ${task.done ? C.accent : C.border2}`,
              background: task.done ? C.accent : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.15s',
            }}>
              {task.done && <CheckCircle size={10} color="#fff"/>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{
                fontSize:13, fontWeight:500, lineHeight:1.4,
                color: task.done ? C.text3 : C.text2,
                textDecoration: task.done ? 'line-through' : 'none',
                fontFamily:"'Inter', sans-serif",
              }}>{task.label}</div>
              <div style={{
                fontSize:10, marginTop:4,
                color: task.done ? C.green : C.text3,
                display:'flex', alignItems:'center', gap:4,
                fontFamily:"'Inter', sans-serif",
              }}>
                {task.done ? <CheckCircle size={9} color={C.green}/> : <Clock size={9}/>}
                {task.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer progress */}
      <div style={{ padding:'14px 20px', borderTop:`1px solid ${C.border}`, background:C.surface2 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:10, color:C.text3, fontFamily:"'Inter', sans-serif", letterSpacing:'0.04em' }}>WEEKLY PROGRESS</span>
          <span style={{ fontSize:10, fontWeight:700, color: pct===100 ? C.green : C.accent, fontFamily:'JetBrains Mono,monospace' }}>{pct}%</span>
        </div>
        <div style={{ height:4, background:C.border, overflow:'hidden' }}>
          <div style={{
            height:'100%', width:`${pct}%`,
            background: pct === 100
              ? `linear-gradient(90deg, ${C.green}, #34d399)`
              : `linear-gradient(90deg, ${C.accent}, ${C.cyan})`,
            transition:'width 0.5s ease',
            boxShadow: pct > 0 ? `0 0 6px ${C.accent}88` : 'none',
          }}/>
        </div>
      </div>
    </div>
  )
}

// ─── Announcements ────────────────────────────────────────────────────────────
function Announcements({ announcements }) {
  const typeColor = { GENERAL:C.accent, IMPORTANT:C.yellow, EVENT:C.green, WARNING:C.red }
  if (!announcements?.length) return null
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}` }}>
      <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, background:C.surface2, display:'flex', alignItems:'center', gap:8 }}>
        <Zap size={12} color={C.yellow}/>
        <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif" }}>Announcements</span>
      </div>
      <div>
        {announcements.slice(0, 3).map((a, i) => {
          const color = typeColor[a.type] || C.accent
          return (
            <div key={a.id} style={{
              padding:'12px 20px',
              borderBottom: i < Math.min(announcements.length, 3) - 1 ? `1px solid ${C.border}` : 'none',
              borderLeft:`3px solid ${color}`,
              transition:'background 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background=C.surface2}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              <div style={{ fontSize:13, fontWeight:600, color:C.text2, marginBottom:3, fontFamily:"'Inter', sans-serif" }}>{a.title}</div>
              <div style={{ fontSize:9, color:C.text3, letterSpacing:'0.08em', fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase' }}>
                {a.type} · {a.audience || 'All students'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Quick Links ──────────────────────────────────────────────────────────────
function QuickLinks({ week }) {
  const links = [
    { icon:Code2,    label:'Submit PR',     sub:`Week ${week} submission`, color:C.accent,  href:'/tasks'   },
    { icon:BookOpen, label:'This Week',     sub:'Continue lesson',         color:C.green,   href:'/lessons' },
    { icon:Flame,    label:'Join Discord',  sub:'Get unblocked fast',      color:C.purple,  href:'#'        },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:C.border, border:`1px solid ${C.border}` }}>
      {links.map(l => (
        <a key={l.label} href={l.href} style={{
          background:C.surface,
          display:'flex', flexDirection:'column', gap:6,
          padding:'16px 18px', textDecoration:'none',
          transition:'background 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.background=C.surface2}
        onMouseLeave={e => e.currentTarget.style.background=C.surface}
        >
          <div style={{
            width:28, height:28,
            background:`${l.color}18`,
            border:`1px solid ${l.color}33`,
            display:'flex', alignItems:'center', justifyContent:'center',
            marginBottom:4,
          }}>
            <l.icon size={13} color={l.color}/>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif" }}>{l.label}</div>
          <div style={{ fontSize:10, color:C.text3, fontFamily:"'Inter', sans-serif" }}>{l.sub}</div>
        </a>
      ))}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const user  = useAuthStore(s => s.user)
  const [tasks, setTasks] = useState([
    { label:'Set up Express + Prisma backend', done:true,  time:'Completed 2 days ago' },
    { label:'Build JWT auth endpoints',         done:true,  time:'Completed yesterday'  },
    { label:'Connect React frontend to API',    done:false, time:'Due in 5 hours'       },
  ])

  const { data, isLoading, isError } = useQuery({
    queryKey:['dashboard'],
    queryFn: () => api.get('/student/dashboard').then(r => r.data),
  })

  if (isLoading) return <DashboardLayout title="Dashboard"><Spinner/></DashboardLayout>
  if (isError) return (
    <DashboardLayout title="Dashboard">
      <div style={{ background:C.surface, border:`1px solid ${C.red}`, padding:'14px 20px', color:C.red, display:'flex', alignItems:'center', gap:10, fontSize:13, fontFamily:"'Inter', sans-serif" }}>
        <AlertCircle size={15}/> Failed to load dashboard. Is the API running?
      </div>
    </DashboardLayout>
  )

  const { student, stats, activeTickets, announcements } = data
  const firstName = user?.name?.split(' ')[0] ?? 'Developer'
  const weekPct   = Math.round((student.currentWeek / TOTAL_WEEKS) * 100)

  return (
    <DashboardLayout title="Dashboard">

      {/* Hero */}
      <HeroBanner student={student} weekPct={weekPct} firstName={firstName}/>

      {/* Stat row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:C.border, border:`1px solid ${C.border}`, marginBottom:20 }}>
        <StatCard icon={TrendingUp} label="CURRENT WEEK"  rawValue={student.currentWeek} suffix={`/${TOTAL_WEEKS}`} accent={C.accent}  sub="weeks into the program"/>
        <StatCard icon={BookOpen}   label="LESSONS DONE"  rawValue={stats.lessonsWatched}                           accent={C.cyan}    sub="lessons completed"/>
        <StatCard icon={GitMerge}   label="PRS MERGED"    rawValue={stats.mergedPRs}                                accent={C.green}   sub="pull requests merged"/>
        <StatCard icon={Star}       label="AVG GRADE"     rawValue={typeof stats.avgGrade === 'number' ? stats.avgGrade : null} suffix={stats.avgGrade ? '' : ''} accent={C.yellow} sub={stats.avgGrade ? 'out of 100 points' : 'submit your first PR'}/>
      </div>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>

        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Active Tickets header */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"'Inter', sans-serif", letterSpacing:'0.02em' }}>Active Tickets</span>
                <span style={{
                  fontSize:10, fontWeight:700, color:C.accent,
                  border:`1px solid ${C.border2}`, padding:'1px 8px',
                  fontFamily:'JetBrains Mono,monospace',
                }}>{activeTickets.length}</span>
              </div>
              <a href="/tasks" style={{
                display:'flex', alignItems:'center', gap:4,
                fontSize:11, color:C.text3, textDecoration:'none',
                fontFamily:"'Inter', sans-serif", transition:'color 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.color=C.text}
              onMouseLeave={e => e.currentTarget.style.color=C.text3}
              >
                View all <ChevronRight size={12}/>
              </a>
            </div>

            {activeTickets.length === 0 ? (
              <div style={{
                background:C.surface, border:`1px solid ${C.border}`,
                padding:'32px 20px', textAlign:'center',
                color:C.text3, fontSize:13, fontFamily:"'Inter', sans-serif",
              }}>
                No active tickets. Sprint tickets drop soon.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {activeTickets.map(t => <TicketCard key={t.id} ticket={t}/>)}
              </div>
            )}
          </div>

          {/* Quick links */}
          <QuickLinks week={student.currentWeek}/>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <WeeklyGoals tasks={tasks} setTasks={setTasks}/>
          <Announcements announcements={announcements}/>
        </div>
      </div>

    </DashboardLayout>
  )
}
