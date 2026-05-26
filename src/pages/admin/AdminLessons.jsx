import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../../components/layout/AdminLayout'
import { Plus, Eye, Upload } from 'lucide-react'
import api from '../../lib/api'

const STATUS_STYLE = {
  PUBLISHED: { bg:'#ecfdf5', color:'#065f46', border:'#a7f3d0', label:'Published' },
  DRAFT:     { bg:'#f8fafc', color:'#64748b', border:'#e2e8f0', label:'Draft'     },
}

function Spinner() {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:300 }}>
      <div style={{ width:36,height:36,border:'4px solid #e2e8f0',borderTop:'4px solid #4f46e5',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const BLANK_FORM = { lessonCode:'', title:'', week:'', duration:'', description:'', videoUrl:'' }

export default function AdminLessons() {
  const qc = useQueryClient()
  const [weekFilter, setWeekFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(BLANK_FORM)

  const { data: lessons = [], isLoading, isError } = useQuery({
    queryKey: ['admin-lessons'],
    queryFn: () => api.get('/admin/lessons').then(r => r.data),
  })

  const publishMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/lessons/${id}`, { status: 'PUBLISHED' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-lessons'] }),
  })

  const createMutation = useMutation({
    mutationFn: (body) => api.post('/admin/lessons', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-lessons'] }); setShowModal(false); setForm(BLANK_FORM) },
  })

  const weeks = ['All', '1','2','3','4','5','6','7','8','9','10','11','12']
  const filtered = weekFilter === 'All' ? lessons : lessons.filter(l => l.week === parseInt(weekFilter))

  const published = lessons.filter(l => l.status === 'PUBLISHED').length
  const drafts    = lessons.filter(l => l.status === 'DRAFT').length
  const totalViews = lessons.reduce((s, l) => s + (l.views || 0), 0)

  if (isLoading) return <AdminLayout title="Lessons"><Spinner/></AdminLayout>
  if (isError)   return <AdminLayout title="Lessons"><div style={{color:'#dc2626',padding:24}}>Failed to load lessons.</div></AdminLayout>

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <AdminLayout title="Lessons">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Manage and publish video lessons for each week.</p>
        <button onClick={() => setShowModal(true)} style={{ display:'flex', alignItems:'center', gap:8, background:'#4f46e5', color:'#fff', fontWeight:700, fontSize:14, padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer' }}>
          <Plus size={16} /> Add Lesson
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[['Total Lessons', lessons.length,'#0f172a'],['Published', published,'#10b981'],['Drafts', drafts,'#f59e0b'],['Total Views', totalViews,'#4f46e5']].map(([l,v,c]) => (
          <div key={l} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 18px' }}>
            <div style={{ fontSize:12, color:'#94a3b8', fontWeight:600, marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {weeks.map(w => (
          <button key={w} onClick={() => setWeekFilter(w)}
            style={{ padding:'7px 16px', fontSize:13, fontWeight:600, borderRadius:8, border:'1px solid #e2e8f0', cursor:'pointer', background: weekFilter===w ? '#4f46e5' : '#fff', color: weekFilter===w ? '#fff' : '#64748b' }}>
            {w === 'All' ? 'All Weeks' : `Week ${w}`}
          </button>
        ))}
      </div>

      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
              {['Code','Week','Title','Duration','Views','Status','Actions'].map((h,i) => (
                <th key={h} style={{ padding:'12px 16px', fontSize:11, fontWeight:700, color:'#94a3b8', textAlign: i>1 ? 'center' : 'left', textTransform:'uppercase', letterSpacing:'0.07em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => {
              const ss = STATUS_STYLE[l.status] || STATUS_STYLE.DRAFT
              return (
                <tr key={l.id} style={{ borderBottom: i < filtered.length-1 ? '1px solid #f8fafc':'none' }}>
                  <td style={{ padding:'13px 16px', fontSize:12, fontWeight:700, color:'#94a3b8', fontFamily:'monospace' }}>{l.lessonCode}</td>
                  <td style={{ padding:'13px 16px', fontSize:13, color:'#475569', textAlign:'center' }}>Week {l.week}</td>
                  <td style={{ padding:'13px 16px', fontSize:13, fontWeight:600, color:'#1e293b' }}>{l.title}</td>
                  <td style={{ padding:'13px 16px', fontSize:13, color:'#64748b', textAlign:'center' }}>{l.duration}</td>
                  <td style={{ padding:'13px 16px', fontSize:13, fontWeight:700, color:'#4f46e5', textAlign:'center' }}>{l.views ?? 0}</td>
                  <td style={{ padding:'13px 16px', textAlign:'center' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>{ss.label}</span>
                  </td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                      {l.videoUrl && (
                        <a href={l.videoUrl} target="_blank" rel="noreferrer" title="Preview"
                          style={{ padding:'6px 10px', background:'#eef2ff', border:'none', borderRadius:7, cursor:'pointer', color:'#4f46e5', display:'flex', alignItems:'center', textDecoration:'none' }}>
                          <Eye size={13} />
                        </a>
                      )}
                      {l.status === 'DRAFT' && (
                        <button title="Publish" disabled={publishMutation.isPending}
                          onClick={() => publishMutation.mutate(l.id)}
                          style={{ padding:'6px 10px', background:'#fef3c7', border:'none', borderRadius:7, cursor:'pointer', color:'#d97706', display:'flex', alignItems:'center' }}>
                          <Upload size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#94a3b8', fontSize:13 }}>No lessons found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, width:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:'0 0 20px', color:'#0f172a' }}>Add New Lesson</h2>
            {[['Lesson Code','lessonCode','text','e.g. W1D1'],['Title','title','text','e.g. Day 1 — GitHub Workflow'],['Week','week','number','1-12'],['Duration','duration','text','e.g. Day 1']].map(([l,k,t,p]) => (
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>{l}</label>
                <input type={t} placeholder={p} value={form[k]} onChange={setField(k)}
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>
                Lesson Content
                <span style={{ fontSize:11, fontWeight:400, color:'#94a3b8', marginLeft:8 }}>Paste the full lesson text here</span>
              </label>
              <textarea
                placeholder={'GOAL\nWrite the goal here...\n\nKEY CONCEPTS\n• Concept 1\n• Concept 2\n\nYOUR TASK\n1. Step one\n2. Step two'}
                value={form.description}
                onChange={setField('description')}
                rows={10}
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box', resize:'vertical', fontFamily:'inherit', lineHeight:1.6 }}
              />
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button
                disabled={createMutation.isPending || !form.lessonCode || !form.title || !form.week || !form.duration}
                onClick={() => createMutation.mutate({ ...form, week: parseInt(form.week), description: form.description || null })}
                style={{ flex:1, padding:12, background: (!form.lessonCode||!form.title||!form.week||!form.duration) ? '#e2e8f0' : '#4f46e5', color: (!form.lessonCode||!form.title||!form.week||!form.duration) ? '#94a3b8' : '#fff', fontWeight:700, fontSize:14, borderRadius:10, border:'none', cursor:'pointer' }}>
                {createMutation.isPending ? 'Saving…' : 'Save Lesson'}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ flex:1, padding:12, background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:14, borderRadius:10, border:'1px solid #e2e8f0', cursor:'pointer' }}>Cancel</button>
            </div>
            {createMutation.isError && (
              <div style={{ marginTop:10, fontSize:12, color:'#dc2626' }}>
                {createMutation.error?.response?.data?.error || 'Failed to create lesson'}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
