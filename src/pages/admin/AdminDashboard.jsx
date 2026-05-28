import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { Users, Zap, IndianRupee, ClipboardList, ArrowRight } from 'lucide-react'
import api from '../../lib/api'

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const AVATAR_COLORS = ['#4f46e5', '#0891b2', '#7c3aed', '#059669', '#dc2626', '#d97706']

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent, sub, topGradient, subAccent, border }) {
  return (
    <div style={{
      background: '#fff',
      border: border || '1px solid #e2e8f0',
      borderRadius: 16,
      padding: '20px 22px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: topGradient || accent, borderRadius: '16px 16px 0 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{label}</span>
        <div style={{ width: 34, height: 34, background: `${accent}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={accent} />
        </div>
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: subAccent || '#94a3b8', fontWeight: 500 }}>{sub}</div>}
    </div>
  )
}

// ─── Recent Submissions ───────────────────────────────────────────────────────

function RecentSubmissions({ submissions }) {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent PR Submissions</h3>
        <button
          onClick={() => navigate('/admin/students')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#4f46e5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          View All <ArrowRight size={12} />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {submissions.slice(0, 6).map((s, i) => (
          <div key={s.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: AVATAR_COLORS[i % AVATAR_COLORS.length],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}>
              {(s.studentName || '?')[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.45, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <b style={{ color: '#0f172a' }}>{s.studentName}</b> submitted{' '}
                <b style={{ color: '#4f46e5' }}>{s.ticketCode}</b>
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                {new Date(s.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 999,
              background: s.status === 'APPROVED' ? '#ecfdf5' : s.status === 'IN_REVIEW' ? '#fff7ed' : '#f8fafc',
              color: s.status === 'APPROVED' ? '#065f46' : s.status === 'IN_REVIEW' ? '#c2410c' : '#475569',
              border: `1px solid ${s.status === 'APPROVED' ? '#a7f3d0' : s.status === 'IN_REVIEW' ? '#fed7aa' : '#e2e8f0'}`,
              flexShrink: 0,
            }}>
              {s.status.replace('_', ' ')}
            </span>
          </div>
        ))}
        {submissions.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '24px 0' }}>
            No recent submissions.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Pending Reviews Panel ────────────────────────────────────────────────────

function PendingPRPanel({ submissions }) {
  const navigate = useNavigate()
  const pending = submissions.filter(s => s.status === 'IN_REVIEW')

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', flex: 1.4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Pending PR Reviews</h3>
        {pending.length > 0 && (
          <span style={{ fontSize: 11, fontWeight: 800, color: '#ea580c', background: '#fff7ed', border: '1px solid #fed7aa', padding: '3px 10px', borderRadius: 999 }}>
            {pending.length} PENDING
          </span>
        )}
      </div>

      {pending.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '32px 0' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
          All caught up! No pending reviews.
        </div>
      ) : (
        <>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.9fr', gap: 8, padding: '0 0 10px', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
            {['STUDENT', 'TICKET', 'DATE', 'ACTION'].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>
          {pending.map((s, i) => (
            <div key={s.id} style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.9fr',
              gap: 8,
              alignItems: 'center',
              padding: '13px 0',
              borderBottom: i < pending.length - 1 ? '1px solid #f8fafc' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                  {(s.studentName || '?')[0]}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.studentName}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace' }}>{s.ticketCode}</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {new Date(s.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
              <button
                onClick={() => navigate('/admin/students')}
                style={{ background: '#4f46e5', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Review
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data),
  })

  if (isLoading) return <AdminLayout title="Admin Overview"><Spinner /></AdminLayout>
  if (isError) return (
    <AdminLayout title="Admin Overview">
      <div style={{ color: '#dc2626', padding: 24, background: '#fff', border: '1px solid #fecaca', borderRadius: 14 }}>
        Failed to load dashboard.
      </div>
    </AdminLayout>
  )

  const { stats, recentSubmissions = [], activeCohort } = data
  const revenue = stats.totalRevenue ?? 0

  return (
    <AdminLayout title="Admin Overview">

      {/* Active cohort banner */}
      {activeCohort && (
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          borderRadius: 14,
          padding: '14px 22px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 4px 16px rgba(49,46,129,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.8)' }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Active Cohort</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{activeCohort.name}</div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 999 }}>
            {activeCohort.status}
          </span>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents}
          accent="#4f46e5"
          topGradient="linear-gradient(90deg, #4f46e5, #7c3aed)"
          sub={`↗ ${stats.activeStudents} active`}
          subAccent="#10b981"
        />
        <StatCard
          icon={Zap}
          label="Active Students"
          value={stats.activeStudents}
          accent="#10b981"
          topGradient="linear-gradient(90deg, #10b981, #059669)"
          sub={`${stats.totalStudents ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0}% of total`}
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${revenue.toLocaleString('en-IN')}`}
          accent="#d97706"
          topGradient="linear-gradient(90deg, #f59e0b, #d97706)"
          sub="All cohorts combined"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Reviews"
          value={stats.pendingReviews}
          accent="#ea580c"
          topGradient="linear-gradient(90deg, #f97316, #ea580c)"
          sub={stats.pendingReviews > 0 ? '⚠ Needs attention' : 'All caught up'}
          subAccent={stats.pendingReviews > 0 ? '#ea580c' : '#10b981'}
          border={stats.pendingReviews > 0 ? '1.5px solid #fed7aa' : '1px solid #e2e8f0'}
        />
      </div>

      {/* Bottom panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
        <RecentSubmissions submissions={recentSubmissions} />
        <PendingPRPanel submissions={recentSubmissions} />
      </div>
    </AdminLayout>
  )
}
