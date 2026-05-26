import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

// ─── Amber Terminal tokens ────────────────────────────────────────────────────
const C = {
  bg:      '#090805',
  surface: '#100D08',
  surface2:'#18140D',
  border:  '#2A2015',
  border2: '#3D2E18',
  text:    '#FDE68A',
  text2:   '#E2B96A',
  text3:   '#B08A40',
  accent:  '#F59E0B',
  green:   '#6EE7B7',
  red:     '#FCA5A5',
  dim:     '#3D2E1888',
}

const PILOT_SEATS_LEFT = 20

const glow  = (color = C.accent, size = 12) => `0 0 ${size}px ${color}55, 0 0 ${size * 2}px ${color}22`
const fade  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } }
const viewportOnce = { once: true, margin: '-40px' }

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 48) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return displayed
}

// ─── Scan line card ───────────────────────────────────────────────────────────
function ScanCard({ children, style = {} }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
      <AnimatePresence>
        {hov && (
          <motion.div
            key="scan"
            initial={{ top: '-4%' }} animate={{ top: '108%' }} exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none',
              background: `rgba(245,158,11,0.35)`,
              boxShadow: `0 0 12px rgba(245,158,11,0.6)`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Cursor blink ─────────────────────────────────────────────────────────────
function Cursor() {
  return (
    <>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'steps(1)' }}
        style={{ display: 'inline-block', width: 10, height: '1em', background: C.accent, marginLeft: 3, verticalAlign: 'text-bottom', boxShadow: glow() }}
      />
      <style>{`@keyframes scanPulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </>
  )
}

// ─── Scroll progress ──────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: C.accent, scaleX, transformOrigin: 'left', zIndex: 100, boxShadow: glow() }} />
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onApply }) {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        position: 'fixed', top: 2, left: 0, right: 0, zIndex: 50, height: 56,
        background: scrolled ? `rgba(9,8,5,0.97)` : 'transparent',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.3s, border-color 0.3s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 26, height: 26, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow() }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#000', fontFamily: 'JetBrains Mono,monospace' }}>DF</span>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: '0.04em' }}>DevForge</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        {['Projects', 'Curriculum', 'Pricing'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`}
            style={{ fontSize: 12, fontWeight: 600, color: C.text3, textDecoration: 'none', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.06em', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = C.accent}
            onMouseLeave={e => e.currentTarget.style.color = C.text3}
          >{l}</a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: C.text3, fontFamily: 'JetBrains Mono,monospace', padding: '6px 12px', transition: 'color 0.15s', letterSpacing: '0.06em' }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.text3}
        >LOGIN</button>
        <button onClick={onApply}
          style={{ background: C.accent, border: `1px solid ${C.accent}`, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '8px 20px', letterSpacing: '0.08em', transition: 'box-shadow 0.15s, opacity 0.15s', boxShadow: glow() }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >APPLY →</button>
      </div>
    </motion.nav>
  )
}

// ─── Dashboard mockup ─────────────────────────────────────────────────────────
function DashboardMockup({ embedded = false }) {
  const tickets = [
    { code: 'LB-005', title: 'Invoice PDF upload — Cloudinary', status: 'In Review',   color: C.red    },
    { code: 'LB-006', title: 'Dashboard revenue aggregation',    status: 'In Progress', color: C.accent },
    { code: 'LB-007', title: 'Role-based access — admin panel',  status: 'Todo',        color: C.text3  },
  ]
  return (
    <div style={{ width: '100%', height: '100%', fontFamily: 'JetBrains Mono,monospace', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 12, padding: 12, flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Welcome */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, color: C.text3, marginBottom: 4 }}>{'>'} ./devforge --week=5 --project=billing-saas</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, textShadow: glow(C.text, 8) }}>Welcome back, Ravikiran</div>
            <div style={{ height: 2, background: C.border, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '50%', background: C.accent, boxShadow: glow() }} />
            </div>
            <div style={{ fontSize: 9, color: C.text3, marginTop: 4 }}>50% complete · 5 weeks remaining</div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: C.border }}>
            {[{ l: 'PRS MERGED', v: '24', c: C.green }, { l: 'LESSONS', v: '18', c: C.accent }, { l: 'AVG GRADE', v: '91', c: C.text2 }].map(s => (
              <div key={s.l} style={{ background: C.surface, padding: '10px 12px', borderTop: `2px solid ${s.c}` }}>
                <div style={{ fontSize: 8, color: C.text3, marginBottom: 4, letterSpacing: '0.1em' }}>{s.l}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.c, textShadow: glow(s.c, 8) }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Tickets */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: C.text3, marginBottom: 6, letterSpacing: '0.1em' }}>ACTIVE TICKETS</div>
            {tickets.map(t => (
              <div key={t.code} style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `2px solid ${t.color}`, padding: '8px 12px', marginBottom: 6 }}>
                <div style={{ fontSize: 9, color: C.text3, marginBottom: 3 }}>{t.code}</div>
                <div style={{ fontSize: 11, color: C.text2 }}>{t.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.color }} />
                  <span style={{ fontSize: 9, color: C.text3 }}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '12px 14px', flex: 1 }}>
            <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.1em', marginBottom: 10 }}>THIS WEEK'S GOALS</div>
            {[{ l: 'Cloudinary upload endpoint', d: true }, { l: 'Invoice PDF generation', d: true }, { l: 'Dashboard revenue query', d: false }].map((g, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '5px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ width: 11, height: 11, border: `1px solid ${g.d ? C.accent : C.border2}`, background: g.d ? C.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {g.d && <Check size={7} color="#000" />}
                </div>
                <span style={{ fontSize: 9, color: g.d ? C.text3 : C.text2, textDecoration: g.d ? 'line-through' : 'none' }}>{g.l}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, height: 2, background: C.border }}>
              <div style={{ height: '100%', width: '66%', background: C.accent, boxShadow: glow() }} />
            </div>
            <div style={{ fontSize: 9, color: C.accent, marginTop: 3 }}>2/3 done</div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.1em', marginBottom: 8 }}>LATEST PR REVIEW</div>
            <div style={{ fontSize: 9, color: C.text3, marginBottom: 8 }}>LB-005 · feat/cloudinary-upload</div>
            <div style={{ background: C.surface2, borderLeft: `2px solid ${C.green}`, padding: '6px 8px', marginBottom: 6 }}>
              <div style={{ fontSize: 9, color: C.green, marginBottom: 2 }}>✓ Logic correct</div>
              <div style={{ fontSize: 9, color: C.text3, lineHeight: 1.5 }}>Good use of multer. Add file size validation.</div>
            </div>
            <div style={{ background: C.surface2, borderLeft: `2px solid ${C.accent}`, padding: '6px 8px' }}>
              <div style={{ fontSize: 9, color: C.accent, marginBottom: 2 }}>⚠ Suggestion</div>
              <div style={{ fontSize: 9, color: C.text3, lineHeight: 1.5 }}>Store only the URL in DB, not full response.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onApply }) {
  const line1 = useTypewriter('Build 3 real products', 45)
  const line2 = useTypewriter('in 12 weeks.', 55)

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 96, background: C.bg, position: 'relative', overflow: 'hidden' }}>

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `radial-gradient(circle, ${C.accent}18 1px, transparent 1px)`,
        backgroundSize: '36px 36px',
      }} />

      {/* Scanline texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.28) 3px, rgba(0,0,0,0.28) 4px)`,
        opacity: 0.85,
      }} />

      {/* Amber glow orb — stronger */}
      <div style={{
        position: 'absolute', top: -140, left: '50%', transform: 'translateX(-50%)',
        width: 1000, height: 640, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${C.accent}30 0%, ${C.accent}0A 45%, transparent 68%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Side decorations — faint terminal lines */}
      <div style={{ position: 'absolute', left: 48, top: 160, zIndex: 0, pointerEvents: 'none', userSelect: 'none', opacity: 0.11, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: C.accent, lineHeight: 2 }}>
        {['$ git init', '$ npm install', '$ git add .', '$ git commit', '$ git push', '$ npm run dev', '$ git merge'].map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <div style={{ position: 'absolute', right: 48, top: 200, zIndex: 0, pointerEvents: 'none', userSelect: 'none', opacity: 0.11, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: C.green, lineHeight: 2, textAlign: 'right' }}>
        {['✓ tests passing', '✓ build success', '✓ linting clean', '✓ PR approved', '✓ deployed', '→ week 5 / 12'].map((l, i) => <div key={i}>{l}</div>)}
      </div>

      <div style={{ maxWidth: 1060, width: '100%', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Terminal badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: `1px solid ${C.border2}`, padding: '6px 16px', marginBottom: 40, fontFamily: 'JetBrains Mono,monospace' }}
        >
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, display: 'inline-block', boxShadow: glow(C.green) }}
          />
          <span style={{ fontSize: 11, color: C.text3, letterSpacing: '0.1em' }}>COHORT 3 · STARTING JULY 7 · {PILOT_SEATS_LEFT} SEATS LEFT</span>
        </motion.div>

        {/* Prompt line */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
          style={{ fontSize: 13, color: C.text3, fontFamily: 'JetBrains Mono,monospace', marginBottom: 16, letterSpacing: '0.04em' }}
        >
          <span style={{ color: C.accent }}>$ </span>./enroll --cohort=3 --track=fullstack
        </motion.div>

        {/* Typewriter headline */}
        <div style={{ marginBottom: 32, minHeight: 160 }}>
          <h1 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(32px, 4.8vw, 64px)', fontWeight: 700, color: C.text, lineHeight: 1.1, margin: '0 0 6px', letterSpacing: '-0.02em', textShadow: glow(C.text, 16), whiteSpace: 'nowrap' }}>
            {line1}{line1.length < 'Build 3 real products'.length && <Cursor />}
          </h1>
          <h1 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(32px, 4.8vw, 64px)', fontWeight: 700, color: C.accent, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em', textShadow: glow() }}>
            {line1.length >= 'Build 3 real products'.length && (
              <>{line2}{line2.length < 'in 12 weeks.'.length && <Cursor />}</>
            )}
            {line2.length >= 'in 12 weeks.'.length && <Cursor />}
          </h1>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 2.2 }}
          style={{ fontSize: 16, color: '#E8D5A3', lineHeight: 1.9, fontFamily: "'Inter', sans-serif", maxWidth: 560, margin: '0 auto 40px', textAlign: 'left' }}
        >
          Merge 65+ real pull requests, ship 3 production-grade apps, and build a GitHub profile that holds up in a technical interview.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 2.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 48 }}
        >
          <button onClick={onApply}
            style={{ background: C.accent, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '14px 36px', letterSpacing: '0.08em', transition: 'box-shadow 0.2s, opacity 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = glow(C.accent, 20); e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.opacity = '1' }}
          >ENROLL NOW <ArrowRight size={14} /></button>

          <a href="#projects"
            style={{ fontSize: 13, fontWeight: 600, color: C.text3, fontFamily: 'JetBrains Mono,monospace', textDecoration: 'none', border: `1px solid ${C.border2}`, padding: '13px 28px', letterSpacing: '0.06em', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.text3 }}
          >VIEW PROJECTS</a>
        </motion.div>

        {/* Trust */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 2.9 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}
        >
          {['No CS degree', '12-week program', 'GitHub workflow'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ color: C.green, fontSize: 11, fontFamily: 'JetBrains Mono,monospace', textShadow: glow(C.green, 6) }}>✓</span>
              <span style={{ fontSize: 12, color: C.text3, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.04em' }}>{b}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Static portal preview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3.2 }}
        style={{ width: '100%', maxWidth: 1060, padding: '48px 24px 0', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 10 }}>
            <span style={{ color: C.accent }}>$ </span>cat ./student-portal.preview
          </div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 700, color: C.text, letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0, textShadow: glow(C.text, 10) }}>
            Your dev environment<span style={{ color: C.text3 }}> from day one.</span>
          </h2>
        </div>

        {/* Window chrome */}
        <div style={{
          border: `1px solid ${C.border2}`,
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: `0 0 0 1px ${C.border}, 0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${C.accent}0D`,
        }}>
          {/* Title bar */}
          <div style={{ height: 36, background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[C.red, C.accent, C.green].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.75 }} />)}
            </div>
            <span style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>devforge — student-portal</span>
            <span style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>week 5 / 12</span>
          </div>
          <div style={{ height: 480 }}>
            <DashboardMockup embedded />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Tools marquee ────────────────────────────────────────────────────────────
