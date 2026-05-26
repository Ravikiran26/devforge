import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const C = {
  bg:      '#0D1117',
  surface: '#161B22',
  border:  '#30363D',
  border2: '#3D444D',
  text:    '#E6EDF3',
  text2:   '#8B949E',
  text3:   '#6E7681',
  accent:  '#3B82F6',
  red:     '#F85149',
}

function BrandPanel() {
  const stats = [
    { value: '65+', label: 'PRs merged'    },
    { value: '12',  label: 'Weeks'         },
    { value: '3',   label: 'Apps deployed' },
  ]

  return (
    <div style={{
      width: '46%',
      background: C.bg,
      borderRight: `1px solid ${C.border}`,
      padding: '52px 56px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:26, height:26, background:C.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:10, fontWeight:800, color:'#fff', fontFamily:'JetBrains Mono,monospace' }}>DF</span>
        </div>
        <span style={{ fontFamily:"'Inter', sans-serif", fontWeight:700, fontSize:16, color:C.text, letterSpacing:'-0.02em' }}>
          DevForge
        </span>
      </div>

      {/* Main copy */}
      <div>
        <div style={{ fontSize:11, fontWeight:600, color:C.accent, letterSpacing:'0.12em', fontFamily:"'Inter', sans-serif", marginBottom:20 }}>
          COHORT 3 — ACTIVE
        </div>

        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: C.text,
          margin: '0 0 6px',
        }}>
          Build real<br/>
          <span style={{ color:C.accent }}>products.</span>
        </h2>
        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: C.text2,
          margin: '0 0 32px',
        }}>
          Get hired.
        </h2>

        <p style={{ fontSize:14, color:C.text3, lineHeight:1.75, fontFamily:"'Inter', sans-serif", maxWidth:340 }}>
          Merge 65+ real pull requests, ship 3 production projects, and land your first developer role in 12 weeks.
        </p>

        {/* Stats */}
        <div style={{ display:'flex', gap:0, marginTop:40, borderTop:`1px solid ${C.border}`, paddingTop:32 }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              flex:1,
              borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none',
              paddingRight: i < stats.length - 1 ? 28 : 0,
              paddingLeft: i > 0 ? 28 : 0,
            }}>
              <div style={{ fontFamily:"'Inter', sans-serif", fontSize:30, fontWeight:700, color:C.text, letterSpacing:'-0.02em' }}>{s.value}</div>
              <div style={{ fontSize:11, color:C.text3, marginTop:4, fontFamily:"'Inter', sans-serif", fontWeight:500, letterSpacing:'0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:28 }}>
        <p style={{ fontSize:13, color:C.text2, lineHeight:1.75, fontFamily:"'Inter', sans-serif", margin:'0 0 16px' }}>
          "DevForge didn't just teach me to code — it taught me how to work like a real developer. I had 3 interviews lined up before the program even ended."
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:28, height:28, background:C.accent,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight:800, fontSize:11, fontFamily:"'Inter', sans-serif",
          }}>P</div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:C.text, fontFamily:"'Inter', sans-serif" }}>Priya Sharma</div>
            <div style={{ fontSize:11, color:C.text3, fontFamily:'JetBrains Mono,monospace', marginTop:1 }}>Cohort 2 Graduate · Bengaluru</div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
      setLoading(false) }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    border: `1px solid ${C.border}`,
    background: C.surface,
    color: C.text,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.12s',
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 64px',
      background: C.surface,
    }}>
      <div style={{ width:'100%', maxWidth:360 }}>

        {/* Header */}
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.accent, letterSpacing:'0.12em', fontFamily:"'Inter', sans-serif", marginBottom:14 }}>
            STUDENT PORTAL
          </div>
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 28, fontWeight: 700,
            color: C.text, margin:'0 0 8px', letterSpacing:'-0.02em',
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize:13, color:C.text3, fontFamily:"'Inter', sans-serif", lineHeight:1.6 }}>
            Sign in with your enrolled email address.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            border:`1px solid ${C.red}`,
            color: C.red,
            fontSize: 12, fontFamily:"'Inter', sans-serif",
            padding: '10px 14px',
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:C.text3, letterSpacing:'0.08em', marginBottom:7, fontFamily:"'Inter', sans-serif" }}>
              EMAIL
            </label>
            <input
              type="email" name="email" value={form.email}
              onChange={e => { setError(''); setForm({...form, email:e.target.value}) }}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:C.text3, letterSpacing:'0.08em', marginBottom:7, fontFamily:"'Inter', sans-serif" }}>
              PASSWORD
            </label>
            <div style={{ position:'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                name="password" value={form.password}
                onChange={e => { setError(''); setForm({...form, password:e.target.value}) }}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ ...inputStyle, paddingRight:44 }}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              <button
                type="button" onClick={() => setShow(!show)}
                style={{
                  position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer',
                  color:C.text3, display:'flex', alignItems:'center', padding:0,
                }}
              >
                {show ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width:'100%', padding:'12px',
              background: loading ? C.accent + 'aa' : C.accent,
              color: '#fff',
              fontWeight: 700, fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.06em',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems:'center', justifyContent:'center', gap:8,
              transition: 'opacity 0.15s',
              marginTop: 4,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {loading ? (
              <>
                <span style={{
                  width:14, height:14,
                  border:'2px solid rgba(12,11,9,0.3)', borderTopColor:'#0D1117',
                  borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite',
                }}/>
                Signing in…
              </>
            ) : (
              <>SIGN IN <ArrowRight size={14}/></>
            )}
          </button>
        </form>

        <div style={{ marginTop:32, paddingTop:28, borderTop:`1px solid ${C.border}` }}>
          <p style={{ fontSize:12, color:C.text3, fontFamily:"'Inter', sans-serif", lineHeight:1.6 }}>
            Not enrolled?{' '}
            <a href="/" style={{ color:C.accent, textDecoration:'none', fontWeight:600 }}>Apply for the program →</a>
          </p>
          <p style={{ fontSize:11, color:C.text3, fontFamily:'JetBrains Mono,monospace', marginTop:8 }}>
            support@devforge.in
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function Login() {
  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter', sans-serif" }}>
      <BrandPanel/>
      <LoginForm/>
    </div>
  )
}
