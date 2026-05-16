import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../../components/layout/AdminLayout'
import { Plus, Search } from 'lucide-react'
import api from '../../lib/api'

const P_STYLE = {
  HIGH:   { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
  MEDIUM: { bg:'#eff6ff', color:'#2563eb', border:'#bfdbfe' },
  LOW:    { bg:'#f0fdf4', color:'#16a34a', border:'#bbf7d0' },
}
const S_STYLE = {
  ACTIVE:    { bg:'#ecfdf5', color:'#065f46', border:'#a7f3d0',  label:'Active'    },
  IN_REVIEW: { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa',  label:'In Review' },
  REVIEWED:  { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe',  label:'Reviewed'  },
  UPCOMING:  { bg:'#faf5ff', color:'#6d28d9', border:'#ddd6fe',  label:'Upcoming'  },
}

function Spinner() {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:300 }}>
      <div style={{ width:36,height:36,border:'4px solid #e2e8f0',borderTop:'4px solid #4f46e5',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const BLANK_FORM = { ticketCode:'', title:'', week:'', storyPoints:'', description:'', priority:'HIGH' }

export default function Tickets() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [weekFilter, setWeekFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(BLANK_FORM)

  const { data: tickets = [], isLoading, isError } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: () => api.get('/admin/tickets').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (body) => api.post('/admin/tickets', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-tickets'] }); setShowModal(false); setForm(BLANK_FORM) },
  })

  const weeks = ['All', ...Array.from(new Set(tickets.map(t => `Week ${t.week}`))).sort()]

  const filtered = tickets.filter(t => {
    const ms = t.title.toLowerCase().includes(search.toLowerCase()) || t.ticketCode.toLowerCase().includes(search.toLowerCase())
    const mw = weekFilter === 'All' || `Week ${t.week}` === weekFilter
    return ms && mw
  })

  if (isLoading) return <AdminLayout title="Tickets"><Spinner/></AdminLayout>
  if (isError)   return <AdminLayout title="Tickets"><div style={{color:'#dc2626',padding:24}}>Failed to load tickets.</div></AdminLayout>

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <AdminLayout title="Tickets">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Manage sprint tickets assigned to students.</p>
        <button onClick={() => setShowModal(true)} style={{ display:'flex', alignItems:'center', gap:8, background:'#4f46e5', color:'#fff', fontWeight:700, fontSize:14, padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer' }}>
          <Plus size={16} /> Create Ticket
        </button>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ position:'relative' }}>
          <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…"
            style={{ paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9, fontSize:13, border:'1px solid #e2e8f0', borderRadius:8, outline:'none', width:220, background:'#fff' }} />
        </div>
        {weeks.map(w => (
          <button key={w} onClick={() => setWeekFilter(w)}
            style={{ padding:'8px 14px', fontSize:13, fontWeight:600, borderRadius:8, border:'1px solid #e2e8f0', cursor:'pointer', background: weekFilter === w ? '#4f46e5' : '#fff', color: weekFilter === w ? '#fff' : '#64748b' }}>{w}</button>
        ))}
      </div>

      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
              {['Ticket ID','Title','Week','Priority','Status','Submissions','Avg Score','Action'].map((h,i) => (
                <th key={h} style={{ padding:'12px 16px', fontSize:11, fontWeight:700, color:'#94a3b8', textAlign: i > 1 ? 'center' : 'left', textTransform:'uppercase', letterSpacing:'0.07em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const ps = P_STYLE[t.priority] || P_STYLE.MEDIUM
              const ss = S_STYLE[t.status] || { bg:'#f8fafc', color:'#64748b', border:'#e2e8f0', label: t.status }
              return (
                <tr key={t.id} style={{ borderBottom: i < filtered.length-1 ? '1px solid #f8fafc' : 'none' }}>
                  <td style={{ padding:'13px 16px', fontSize:12, fontWeight:700, color:'#64748b', fontFamily:'monospace' }}>{t.ticketCode}</td>
                  <td style={{ padding:'13px 16px', fontSize:13, fontWeight:600, color:'#1e293b' }}>{t.title}</td>
                  <td style={{ padding:'13px 16px', textAlign:'center', fontSize:13, color:'#475569' }}>Week {t.week}</td>
                  <td style={{ padding:'13px 16px', textAlign:'center' }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:4, background:ps.bg, color:ps.color, border:`1px solid ${ps.border}` }}>{t.priority}</span>
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'center' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>{ss.label}</span>
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'center', fontSize:13, fontWeight:700, color:'#4f46e5' }}>{t.submissionCount ?? 0}</td>
                  <td style={{ padding:'13px 16px', textAlign:'center', fontSize:13, fontWeight:800, color: t.avgScore ? (t.avgScore >= 85 ? '#059669' : '#4f46e5') : '#cbd5e1' }}>
                    {t.avgScore ? `${t.avgScore}/100` : '—'}
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'center' }}>
                    <button style={{ padding:'6px 16px', background:'#4f46e5', color:'#fff', fontWeight:700, fontSize:12, borderRadius:7, border:'none', cursor:'pointer' }}>
                      {t.status === 'IN_REVIEW' ? 'Review' : 'View'}
                    </button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding:32, textAlign:'center', color:'#94a3b8', fontSize:13 }}>No tickets found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, width:460, boxShadow:'0 24px 64px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:'0 0 20px', color:'#0f172a' }}>Create New Ticket</h2>
            {[['Ticket ID','ticketCode','text','e.g. P1-012'],['Title','title','text','e.g. Build CRUD endpoints'],['Week','week','number','1-8'],['Story Points','storyPoints','number','1-10'],['Description','description','text','Ticket description']].map(([l,k,t,p]) => (
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>{l}</label>
                <input type={t} placeholder={p} value={form[k]} onChange={setField(k)}
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Priority</label>
              <select value={form.priority} onChange={setField('priority')}
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none' }}>
                <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
              </select>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button
                disabled={createMutation.isPending || !form.ticketCode || !form.title || !form.week}
                onClick={() => createMutation.mutate({ ...form, week: parseInt(form.week), storyPoints: parseInt(form.storyPoints) || 5 })}
                style={{ flex:1, padding:12, background: (!form.ticketCode||!form.title||!form.week) ? '#e2e8f0' : '#4f46e5', color: (!form.ticketCode||!form.title||!form.week) ? '#94a3b8' : '#fff', fontWeight:700, fontSize:14, borderRadius:10, border:'none', cursor:'pointer' }}>
                {createMutation.isPending ? 'Creating…' : 'Create Ticket'}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ flex:1, padding:12, background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:14, borderRadius:10, border:'1px solid #e2e8f0', cursor:'pointer' }}>Cancel</button>
            </div>
            {createMutation.isError && (
              <div style={{ marginTop:10, fontSize:12, color:'#dc2626' }}>
                {createMutation.error?.response?.data?.error || 'Failed to create ticket'}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