function ToolsBar() {
  const tools = ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'GitHub', 'Vercel', 'JWT', 'Razorpay', 'Socket.io', 'Cloudinary', 'Railway', 'Claude API']
  const doubled = [...tools, ...tools]
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: C.text3, letterSpacing: '0.14em', whiteSpace: 'nowrap', padding: '14px 20px', borderRight: `1px solid ${C.border}`, fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>STACK</div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
          style={{ display: 'flex', width: 'max-content' }}
        >
          {doubled.map((t, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: 'JetBrains Mono,monospace', padding: '14px 22px', borderRight: `1px solid ${C.border}`, whiteSpace: 'nowrap', cursor: 'default', transition: 'color 0.15s, text-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.textShadow = glow() }}
              onMouseLeave={e => { e.currentTarget.style.color = C.text3; e.currentTarget.style.textShadow = 'none' }}
            >{t}</div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: '65+',   label: 'pull requests merged',  sub: 'per student · every one reviewed'   },
    { value: '3',     label: 'products shipped',      sub: 'deployed to production'              },
    { value: '12',    label: 'weeks',                 sub: 'from zero to job-ready portfolio'    },
    { value: '< 24h', label: 'mentor feedback',       sub: 'on every PR · no waiting days'       },
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}
          style={{ fontSize: 9, color: C.text3, letterSpacing: '0.16em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 52 }}
        ><span style={{ color: C.accent }}>$ </span>cat ./stats.log</motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}
              transition={{ delay: i * 0.1 }}
              style={{ paddingRight: i < 3 ? 44 : 0, paddingLeft: i > 0 ? 44 : 0, borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}
            >
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', color: C.accent, lineHeight: 1, marginBottom: 12, textShadow: glow(C.accent, 20) }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: C.text2, fontFamily: 'JetBrains Mono,monospace' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const projects = [
    { num:'01', name:'Ordering & Payments App',  weeks:'Weeks 5–6',  tag:'BACKEND & PAYMENTS',  desc:'Build a full-stack ordering system with server-side payment verification, real-time order tracking, and a live kitchen dashboard.', tags:['Node.js','Express','PostgreSQL','Prisma','Razorpay','Socket.io'], color:C.accent },
    { num:'02', name:'SaaS Billing Platform',    weeks:'Weeks 7–9',  tag:'FULL-STACK SAAS',      desc:'Build a multi-tenant billing SaaS — invoices, tax calculation, PDF generation, payment tracking, and a full React dashboard with live data.', tags:['React','pdf-lib','GST Logic','TanStack Query','Cloudinary'],      color:C.green  },
    { num:'03', name:'AI-Powered Web App',        weeks:'Weeks 10–11',tag:'AI & CI/CD',            desc:'Integrate an AI API for intelligent automation, set up GitHub Actions for CI/CD, and deploy a production-grade app with health monitoring.', tags:['Claude API','GitHub Actions','Nodemailer','Vercel','Railway'],    color:C.text2  },
  ]
  return (
    <section id="projects" style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>ls ./projects/</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', color: C.text, margin: 0, textShadow: glow(C.text, 8) }}>
            3 real products.<br /><span style={{ color: C.text3 }}>All on your GitHub.</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {projects.map((p, i) => (
            <motion.div key={p.num} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.12 }}>
              <ScanCard style={{ padding: '32px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none', borderTop: `2px solid ${p.color}`, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: p.color, fontWeight: 700, letterSpacing: '0.12em', textShadow: glow(p.color, 6) }}>{p.tag}</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: C.text3 }}>{p.weeks}</span>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 28, fontWeight: 700, color: C.text3, marginBottom: 8, letterSpacing: '-0.01em' }}>[{p.num}]</div>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 14px', letterSpacing: '-0.01em' }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.75, fontFamily: "'Inter', sans-serif", margin: '0 0 24px', opacity: 0.78 }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', border: `1px solid ${C.border}`, padding: '3px 8px', letterSpacing: '0.04em' }}>{t}</span>
                  ))}
                </div>
              </ScanCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Curriculum ───────────────────────────────────────────────────────────────
