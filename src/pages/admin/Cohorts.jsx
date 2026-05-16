import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../../components/layout/AdminLayout'
import { Plus, Users, Calendar, ChevronRight } from 'lucide-react'
import api from '../../lib/api'

const STATUS_STYLE = {
  ACTIVE:    { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0', label: 'Active'    },
  COMPLETED: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Completed' },
  UPCOMING:  { bg: '#faf5ff', color: '#6d28d9', border: '#ddd6fe', label: 'Upcoming'  },
}

function Spinner() {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:300 }}>
      <div style={{ width:36,height:36,border:'4px solid #e2e8f0',borderTop:'4px solid #4f46e5',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}

function CohortCard({ c }) {
  const s   = STATUS_STYLE[c.status] || STATUS_STYLE.UPCOMING
  const total    = c._count?.students ?? 0
  const pct = total > 0 ? Math.round(((c._count?.students ?? 0) / (c.maxStudents || 1)) * 100) : 0

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{c.name}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Node.js Full-Stack Track</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
          {s.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 3 }}>START DATE</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={12} color="#4f46e5" /> {fmtDate(c.startDate)}
          </div>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 3 }}>END DATE</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={12} color="#4f46e5" /> {fmtDate(c.endDate)}
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={13} /> {total} / {c.maxStudents} students
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>{pct}% filled</span>
        </div>
        <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: c.status === 'COMPLETED' ? '#10b981' : '#4f46e5', borderRadius: 99 }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#94a3b8' }}>
        <span>{c._count?.tickets ?? 0} tickets</span>
        <span>·</span>
        <span>{c._count?.lessons ?? 0} lessons</span>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ flex: 1, padding: '9px', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          View Cohort <ChevronRight size={14} />
        </button>
        <button style={{ padding: '9px 14px', background: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
          Edit
        </button>
      </div>
    </div>
  )
}

const BLANK_FORM = { name:'', startDate:'', endDate:'', maxStudents:15 }

export default function Cohorts() {
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(BLANK_FORM)

  const { data: cohorts = [], isLoading, isError } = useQuery({
    queryKey: ['admin-cohorts'],
    queryFn: () => api.get('/admin/cohorts').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (body) => api.post('/admin/cohorts', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-cohorts'] }); setShowModal(false); setForm(BLANK_FORM) },
  })

  if (isLoading) return <AdminLayout title="Cohorts"><Spinner/></AdminLayout>
  if (isError)   return <AdminLayout title="Cohorts"><div style={{color:'#dc2626',padding:24}}>Failed to load cohorts.</div></AdminLayout>

  const active    = cohorts.filter(c => c.status === 'ACTIVE').length
  const totalStu  = cohorts.reduce((s, c) => s + (c._count?.students ?? 0), 0)

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <AdminLayout title="Cohorts">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Manage all cohorts and their student batches.</p>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
          <Plus size={16} /> New Cohort
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[['Total Cohorts', cohorts.length,'#4f46e5'],['Active Now', active,'#10b981'],['Total Students', totalStu,'#0f172a'],['Max Capacity', cohorts.reduce((s,c) => s+(c.maxStudents||0),0),'#f59e0b']].map(([l,v,c]) => (
          <div key={l} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 18px' }}>
            <div style={{ fontSize:12, color:'#94a3b8', fontWeight:600, marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
        {cohorts.map(c => <CohortCard key={c.id} c={c} />)}
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, width:440, boxShadow:'0 24px 64px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:'0 0 20px', color:'#0f172a' }}>Create New Cohort</h2>
            {[['Cohort Name','name','text','e.g. Cohort 4'],['Start Date','startDate','date',''],['End Date','endDate','date','']].map(([l,k,t,p]) => (
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>{l}</label>
                <input type={t} placeholder={p} value={form[k]} onChange={setField(k)}
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Max Students</label>
              <input type="number" value={form.maxStudents} onChange={setField('maxStudents')} min={1}
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button
                disabled={createMutation.isPending || !form.name || !form.startDate || !form.endDate}
                onClick={() => createMutation.mutate({ name: form.name, startDate: form.startDate, endDate: form.endDate, maxStudents: parseInt(form.maxStudents) || 15 })}
                style={{ flex:1, padding:12, background: (!form.name||!form.startDate||!form.endDate) ? '#e2e8f0' : '#4f46e5', color: (!form.name||!form.startDate||!form.endDate) ? '#94a3b8' : '#fff', fontWeight:700, fontSize:14, borderRadius:10, border:'none', cursor:'pointer' }}>
                {createMutation.isPending ? 'Creating…' : 'Create Cohort'}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ flex:1, padding:12, background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:14, borderRadius:10, border:'1px solid #e2e8f0', cursor:'pointer' }}>Cancel</button>
            </div>
            {createMutation.isError && (
              <div style={{ marginTop:10, fontSize:12, color:'#dc2626' }}>
                {createMutation.error?.response?.data?.error || 'Failed to create cohort'}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
