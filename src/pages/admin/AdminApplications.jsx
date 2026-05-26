import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AdminLayout from '../../components/layout/AdminLayout'
import { Users, CheckCircle, Clock, Phone, GraduationCap } from 'lucide-react'
import api from '../../lib/api'

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const PLAN_LABEL = { LIVE_COHORT: 'Live Batch', SELF_PACED: 'Self-Paced', MENTORED: 'Mentored' }

export default function AdminApplications() {
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: () => api.get('/admin/applications').then(r => r.data),
    staleTime: 30_000,
  })

  if (isLoading) return <AdminLayout title="Applications"><Spinner /></AdminLayout>

  const { applications = [], total = 0, paid = 0, unpaid = 0 } = data || {}

  const filtered = filter === 'paid'   ? applications.filter(a => a.paid)
                 : filter === 'unpaid' ? applications.filter(a => !a.paid)
                 : applications

  return (
    <AdminLayout title="Applications">

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Applied', value: total,  color: '#4f46e5', icon: Users },
          { label: 'Paid',          value: paid,   color: '#059669', icon: CheckCircle },
          { label: 'Pending',       value: unpaid, color: '#c2410c', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 42, height: 42, background: `${color}12`, border: `1px solid ${color}22`, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['all', 'All'], ['paid', 'Paid'], ['unpaid', 'Pending']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '6px 16px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer',
            fontWeight: filter === val ? 700 : 500, fontSize: 13,
            background: filter === val ? '#4f46e5' : '#fff',
            color: filter === val ? '#fff' : '#64748b',
            fontFamily: "'Inter', sans-serif",
          }}>
            {label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#94a3b8', alignSelf: 'center' }}>
          {filtered.length} application{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>No applications yet</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Applications from the landing page will appear here.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Name', 'Email', 'Phone', 'College', 'Plan', 'Status', 'Applied On'].map((h, i) => (
                  <th key={h} style={{ padding: '11px 18px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: i === 0 ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#4f46e5', flexShrink: 0 }}>
                        {a.name[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12, color: '#4f46e5' }}>{a.email}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, color: '#374151' }}>
                      <Phone size={11} color="#94a3b8" />{a.phone}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, color: '#374151' }}>
                      <GraduationCap size={11} color="#94a3b8" />{a.college}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#4f46e5', background: '#eef2ff', padding: '3px 10px', borderRadius: 6 }}>
                      {PLAN_LABEL[a.plan] || a.plan}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    {a.paid ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: 6, border: '1px solid #a7f3d0' }}>
                        <CheckCircle size={11} /> Paid
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#c2410c', background: '#fff7ed', padding: '4px 10px', borderRadius: 6, border: '1px solid #fed7aa' }}>
                        <Clock size={11} /> Pending
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
                    {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