function Curriculum() {
  const weeks = [
    { w:1,  title:'Git, JavaScript, APIs & Developer Workflow',          tag:'foundations' },
    { w:2,  title:'Node.js, Express, PostgreSQL & Prisma',               tag:'backend'     },
    { w:3,  title:'React — State, Forms & TanStack Query',               tag:'frontend'    },
    { w:4,  title:'Authentication — JWT, Refresh Tokens & RBAC',         tag:'auth'        },
    { w:5,  title:'Project 1 — Payments, APIs & Backend Logic',          tag:'project_1'   },
    { w:6,  title:'Project 1 — Real-Time Features & Full Deploy',        tag:'project_1'   },
    { w:7,  title:'Project 2 — SaaS Backend & Business Logic',           tag:'project_2'   },
    { w:8,  title:'Project 2 — PDF Generation, React & Payments',        tag:'project_2'   },
    { w:9,  title:'Project 2 — Dashboard, Forms & Deploy',               tag:'project_2'   },
    { w:10, title:'Project 3 — AI API Integration & Email Notifications', tag:'project_3'   },
    { w:11, title:'Project 3 — CI/CD Pipeline, React & Production',      tag:'project_3'   },
    { w:12, title:'Career Week — Resume, LinkedIn & Job Strategy',        tag:'career'      },
  ]
  const tagCol = { foundations:C.text3, backend:C.accent, frontend:'#22D3EE', auth:C.text2, project_1:C.green, project_2:'#FBBF24', project_3:C.red, career:C.text2 }

  return (
    <section id="curriculum" style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 80 }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ position: 'sticky', top: 80 }}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>cat ./curriculum.md</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 32, fontWeight: 700, color: C.text, margin: '0 0 16px', lineHeight: 1.15, textShadow: glow(C.text, 8) }}>
            12 weeks.<br /><span style={{ color: C.text3 }}>Real skills.</span>
          </h2>
          <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.75, fontFamily: "'Inter', sans-serif" }}>
            Each week builds directly on the last. By Week 10 you understand the full stack — from terminal to production.
          </p>
        </motion.div>

        <div>
          {weeks.map((w, i) => (
            <motion.div key={w.w} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.04 }}>
              <ScanCard style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 12px', borderBottom: i < weeks.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'default' }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: C.text3, fontWeight: 700, flexShrink: 0, width: 36 }}>W{String(w.w).padStart(2, '0')}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "'Inter', sans-serif", opacity: 0.88 }}>{w.title}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: tagCol[w.tag], border: `1px solid ${tagCol[w.tag]}44`, padding: '3px 8px', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>
                  {w.tag.replace('_', ' ').toUpperCase()}
                </span>
              </ScanCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n:'01', title:'Enroll & get access',   desc:'Immediately access the student portal, all lessons, and the Week 1 starter repo.' },
    { n:'02', title:'Build daily, PR daily', desc:'Every day you build a real feature and open a pull request against a real project.' },
    { n:'03', title:'Get feedback on every PR', desc:'Every PR gets reviewed for logic, naming, security, and structure. Fix, push, repeat.' },
    { n:'04', title:'Ship & get placed',     desc:'3 deployed products, 65+ merged PRs, and a structured job application process.' },
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>./how-it-works --explain</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: '0 0 52px', textShadow: glow(C.text, 8) }}>The process is the product.</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {steps.map((s, i) => (
            <motion.div key={s.n} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.1 }}
              style={{ paddingRight: i < 3 ? 36 : 0, paddingLeft: i > 0 ? 36 : 0, borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}
            >
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 36, fontWeight: 700, color: C.border2, marginBottom: 16, textShadow: glow(C.accent, 6) }}>{s.n}</div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.75, fontFamily: "'Inter', sans-serif", margin: 0 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Who is this for ──────────────────────────────────────────────────────────
function WhoIsThisFor() {
  const fits = [
    { icon: '✓', label: 'Final-year or recent CS/IT/ECE graduates', desc: 'No job yet, want a portfolio that actually shows you can build.' },
    { icon: '✓', label: 'Self-taught developers stuck in tutorial hell', desc: 'You finish courses but can\'t build anything without a guide.' },
    { icon: '✓', label: 'Working professionals switching to dev roles', desc: 'You can spare 3–4 hours a day and need structured, real output.' },
    { icon: '✓', label: 'Students who want to skip internship queues', desc: 'Ship 3 real apps and show them instead of applying blind.' },
  ]
  const notFits = [
    { icon: '✕', label: 'Complete beginners with no JavaScript exposure', desc: 'Learn JS basics first — variables, functions, arrays. Then join.' },
    { icon: '✕', label: 'Anyone looking for live classes or recorded lectures', desc: 'This is not a course. It is a work environment.' },
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>./check-fit --honest</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: 0, textShadow: glow(C.text, 8) }}>
            Who this is for.
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ fontSize: 9, color: C.green, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20, textShadow: glow(C.green, 6) }}>GOOD FIT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {fits.map((f, i) => (
                <motion.div key={f.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: i < fits.length - 1 ? `1px solid ${C.border}` : 'none' }}
                >
                  <span style={{ color: C.green, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, flexShrink: 0, marginTop: 2, textShadow: glow(C.green, 6) }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.65 }}>{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.red, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20, textShadow: glow(C.red, 6) }}>NOT A FIT (YET)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {notFits.map((f, i) => (
                <motion.div key={f.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: i < notFits.length - 1 ? `1px solid ${C.border}` : 'none' }}
                >
                  <span style={{ color: C.red, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.65 }}>{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing({ onApply }) {
  const plans = [
    {
      id: 'basic', name: 'Basic', price: '₹9,999', emi: '₹3,500', badge: null, tagline: 'Build real projects. Ship real code.',
      desc: 'Full 12-week curriculum, AI code review on every PR, mentor grading, and community access.',
      features: [
        { title: 'Full 12-week project curriculum', sub: 'All lessons, project briefs, and code examples on day 1.' },
        { title: 'AI code review on every pull request', sub: 'Every PR reviewed for logic, naming, security, and architecture.' },
        { title: 'Mentor grading within 24 hours', sub: 'Human feedback on every submission — not just automated checks.' },
        { title: 'Completion certificate', sub: 'Issued after 12 weeks and 65+ merged PRs. LinkedIn-ready.' },
        { title: 'Community Discord access', sub: 'Ask questions, share progress, get unblocked by peers.' },
        { title: 'Lifetime content access', sub: 'Curriculum updates go to your account forever.' },
      ],
      cta: 'ENROLL — BASIC', accent: C.text3, recommended: false,
    },
    {
      id: 'pro', name: 'Pro', price: '₹14,999', emi: '₹5,000', badge: 'MOST POPULAR', tagline: 'Build + get placement-ready.',
      desc: 'Everything in Basic plus resume preparation, LinkedIn setup, and a 1:1 mock interview.',
      features: [
        { title: 'Everything in Basic', sub: 'Full curriculum, AI reviews, mentor grading, certificate, lifetime access.' },
        { title: 'Resume writing & review', sub: 'Write a developer resume that gets past the first filter. We review it.' },
        { title: 'LinkedIn profile preparation', sub: 'Headline, about section, and projects set up for recruiters.' },
        { title: 'Job application strategy', sub: 'Which companies, what order, when and how to follow up.' },
        { title: '1 mock interview session (1:1)', sub: '45-min interview with a working developer. Written feedback included.' },
      ],
      cta: 'ENROLL — PRO', accent: C.accent, recommended: true,
    },
  ]

  return (
    <section id="pricing" style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>cat ./pricing.json</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: 0, textShadow: glow(C.text, 8) }}>
              No hidden fees.<br /><span style={{ color: C.text3 }}>No subscriptions.</span>
            </h2>
            <div style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', border: `1px solid ${C.border}`, padding: '8px 14px', letterSpacing: '0.06em' }}>7-day refund · no questions</div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 0, maxWidth: 800, margin: '0 auto' }}>
          {plans.map((p, i) => (
            <motion.div key={p.id} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.1 }}>
              <ScanCard style={{
                padding: '32px', display: 'flex', flexDirection: 'column', minHeight: 620,
                borderRight: i < 1 ? `1px solid ${C.border}` : 'none',
                borderTop: `2px solid ${p.accent}`,
                background: p.recommended ? `${C.accent}08` : 'transparent',
              }}>
                <div style={{ height: 20, marginBottom: 14 }}>
                  {p.badge && <span style={{ fontSize: 9, fontWeight: 700, color: p.accent, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', textShadow: p.recommended ? glow() : 'none' }}>{p.badge}</span>}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: C.text3, marginBottom: 20, letterSpacing: '0.04em' }}>{p.tagline}</div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 36, fontWeight: 700, color: p.recommended ? C.accent : C.text, textShadow: p.recommended ? glow() : 'none' }}>{p.price}</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: C.text3, marginLeft: 8 }}>one-time</span>
                  <div style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', marginTop: 5 }}>or {p.emi} × 3 EMI</div>
                </div>
                <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>{p.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, flex: 1 }}>
                  {p.features.map(f => (
                    <div key={f.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: p.accent, fontSize: 10, fontFamily: 'JetBrains Mono,monospace', flexShrink: 0, marginTop: 2, textShadow: p.recommended ? glow() : 'none' }}>✓</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>{f.title}</div>
                        <div style={{ fontSize: 11, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => onApply(p.name)}
                  style={{
                    width: '100%', padding: '12px', cursor: 'pointer',
                    fontWeight: 700, fontSize: 11, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.1em',
                    background: p.recommended ? C.accent : 'transparent',
                    border: p.recommended ? 'none' : `1px solid ${p.accent}55`,
                    color: p.recommended ? '#000' : p.accent,
                    transition: 'box-shadow 0.2s, opacity 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = glow(p.accent, 14); e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.opacity = '1' }}
                >{p.cta}</button>
              </ScanCard>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginTop: 28, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: C.text3, fontFamily: 'JetBrains Mono,monospace', lineHeight: 1.7 }}>
            7-day full refund if you haven't opened your first PR · <span style={{ color: C.text2 }}>support@devforge.in</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    { quote: 'I had 3 interviews lined up before the program even ended. The PR workflow alone is worth the fee — it is how real companies work.', name: 'Priya Sharma', detail: 'Cohort 2 Graduate · Bengaluru' },
    { quote: "Every week I was genuinely scared I wouldn't finish — and then I did. That's the confidence that shows up in interviews.", name: 'Karan Mehta', detail: 'Cohort 2 Graduate · Hyderabad' },
    { quote: "The code reviews were brutal in the best way. By Week 6 I was writing code that didn't get comments at all.", name: 'Ananya Roy', detail: 'Cohort 2 Graduate · Pune' },
  ]
  return (
    <section id="testimonials" style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>cat ./testimonials.log</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: '0 0 52px', textShadow: glow(C.text, 8) }}>
            From the people who built.
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {quotes.map((q, i) => (
            <motion.div key={q.name} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.1 }}>
              <ScanCard style={{ padding: '32px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none', height: '100%' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 40, color: C.accent, lineHeight: 1, marginBottom: 16, textShadow: glow() }}>"</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.text, lineHeight: 1.8, margin: '0 0 28px', opacity: 0.85 }}>{q.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 30, height: 30, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: 12, fontFamily: 'JetBrains Mono,monospace', boxShadow: glow() }}>{q.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: "'Inter', sans-serif" }}>{q.name}</div>
                    <div style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', marginTop: 2 }}>{q.detail}</div>
                  </div>
                </div>
              </ScanCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null)
  const items = [
    { q: 'When does Cohort 3 start?', a: 'Cohort 3 starts July 7, 2025. Once enrolled, you get immediate access to Week 1 lessons, the starter repo, and the Discord community.' },
    { q: 'Do I need a CS degree?', a: 'No. Most students are engineering graduates from non-CS branches or working professionals. What matters is commitment and 3–4 focused hours daily.' },
    { q: 'What programming knowledge is required?', a: 'You should know basic JavaScript — variables, functions, arrays, loops. If you can write a function that filters an array, you are ready.' },
    { q: 'How is this different from YouTube tutorials?', a: 'Tutorials teach you to watch. This program teaches you to build. Every day you open a real pull request that gets reviewed. You cannot fake your way through that.' },
    { q: 'Can I do this while working full-time?', a: 'Yes. The program is fully async — no live sessions, no fixed schedule. 3–4 focused hours daily is recommended. Most students do early morning or evening blocks.' },
    { q: 'What is the refund policy?', a: 'Full refund within 7 days if you haven\'t opened your first pull request. No questions asked. After that, no refunds — you\'ve started building.' },
    { q: 'What laptop or setup do I need?', a: 'Any laptop made after 2015 works — Windows, Mac, or Linux. You need Node.js, Git, and VS Code installed. We send a setup guide on enrollment day. No paid tools required.' },
    { q: 'What happens after the program?', a: 'You leave with 3 deployed products, 65+ merged PRs, and a structured job application process. Discord access is lifetime.' },
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>./faq --all</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: '0 0 40px', textShadow: glow(C.text, 8) }}>Common questions.</h2>
        </motion.div>
        {items.map((item, i) => (
          <div key={item.q} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: open === i ? C.accent : C.text2, fontFamily: "'Inter', sans-serif", transition: 'color 0.15s', textShadow: open === i ? glow() : 'none' }}>{item.q}</span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 18, color: C.text3, display: 'inline-block', flexShrink: 0, marginLeft: 16 }}
              >+</motion.span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                  <div style={{ paddingBottom: 18, fontSize: 13, color: C.text2, lineHeight: 1.8, fontFamily: "'Inter', sans-serif" }}>{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA({ onApply }) {
  return (
    <section style={{ padding: '100px 48px', borderBottom: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: `radial-gradient(ellipse, ${C.accent}14 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20 }}><span style={{ color: C.accent }}>$ </span>./apply --cohort=3</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(32px,5vw,58px)', fontWeight: 700, color: C.text, margin: '0 0 20px', lineHeight: 1.05, textShadow: glow(C.text, 12) }}>
            Your GitHub should<br /><span style={{ color: C.accent, textShadow: glow() }}>speak for itself.</span>
          </h2>
          <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.8, fontFamily: "'Inter', sans-serif", marginBottom: 40 }}>
            65+ merged PRs, 3 deployed products, and code your interviewers can actually open.
          </p>
          <button onClick={onApply}
            style={{ background: C.accent, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '16px 52px', letterSpacing: '0.1em', transition: 'box-shadow 0.2s, transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `${glow(C.accent, 28)}, 0 0 60px ${C.accent}33`; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}
          >APPLY FOR COHORT 3 →</button>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: '36px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 22, height: 22, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow() }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: '#000', fontFamily: 'JetBrains Mono,monospace' }}>DF</span>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, fontSize: 13, color: C.text3 }}>DevForge</span>
      </div>
      <div style={{ display: 'flex', gap: 28 }}>
        {['Privacy', 'Terms', 'support@devforge.in'].map(l => (
          <a key={l} href="#" style={{ fontSize: 11, color: C.text3, textDecoration: 'none', fontFamily: 'JetBrains Mono,monospace', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = C.accent}
            onMouseLeave={e => e.currentTarget.style.color = C.text3}
          >{l}</a>
        ))}
      </div>
      <div style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>© 2025 DevForge</div>
    </footer>
  )
}

// ─── Apply Modal ──────────────────────────────────────────────────────────────
function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

function ApplyModal({ onClose, initialPlan = 'LIVE_COHORT' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', plan: initialPlan })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const PLAN_OPTIONS = [
    { value: 'LIVE_COHORT', label: 'Live Cohort — ₹14,999' },
    { value: 'SELF_PACED',  label: 'Self-Paced — ₹9,999'  },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.college) {
      setError('All fields are required.'); return
    }
    setLoading(true); setError('')

    try {
      const ok = await loadRazorpay()
      if (!ok) { setError('Failed to load payment gateway. Please try again.'); setLoading(false); return }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, college: form.college, plan: form.plan }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setLoading(false); return }

      const rzp = new window.Razorpay({
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        order_id:    data.orderId,
        name:        'DevForge',
        description: `${data.planLabel} — Cohort 3`,
        prefill:     { name: data.name, email: data.email, contact: data.phone },
        theme:       { color: '#F59E0B' },
        modal:       { ondismiss: () => setLoading(false) },
        handler: async (response) => {
          try {
            await fetch(`${import.meta.env.VITE_API_URL}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
          } catch {}
          setDone(true)
          setLoading(false)
        },
      })
      rzp.open()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', background: C.surface2,
    border: `1px solid ${C.border}`, color: C.text, fontSize: 13,
    fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(6px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div initial={{ opacity: 0, y: 28, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 28 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: C.surface, border: `1px solid ${C.border2}`, borderTop: `2px solid ${C.accent}`, width: 480, padding: '36px', position: 'relative', boxShadow: glow(C.accent, 24), maxHeight: '90vh', overflowY: 'auto' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: C.text3, fontSize: 20, fontFamily: 'JetBrains Mono,monospace', lineHeight: 1 }}>×</button>

          {done ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: C.green, marginBottom: 16, letterSpacing: '0.08em', textShadow: glow(C.green) }}>✓ PAYMENT SUCCESSFUL</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Seat locked. You're in.</div>
              <p style={{ fontSize: 13, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 20 }}>We'll WhatsApp <strong style={{ color: C.accent }}>{form.phone}</strong> within 2 hours with login details.</p>
              <div style={{ background: C.surface2, border: `1px solid ${C.border}`, padding: '14px 16px', textAlign: 'left' }}>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.1em', marginBottom: 10 }}>WHAT HAPPENS NEXT</div>
                {['Payment confirmed & seat locked', 'Login details sent on WhatsApp within 2 hours', 'Cohort 3 kicks off July 7', 'Instant access to Week 1 lessons & Discord'].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 12, color: C.text2, fontFamily: "'Inter', sans-serif" }}>
                    <span style={{ color: C.accent, fontFamily: 'JetBrains Mono,monospace' }}>{i + 1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 8, textShadow: glow() }}>APPLY FOR COHORT 3</div>
              <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Reserve your seat</h2>
              <p style={{ fontSize: 12, color: C.text3, fontFamily: "'Inter', sans-serif", margin: '0 0 24px', lineHeight: 1.6 }}>Cohort 3 starts July 7 · {PILOT_SEATS_LEFT} seats remaining · Pilot batch pricing</p>

              {error && (
                <div style={{ fontSize: 12, color: C.red, fontFamily: "'Inter', sans-serif", padding: '8px 12px', border: `1px solid ${C.red}44`, marginBottom: 14 }}>{error}</div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  ['Full name', 'name', 'text', 'Your full name'],
                  ['Email address', 'email', 'email', 'you@example.com'],
                  ['Mobile number', 'phone', 'tel', '+91 98765 43210'],
                  ['College / University', 'college', 'text', 'e.g. JNTU Hyderabad'],
                ].map(([label, key, type, placeholder]) => (
                  <div key={key}>
                    <label style={{ fontSize: 9, fontWeight: 700, color: C.text3, letterSpacing: '0.12em', fontFamily: 'JetBrains Mono,monospace', display: 'block', marginBottom: 7 }}>{label.toUpperCase()}</label>
                    <input type={type} value={form[key]} placeholder={placeholder}
                      onChange={e => { setError(''); setForm({ ...form, [key]: e.target.value }) }}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = glow() }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, color: C.text3, letterSpacing: '0.12em', fontFamily: 'JetBrains Mono,monospace', display: 'block', marginBottom: 7 }}>PLAN</label>
                  <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {PLAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={loading}
                  style={{ background: C.accent, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '13px', letterSpacing: '0.1em', marginTop: 6, transition: 'box-shadow 0.2s, opacity 0.15s', opacity: loading ? 0.7 : 1, boxShadow: glow() }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = glow(C.accent, 20) }}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = glow()}
                >{loading ? 'OPENING PAYMENT...' : 'PAY & LOCK SEAT →'}</button>
                <p style={{ fontSize: 10, color: C.text3, fontFamily: "'Inter', sans-serif", textAlign: 'center', margin: 0 }}>
                  Secured by Razorpay · UPI, Cards, Net Banking accepted
                </p>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('Pro')

  const openModal = (plan) => {
    if (plan) setSelectedPlan(plan)
    setShowModal(true)
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <ScrollProgress />
      <Navbar onApply={openModal} />
      <Hero onApply={openModal} />
      <ToolsBar />
      <Stats />
      <Projects />
      <Curriculum />
      <HowItWorks />
      <WhoIsThisFor />
      <Pricing onApply={openModal} />
      <Testimonials />
      <FAQ />
      <CTA onApply={openModal} />
      <Footer />
      {showModal && <ApplyModal onClose={() => setShowModal(false)} initialPlan={selectedPlan} />}
    </div>
  )
}
