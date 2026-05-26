import { useQuery } from '@tanstack/react-query'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../lib/api'
import { AlertCircle, TrendingDown } from 'lucide-react'

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function CriteriaBar({ criterion, pass, fail, failRate }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600, flex: 1 }}>{criterion}</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>{pass} passed</span>
          <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>{fail} failed</span>
          <span style={{
            fontSize: 11, fontWeight: 800, padding: '2px 9px', borderRadius: 999,
            background: failRate >= 50 ? '#fef2f2' : failRate >= 25 ? '#fff7ed' : '#ecfdf5',
            color: failRate >= 50 ? '#dc2626' : failRate >= 25 ? '#c2410c' : '#059669',
            border: `1px solid ${failRate >= 50 ? '#fecaca' : failRate >= 25 ? '#fed7aa' : '#a7f3d0'}`,
            minWidth: 48, textAlign: 'center',
          }}>{failRate}%</span>
        </div>
      </div>
      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${failRate}%`,
          background: failRate >= 50 ? 'linear-gradient(90deg, #ef4444, #dc2626)'
            : failRate >= 25 ? 'linear-gradient(90deg, #f97316, #ea580c)'
            : 'linear-gradient(90deg, #10b981, #059669)',
          transition: 'width 0.6s ease',
        }}/>
      </div>
    </div>
  )
}

function AtRiskPanel({ atRisk = [] }) {
  if (!atRisk.length) return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '28px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>No students at risk</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Everyone has been active in the last 7 days</div>
    </div>
  )

  return (
    <div style={{ background: '#fff', border: '1.5px solid #fed7aa', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #fef3c7', background: '#fffbeb', display: 'flex', alignItems: 'center', gap: 8 }}>
        <AlertCircle size={16} color="#d97706"/>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#92400e' }}>At-Risk Students</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', background: '#fff', border: '1px solid #fed7aa', padding: '2px 9px', borderRadius: 999, marginLeft: 4 }}>
          {atRisk.length} students
        </span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['Student', 'Email', 'Week', 'Days Inactive'].map((h, i) => (
              <th key={h} style={{ padding: '11px 18px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: i < 2 ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {atRisk.map((s, i) => (
            <tr key={s.id} style={{ borderBottom: i < atRisk.length - 1 ? '1px solid #f8fafc' : 'none' }}>
              <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.name}</td>
              <td style={{ padding: '12px 18px', fontSize: 12, color: '#64748b' }}>{s.email}</td>
              <td style={{ padding: '12px 18px', textAlign: 'center', fontSize: 13, color: '#4f46e5', fontWeight: 700 }}>{s.currentWeek}</td>
              <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                <span style={{
                  fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
                  background: s.daysInactive >= 14 ? '#fef2f2' : '#fff7ed',
                  color: s.daysInactive >= 14 ? '#dc2626' : '#c2410c',
                  border: `1px solid ${s.daysInactive >= 14 ? '#fecaca' : '#fed7aa'}`,
                }}>
                  {s.daysInactive}d
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Analytics() {
  const { data: criteriaData, isLoading: loadingCriteria } = useQuery({
    queryKey: ['admin-analytics-criteria'],
    queryFn: () => api.get('/admin/analytics/criteria').then(r => r.data),
  })

  const { data: riskData, isLoading: loadingRisk } = useQuery({
    queryKey: ['admin-analytics-risk'],
    queryFn: () => api.get('/admin/analytics/at-risk').then(r => r.data),
  })

  return (
    <AdminLayout title="Analytics">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* At-risk panel */}
        {loadingRisk ? <Spinner/> : <AtRiskPanel atRisk={riskData?.atRisk ?? []}/>}

        {/* Criteria heatmap */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
            <TrendingDown size={16} color="#ef4444"/>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>AI Criteria Failure Heatmap</h3>
            {criteriaData && (
              <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{criteriaData.totalReviewed} PRs reviewed</span>
            )}
          </div>

          {loadingCriteria ? <Spinner/> : criteriaData?.criteria?.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '32px 0' }}>
              No AI review data yet. Criteria will appear after students submit PRs.
            </div>
          ) : (
            criteriaData?.criteria?.map(c => (
              <CriteriaBar key={c.criterion} {...c}/>
            ))
          )}

          {criteriaData?.criteria?.length > 0 && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: '#f8fafc', borderRadius: 10, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
              <strong style={{ color: '#0f172a' }}>How to use this:</strong> Red bars (≥50% fail) need more lesson coverage or clearer instructions.
              Orange bars (25–50%) are worth watching. Green bars are working well.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
