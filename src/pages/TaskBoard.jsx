import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Search, X, ExternalLink, Send, AlertCircle, CheckCircle2, Clock, Eye, GitPullRequest } from 'lucide-react'
import api from '../lib/api'

const COLS = [
  { id: 'UPCOMING',  label: 'Todo',        color: '#4f46e5', bg: '#eef2ff', icon: '○'  },
  { id: 'ACTIVE',    label: 'In Progress', color: '#f59e0b', bg: '#fff7ed', icon: '◑'  },
  { id: 'IN_REVIEW', label: 'Review',      color: '#7c3aed', bg: '#f5f3ff', icon: '◐'  },
  { id: 'REVIEWED',  label: 'Done',        color: '#10b981', bg: '#ecfdf5', icon: '●'  },
]

const P_STYLE = {
  HIGH:   { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  MEDIUM: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  LOW:    { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
}

function DueBadge({ dueDate, full = false }) {
  const now  = new Date()
  const due  = new Date(dueDate)
  const days = Math.ceil((due - now) / 86400000)

  let color, bg
  if (days < 0)      { color = '#dc2626'; bg = '#fef2f2' }
  else if (days <= 2){ color = '#dc2626'; bg = '#fef2f2' }
  else if (days <= 5){ color = '#d97706'; bg = '#fffbeb' }
  else               { color = '#6b7280'; bg = '#f9fafb' }

  const label = full
    ? due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : days < 0
      ? `${Math.abs(days)}d overdue`
      : days === 0 ? 'Due today'
      : `${days}d left`

  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, padding: '2px 7px', borderRadius: 5, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── Column Header ────────────────────────────────────────────────────────────

function ColHeader({ col, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: `2px solid ${col.color}20` }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color, boxShadow: `0 0 6px ${col.color}60` }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {col.label}
      </span>
      <span style={{
        marginLeft: 'auto',
        fontSize: 11,
        fontWeight: 700,
        color: col.color,
        background: col.bg,
        padding: '2px 9px',
        borderRadius: 999,
        minWidth: 22,
        textAlign: 'center',
      }}>
        {count}
      </span>
    </div>
  )
}

// ─── Ticket Card ─────────────────────────────────────────────────────────────

function TicketCard({ ticket: t, col, isSelected, onClick }) {
  const ps = P_STYLE[t.priority] || P_STYLE.MEDIUM

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: `1.5px solid ${isSelected ? col.color : '#e2e8f0'}`,
        borderTop: `3px solid ${col.color}`,
        borderRadius: '0 0 12px 12px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s, transform 0.15s',
        boxShadow: isSelected ? `0 0 0 3px ${col.color}20, 0 4px 12px rgba(0,0,0,0.08)` : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {/* Ticket code + priority */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
          {t.ticketCode}
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 5,
          background: ps.bg,
          color: ps.color,
          border: `1px solid ${ps.border}`,
          letterSpacing: '0.03em',
        }}>
          {t.priority}
        </span>
      </div>

      {/* Title */}
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.45, marginBottom: 10 }}>
        {t.title}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
          <Clock size={10} />
          Week {t.week} · {t.storyPoints} XP
        </div>
        {t.mySubmission?.score && (
          <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '2px 7px', borderRadius: 999 }}>
            {t.mySubmission.score}/100
          </span>
        )}
        {t.mySubmission && !t.mySubmission.score && (
          <span style={{ fontSize: 10, color: '#7c3aed', background: '#f5f3ff', padding: '2px 7px', borderRadius: 999, fontWeight: 600 }}>
            PR submitted
          </span>
        )}
      </div>
      {t.dueDate && t.status !== 'REVIEWED' && (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <DueBadge dueDate={t.dueDate} />
        </div>
      )}
    </div>
  )
}

// ─── I'm Stuck button ─────────────────────────────────────────────────────────

