import { useQuery } from '@tanstack/react-query'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../lib/api'
import { TrendingUp, GitMerge, BookOpen, AlertCircle, Trophy, Lock } from 'lucide-react'

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ pct }) {
  const r = 54, cx = 64, cy = 64, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={13} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#prog-grad)" strokeWidth={13}
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
      <defs>
        <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <text x={cx} y={cy - 7} textAnchor="middle" fontSize={22} fontWeight={800} fill="#0f172a">{pct}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={11} fill="#94a3b8">done</text>
    </svg>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── Stat Mini Card ───────────────────────────────────────────────────────────

function MiniStat({ value, label, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 18px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 5, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
    </div>
  )
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────────

function ActivityHeatmap({ activityDates = [] }) {
  const dateSet = new Set(activityDates)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build 84-day grid (12 weeks), starting from the Monday 12 weeks ago
  const days = []
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    days.push({ iso, active: dateSet.has(iso), date: d })
  }

  // Group into weeks of 7
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const totalActive = dateSet.size
  const last30 = days.slice(-30).filter(d => d.active).length
  const streak = (() => {
    let s = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].active) s++
      else break
    }
    return s
  })()

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Activity</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#4f46e5' }}>{streak}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>DAY STREAK</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#059669' }}>{last30}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>LAST 30 DAYS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#7c3aed' }}>{totalActive}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>TOTAL ACTIVE</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 3, overflowX: 'auto', paddingBottom: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day.iso}${day.active ? ' — lesson watched' : ''}`}
                style={{
                  width: 12, height: 12, borderRadius: 3,
                  background: day.active ? '#4f46e5' : '#f1f5f9',
                  opacity: day.active ? 1 : 0.6,
                  boxShadow: day.active ? '0 0 4px rgba(79,70,229,0.4)' : 'none',
                  transition: 'transform 0.1s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              />
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11, color: '#94a3b8' }}>
        <span>Less</span>
        {[0.15, 0.35, 0.6, 0.85, 1].map((o, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: `rgba(79,70,229,${o})` }}/>
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

// ─── Grade Trend ──────────────────────────────────────────────────────────────

function GradeTrend({ recentPRs }) {
  const scored = [...recentPRs].filter(p => p.score).reverse()
  if (scored.length < 2) return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
      Grade trend appears after your first 2 reviewed PRs.
    </div>
  )

  const scores = scored.map(p => p.score)
  const min = Math.min(...scores, 60)
  const max = Math.max(...scores, 100)
  const range = max - min || 1

  const W = 280, H = 60
  const points = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * (W - 20) + 10
    const y = H - ((s - min) / range) * (H - 16) - 8
    return { x, y, s, code: scored[i].ticketCode }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')

  const last2 = scores.slice(-2)
  const trend = last2[1] > last2[0] ? '📈 Improving' : last2[1] === last2[0] ? '➡️ Consistent' : '📉 Declining'
  const trendColor = last2[1] > last2[0] ? '#059669' : last2[1] === last2[0] ? '#4f46e5' : '#dc2626'

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '22px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Grade Trend</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: trendColor }}>{trend}</span>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', width: '100%' }}>
        <defs>
          <linearGradient id="trend-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <path d={path} fill="none" stroke="url(#trend-grad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill="#4f46e5"/>
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={9} fill="#64748b" fontWeight={600}>{p.s}</text>
            <text x={p.x} y={H + 14} textAnchor="middle" fontSize={9} fill="#94a3b8">{p.code}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ─── Portfolio Unlocks ────────────────────────────────────────────────────────

const PROJECTS = [
  {
    key: 'RF',
    name: 'Restaurant Flow',
    desc: 'Full-stack ordering system with Razorpay payments & real-time Socket.io updates',
    weeks: 'Weeks 5–6',
    unlockedAt: 7,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    stack: ['Node.js', 'Express', 'Socket.io', 'Razorpay', 'PostgreSQL'],
    emoji: '🍽️',
  },
  {
    key: 'LB',
    name: 'Lead Bill',
    desc: 'GST billing SaaS with PDF generation, Cloudinary file uploads & production deploy',
    weeks: 'Weeks 7–9',
    unlockedAt: 10,
    color: '#4f46e5',
    bg: '#eef2ff',
    border: '#c7d2fe',
    stack: ['React', 'pdf-lib', 'Cloudinary', 'GST Billing', 'Railway'],
    emoji: '🧾',
  },
  {
    key: 'CA',
    name: 'ClientDesk AI',
    desc: 'AI-powered CRM with Claude API integration, CI/CD via GitHub Actions',
    weeks: 'Weeks 10–11',
    unlockedAt: 12,
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    stack: ['Claude API', 'GitHub Actions', 'CI/CD', 'Docker'],
    emoji: '🤖',
  },
]

function PortfolioSection({ currentWeek }) {
  const unlocked = PROJECTS.filter(p => currentWeek >= p.unlockedAt)
  const locked   = PROJECTS.filter(p => currentWeek < p.unlockedAt)
  if (unlocked.length === 0) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Trophy size={16} color="#f59e0b" />
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Projects You've Built</div>
        <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{unlocked.length} completed</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {unlocked.map(p => (
          <div key={p.key} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{p.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{p.weeks}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {p.stack.map(tech => (
                <span key={tech} style={{ fontSize: 10, fontWeight: 600, color: p.color, background: '#fff', border: `1px solid ${p.border}`, padding: '2px 8px', borderRadius: 999 }}>{tech}</span>
              ))}
            </div>
          </div>
        ))}

        {locked.map(p => (
          <div key={p.key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px', opacity: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Lock size={14} color="#94a3b8"/>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>{p.name}</div>
                <div style={{ fontSize: 10, color: '#cbd5e1' }}>Unlocks at Week {p.unlockedAt}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export default function Progress() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['progress'],
    queryFn: () => api.get('/student/progress').then(r => r.data),
  })

  if (isLoading) return <DashboardLayout title="Progress"><Spinner /></DashboardLayout>
  if (isError) return (
    <DashboardLayout title="Progress">
      <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 14, padding: '20px 24px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlertCircle size={16} /> Failed to load progress.
      </div>
    </DashboardLayout>
  )

  const { currentWeek, overallGrade, totalPRs, mergedPRs, lessonsWatched, weeklyData = [], recentPRs = [], activityDates = [], daysInactive } = data
  const pct = Math.round(((currentWeek - 1) / 12) * 100)

  return (
    <DashboardLayout title="Progress">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* AT_RISK warning */}
      {daysInactive !== null && daysInactive >= 7 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#c2410c' }}>
          <AlertCircle size={15}/> You haven't been active for {daysInactive} days. Jump back in — even one lesson a day keeps you on track!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Left — completion ring */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '28px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Program Completion
            </div>
            <DonutChart pct={pct} />
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 14, lineHeight: 1.5 }}>
              <strong style={{ color: '#0f172a' }}>Week {currentWeek}</strong> of 12<br />
              <span style={{ fontSize: 11 }}>{12 - currentWeek} weeks remaining</span>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Activity</div>
            {[
              [GitMerge,   'PRs Merged',  mergedPRs,      '#10b981'],
              [BookOpen,   'Lessons',     lessonsWatched, '#06b6d4'],
              [TrendingUp, 'Total PRs',   totalPRs,       '#7c3aed'],
            ].map(([Icon, label, val, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f8fafc' }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 1 }}>{label}</div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — main stats + charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 4 mini stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <MiniStat value={`${overallGrade ?? '—'}/100`} label="Overall Grade" color="#4f46e5" />
            <MiniStat value={mergedPRs}                    label="PRs Merged"   color="#10b981" />
            <MiniStat value={lessonsWatched}               label="Lessons Done" color="#7c3aed" />
            <MiniStat value={`${currentWeek} / 12`}        label="Week"         color="#f59e0b" />
          </div>

          {/* Grade trend */}
          <GradeTrend recentPRs={recentPRs} />

          {/* Activity heatmap */}
          <ActivityHeatmap activityDates={activityDates} />

          {/* Weekly bar chart */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Weekly Progress</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 110 }}>
              {weeklyData.map(({ week, avgScore }) => {
                const done = week < currentWeek && avgScore !== null
                const curr = week === currentWeek
                const h = done ? Math.max(24, (avgScore / 100) * 95) : curr ? 48 : 16
                const bg = done ? 'linear-gradient(180deg, #4f46e5, #7c3aed)' : curr ? 'rgba(79,70,229,0.25)' : '#f1f5f9'
                return (
                  <div key={week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 10, color: done ? '#4f46e5' : curr ? '#a5b4fc' : 'transparent', fontWeight: 700 }}>
                      {done ? avgScore : curr ? '…' : ''}
                    </div>
                    <div style={{ width: '100%', height: h, borderRadius: 8, background: bg, transition: 'height 0.6s ease', boxShadow: done ? '0 2px 8px rgba(79,70,229,0.25)' : 'none' }} />
                    <div style={{ fontSize: 10, color: done || curr ? '#64748b' : '#cbd5e1', fontWeight: 700 }}>W{week}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Grades table */}
          {recentPRs.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '18px 24px 0' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Recent PR Grades</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', borderTop: '1px solid #f1f5f9' }}>
                    {['Ticket', 'Title', 'Status', 'Score', 'Feedback'].map((h, i) => (
                      <th key={h} style={{ padding: '11px 18px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: i < 2 ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentPRs.map((pr, i) => (
                    <tr key={pr.id} style={{ borderBottom: i < recentPRs.length - 1 ? '1px solid #f8fafc' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fafafe')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '13px 18px', fontSize: 12, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{pr.ticketCode}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: '#1e293b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.title}</td>
                      <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                          background: pr.status === 'APPROVED' ? '#ecfdf5' : pr.status === 'IN_REVIEW' ? '#fff7ed' : '#fef2f2',
                          color: pr.status === 'APPROVED' ? '#065f46' : pr.status === 'IN_REVIEW' ? '#c2410c' : '#dc2626',
                          border: `1px solid ${pr.status === 'APPROVED' ? '#a7f3d0' : pr.status === 'IN_REVIEW' ? '#fed7aa' : '#fecaca'}`,
                        }}>
                          {pr.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'center', fontSize: 15, fontWeight: 800, color: !pr.score ? '#cbd5e1' : pr.score >= 90 ? '#059669' : '#4f46e5' }}>
                        {pr.score ? `${pr.score}/100` : '—'}
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'center', fontSize: 12, color: '#64748b' }}>{pr.feedback || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Portfolio */}
          <PortfolioSection currentWeek={currentWeek} />
        </div>
      </div>
    </DashboardLayout>
  )
}
