import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../../components/layout/AdminLayout'
import { Plus, Megaphone, Trash2 } from 'lucide-react'
import api from '../../lib/api'

const TYPE_STYLE = {
  SPRINT:  { bg:'#eef2ff', color:'#4f46e5', border:'#c7d2fe', label:'Sprint'  },
  SESSION: { bg:'#ecfdf5', color:'#065f46', border:'#a7f3d0', label:'Session' },
  GENERAL: { bg:'#f8fafc', color:'#475569', border:'#e2e8f0', label:'General' },
  UPDATE:  { bg:'#fffbeb', color:'#92400e', border:'#fde68a', label:'Update'  },
}

function Spinner() {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:300 }}>
      <div style={{ width:36,height:36,border:'4px solid #e2e8f0',borderTop:'4px solid #4f46e5',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const BLANK_FORM = { title:'', body:'', type:'SPRINT', audience:'All Students' }

export default function Announcements() {
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(BLANK_FORM)

  const { data: announcements = [], isLoading, isError } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: () => api.get('/admin/announcements').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (body) => api.post('/admin/announcements', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-announcements'] }); setShowModal(false); setForm(BLANK_FORM) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/announcements/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-announcements'] }),
  })

  if (isLoading) return <AdminLayout title="Announcements"><Spinner/></AdminLayout>
  if (isError)   return <AdminLayout title="Announcements"><div style={{color:'#dc2626',padding:24}}>Failed to load announcements.</div></AdminLayout>

  const pinned = announcements.filter(a => a.pinned).length
  const toAll  = announcements.filter(a => a.audience === 'All Students' || a.audience === 'All').length

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <AdminLayout title="Announcements">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Post updates, reminders, and session links to students.</p>
        <button onClick={() => setShowModal(true)} style={{ display:'flex', alignItems:'center', gap:8, background:'#4f46e5', color:'#fff', fontWeight:700, fontSize:14, padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer' }}>
          <Plus size={16} /> Post Announcement
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[['Total Posted', announcements.length,'#0f172a'],['Pinned', pinned,'#4f46e5'],['To All Students', toAll,'#10b981'],['This Week', announcements.length,'#f59e0b']].map(([l,v,c]) => (
          <div key={l} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 18px' }}>
            <div style={{ fontSize:12, color:'#94a3b8', fontWeight:600, marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {announcements.map(a => {
          const ts = TYPE_STYLE[a.type] || TYPE_STYLE.GENERAL
          const dateStr = a.createdAt
            ? new Date(a.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
            : '—'
          return (
            <div key={a.id} style={{ background:'#fff', border: a.pinned ? '1.5px solid #c7d2fe' : '1px solid #e2e8f0', borderRadius:16, padding:'20px 24px', position:'relative' }}>
              {a.pinned && (
                <div style={{ position:'absolute', top:16, right:48, fontSize:11, fontWeight:700, color:'#4f46e5', background:'#eef2ff', border:'1px solid #c7d2fe', padding:'2px 10px', borderRadius:999 }}>
                  📌 Pinned
                </div>
              )}
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:40, height:40, background:ts.bg, border:`1px solid ${ts.border}`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Megaphone size={18} color={ts.color} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                    <h3 style={{ fontSize:15, fontWeight:700, color:'#0f172a', margin:0 }}>{a.title}</h3>
                    <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:4, background:ts.bg, color:ts.color, border:`1px solid ${ts.border}` }}>{ts.label}</span>
                  </div>
                  <p style={{ fontSize:13, color:'#475569', lineHeight:1.6, margin:'0 0 12px' }}>{a.body}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <span style={{ fontSize:12, color:'#94a3b8' }}>📅 {dateStr}</span>
                    <span style={{ fontSize:12, color:'#94a3b8' }}>👥 {a.audience}</span>
                    {a.cohort && <span style={{ fontSize:12, color:'#94a3b8' }}>· {a.cohort.name}</span>}
                  </div>
                </div>
                <button onClick={() => deleteMutation.mutate(a.id)} disabled={deleteMutation.isPending}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'#e2e8f0', padding:4, marginLeft:8, flexShrink:0 }}
                  title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
        {announcements.length === 0 && (
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:40, textAlign:'center', color:'#94a3b8', fontSize:14 }}>
            No announcements yet. Post one above!
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, width:480, boxShadow:'0 24px 64px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:'0 0 20px', color:'#0f172a' }}>Post Announcement</h2>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Title</label>
              <input value={form.title} onChange={setField('title')} placeholder="e.g. Week 5 Sprint is live!"
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Message</label>
              <textarea rows={4} value={form.body} onChange={setField('body')} placeholder="Write your announcement…"
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box', resize:'vertical' }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Audience</label>
                <select value={form.audience} onChange={setField('audience')}
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none' }}>
                  <option>All Students</option><option>Cohort 3</option><option>Cohort 2</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Type</label>
                <select value={form.type} onChange={setField('type')}
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none' }}>
                  <option value="SPRINT">Sprint</option>
                  <option value="SESSION">Session</option>
                  <option value="GENERAL">General</option>
                  <option value="UPDATE">Update</option>
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button
                disabled={createMutation.isPending || !form.title || !form.body}
                onClick={() => createMutation.mutate({ title: form.title, body: form.body, type: form.type, audience: form.audience })}
                style={{ flex:1, padding:12, background: (!form.title||!form.body) ? '#e2e8f0' : '#4f46e5', color: (!form.title||!form.body) ? '#94a3b8' : '#fff', fontWeight:700, fontSize:14, borderRadius:10, border:'none', cursor:'pointer' }}>
                {createMutation.isPending ? 'Posting…' : 'Post Now'}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ flex:1, padding:12, background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:14, borderRadius:10, border:'1px solid #e2e8f0', cursor:'pointer' }}>Cancel</button>
            </div>
            {createMutation.isError && (
              <div style={{ marginTop:10, fontSize:12, color:'#dc2626' }}>
                {createMutation.error?.response?.data?.error || 'Failed to post'}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
