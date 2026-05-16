import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AdminLayout from '../../components/layout/AdminLayout'
import { Download, Search } from 'lucide-react'
import api from '../../lib/api'

const STATUS_STYLE = {
  PAID:    { bg:'#ecfdf5', color:'#065f46', border:'#a7f3d0', label:'Paid'    },
  PARTIAL: { bg:'#fffbeb', color:'#92400e', border:'#fde68a', label:'Partial' },
  FAILED:  { bg:'#fef2f2', color:'#dc2626', border:'#fecaca', label:'Failed'  },
}

const PLAN_STYLE = {
  LIVE_COHORT: { bg:'#eef2ff', color:'#4f46e5', label:'Live Cohort' },
  SELF_PACED:  { bg:'#f0fdf4', color:'#16a34a', label:'Self-paced'  },
  MENTORED:    { bg:'#f5f3ff', color:'#7c3aed', label:'Mentored'    },
}

function Spinner() {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:300 }}>
      <div style={{ width:36,height:36,border:'4px solid #e2e8f0',borderTop:'4px solid #4f46e5',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function Payments() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-payments', filter, search],
    queryFn: () => {
      const params = new URLSearchParams()
      if (filter !== 'All') params.set('status', filter)
      if (search) params.set('search', search)
      return api.get(`/admin/payments?${params}`).then(r => r.data)
    },
  })

  if (isLoading) return <AdminLayout title="Payments"><Spinner/></AdminLayout>
  if (isError)   return <AdminLayout title="Payments"><div style={{color:'#dc2626',padding:24}}>Failed to load payments.</div></AdminLayout>

  const { payments = [], summary = {}, byStatus = [] } = data
  const totalRevenue = summary.totalRevenue ?? 0

  const countByStatus = (s) => byStatus.find(b => b.status === s)?._count ?? 0

  return (
    <AdminLayout title="Payments">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Track enrollment payments and revenue across all cohorts.</p>
        <button style={{ display:'flex', alignItems:'center', gap:8, background:'#f8fafc', color:'#374151', fontWeight:700, fontSize:13, padding:'9px 18px', borderRadius:10, border:'1px solid #e2e8f0', cursor:'pointer' }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          ['Total Revenue', `₹${totalRevenue.toLocaleString('en-IN')}`, '#4f46e5'],
          ['Paid', countByStatus('PAID'), '#10b981'],
          ['Partial / EMI', countByStatus('PARTIAL'), '#f59e0b'],
          ['Failed', countByStatus('FAILED'), '#dc2626'],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 18px' }}>
            <div style={{ fontSize:12, color:'#94a3b8', fontWeight:600, marginBottom:6 }}>{l}</div>
            <div style={{ fontSize: l === 'Total Revenue' ? 22 : 28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <div style={{ position:'relative' }}>
          <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments…"
            style={{ paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9, fontSize:13, border:'1px solid #e2e8f0', borderRadius:8, outline:'none', width:220, background:'#fff' }} />
        </div>
        {['All','PAID','PARTIAL','FAILED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'8px 14px', fontSize:13, fontWeight:600, borderRadius:8, border:'1px solid #e2e8f0', cursor:'pointer', background: filter===f ? '#4f46e5' : '#fff', color: filter===f ? '#fff' : '#64748b' }}>
            {f === 'All' ? 'All' : STATUS_STYLE[f]?.label ?? f}
          </button>
        ))}
      </div>

      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
              {['Txn ID','Student','Plan','Amount','Date','Method','Status'].map((h, i) => (
                <th key={h} style={{ padding:'12px 16px', fontSize:11, fontWeight:700, color:'#94a3b8', textAlign: i>1 ? 'center' : 'left', textTransform:'uppercase', letterSpacing:'0.07em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => {
              const ss = STATUS_STYLE[p.status] || STATUS_STYLE.PAID
              const ps = PLAN_STYLE[p.plan] || PLAN_STYLE.LIVE_COHORT
              const dateStr = p.createdAt
                ? new Date(p.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
                : '—'
              return (
                <tr key={p.id} style={{ borderBottom: i < payments.length-1 ? '1px solid #f8fafc' : 'none' }}>
                  <td style={{ padding:'13px 16px', fontSize:11, fontWeight:700, color:'#94a3b8', fontFamily:'monospace' }}>{p.txnId}</td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{p.student?.user?.name ?? '—'}</div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{p.student?.user?.email}</div>
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'center' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:4, background:ps.bg, color:ps.color }}>{ps.label}</span>
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'center', fontSize:13, fontWeight:800, color:'#0f172a' }}>₹{p.amount.toLocaleString('en-IN')}</td>
                  <td style={{ padding:'13px 16px', textAlign:'center', fontSize:12, color:'#64748b' }}>{dateStr}</td>
                  <td style={{ padding:'13px 16px', textAlign:'center', fontSize:12, color:'#475569' }}>{p.method}</td>
                  <td style={{ padding:'13px 16px', textAlign:'center' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>{ss.label}</span>
                  </td>
                </tr>
              )
            })}
            {payments.length === 0 && (
              <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#94a3b8', fontSize:13 }}>No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
