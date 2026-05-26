import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, ArrowRight, GitMerge, Check, AlertTriangle, Terminal } from 'lucide-react'

const C = {
  bg:      '#0D1117',
  surface: '#161B22',
  surface2:'#21262D',
  surface3:'#0D1117',
  border:  '#30363D',
  border2: '#3D444D',
  text:    '#E6EDF3',
  text2:   '#8B949E',
  text3:   '#6E7681',
  accent:  '#3B82F6',
  green:   '#3FB950',
  red:     '#F85149',
  amber:   '#F59E0B',
  purple:  '#A78BFA',
}

const glow = (color, size = 10) => `0 0 ${size}px ${color}44, 0 0 ${size * 2}px ${color}18`

// ─── PR Review Terminal Card ───────────────────────────────────────────────────
function PRReviewCard() {
  const checks = [
    { ok: true,  text: 'HMAC-SHA256 signature verification' },
    { ok: true,  text: 'Server-side amount calculation'     },
    { ok: true,  text: 'Razorpay keys loaded from .env'     },
    { ok: false, text: 'Add idempotency key on retry'       },
  ]
  return (
    <div style={{
      background: C.surface2, border: `1px solid ${C.border2}`,
      borderLeft: `3px solid ${C.green}`, borderRadius: 6,
      overflow: 'hidden', fontFamily: 'JetBrains Mono, monospace',
    }}>
      {/* Terminal bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#F85149', '#F59E0B', '#3FB950'].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        <span style={{ fontSize: 10, color: C.text3 }}>devforge — pr-review</span>
        <div style={{ width: 44 }} />
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Command */}
        <div style={{ fontSize: 10, color: C.text3, marginBottom: 10 }}>
          <span style={{ color: C.amber }}>$ </span>gh pr merge rf-3-razorpay --auto
        </div>

        {/* Merge line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <GitMerge size={13} color={C.purple} />
          <span style={{ fontSize: 11, color: C.purple, fontWeight: 700 }}>PR #12 merged into main</span>
        </div>

        {/* Ticket + Branch */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '10px 12px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>RF-3 · Razorpay Payment Integration</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: C.green, border: `1px solid ${C.green}44`, padding: '1px 7px', borderRadius: 3 }}>APPROVED</span>
            </div>
          </div>
          <div style={{ fontSize: 9, color: C.text3 }}>
            branch: <span style={{ color: C.accent }}>rf-3-payment-flow</span> · Week 5
          </div>
        </div>

        {/* Score + checks */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.green, lineHeight: 1, textShadow: glow(C.green) }}>91</div>
            <div style={{ fontSize: 8, color: C.text3, marginTop: 3, letterSpacing: '0.08em' }}>/ 100</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {checks.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ flexShrink: 0 }}>
                  {c.ok
                    ? <Check size={10} color={C.green} />
                    : <AlertTriangle size={10} color={C.amber} />
                  }
                </div>
                <span style={{ fontSize: 9, color: c.ok ? C.text2 : C.amber, lineHeight: 1.4 }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor comment */}
        <div style={{ background: C.surface, borderLeft: `2px solid ${C.accent}`, padding: '8px 10px', borderRadius: '0 4px 4px 0' }}>
          <div style={{ fontSize: 9, color: C.text3, marginBottom: 4, letterSpacing: '0.06em' }}>MENTOR FEEDBACK</div>
          <p style={{ fontSize: 10, color: C.text2, margin: 0, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
            "Clean implementation. HMAC verification is exactly right. Add the idempotency check before Week 6 deploy."
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Activity feed ─────────────────────────────────────────────────────────────
function ActivityFeed() {
  const items = [
    { dot: C.green,  text: 'Karan merged LB-3 · GST Invoice API',    time: '2h ago'  },
    { dot: C.amber,  text: 'Divya submitted RF-5 · Socket.io PR',     time: '4h ago'  },
    { dot: C.accent, text: 'Week 6 lessons published for Cohort 3',   time: '1d ago'  },
  ]
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.12em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 10 }}>COHORT 3 · RECENT ACTIVITY</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.dot, flexShrink: 0, marginTop: 4 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: C.text2, fontFamily: "'Inter', sans-serif" }}>{item.text}</span>
            </div>
            <span style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Brand / Left Panel ────────────────────────────────────────────────────────
