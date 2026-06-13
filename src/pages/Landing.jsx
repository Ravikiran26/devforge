import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://devforge-production-742c.up.railway.app/api'

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

const PILOT_SEATS_LEFT = 12
const WHATSAPP_NUMBER  = '919390545942'

const glow  = (color = C.accent, size = 12) => `0 0 ${Math.round(size * 0.6)}px ${color}22, 0 0 ${size}px ${color}0D`
const fade  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } }
const viewportOnce = { once: true, margin: '-40px' }

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 48) {
  const [displayed, setDisplayed] = useState('')
  /* eslint-disable react-hooks/set-state-in-effect */
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
  /* eslint-enable react-hooks/set-state-in-effect */
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
        style={{ display: 'inline-block', width: 10, height: '1em', background: C.accent, marginLeft: 3, verticalAlign: 'text-bottom' }}
      />
      <style>{`@keyframes scanPulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </>
  )
}

// ─── Scroll progress ──────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: C.accent, scaleX, transformOrigin: 'left', zIndex: 100 }} />
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
        <div style={{ width: 26, height: 26, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+want+to+know+more+about+DevForge`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, fontWeight: 600, color: C.text3, fontFamily: 'JetBrains Mono,monospace', padding: '7px 16px', letterSpacing: '0.06em', border: `1px solid ${C.border2}`, textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.text3 }}
        >WHATSAPP</a>
        <button onClick={onApply}
          style={{ background: C.accent, border: `1px solid ${C.accent}`, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '8px 20px', letterSpacing: '0.08em', transition: 'opacity 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >APPLY →</button>
      </div>
    </motion.nav>
  )
}

