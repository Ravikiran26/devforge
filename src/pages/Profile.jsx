import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '../components/layout/DashboardLayout'
import { GitBranch, Mail, MapPin, Calendar, Edit2, Save, X, ExternalLink, AlertCircle } from 'lucide-react'
import api from '../lib/api'

const SKILLS = ['Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'React', 'JWT Auth', 'REST APIs', 'Git']

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function Profile() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [draftBio, setDraftBio] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/student/profile').then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: (body) => api.put('/student/profile', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })

  if (isLoading) return <DashboardLayout title="Profile"><Spinner /></DashboardLayout>
  if (isError) return (
    <DashboardLayout title="Profile">
      <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 14, padding: '20px 24px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlertCircle size={16} /> Failed to load profile.
      </div>
    </DashboardLayout>
  )

  const { name, email, student } = data
  const { bio, college, location, githubUrl, cohort, plan, currentWeek, prSubmissions = [] } = student

  const approvedPRs = prSubmissions.filter(s => s.status === 'APPROVED')
  const avgGrade = approvedPRs.length
    ? Math.round(approvedPRs.reduce((s, p) => s + (p.score || 0), 0) / approvedPRs.length)
    : null

  const weekGrades = {}
  for (const pr of prSubmissions) {
    const w = pr.ticket?.week
    if (pr.score && w) {
      if (!weekGrades[w] || pr.score > weekGrades[w]) weekGrades[w] = pr.score
    }
  }

  const handleEdit = () => { setDraftBio(bio || ''); setEditing(true) }
  const handleSave = () => { updateMutation.mutate({ bio: draftBio }); setEditing(false) }

  const planLabel = (plan || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  const joinedDate = student.enrolledAt
    ? new Date(student.enrolledAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—'

  return (
    <DashboardLayout title="Profile">
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Profile card */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '28px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {/* Avatar */}
            <div style={{
              width: 82,
              height: 82,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 32,
              margin: '0 auto 14px',
              boxShadow: '0 4px 20px rgba(79,70,229,0.3)',
            }}>
              {(name || '?')[0].toUpperCase()}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, marginBottom: 4, background: '#f5f3ff', display: 'inline-block', padding: '3px 12px', borderRadius: 999 }}>
              Node.js Full-Stack
            </div>

            {/* Week badge */}
            <div style={{ marginBottom: 16 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#4f46e5',
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                padding: '3px 12px',
                borderRadius: 999,
              }}>
                Week {currentWeek} of 8
              </span>
            </div>

            {/* Bio */}
            {editing ? (
              <div style={{ textAlign: 'left' }}>
                <textarea
                  value={draftBio}
                  onChange={e => setDraftBio(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    fontSize: 12,
                    color: '#475569',
                    border: '1.5px solid #c7d2fe',
                    borderRadius: 10,
                    padding: '8px 12px',
                    resize: 'none',
                    outline: 'none',
                    boxSizing: 'border-box',
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif",
                    background: '#fafafe',
                  }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    style={{ flex: 1, padding: '7px 0', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: "'Inter', sans-serif" }}
                  >
                    <Save size={12} /> Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    style={{ flex: 1, padding: '7px 0', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: "'Inter', sans-serif" }}
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', textAlign: 'left' }}>
                <p style={{ fontSize: 12, color: bio ? '#64748b' : '#cbd5e1', lineHeight: 1.7, margin: '0 0 8px', textAlign: 'center' }}>
                  {bio || 'No bio yet — click edit to add one.'}
                </p>
                <button
                  onClick={handleEdit}
                  style={{ position: 'absolute', top: -2, right: -2, background: '#eef2ff', border: 'none', borderRadius: 7, cursor: 'pointer', padding: 5, color: '#4f46e5', display: 'flex', alignItems: 'center' }}
                >
                  <Edit2 size={11} />
                </button>
              </div>
            )}

            {/* Contact info */}
            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 18, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                [Mail,      email,                    'Email'],
                [MapPin,    location || '—',           'Location'],
                [Calendar,  `Joined ${joinedDate}`,   'Joined'],
                [GitBranch, githubUrl || '—',          'GitHub'],
              ].map(([Icon, text, title], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                    <Icon size={12} color="#94a3b8" />
                  </div>
                  <span style={{ fontSize: 12, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrollment card */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Enrollment</div>
            {[
              ['Cohort',  cohort?.name || '—'],
              ['Plan',    planLabel],
              ['College', college || '—'],
              ['Status',  student.status?.replace('_', ' ')],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #f8fafc' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 700 }}>{v}</span>
              </div>
            ))}
            {githubUrl && (
              <a
                href={githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 6, padding: '9px 0', background: '#0f172a', color: '#fff', borderRadius: 11, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}
              >
                <GitBranch size={13} /> View GitHub <ExternalLink size={11} />
              </a>
            )}
          </div>

          {/* Skills */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Tech Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SKILLS.map(s => (
                <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: '4px 11px', background: '#eef2ff', color: '#4f46e5', borderRadius: 999, border: '1px solid #c7d2fe' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              [approvedPRs.length,                  'PRs Merged',   '#4f46e5'],
              [avgGrade ? `${avgGrade}/100` : '—', 'Avg Grade',    '#059669'],
              [prSubmissions.length,                'Submitted',    '#7c3aed'],
              [`${currentWeek} / 8`,               'Current Week', '#f59e0b'],
            ].map(([value, label, color]) => (
              <div key={label} style={{
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
            ))}
          </div>

          {/* Weekly performance */}
          {Object.keys(weekGrades).length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '24px 26px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>Weekly Performance</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {Array.from({ length: Math.min(8, currentWeek) }, (_, i) => i + 1).map(w => {
                  const grade = weekGrades[w]
                  return (
                    <div key={w} style={{
                      textAlign: 'center',
                      padding: '16px 12px',
                      borderRadius: 12,
                      background: grade ? '#f0fdf4' : '#f8fafc',
                      border: grade ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    }}>
                      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Week {w}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: grade ? (grade >= 90 ? '#059669' : '#4f46e5') : '#cbd5e1' }}>
                        {grade || '—'}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{grade ? '/100' : 'pending'}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PR table */}
          {prSubmissions.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '20px 24px 0', marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Recent Pull Requests</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', borderTop: '1px solid #f1f5f9' }}>
                    {['Ticket', 'Title', 'Status', 'Score'].map((h, i) => (
                      <th key={h} style={{ padding: '11px 18px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: i < 2 ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prSubmissions.map((pr, i) => (
                    <tr key={pr.id} style={{ borderBottom: i < prSubmissions.length - 1 ? '1px solid #f8fafc' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fafafe')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{pr.ticket?.ticketCode}</td>
                      <td style={{ padding: '12px 18px', fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{pr.ticket?.title}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                          background: pr.status === 'APPROVED' ? '#ecfdf5' : pr.status === 'IN_REVIEW' ? '#fff7ed' : '#f8fafc',
                          color: pr.status === 'APPROVED' ? '#065f46' : pr.status === 'IN_REVIEW' ? '#c2410c' : '#475569',
                          border: `1px solid ${pr.status === 'APPROVED' ? '#a7f3d0' : pr.status === 'IN_REVIEW' ? '#fed7aa' : '#e2e8f0'}`,
                        }}>
                          {pr.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'center', fontSize: 14, fontWeight: 800, color: pr.score ? (pr.score >= 90 ? '#059669' : '#4f46e5') : '#cbd5e1' }}>
                        {pr.score ? `${pr.score}/100` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Activity heatmap */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '24px 26px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Activity — Last 12 Weeks</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {Array.from({ length: 84 }, (_, i) => {
                const w = Math.floor(i / 7) + 1
                const grade = weekGrades[w]
                const level = !grade ? 0 : grade >= 90 ? 3 : grade >= 75 ? 2 : 1
                const colors = ['#f1f5f9', '#c7d2fe', '#818cf8', '#4f46e5']
                return <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: colors[level] }} />
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Less</span>
              {['#f1f5f9', '#c7d2fe', '#818cf8', '#4f46e5'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
              ))}
              <span style={{ fontSize: 11, color: '#94a3b8' }}>More</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
