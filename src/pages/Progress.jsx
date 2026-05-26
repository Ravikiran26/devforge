import { useQuery } from '@tanstack/react-query'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../lib/api'
import { TrendingUp, GitMerge, BookOpen, AlertCircle } from 'lucide-react'

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ pct }) {
  const r = 54, cx = 64, cy = 64, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={13} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="url(#prog-grad)" strokeWidth={13}
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
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
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: '16px 18px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 5, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
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

  const { currentWeek, overallGrade, totalPRs, mergedPRs, lessonsWatched, weeklyData, recentPRs } = data
  const pct = Math.round(((currentWeek - 1) / 12) * 100)

  return (
    <DashboardLayout title="Progress">
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
              [GitMerge, 'PRs Merged',  mergedPRs,      '#10b981'],
              [BookOpen, 'Lessons',     lessonsWatched, '#06b6d4'],
              [TrendingUp, 'Total PRs', totalPRs,       '#7c3aed'],
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
            <MiniStat value={`${currentWeek} / 12`}         label="Week"         color="#f59e0b" />
          </div>

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
                    <div style={{
                      width: '100%',
                      height: h,
                      borderRadius: 8,
                      background: bg,
                      transition: 'height 0.6s ease',
                      boxShadow: done ? '0 2px 8px rgba(79,70,229,0.25)' : 'none',
                    }} />
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
                    <tr
                      key={pr.id}
                      style={{ borderBottom: i < recentPRs.length - 1 ? '1px solid #f8fafc' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fafafe')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '13px 18px', fontSize: 12, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{pr.ticketCode}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: '#1e293b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.title}</td>
                      <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 999,
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
        </div>
      </div>
    </DashboardLayout>
  )
}