function BrandPanel() {
  const stats = [
    { value: '65+', label: 'PRs merged'    },
    { value: '12',  label: 'weeks'         },
    { value: '3',   label: 'apps shipped'  },
  ]
  return (
    <div style={{
      width: '52%', flexShrink: 0,
      background: C.bg,
      borderRight: `1px solid ${C.border}`,
      padding: '40px 48px',
      display: 'flex', flexDirection: 'column', gap: 28,
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, ${C.border}88 1px, transparent 1px)`,
        backgroundSize: '28px 28px', opacity: 0.6,
      }} />

      {/* Faint glow */}
      <div style={{
        position: 'absolute', top: -120, right: -80, width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${C.accent}0D 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Logo row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow(C.accent) }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono,monospace' }}>DF</span>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: '-0.02em' }}>DevForge</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, border: `1px solid ${C.green}44`, padding: '4px 10px', borderRadius: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: glow(C.green, 6),
            animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 10, color: C.green, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.08em' }}>COHORT 3 ACTIVE</span>
        </div>
      </div>

      {/* Headline */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 42, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.text, margin: '0 0 4px' }}>
          Build real<br />
          <span style={{ color: C.accent }}>products.</span>
        </h2>
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 42, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.text3, margin: '0 0 16px' }}>
          Get hired.
        </h2>
        <p style={{ fontSize: 13, color: C.text3, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", maxWidth: 360 }}>
          Merge 65+ real pull requests across 3 production projects. Every PR gets reviewed — by AI and a mentor.
        </p>
      </div>

      {/* PR Review Card */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Terminal size={12} color={C.text3} />
          <span style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.08em' }}>LATEST REVIEW · RF-3</span>
        </div>
        <PRReviewCard />
      </div>

      {/* Activity Feed */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ActivityFeed />
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 0, borderTop: `1px solid ${C.border}`, paddingTop: 20, position: 'relative', zIndex: 1 }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            flex: 1,
            borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none',
            paddingRight: i < stats.length - 1 ? 20 : 0,
            paddingLeft: i > 0 ? 20 : 0,
          }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: C.text3, marginTop: 2, fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>
    </div>
  )
}

// ─── Login Form / Right Panel ──────────────────────────────────────────────────
function LoginForm() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const setAuth  = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Both fields are required.'); return }
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.user, data.accessToken, data.refreshToken)
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    border: `1px solid ${C.border}`,
    background: C.surface2,
    color: C.text, outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    borderRadius: 4,
  }

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 56px', background: C.surface, position: 'relative', overflow: 'hidden',
    }}>

      {/* Subtle top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.accent}, ${C.purple})` }} />

      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 3, height: 20, background: C.accent, borderRadius: 2 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.12em', fontFamily: "'Inter', sans-serif" }}>
              STUDENT PORTAL
            </span>
          </div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 30, fontWeight: 800, color: C.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: C.text3, fontFamily: "'Inter', sans-serif", lineHeight: 1.6, margin: 0 }}>
            Sign in to continue building.
          </p>
        </div>

        {/* Cohort status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: `${C.green}0F`, border: `1px solid ${C.green}33`,
          padding: '8px 12px', borderRadius: 6, marginBottom: 24,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flexShrink: 0, animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, color: C.green, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            Cohort 3 is active — Week 1 in progress
          </span>
        </div>

        {/* Error */}
        {error && (
          <div style={{ border: `1px solid ${C.red}55`, background: `${C.red}0A`, color: C.red, fontSize: 12, fontFamily: "'Inter', sans-serif", padding: '10px 14px', borderRadius: 4, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.text3, letterSpacing: '0.08em', marginBottom: 7, fontFamily: "'Inter', sans-serif" }}>
              EMAIL
            </label>
            <input
              type="email" name="email" value={form.email}
              onChange={e => { setError(''); setForm({ ...form, email: e.target.value }) }}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = glow(C.accent, 8) }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.text3, letterSpacing: '0.08em', marginBottom: 7, fontFamily: "'Inter', sans-serif" }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                name="password" value={form.password}
                onChange={e => { setError(''); setForm({ ...form, password: e.target.value }) }}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = glow(C.accent, 8) }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
              />
              <button
                type="button" onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.text3, display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? `${C.accent}aa` : C.accent,
              color: '#fff', fontWeight: 700, fontSize: 13,
              fontFamily: "'Inter', sans-serif", letterSpacing: '0.06em',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 0.15s, box-shadow 0.2s', marginTop: 4,
              boxShadow: loading ? 'none' : glow(C.accent, 12),
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {loading ? (
              <>
                <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Signing in…
              </>
            ) : (
              <>SIGN IN <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.text3, fontFamily: "'Inter', sans-serif", lineHeight: 1.7, margin: '0 0 8px' }}>
            Not enrolled yet?{' '}
            <a href="/" style={{ color: C.accent, textDecoration: 'none', fontWeight: 700 }}>Apply for Cohort 3 →</a>
          </p>
          <p style={{ fontSize: 11, color: C.text3, fontFamily: 'JetBrains Mono,monospace', margin: 0 }}>
            support@devforge.in
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Login() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <BrandPanel />
      <LoginForm />
    </div>
  )
}