function StuckButton({ ticketId }) {
  const [sent, setSent]     = useState(false)
  const [sending, setSending] = useState(false)

  const handleStuck = useCallback(async () => {
    setSending(true)
    try {
      await api.post(`/student/tickets/${ticketId}/stuck`)
      setSent(true)
    } catch {}
    setSending(false)
  }, [ticketId])

  if (sent) return (
    <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      ✅ Mentor notified! Check Discord for help.
    </div>
  )

  return (
    <button
      onClick={handleStuck}
      disabled={sending}
      style={{ width: '100%', padding: '9px 14px', background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 10, color: '#c2410c', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 16, transition: 'background 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#fef3c7' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff7ed' }}
    >
      🆘 {sending ? 'Notifying mentor…' : "I'm Stuck — Raise Hand"}
    </button>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ ticket: sel, onClose, prUrl, setPrUrl, submitMutation }) {
  const col = COLS.find(c => c.id === sel.status) || COLS[0]
  const ps  = P_STYLE[sel.priority] || P_STYLE.MEDIUM

  return (
    <div style={{
      width: 360,
      flexShrink: 0,
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 18,
      padding: 24,
      position: 'sticky',
      top: 24,
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10,
            fontWeight: 700,
            color: col.color,
            background: col.bg,
            padding: '3px 9px',
            borderRadius: 999,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: col.color }} />
            {col.label}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 5 }}>
            {sel.ticketCode}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
            {sel.title}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#374151' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#94a3b8' }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Meta grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: sel.dueDate ? 10 : 20 }}>
        {[
          ['Priority', <span style={{ fontSize: 12, fontWeight: 700, color: ps.color }}>{sel.priority}</span>],
          ['Status',   <span style={{ fontSize: 12, color: '#374151' }}>{sel.status.replace('_', ' ')}</span>],
          ['Week',     <span style={{ fontSize: 12, color: '#374151' }}>Week {sel.week}</span>],
          ['XP',       <span style={{ fontSize: 12, color: '#374151' }}>{sel.storyPoints} XP</span>],
        ].map(([k, v]) => (
          <div key={k} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{k}</div>
            {v}
          </div>
        ))}
      </div>
      {sel.dueDate && (
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Due Date</div>
            <span style={{ fontSize: 12, color: '#374151' }}>
              {new Date(sel.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          {sel.status !== 'REVIEWED' && <DueBadge dueDate={sel.dueDate} />}
        </div>
      )}

      {/* Description */}
      {sel.description && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Description</div>
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{sel.description}</div>
        </div>
      )}

      {/* I'm Stuck */}
      <StuckButton ticketId={sel.id}/>

      {/* Submission section */}
      {sel.mySubmission ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* PR link */}
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <CheckCircle2 size={13} color="#10b981" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>PR SUBMITTED</span>
            </div>
            <a href={sel.mySubmission.prUrl} target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: '#4f46e5', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
              <ExternalLink size={10}/> {sel.mySubmission.prUrl}
            </a>
          </div>

          {/* AI Review */}
          {(() => {
            const sub = sel.mySubmission
            const review = sub.aiReview ? (() => { try { return JSON.parse(sub.aiReview) } catch { return null } })() : null

            const VERDICT = {
              MERGE_READY:   { label: '✅ Merge Ready',    bg: '#ecfdf5', border: '#a7f3d0', color: '#059669' },
              NEEDS_CHANGES: { label: '🔄 Needs Changes',  bg: '#fff7ed', border: '#fed7aa', color: '#c2410c' },
              MAJOR_REWORK:  { label: '❌ Major Rework',   bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
            }

            if (sub.aiReview === null && !sub.verdict) {
              return (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid #e2e8f0', borderTop: '2px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 8 }}/>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>AI is reviewing your code…</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Usually takes 30–60 seconds. Refresh to check.</div>
                </div>
              )
            }

            if (!review) return null

            const v = VERDICT[review.verdict] || VERDICT.NEEDS_CHANGES

            return (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>

                {/* Verdict header */}
                <div style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: '10px 10px 0 0', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: v.color }}>{v.label}</span>
                  {sub.score && <span style={{ fontSize: 18, fontWeight: 800, color: sub.score >= 90 ? '#059669' : '#4f46e5' }}>{sub.score}/100</span>}
                </div>

                {/* Summary */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                  {review.summary}
                </div>

                {/* Done well */}
                {review.done_well?.length > 0 && (
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#059669', letterSpacing: '0.07em', marginBottom: 6 }}>WHAT YOU DID WELL</div>
                    {review.done_well.map((d, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                        <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span> {d}
                      </div>
                    ))}
                  </div>
                )}

                {/* Improve */}
                {review.improve?.length > 0 && (
                  <div style={{ padding: '10px 14px', borderBottom: review.security_issues?.length ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#c2410c', letterSpacing: '0.07em', marginBottom: 6 }}>IMPROVE</div>
                    {review.improve.map((d, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                        <span style={{ color: '#f59e0b', flexShrink: 0 }}>→</span> {d}
                      </div>
                    ))}
                  </div>
                )}

                {/* Security issues */}
                {review.security_issues?.length > 0 && (
                  <div style={{ padding: '10px 14px', background: '#fef2f2' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', letterSpacing: '0.07em', marginBottom: 6 }}>⚠️ SECURITY ISSUES</div>
                    {review.security_issues.map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#dc2626', marginBottom: 4, lineHeight: 1.5 }}>{s}</div>
                    ))}
                  </div>
                )}

                {/* Criteria checklist */}
                {review.criteria_results?.length > 0 && (
                  <details style={{ borderTop: '1px solid #f1f5f9' }}>
                    <summary style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#94a3b8', cursor: 'pointer', letterSpacing: '0.07em' }}>
                      CHECKLIST ({review.criteria_results.filter(c => c.pass).length}/{review.criteria_results.length} passed)
                    </summary>
                    <div style={{ padding: '0 14px 10px' }}>
                      {review.criteria_results.map((c, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 11, color: c.pass ? '#374151' : '#dc2626', lineHeight: 1.5 }}>
                          <span style={{ flexShrink: 0 }}>{c.pass ? '✅' : '❌'}</span>
                          <span><strong>{c.criterion}</strong>{c.note ? ` — ${c.note}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )
          })()}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Submit Your Work
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '3px 3px 3px 12px' }}>
            <GitPullRequest size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
            <input
              value={prUrl}
              onChange={e => setPrUrl(e.target.value)}
              placeholder="https://github.com/you/repo/pull/…"
              style={{
                flex: 1, padding: '8px 0', border: 'none', fontSize: 12,
                outline: 'none', background: 'transparent', color: '#374151',
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
          <button
            disabled={!prUrl || submitMutation.isPending}
            onClick={() => submitMutation.mutate({ id: sel.id, prUrl })}
            style={{
              width: '100%', padding: '10px',
              background: prUrl ? '#4f46e5' : '#f1f5f9',
              color: prUrl ? '#fff' : '#94a3b8',
              fontWeight: 700, fontSize: 13, borderRadius: 10, border: 'none',
              cursor: prUrl ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'background 0.15s, box-shadow 0.15s',
              boxShadow: prUrl ? '0 2px 8px rgba(79,70,229,0.3)' : 'none',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => { if (prUrl) e.currentTarget.style.background = '#4338ca' }}
            onMouseLeave={e => { if (prUrl) e.currentTarget.style.background = '#4f46e5' }}
          >
            <Send size={13} />
            {submitMutation.isPending ? 'Submitting…' : 'Submit for Review'}
          </button>
          <div style={{ marginTop: 14, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, letterSpacing: '0.06em' }}>WHAT HAPPENS NEXT</div>
            {[
              { step: '1', text: 'AI reviews your code in 30–60 seconds', color: '#4f46e5' },
              { step: '2', text: 'Mentor grades your PR within 24 hours',  color: '#7c3aed' },
              { step: '3', text: 'You get notified with your score',        color: '#059669' },
            ].map(({ step, text, color }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${color}18`, color, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── TaskBoard ────────────────────────────────────────────────────────────────

export default function TaskBoard() {
  const qc = useQueryClient()
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [prUrl,    setPrUrl]    = useState('')

  const { data: tickets = [], isLoading, isError } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => api.get('/student/tickets').then(r => r.data),
  })

  const submitMutation = useMutation({
    mutationFn: ({ id, prUrl }) => api.post(`/student/tickets/${id}/submit`, { prUrl }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets'] })
      setPrUrl('')
    },
  })

  const filtered = tickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.ticketCode.toLowerCase().includes(search.toLowerCase())
  )

  const byCol = (colId) => filtered.filter(t => t.status === colId)

  if (isLoading) return <DashboardLayout title="Task Board"><Spinner /></DashboardLayout>
  if (isError) return (
    <DashboardLayout title="Assignments">
      <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 14, padding: '20px 24px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlertCircle size={16} /> Failed to load tickets.
      </div>
    </DashboardLayout>
  )

  const sel = selected ? tickets.find(t => t.id === selected) : null

  return (
    <DashboardLayout title="Assignments">

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets…"
            style={{
              paddingLeft: 34,
              paddingRight: 14,
              paddingTop: 9,
              paddingBottom: 9,
              fontSize: 13,
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              outline: 'none',
              width: 240,
              background: '#fff',
              fontFamily: "'Inter', sans-serif",
              color: '#374151',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            onFocus={e => { e.target.style.borderColor = '#a5b4fc'; e.target.style.boxShadow = '0 0 0 3px rgba(165,180,252,0.15)' }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {COLS.map(col => (
            <span key={col.id} style={{
              fontSize: 12, fontWeight: 600, color: col.color,
              background: col.bg, padding: '5px 12px', borderRadius: 999,
            }}>
              {col.label} ({byCol(col.id).length})
            </span>
          ))}
        </div>
        <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 'auto' }}>
          {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Kanban columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, flex: 1, minWidth: 0 }}>
          {COLS.map(col => {
            const colTickets = byCol(col.id)
            return (
              <div key={col.id} style={{ minWidth: 0 }}>
                <ColHeader col={col} count={colTickets.length} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {colTickets.length === 0 ? (
                    <div style={{
                      border: `2px dashed ${col.color}30`,
                      borderRadius: 12,
                      padding: '28px 16px',
                      textAlign: 'center',
                      color: '#cbd5e1',
                      fontSize: 12,
                    }}>
                      No tickets
                    </div>
                  ) : (
                    colTickets.map(t => (
                      <TicketCard
                        key={t.id}
                        ticket={t}
                        col={col}
                        isSelected={selected === t.id}
                        onClick={() => {
                          setSelected(selected === t.id ? null : t.id)
                          setPrUrl(t.mySubmission?.prUrl || '')
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        {sel && (
          <DetailPanel
            ticket={sel}
            onClose={() => setSelected(null)}
            prUrl={prUrl}
            setPrUrl={setPrUrl}
            submitMutation={submitMutation}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