// ─── Dashboard mockup ─────────────────────────────────────────────────────────
function DashboardMockup() {
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
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Welcome back, Ravikiran</div>
            <div style={{ height: 2, background: C.border, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '50%', background: C.accent }} />
            </div>
            <div style={{ fontSize: 9, color: C.text3, marginTop: 4 }}>50% complete · 5 weeks remaining</div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: C.border }}>
            {[{ l: 'PRS MERGED', v: '24', c: C.green }, { l: 'LESSONS', v: '18', c: C.accent }, { l: 'AVG GRADE', v: '91', c: C.text2 }].map(s => (
              <div key={s.l} style={{ background: C.surface, padding: '10px 12px', borderTop: `2px solid ${s.c}` }}>
                <div style={{ fontSize: 8, color: C.text3, marginBottom: 4, letterSpacing: '0.1em' }}>{s.l}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.c }}>{s.v}</div>
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
              <div style={{ height: '100%', width: '66%', background: C.accent }} />
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
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.10) 3px, rgba(0,0,0,0.10) 4px)`,
        opacity: 0.5,
      }} />

      {/* Amber glow orb */}
      <div style={{
        position: 'absolute', top: -140, left: '50%', transform: 'translateX(-50%)',
        width: 1000, height: 640, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${C.accent}14 0%, ${C.accent}04 45%, transparent 68%)`,
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
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, display: 'inline-block', opacity: 0.85 }} />
          <span style={{ fontSize: 11, color: C.text3, letterSpacing: '0.1em' }}>{PILOT_SEATS_LEFT} FOUNDING SEATS · ENROLL TODAY · START THIS WEEK</span>
        </motion.div>

        {/* Prompt line */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
          style={{ fontSize: 13, color: C.text3, fontFamily: 'JetBrains Mono,monospace', marginBottom: 16, letterSpacing: '0.04em' }}
        >
          <span style={{ color: C.accent }}>$ </span>./enroll --start=today --track=fullstack
        </motion.div>

        {/* Typewriter headline */}
        <div style={{ marginBottom: 32, minHeight: 160 }}>
          <h1 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(32px, 4.8vw, 64px)', fontWeight: 700, color: C.text, lineHeight: 1.1, margin: '0 0 6px', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            {line1}{line1.length < 'Build 3 real products'.length && <Cursor />}
          </h1>
          <h1 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(32px, 4.8vw, 64px)', fontWeight: 700, color: C.accent, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em' }}>
            {line1.length >= 'Build 3 real products'.length && (
              <>{line2}{line2.length < 'in 12 weeks.'.length && <Cursor />}</>
            )}
            {line2.length >= 'in 12 weeks.'.length && <Cursor />}
          </h1>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 2.2 }}
          style={{ fontSize: 16, color: '#E8D5A3', lineHeight: 1.9, fontFamily: "'Inter', sans-serif", maxWidth: 560, margin: '0 auto 40px', textAlign: 'left' }}
        >
          65+ merged pull requests. 3 deployed apps. A GitHub profile that gets you past the first screening call.
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

          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+want+to+know+more+about+DevForge`}
            target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, fontWeight: 600, color: C.text3, fontFamily: 'JetBrains Mono,monospace', textDecoration: 'none', border: `1px solid ${C.border2}`, padding: '13px 28px', letterSpacing: '0.06em', transition: 'border-color 0.15s, color 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.text3 }}
          >
            {WA_ICON}
            TALK TO US
          </a>
        </motion.div>

        {/* Trust */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 2.9 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}
        >
          {['ECE / Mech / Any branch', '12-week program', 'Real PRs, real feedback'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ color: C.green, fontSize: 11, fontFamily: 'JetBrains Mono,monospace' }}>✓</span>
              <span style={{ fontSize: 12, color: C.text3, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.04em' }}>{b}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Portal preview (extracted from Hero so Stats can sit above it) ───────────
function PortalPreview() {
  return (
    <section style={{ padding: '64px 24px 0', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 10 }}>
              <span style={{ color: C.accent }}>$ </span>cat ./student-portal.preview
            </div>
            <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 700, color: C.text, letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0 }}>
              Your dev environment<span style={{ color: C.text3 }}> from day one.</span>
            </h2>
          </div>
          <div style={{
            border: `1px solid ${C.border2}`,
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: `0 0 0 1px ${C.border}, 0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${C.accent}0D`,
          }}>
            <div style={{ height: 36, background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[C.red, C.accent, C.green].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.75 }} />)}
              </div>
              <span style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>devforge — student-portal</span>
              <span style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>week 5 / 12</span>
            </div>
            <div style={{ height: 480 }}>
              <DashboardMockup />
            </div>
          </div>
        </motion.div>
      </div>
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
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', color: C.accent, lineHeight: 1, marginBottom: 12 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: C.text2, fontFamily: 'JetBrains Mono,monospace' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}
          style={{ marginTop: 56, paddingTop: 40, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}
        >
          <p style={{ fontSize: 'clamp(15px,1.6vw,20px)', color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.65, maxWidth: 680, margin: 0 }}>
            The only Indian program where your portfolio is built entirely through{' '}
            <span style={{ color: C.accent, fontWeight: 600 }}>pull requests</span>{' '}
            — the same workflow real companies use to hire.
          </p>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: C.text3, border: `1px solid ${C.border2}`, padding: '8px 16px', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
            BUILD LIKE A DEVELOPER. GET HIRED LIKE ONE.
          </div>
        </motion.div>
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
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', color: C.text, margin: 0 }}>
            3 real products.<br /><span style={{ color: C.text3 }}>All on your GitHub.</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {projects.map((p, i) => (
            <motion.div key={p.num} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.12 }}>
              <ScanCard style={{ padding: '32px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none', borderTop: `2px solid ${p.color}`, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: p.color, fontWeight: 700, letterSpacing: '0.12em' }}>{p.tag}</span>
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
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 32, fontWeight: 700, color: C.text, margin: '0 0 16px', lineHeight: 1.15 }}>
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
    { n:'01', title:'Enroll & start today',   desc:'Within 24 hours you get full access — student portal, all lessons, starter repo, and Discord. No waiting.' },
    { n:'02', title:'Build daily, PR daily', desc:'Every day you build a real feature and open a pull request against a real project.' },
    { n:'03', title:'Get feedback on every PR', desc:'Every PR gets reviewed for logic, naming, security, and structure. Fix, push, repeat.' },
    { n:'04', title:'Ship & interview',       desc:'Leave with 3 deployed products, 65+ merged PRs, and a structured approach to job applications. No guarantee — but real proof.' },
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>./how-it-works --explain</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: '0 0 52px' }}>The process is the product.</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {steps.map((s, i) => (
            <motion.div key={s.n} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.1 }}
              style={{ paddingRight: i < 3 ? 36 : 0, paddingLeft: i > 0 ? 36 : 0, borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}
            >
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 42, fontWeight: 800, color: C.accent, marginBottom: 20, opacity: 0.9 }}>{s.n}</div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 700, color: C.text, margin: '0 0 12px', letterSpacing: '-0.01em' }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.8, fontFamily: "'Inter', sans-serif", margin: 0 }}>{s.desc}</p>
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
    { icon: '✕', label: 'Complete beginners with no JavaScript exposure', desc: 'Try freeCodeCamp first — variables, functions, arrays. Then come back.' },
    { icon: '✕', label: 'Anyone looking for live classes or recorded lectures', desc: 'This is not a course. It is a work environment.' },
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>./check-fit --honest</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: 0 }}>
            Who this is for.
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ fontSize: 9, color: C.green, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20 }}>GOOD FIT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {fits.map((f, i) => (
                <motion.div key={f.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: i < fits.length - 1 ? `1px solid ${C.border}` : 'none' }}
                >
                  <span style={{ color: C.green, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.65 }}>{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.red, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20 }}>NOT THE RIGHT FIT</div>
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
      id: 'LIVE_COHORT',
      name: 'Builder',
      price: '₹7,000',
      badge: null,
      tagline: 'Build real products. Ship real code.',
      desc: 'Full 12-week curriculum, AI code review on every PR, mentor grading within 24 hours, and Discord community.',
      features: [
        { title: 'Full 12-week project curriculum',      sub: 'All lessons, project briefs, and code examples unlocked on day 1.' },
        { title: 'AI code review on every pull request', sub: 'Every PR reviewed for logic, naming, security, and architecture.' },
        { title: 'Mentor grading within 24 hours',       sub: 'Human feedback on every submission — not just automated checks.' },
        { title: 'Completion certificate',               sub: 'Issued after 12 weeks and 65+ merged PRs. LinkedIn-ready.' },
        { title: 'Discord community access',             sub: 'Ask questions, share PRs, get unblocked by peers.' },
        { title: 'Lifetime content access',              sub: 'Curriculum updates go to your account forever.' },
      ],
      cta: 'ENROLL — BUILDER',
      accent: C.text3,
      recommended: false,
    },
    {
      id: 'MENTORED',
      name: 'Builder + Placement Prep',
      price: '₹12,000',
      badge: 'MOST POPULAR',
      tagline: 'Build + get placement-ready.',
      desc: 'Everything in Builder, plus resume preparation, LinkedIn setup, job strategy, and a live 1:1 mock interview.',
      features: [
        { title: 'Everything in Builder',             sub: 'Full curriculum, AI reviews, mentor grading, certificate, lifetime access.' },
        { title: 'Resume writing & review',          sub: 'Write a developer resume that gets past the first filter. We review it.' },
        { title: 'LinkedIn profile preparation',     sub: 'Headline, about section, and featured projects set up for recruiters.' },
        { title: 'Job application strategy session', sub: 'Which companies, what order, when and how to follow up.' },
        { title: '1:1 mock interview (45 min)',      sub: 'Live interview with a working developer. Written feedback included.' },
      ],
      cta: 'ENROLL — BUILDER+',
      accent: C.accent,
      recommended: true,
    },
  ]

  return (
    <section id="pricing" style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>cat ./pricing.json</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: '0 0 12px' }}>
                Founding price.<br /><span style={{ color: C.text3 }}>No fake discounts.</span>
              </h2>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${C.accent}44`, padding: '7px 14px', fontFamily: 'JetBrains Mono,monospace' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block', opacity: 0.85 }} />
                <span style={{ fontSize: 10, color: C.accent, letterSpacing: '0.1em' }}>
                  {PILOT_SEATS_LEFT} seats at this price · goes up after seat 12
                </span>
              </div>
            </div>
            <div style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', border: `1px solid ${C.border}`, padding: '8px 14px', letterSpacing: '0.06em' }}>7-day refund · no questions</div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 0, maxWidth: 800, margin: '0 auto' }}>
          {plans.map((p, i) => (
            <motion.div key={p.id} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.1 }}>
              <ScanCard style={{
                padding: '32px', display: 'flex', flexDirection: 'column', minHeight: 580,
                borderRight: i < 1 ? `1px solid ${C.border}` : 'none',
                borderTop: `2px solid ${p.accent}`,
                background: p.recommended ? `${C.accent}08` : 'transparent',
              }}>
                <div style={{ height: 20, marginBottom: 14 }}>
                  {p.badge && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: p.accent, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace' }}>
                      {p.badge}
                    </span>
                  )}
                </div>

                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: C.text3, marginBottom: 20, letterSpacing: '0.04em' }}>{p.tagline}</div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 40, fontWeight: 700, color: p.recommended ? C.accent : C.text, lineHeight: 1 }}>
                      {p.price}
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: C.text3 }}>one-time</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', marginTop: 6 }}>
                    After seat 12: <span style={{ color: C.text2 }}>{p.recommended ? '₹18,000' : '₹12,000'}</span>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>{p.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, flex: 1 }}>
                  {p.features.map(f => (
                    <div key={f.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: p.accent, fontSize: 10, fontFamily: 'JetBrains Mono,monospace', flexShrink: 0, marginTop: 2 }}>✓</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>{f.title}</div>
                        <div style={{ fontSize: 11, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onApply(p.id)}
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
          <p style={{ fontSize: 11, color: C.text3, fontFamily: 'JetBrains Mono,monospace', lineHeight: 1.7, marginBottom: 10 }}>
            7-day full refund if you haven't opened your first PR · <span style={{ color: C.text2 }}>support@devforge.in</span>
          </p>
          <p style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', marginBottom: 14, opacity: 0.7 }}>
            No live classes. No certificate mill. No placement guarantee. Just 12 weeks of real work.
          </p>
          <p style={{ fontSize: 11, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>
            Not sure which plan is right for you?{' '}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+can+you+help+me+choose+between+Builder+and+Builder+%2B+Placement+Prep%3F`}
              target="_blank" rel="noopener noreferrer"
              style={{ color: C.accent, textDecoration: 'none' }}>WhatsApp us →</a>
          </p>
          <p style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace', marginTop: 10, opacity: 0.7 }}>
            Enrolling 5+ students from the same college?{' '}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I%27m+a+college+coordinator+and+want+to+discuss+group+enrollment+for+DevForge`}
              target="_blank" rel="noopener noreferrer"
              style={{ color: C.text2, textDecoration: 'none' }}>Ask about group rates →</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Outcomes ─────────────────────────────────────────────────────────────────
function Outcomes() {
  const outcomes = [
    {
      label: '3 DEPLOYED PRODUCTS',
      title: 'Real apps. Live URLs.',
      desc: 'Restaurant ordering system with Razorpay payments. GST billing SaaS with PDF invoices. AI-powered client support desk on GitHub Actions CI/CD. All public, all yours.',
      stat: '3', unit: 'live products',
    },
    {
      label: '65+ MERGED PULL REQUESTS',
      title: 'A GitHub profile that speaks.',
      desc: 'Every feature you build is a PR. Every PR gets reviewed for logic, security, and structure. By the end, your GitHub history shows consistent, professional-grade output.',
      stat: '65+', unit: 'merged PRs',
    },
    {
      label: 'INTERVIEW-READY',
      title: 'Show work, not certificates.',
      desc: 'Walk into any interview with deployed URLs, a PR history, and the ability to explain every line. No algorithmic trick questions — real code answers real questions.',
      stat: '12', unit: 'weeks to job-ready',
    },
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>./what-you-leave-with --after=12weeks</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: 0 }}>
            What you leave with.
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {outcomes.map((o, i) => (
            <motion.div key={o.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: i * 0.1 }}>
              <ScanCard style={{ padding: '36px 32px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none', height: '100%' }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: C.accent, letterSpacing: '0.16em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20, }}>{o.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 48, fontWeight: 800, color: C.text, lineHeight: 1 }}>{o.stat}</span>
                  <span style={{ fontSize: 11, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>{o.unit}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text2, fontFamily: "'Inter', sans-serif", marginBottom: 12, letterSpacing: '-0.01em' }}>{o.title}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.text3, lineHeight: 1.75, margin: 0 }}>{o.desc}</p>
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
    { q: 'When do I get access after enrolling?', a: 'Within 24 hours of enrollment you get full access — Week 1 lessons, the starter repo, the Jira board, and the Discord community. You start at your own pace. No waiting for a batch or a cohort.' },
    { q: 'Do I need a CS degree?', a: 'No. Most students are engineering graduates from non-CS branches or working professionals. What matters is commitment and 3–4 focused hours daily.' },
    { q: 'What programming knowledge is required?', a: 'You should know basic JavaScript — variables, functions, arrays, loops. If you can write a function that filters an array, you are ready.' },
    { q: 'How is this different from YouTube tutorials?', a: 'Tutorials teach you to watch. This program teaches you to build. Every day you open a real pull request that gets reviewed. You cannot fake your way through that.' },
    { q: 'Can I do this while working full-time?', a: 'Yes. The program is fully async — no live sessions, no fixed schedule. 3–4 focused hours daily is recommended. Most students do early morning or evening blocks.' },
    { q: 'What is the refund policy?', a: 'Full refund within 7 days if you haven\'t opened your first pull request. No questions asked. After that, no refunds — you\'ve started building.' },
    { q: 'What laptop or setup do I need?', a: 'Any laptop made after 2015 works — Windows, Mac, or Linux. You need Node.js, Git, and VS Code installed. We send a setup guide on enrollment day. No paid tools required.' },
    { q: 'What happens after the program?', a: 'You leave with 3 deployed products, 65+ merged PRs, and a structured job application process. Discord access is lifetime.' },
    { q: 'How does the AI code review work?', a: 'Every pull request you open is automatically reviewed by an AI trained on the project rubric. It checks for logic correctness, naming conventions, security issues, and code structure. You see feedback within minutes. Your mentor then grades it within 24 hours.' },
    { q: 'Will I build alone or with other students?', a: 'You build independently — there are no group projects. The Discord community is active and students often review each other\'s PRs informally. But your portfolio is 100% your own work.' },
    { q: 'Is this for freshers or experienced developers?', a: 'Primarily for freshers (0–1 years). Experienced developers switching tracks also find it useful for building GitHub-based proof of full-stack work. If you have 2+ years of experience, Weeks 1–4 may feel slow.' },
    { q: 'Is the program in English or Hindi?', a: 'All lesson content and mentor feedback is in English. WhatsApp and Discord conversations are mixed — use whichever you\'re comfortable with.' },
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>./faq --all</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: C.text, margin: '0 0 40px' }}>Common questions.</h2>
        </motion.div>
        {items.map((item, i) => (
          <div key={item.q} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: open === i ? C.accent : C.text2, fontFamily: "'Inter', sans-serif", transition: 'color 0.15s' }}>{item.q}</span>
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
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>
            Still have a question?{' '}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+have+a+question+about+DevForge`}
              target="_blank" rel="noopener noreferrer"
              style={{ color: C.accent, textDecoration: 'none' }}>Ask on WhatsApp →</a>
          </p>
        </div>
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
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20 }}><span style={{ color: C.accent }}>$ </span>./apply --start=today</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(32px,5vw,58px)', fontWeight: 700, color: C.text, margin: '0 0 20px', lineHeight: 1.05 }}>
            Your GitHub should<br /><span style={{ color: C.accent }}>speak for itself.</span>
          </h2>
          <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.8, fontFamily: "'Inter', sans-serif", marginBottom: 40 }}>
            65+ merged PRs, 3 deployed products, and code your interviewers can actually open.
          </p>
          <button onClick={onApply}
            style={{ background: C.accent, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '16px 52px', letterSpacing: '0.1em', transition: 'box-shadow 0.2s, transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >START BUILDING TODAY →</button>
        </motion.div>
      </div>
    </section>
  )
}

// ─── College / TPO Section ───────────────────────────────────────────────────
function CollegeSection() {
  const outcomes = [
    '3 deployed full-stack applications — live URLs, not local projects',
    '65+ merged pull requests on public GitHub repositories',
    'Hands-on experience with Node.js, React, PostgreSQL, CI/CD, and AI APIs',
  ]
  const offerings = [
    'Group discount for 5+ enrollments from the same institution',
    'Free 45-min demo session for your students (online)',
    'Certificate of completion on institutional letterhead (on request)',
    'Dedicated WhatsApp group for college coordinators',
  ]
  return (
    <section style={{ padding: '80px 48px', borderBottom: `1px solid ${C.border}`, background: `${C.accent}05` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, color: C.accent, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 16 }}><span style={{ color: C.accent }}>$ </span>./devforge --audience=college --mode=partnership</div>
          <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 700, color: C.text, margin: '0 0 16px' }}>
            For College Coordinators <span style={{ color: C.accent }}>&amp; TPOs</span>
          </h2>
          <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.85, fontFamily: "'Inter', sans-serif", maxWidth: 620 }}>
            Companies have raised the bar for freshers. Resumes without proof of work get filtered before a human reads them. DevForge prepares students the way companies actually hire — through pull requests, deployed projects, and a GitHub history that survives a technical screen.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <div style={{ fontSize: 9, color: C.green, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20 }}>WHAT YOUR STUDENTS LEAVE WITH</div>
            {outcomes.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 0', borderBottom: i < outcomes.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <span style={{ color: C.green, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, flexShrink: 0, marginTop: 2 }}>✓</span>
                <span style={{ fontSize: 13, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.65 }}>{o}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: 0.1 }}>
            <div style={{ fontSize: 9, color: C.accent, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 20 }}>WHAT WE OFFER FOR COLLEGE PARTNERSHIPS</div>
            {offerings.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 0', borderBottom: i < offerings.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <span style={{ color: C.accent, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, flexShrink: 0, marginTop: 2 }}>→</span>
                <span style={{ fontSize: 13, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.65 }}>{o}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I%27m+a+college+coordinator+and+want+to+discuss+DevForge+for+our+students`}
            target="_blank" rel="noopener noreferrer"
            style={{ background: C.accent, color: '#000', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, fontWeight: 700, padding: '12px 28px', letterSpacing: '0.08em', textDecoration: 'none', display: 'inline-block', transition: 'opacity 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >BOOK A COLLEGE DEMO →</a>
          <span style={{ fontSize: 12, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>or</span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I%27m+a+college+coordinator+and+want+to+discuss+DevForge+for+our+students`}
            target="_blank" rel="noopener noreferrer"
            style={{ color: C.accent, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, fontWeight: 600, textDecoration: 'none', border: `1px solid ${C.border2}`, padding: '11px 24px', letterSpacing: '0.06em', transition: 'border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2 }}
          >WHATSAPP THE TEAM</a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── WhatsApp Floating Button ─────────────────────────────────────────────────
const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

function WhatsAppFloat() {
  const [visible, setVisible]   = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="wa-float"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+want+to+know+more+about+DevForge`}
          target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: isMobile ? 80 : 28,
            right: isMobile ? 16 : 28,
            zIndex: 200,
            background: '#25D366',
            color: '#fff',
            padding: isMobile ? '12px' : '11px 18px',
            borderRadius: isMobile ? '50%' : 6,
            width: isMobile ? 48 : 'auto',
            height: isMobile ? 48 : 'auto',
            fontFamily: 'JetBrains Mono,monospace',
            fontWeight: 700,
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 24px rgba(37,211,102,0.5)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          {WA_ICON}
          {!isMobile && 'WHATSAPP US'}
        </motion.a>
      )}
    </AnimatePresence>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'support@devforge.in', href: 'mailto:support@devforge.in' },
  ]
  return (
    <footer style={{ padding: '36px 48px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 22, height: 22, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: '#000', fontFamily: 'JetBrains Mono,monospace' }}>DF</span>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, fontSize: 13, color: C.text3 }}>DevForge</span>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {links.map(l => (
          <a key={l.href} href={l.href} style={{ fontSize: 11, color: C.text3, textDecoration: 'none', fontFamily: 'JetBrains Mono,monospace', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = C.accent}
            onMouseLeave={e => e.currentTarget.style.color = C.text3}
          >{l.label}</a>
        ))}
      </div>
      <div style={{ fontSize: 10, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>© 2026 DevForge</div>
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
  const navigate = useNavigate()
  const [form, setForm]         = useState({ name: '', email: '', phone: '', college: '', plan: initialPlan })
  const [step, setStep]         = useState('apply')   // 'apply' | 'password' | 'done'
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const PLAN_OPTIONS = [
    { value: 'LIVE_COHORT', label: 'Builder — ₹7,000'                                         },
    { value: 'MENTORED',    label: 'Builder + Placement Prep (Resume + Mock Interview) — ₹12,000' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.college) {
      setError('All fields are required.'); return
    }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_URL}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: String(form.name), email: String(form.email), phone: String(form.phone), college: String(form.college), plan: String(form.plan) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setLoading(false); return }
      setStep('password')
      setLoading(false)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleSetPassword = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: String(form.name), email: String(form.email), password, college: String(form.college), plan: ['LIVE_COHORT', 'MENTORED'].includes(form.plan) ? form.plan : 'LIVE_COHORT' }),
      })
      const data = await res.json()
      if (!res.ok) {
        // Already registered — just send them to login
        if (res.status === 409) { setStep('done'); setLoading(false); return }
        setError(data.error || 'Failed to create account.'); setLoading(false); return
      }
      setStep('done')
      setLoading(false)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
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
          style={{ background: C.surface, border: `1px solid ${C.border2}`, borderTop: `2px solid ${C.accent}`, width: 480, padding: '36px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: C.text3, fontSize: 20, fontFamily: 'JetBrains Mono,monospace', lineHeight: 1 }}>×</button>

          {step === 'done' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: C.green, marginBottom: 16, letterSpacing: '0.08em' }}>✓ ACCOUNT CREATED</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>You're in. Seat locked.</div>
              <p style={{ fontSize: 13, color: C.text2, fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: 24 }}>
                Your account is ready. Log in with <strong style={{ color: C.accent }}>{form.email}</strong> and the password you just set.
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{ background: C.accent, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '12px 32px', letterSpacing: '0.08em', width: '100%' }}
              >
                GO TO LOGIN →
              </button>
            </div>
          ) : step === 'password' ? (
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: C.green, marginBottom: 16, letterSpacing: '0.08em' }}>✓ SEAT RESERVED</div>
              <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Set your password</h2>
              <p style={{ fontSize: 12, color: C.text3, fontFamily: "'Inter', sans-serif", margin: '0 0 24px', lineHeight: 1.6 }}>
                Create a password for <strong style={{ color: C.accent }}>{form.email}</strong> — you'll use this to log in.
              </p>
              {error && (
                <div style={{ fontSize: 12, color: C.red, fontFamily: "'Inter', sans-serif", padding: '8px 12px', border: `1px solid ${C.red}44`, marginBottom: 14 }}>{error}</div>
              )}
              <form onSubmit={handleSetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[['Password', password, setPassword], ['Confirm password', confirm, setConfirm]].map(([label, val, setter]) => (
                  <div key={label}>
                    <label style={{ fontSize: 9, fontWeight: 700, color: C.text3, letterSpacing: '0.12em', fontFamily: 'JetBrains Mono,monospace', display: 'block', marginBottom: 7 }}>{label.toUpperCase()}</label>
                    <input
                      type="password" value={val} placeholder="Min. 8 characters"
                      onChange={e => { setError(''); setter(e.target.value) }}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}18` }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  style={{ background: C.accent, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '13px', letterSpacing: '0.1em', marginTop: 6, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT & LOGIN →'}
                </button>
              </form>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 8 }}>GET STARTED TODAY</div>
              <h2 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Reserve your seat</h2>
              <p style={{ fontSize: 12, color: C.text3, fontFamily: "'Inter', sans-serif", margin: '0 0 24px', lineHeight: 1.6 }}>Access within 24 hours · {PILOT_SEATS_LEFT} seats at this price · no waiting</p>

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
                      onChange={e => { const v = e.target.value; setError(''); setForm(prev => ({ ...prev, [key]: v })) }}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}18` }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, color: C.text3, letterSpacing: '0.12em', fontFamily: 'JetBrains Mono,monospace', display: 'block', marginBottom: 7 }}>PLAN</label>
                  <select value={form.plan} onChange={e => { const v = e.target.value; setForm(prev => ({ ...prev, plan: v })) }}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {PLAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={loading}
                  style={{ background: C.accent, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 700, color: '#000', fontFamily: 'JetBrains Mono,monospace', padding: '13px', letterSpacing: '0.1em', marginTop: 6, transition: 'opacity 0.15s', opacity: loading ? 0.7 : 1 }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >{loading ? 'RESERVING SEAT...' : 'RESERVE SEAT →'}</button>
                <p style={{ fontSize: 10, color: C.text3, fontFamily: "'Inter', sans-serif", textAlign: 'center', margin: 0 }}>
                  Enroll today · access within 24 hours · {PILOT_SEATS_LEFT} seats at this price
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
  const [selectedPlan, setSelectedPlan] = useState('LIVE_COHORT')

  const openModal = (plan) => {
    if (plan && typeof plan === 'string') setSelectedPlan(plan)
    setShowModal(true)
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <ScrollProgress />
      <Navbar onApply={openModal} />
      <Hero onApply={openModal} />
      <Stats />
      <PortalPreview />
      <ToolsBar />
      <Projects />
      <Curriculum />
      <HowItWorks />
      <WhoIsThisFor />
      <Pricing onApply={openModal} />
      <Outcomes />
      <CollegeSection />
      <FAQ />
      <CTA onApply={openModal} />
      <Footer />
      <WhatsAppFloat />
      {showModal && <ApplyModal onClose={() => setShowModal(false)} initialPlan={selectedPlan} />}
    </div>
  )
}
