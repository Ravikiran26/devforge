import DashboardLayout from '../components/layout/DashboardLayout'
import { ExternalLink, Users, BookOpen, GitMerge, Trophy } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

const RESOURCES = [
  { label: 'Discord Server', desc: 'Ask doubts, share PRs, get unblocked fast', icon: '💬', url: 'https://discord.gg/XxFSFdHTU' },
]

const COLORS = ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444','#06B6D4','#EC4899','#14B8A6']

function Avatar({ name, i, size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: COLORS[i % COLORS.length],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
    }}>
      {name[0]}
    </div>
  )
}

function StatusBadge({ status }) {
  const ok = status === 'ACTIVE'
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
      background: ok ? '#ecfdf5' : '#fff7ed',
      color: ok ? '#065f46' : '#c2410c',
      border: `1px solid ${ok ? '#a7f3d0' : '#fed7aa'}`,
    }}>{ok ? 'Active' : 'At Risk'}</span>
  )
}

// ─── Win Wall ─────────────────────────────────────────────────────────────────

function WinWall({ wins = [] }) {
  if (!wins.length) return null

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr)
    const d = Math.floor(diff / 86400000)
    const h = Math.floor(diff / 3600000)
    if (d > 0) return `${d}d ago`
    if (h > 0) return `${h}h ago`
    return 'just now'
  }

  const scoreColor = (s) => s >= 90 ? '#059669' : s >= 75 ? '#4f46e5' : '#94a3b8'

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Trophy size={14} color="#f59e0b"/>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>Win Wall</span>
        <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>recent approvals</span>
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {wins.map((w, i) => (
          <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderBottom: i < wins.length - 1 ? '1px solid #f8fafc' : 'none', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafe'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Avatar name={w.studentName} i={i} size={32}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {w.studentName}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                <span style={{ fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace' }}>{w.ticketCode}</span>
                {' · '}{w.title}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {w.score && <div style={{ fontSize: 14, fontWeight: 800, color: scoreColor(w.score) }}>{w.score}</div>}
              <div style={{ fontSize: 10, color: '#cbd5e1' }}>{timeAgo(w.reviewedAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Community() {
  const { data, isLoading } = useQuery({
    queryKey: ['cohort-students'],
    queryFn: () => api.get('/student/community').then(r => r.data).catch(() => ({ students: [], recentWins: [] })),
    staleTime: 5 * 60_000,
  })

  const students    = data?.students    ?? []
  const recentWins  = data?.recentWins  ?? []
  const cohortName  = data?.cohortName  ?? 'Your Cohort'

  return (
    <DashboardLayout title="Community">

      {/* Discord banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f51e8, #5865f2)',
        borderRadius: 18, padding: '18px 24px', marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(88,101,242,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💬</div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Join the DevForge Discord</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Ask doubts · share PRs · get unblocked fast</div>
          </div>
        </div>
        <a href="https://discord.gg/XxFSFdHTU" target="_blank" rel="noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: '#fff', color: '#5865f2', fontWeight: 700, fontSize: 13,
          padding: '10px 20px', borderRadius: 11, textDecoration: 'none', flexShrink: 0,
        }}>
          Open Discord <ExternalLink size={13} />
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

        {/* Left — leaderboard + win wall */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Cohort leaderboard */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={15} color="#4f46e5" />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>{cohortName} — Students</span>
              <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{students.length} enrolled</span>
            </div>

            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : students.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>Cohort directory coming soon</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Student profiles will appear here once the cohort kicks off.</div>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['#', 'Student', 'Week', 'Submitted', 'Avg Grade', 'Status'].map((h, i) => (
                      <th key={h} style={{ padding: '11px 18px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: i < 2 ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? '1px solid #f8fafc' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 700, color: '#cbd5e1', textAlign: 'center' }}>#{i + 1}</td>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={s.name} i={i} />
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'center', fontSize: 13, color: '#4f46e5', fontWeight: 700 }}>{s.currentWeek}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#059669' }}>{s.mergedPRs}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: s.avgGrade >= 90 ? '#059669' : s.avgGrade > 0 ? '#4f46e5' : '#94a3b8' }}>
                        {s.avgGrade > 0 ? `${s.avgGrade}/100` : '—'}
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}><StatusBadge status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <WinWall wins={recentWins} />
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stats summary */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Batch Stats</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                [GitMerge, 'Total PRs',  students.reduce((a, s) => a + (s.mergedPRs || 0), 0), '#4f46e5'],
                [BookOpen, 'Avg Week',   students.length ? Math.round(students.reduce((a, s) => a + s.currentWeek, 0) / students.length) : 0, '#059669'],
              ].map(([Icon, label, val, color]) => (
                <div key={label} style={{ textAlign: 'center', padding: '14px 0', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                  <Icon size={14} color={color} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: 20, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Resources</div>
            {RESOURCES.map((r, i) => (
              <a key={r.label} href={r.url} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < RESOURCES.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration: 'none', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{ fontSize: 18, width: 34, height: 34, background: '#f8fafc', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.desc}</div>
                </div>
                <ExternalLink size={12} color="#cbd5e1" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
