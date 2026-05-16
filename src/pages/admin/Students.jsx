import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AdminLayout from '../../components/layout/AdminLayout'
import { Search, Mail, Eye, Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import api from '../../lib/api'

const STATUS_STYLE = {
  ACTIVE:    { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0', label: 'Active'    },
  AT_RISK:   { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', label: 'At Risk'   },
  COMPLETED: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Completed' },
}

const INITIALS_COLORS = ['#4f46e5', '#0891b2', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0284c7', '#9333ea']

function gradeColor(g) {
  if (!g && g !== 0) return '#94a3b8'
  if (g >= 90) return '#059669'
  if (g >= 75) return '#4f46e5'
  return '#dc2626'
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function Students() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  const { data: students = [], isLoading, isError } = useQuery({
    queryKey: ['admin-students'],
    queryFn: () => api.get('/admin/students').then(r => r.data),
  })

  const filtered = students.filter(s => {
    const matchSearch = (s.user?.name || '').toLowerCase().includes(search.toLowerCase())
      || (s.user?.email || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'ALL' || s.status === filter
    return matchSearch && matchFilter
  })

  const counts = {
    total:     students.length,
    ACTIVE:    students.filter(s => s.status === 'ACTIVE').length,
    AT_RISK:   students.filter(s => s.status === 'AT_RISK').length,
    COMPLETED: students.filter(s => s.status === 'COMPLETED').length,
  }

  if (isLoading) return <AdminLayout title="Students"><Spinner /></AdminLayout>
  if (isError) return (
    <AdminLayout title="Students">
      <div style={{ color: '#dc2626', padding: 24, background: '#fff', border: '1px solid #fecaca', borderRadius: 14 }}>
        Failed to load students.
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout title="Students">

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Students', value: counts.total,     color: '#4f46e5', icon: Users,         gradient: 'linear-gradient(90deg, #4f46e5, #7c3aed)' },
          { label: 'Active',         value: counts.ACTIVE,    color: '#10b981', icon: CheckCircle,    gradient: 'linear-gradient(90deg, #10b981, #059669)' },
          { label: 'At Risk',        value: counts.AT_RISK,   color: '#ea580c', icon: AlertTriangle,  gradient: 'linear-gradient(90deg, #f97316, #ea580c)' },
          { label: 'Completed',      value: counts.COMPLETED, color: '#2563eb', icon: TrendingUp,     gradient: 'linear-gradient(90deg, #3b82f6, #2563eb)' },
        ].map(({ label, value, color, icon: Icon, gradient }) => (
          <div key={label} style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: gradient, borderRadius: '14px 14px 0 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{label}</span>
              <div style={{ width: 30, height: 30, background: `${color}12`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filter + Search bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['ALL', 'All'], ['ACTIVE', 'Active'], ['AT_RISK', 'At Risk'], ['COMPLETED', 'Completed']].map(([val, lbl]) => {
            const isActive = filter === val
            return (
              <button
                key={val}
                onClick={() => setFilter(val)}
                style={{
                  padding: '7px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 9,
                  border: '1px solid',
                  borderColor: isActive ? '#4f46e5' : '#e2e8f0',
                  cursor: 'pointer',
                  background: isActive ? '#4f46e5' : '#fff',
                  color: isActive ? '#fff' : '#64748b',
                  transition: 'all 0.15s',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {lbl}
              </button>
            )
          })}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students…"
            style={{
              paddingLeft: 34,
              paddingRight: 14,
              paddingTop: 9,
              paddingBottom: 9,
              fontSize: 13,
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              outline: 'none',
              width: 230,
              background: '#fff',
              fontFamily: "'Inter', sans-serif",
              color: '#374151',
            }}
            onFocus={e => { e.target.style.borderColor = '#a5b4fc'; e.target.style.boxShadow = '0 0 0 3px rgba(165,180,252,0.15)' }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
          />
        </div>
      </div>

      {/* Students table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Student', 'Cohort', 'Week', 'PRs', 'Plan', 'Status', 'Actions'].map((h, i) => (
                <th key={h} style={{
                  padding: '12px 18px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#94a3b8',
                  textAlign: i > 1 ? 'center' : 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const st = STATUS_STYLE[s.status] || STATUS_STYLE.ACTIVE
              const planLabel = (s.plan || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
              return (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafe')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: INITIALS_COLORS[i % INITIALS_COLORS.length],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}>
                        {(s.user?.name || '?')[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{s.user?.name}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{s.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: '#475569' }}>{s.cohort?.name || '—'}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', background: '#f1f5f9', padding: '3px 10px', borderRadius: 999 }}>
                      W{s.currentWeek}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#4f46e5' }}>{s._count?.prSubmissions ?? 0}</span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12, color: '#64748b' }}>{planLabel}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 11px',
                      borderRadius: 999,
                      background: st.bg,
                      color: st.color,
                      border: `1px solid ${st.border}`,
                    }}>
                      {st.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button
                        title="View Profile"
                        style={{ padding: '6px 10px', background: '#eef2ff', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#4f46e5', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#e0e7ff')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#eef2ff')}
                      >
                        <Eye size={13} />
                      </button>
                      <a
                        href={`mailto:${s.user?.email}`}
                        title="Send Email"
                        style={{ padding: '6px 10px', background: '#ecfdf5', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#d1fae5')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#ecfdf5')}
                      >
                        <Mail size={13} />
                      </a>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
                  No students found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        {filtered.length > 0 && (
          <div style={{ padding: '12px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Showing {filtered.length} of {students.length} students
            </span>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
