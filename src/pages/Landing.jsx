import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:      '#0D1117',
  surface: '#161B22',
  surface2:'#21262D',
  border:  '#30363D',
  border2: '#3D444D',
  text:    '#E6EDF3',
  text2:   '#8B949E',
  text3:   '#6E7681',
  accent:  '#3B82F6',
  green:   '#3FB950',
  red:     '#F85149',
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useCounter(end, duration = 1600) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started || !end) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const t = Math.min((now - t0) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      setVal(Math.floor(ease * end))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setVal(end)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, end, duration])
  return [ref, val]
}

const TAGLINES = [
  'that ship to production — not just localhost.',
  'that hold up under a technical interview.',
  'with 65+ PRs your interviewer can open right now.',
  'deployed, documented, and demo-ready.',
]

function useTypewriter(words, speed = 62, deleteSpeed = 32, pause = 2800) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [del, setDel] = useState(false)
  useEffect(() => {
    const cur = words[idx]
    const id = setTimeout(() => {
      if (!del) {
        const next = cur.slice(0, text.length + 1)
        setText(next)
        if (next === cur) setTimeout(() => setDel(true), pause)
      } else {
        const next = cur.slice(0, text.length - 1)
        setText(next)
        if (next === '') { setDel(false); setIdx((idx + 1) % words.length) }
      }
    }, del ? deleteSpeed : speed)
    return () => clearTimeout(id)
  }, [text, del, idx, words, speed, deleteSpeed, pause])
  return text
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Scroll progress ──────────────────────────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const h = () => {
      const el = document.documentElement
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, height:2, zIndex:100, background:C.border }}>
      <div style={{ height:'100%', width:`${pct}%`, background:C.accent, transition:'width 0.1s linear' }}/>
    </div>
  )
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
    <nav style={{
      position: 'fixed', top: 2, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(13,17,23,0.96)' : 'transparent',
      borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'background 0.3s, border-color 0.3s',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 60,
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

      {/* Nav links */}
      <div style={{ display:'flex', alignItems:'center', gap:32 }}>
        {['Projects','Curriculum','Pricing','Testimonials'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            fontSize:13, fontWeight:500, color:C.text2, textDecoration:'none',
            fontFamily:"'Inter', sans-serif", transition:'color 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.text2}
          >{l}</a>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => navigate('/login')} style={{
          background:'none', border:'none', cursor:'pointer',
          fontSize:13, fontWeight:500, color:C.text2,
          fontFamily:"'Inter', sans-serif", padding:'6px 12px',
          transition:'color 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.text}
        onMouseLeave={e => e.currentTarget.style.color = C.text2}
        >Login</button>
        <button onClick={onApply} style={{
          background:C.accent, border:'none', cursor:'pointer',
          fontSize:13, fontWeight:700, color:'#fff',
          fontFamily:"'Inter', sans-serif", padding:'9px 20px',
          letterSpacing:'0.04em', transition:'opacity 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Apply Now →</button>
      </div>
    </nav>
  )
}

// ─── Terminal card ────────────────────────────────────────────────────────────
function TerminalCard() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border2}`,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 13,
      overflow: 'hidden',
    }}>
      {/* Title bar */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'10px 16px',
        borderBottom:`1px solid ${C.border}`,
        background: C.surface2,
      }}>
        <span style={{ fontSize:11, color:C.text3 }}>project-01.js</span>
        <span style={{ fontSize:10, fontWeight:700, color:C.green, letterSpacing:'0.06em' }}>PR #14 MERGED ✓</span>
      </div>

      {/* Code */}
      <div style={{ padding:'20px 20px', lineHeight:1.8 }}>
        <div style={{ color:C.text3, marginBottom:8 }}>{'// Business SaaS — shipped to production'}</div>
        <div>
          <span style={{ color:'#A78BFA' }}>const </span>
          <span style={{ color:C.text }}>generateDocument </span>
          <span style={{ color:C.text3 }}>= </span>
          <span style={{ color:'#A78BFA' }}>async </span>
          <span style={{ color:C.text3 }}>(client) </span>
          <span style={{ color:C.accent }}>{'=> {'}</span>
        </div>
        <div style={{ paddingLeft:20 }}>
          <span style={{ color:'#A78BFA' }}>const </span>
          <span style={{ color:C.text }}>content </span>
          <span style={{ color:C.text3 }}>= </span>
          <span style={{ color:'#60B8D4' }}>await </span>
          <span style={{ color:C.text }}>ai</span>
          <span style={{ color:C.text3 }}>.</span>
          <span style={{ color:C.accent }}>generate</span>
          <span style={{ color:C.text3 }}>(client)</span>
        </div>
        <div style={{ paddingLeft:20 }}>
          <span style={{ color:'#A78BFA' }}>return </span>
          <span style={{ color:C.accent }}>exportPDF</span>
          <span style={{ color:C.text3 }}>(content)</span>
        </div>
        <div style={{ color:C.accent }}>{'}'}</div>
      </div>

      {/* Projects list */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:'14px 20px' }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.text3, letterSpacing:'0.12em', marginBottom:10 }}>YOU'LL SHIP ALL 3 →</div>
        {[
          { num:'01', name:'SaaS App', sub:'Backend & Database module', color:C.accent },
          { num:'02', name:'Multi-Role Platform', sub:'Auth & Payments module', color:C.green },
          { num:'03', name:'Production Deploy', sub:'DevOps & Real-time module', color:'#60B8D4' },
        ].map(p => (
          <div key={p.num} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:p.color, flexShrink:0 }}/>
            <span style={{ color:p.color, fontWeight:700 }}>Project {p.num}</span>
            <span style={{ color:C.text3, fontSize:12 }}>{p.sub}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onApply }) {
  const tagline = useTypewriter(TAGLINES)

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      padding: '100px 48px 80px',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 480px', gap:80, alignItems:'center' }}>

        {/* Left */}
        <div>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            border:`1px solid ${C.border2}`, padding:'5px 14px',
            marginBottom:36, fontFamily:"'Inter', sans-serif",
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.green, display:'inline-block' }}/>
            <span style={{ fontSize:11, fontWeight:600, color:C.text2, letterSpacing:'0.08em' }}>
              COHORT 3 · LIMITED SEATS
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(52px, 6vw, 82px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: C.text,
            margin: '0 0 8px',
          }}>
            Build 3 real
          </h1>
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(52px, 6vw, 82px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: C.accent,
            margin: '0 0 8px',
          }}>
            products
          </h1>
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(52px, 6vw, 82px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: C.text,
            margin: '0 0 32px',
          }}>
            in 10 weeks.
          </h1>

          {/* Typewriter */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28, minHeight:28 }}>
            <span style={{ color:C.accent, fontFamily:'JetBrains Mono,monospace', fontSize:14 }}>→</span>
            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:14, color:C.text2 }}>
              {tagline}
              <span style={{ animation:'blink 1s step-end infinite', color:C.accent }}>|</span>
            </span>
          </div>

          <p style={{
            fontSize:15, color:C.text2, lineHeight:1.8,
            fontFamily:"'Inter', sans-serif",
            maxWidth:480, marginBottom:40,
          }}>
            Build, deploy, and explain production-grade software using the same GitHub workflow used at real companies — the kind of work that holds up in a technical interview.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:40 }}>
            <button onClick={onApply} style={{
              background:C.accent, border:'none', cursor:'pointer',
              fontSize:14, fontWeight:700, color:'#fff',
              fontFamily:"'Inter', sans-serif", padding:'14px 28px',
              letterSpacing:'0.04em', transition:'opacity 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
            >Enroll Now</button>
            <a href="#projects" style={{
              fontSize:14, fontWeight:500, color:C.text2,
              fontFamily:"'Inter', sans-serif", textDecoration:'none',
              border:`1px solid ${C.border2}`, padding:'13px 24px',
              transition:'border-color 0.1s, color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.text }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border2; e.currentTarget.style.color=C.text2 }}
            >View Projects</a>
          </div>

          {/* Trust badges */}
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            {['No CS degree needed', '10-week program', 'GitHub workflow'].map(b => (
              <div key={b} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:C.green, fontSize:12, fontFamily:'JetBrains Mono,monospace' }}>✓</span>
                <span style={{ fontSize:12, color:C.text3, fontFamily:"'Inter', sans-serif" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — terminal */}
        <TerminalCard/>
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  )
}

// ─── Tool strip ───────────────────────────────────────────────────────────────
function ToolsBar() {
  const tools = ['React','Node.js','Express','PostgreSQL','Prisma','GitHub','Vercel','JWT','Razorpay','Claude AI']
  return (
    <div style={{ borderBottom:`1px solid ${C.border}`, padding:'0 48px', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:0 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.text3, letterSpacing:'0.12em', whiteSpace:'nowrap', padding:'16px 24px 16px 0', borderRight:`1px solid ${C.border}`, fontFamily:"'Inter', sans-serif" }}>
          TECH STACK
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto' }}>
          {tools.map((t, i) => (
            <div key={t} style={{
              fontSize:12, fontWeight:600, color:C.text3,
              fontFamily:'JetBrains Mono,monospace',
              padding:'16px 20px',
              borderRight: i < tools.length-1 ? `1px solid ${C.border}` : 'none',
              whiteSpace:'nowrap',
              transition:'color 0.1s',
              cursor:'default',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.accent}
            onMouseLeave={e => e.currentTarget.style.color = C.text3}
            >{t}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { end:65,  suffix:'+',  label:'Pull requests merged',   sub:'per student, every one reviewed' },
    { end:3,   suffix:'',   label:'Production products',    sub:'shipped & deployed to production' },
    { end:10,  suffix:'wk', label:'Program duration',       sub:'from zero to job-ready portfolio' },
    { end:3,   suffix:'',   label:'Cohorts completed',      sub:'with placement support included' },
  ]

  return (
    <section style={{ padding:'80px 48px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <Reveal>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:48 }}>BY THE NUMBERS</div>
        </Reveal>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
          {stats.map((s, i) => {
            const [ref, count] = useCounter(s.end)
            return (
              <div key={s.label} ref={ref} style={{
                paddingRight: i < stats.length-1 ? 40 : 0,
                paddingLeft: i > 0 ? 40 : 0,
                borderRight: i < stats.length-1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{
                  fontFamily:"'Inter', sans-serif", fontSize:56, fontWeight:700,
                  letterSpacing:'-0.03em', color:C.text, lineHeight:1,
                  marginBottom:8,
                }}>
                  {count}{s.suffix}
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:C.text2, fontFamily:"'Inter', sans-serif", marginBottom:4 }}>{s.label}</div>
                <div style={{ fontSize:12, color:C.text3, fontFamily:"'Inter', sans-serif" }}>{s.sub}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const projects = [
    {
      num: '01', name: 'Full-Stack SaaS App', weeks: 'Weeks 4–6',
      module: 'MODULE — BACKEND & DATABASE',
      desc: 'Build a production backend from scratch — REST APIs, database schema design, PDF generation, and payment calculations. Your first real server.',
      tags: ['Node.js','Express','PostgreSQL','Prisma','REST APIs'],
      color: C.accent,
    },
    {
      num: '02', name: 'Multi-Role Platform', weeks: 'Weeks 7–8',
      module: 'MODULE — AUTH & PAYMENTS',
      desc: 'Implement JWT authentication, role-based access control, and live payment integration. Build dashboards with real data from your own API.',
      tags: ['React','JWT','Razorpay','Role-based access','Dashboards'],
      color: C.green,
    },
    {
      num: '03', name: 'Production Deployment', weeks: 'Week 9',
      module: 'MODULE — DEVOPS & REAL-TIME',
      desc: 'Ship your app to production with CI/CD, environment configs, file uploads, and real-time features. The thing you demo in interviews.',
      tags: ['Vercel','Cloudinary','WebSockets','CI/CD','Docker'],
      color: '#60B8D4',
    },
  ]

  return (
    <section id="projects" style={{ padding:'80px 48px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <Reveal>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:56 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:12 }}>WHAT YOU'LL BUILD</div>
              <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:42, fontWeight:700, letterSpacing:'-0.03em', color:C.text, margin:0 }}>
                3 real products.<br/><span style={{ color:C.text2 }}>All on your GitHub.</span>
              </h2>

            </div>
            <div style={{ fontSize:13, color:C.text3, fontFamily:"'Inter', sans-serif", maxWidth:260, textAlign:'right', lineHeight:1.6 }}>
              Not toy projects. Not tutorials. Products that answer "show me something you built."
            </div>
          </div>
        </Reveal>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
          {projects.map((p, i) => (
            <Reveal key={p.num} delay={i * 80}>
              <div style={{
                padding:'32px 32px',
                borderRight: i < projects.length-1 ? `1px solid ${C.border}` : 'none',
                borderTop:`2px solid ${p.color}`,
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:p.color, fontWeight:700, letterSpacing:'0.1em' }}>{p.module}</span>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:C.text3, letterSpacing:'0.06em' }}>{p.weeks}</span>
                </div>
                <h3 style={{ fontFamily:"'Inter', sans-serif", fontSize:22, fontWeight:700, color:C.text, margin:'0 0 14px', letterSpacing:'-0.02em' }}>{p.name}</h3>
                <p style={{ fontSize:13, color:C.text2, lineHeight:1.75, fontFamily:"'Inter', sans-serif", margin:'0 0 24px' }}>{p.desc}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{
                      fontSize:10, fontWeight:600, color:C.text3,
                      fontFamily:'JetBrains Mono,monospace',
                      border:`1px solid ${C.border}`, padding:'3px 8px',
                      letterSpacing:'0.04em',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Curriculum ───────────────────────────────────────────────────────────────
function Curriculum() {
  const weeks = [
    { w:1,  title:'Git, JavaScript, APIs & Developer Workflow',       tag:'Foundations' },
    { w:2,  title:'Node.js, Express, PostgreSQL & Prisma',            tag:'Backend' },
    { w:3,  title:'React — State, Forms & TanStack Query',            tag:'Frontend' },
    { w:4,  title:'Authentication — JWT, Refresh Tokens & RBAC',      tag:'Auth' },
    { w:5,  title:'Project 1 — SaaS App Core Features',               tag:'Project 1' },
    { w:6,  title:'Project 1 — Cloudinary, File Uploads & Deploy',    tag:'Project 1' },
    { w:7,  title:'Project 2 — Payments with Razorpay',               tag:'Project 2' },
    { w:8,  title:'Project 2 — Real-time with Socket.io & Deploy',    tag:'Project 2' },
    { w:9,  title:'Project 3 — AI Integration, CI/CD & Production',   tag:'Project 3' },
    { w:10, title:'Career Week — Resume, LinkedIn & Job Strategy',     tag:'Career' },
  ]

  return (
    <section id="curriculum" style={{ padding:'80px 48px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'280px 1fr', gap:80 }}>
        <Reveal>
          <div style={{ position:'sticky', top:80 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:14 }}>CURRICULUM</div>
            <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:36, fontWeight:700, letterSpacing:'-0.02em', color:C.text, margin:'0 0 20px', lineHeight:1.1 }}>
              10 weeks.<br/><span style={{ color:C.text2 }}>Real skills.</span>
            </h2>
            <p style={{ fontSize:13, color:C.text3, lineHeight:1.75, fontFamily:"'Inter', sans-serif" }}>
              Each week builds directly on the last. By Week 10 you understand the full stack — from terminal to production.
            </p>
          </div>
        </Reveal>

        <div>
          {weeks.map((w, i) => (
            <Reveal key={w.w} delay={i * 40}>
              <div style={{
                display:'flex', alignItems:'flex-start', gap:24,
                padding:'20px 0',
                borderBottom: i < weeks.length-1 ? `1px solid ${C.border}` : 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.paddingLeft='12px'}
              onMouseLeave={e => e.currentTarget.style.paddingLeft='0'}
              >
                <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:C.text3, fontWeight:700, marginTop:2, flexShrink:0, width:48 }}>W{String(w.w).padStart(2,'0')}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:600, color:C.text, fontFamily:"'Inter', sans-serif", marginBottom:4 }}>{w.title}</div>
                </div>
                <div style={{
                  fontSize:9, fontWeight:700, color:C.accent,
                  border:`1px solid ${C.border2}`, padding:'3px 8px',
                  letterSpacing:'0.1em', fontFamily:"'Inter', sans-serif",
                  flexShrink:0, marginTop:2,
                }}>{w.tag.toUpperCase()}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n:'01', title:'Enroll & get access', desc:'Immediately access the student portal, lesson content, and the Week 1 starter repo.' },
    { n:'02', title:'Build daily, PR daily', desc:'Every day you build real features and open a pull request. No shortcuts.' },
    { n:'03', title:'Reviews every PR', desc:'Every pull request gets reviewed for logic, naming, security, and structure. Fix the feedback, push again, get re-reviewed.' },
    { n:'04', title:'Ship & get placed', desc:'3 deployed products, 65+ merged PRs, and a structured job search process.' },
  ]

  return (
    <section style={{ padding:'80px 48px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <Reveal>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:12 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:42, fontWeight:700, letterSpacing:'-0.03em', color:C.text, margin:'0 0 56px' }}>
            The process is the product.
          </h2>
        </Reveal>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div style={{
                paddingRight: i < steps.length-1 ? 36 : 0,
                paddingLeft: i > 0 ? 36 : 0,
                borderRight: i < steps.length-1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:32, fontWeight:700, color:C.border2, marginBottom:16, letterSpacing:'-0.02em' }}>{s.n}</div>
                <h3 style={{ fontFamily:"'Inter', sans-serif", fontSize:15, fontWeight:700, color:C.text, margin:'0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize:13, color:C.text3, lineHeight:1.7, fontFamily:"'Inter', sans-serif", margin:0 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing({ onApply }) {
  const plans = [
    {
      id: 'solo',
      name: 'Solo',
      price: '₹7,999',
      badge: null,
      tagline: 'Build real projects. Ship real code.',
      desc: 'Full 10-week curriculum, code review on every PR, and community access. Best for self-driven students who want project experience without career support.',
      features: [
        { title: 'Full 10-week project curriculum', sub: 'All lessons, project briefs, and code examples unlocked on day 1. No drip-feeding.' },
        { title: 'Code review on every pull request', sub: 'Every PR is reviewed for logic, naming, security, and architecture — the same feedback loop used at real companies.' },
        { title: 'Community Discord access', sub: 'Ask questions, share progress, and get unblocked by peers from all cohorts.' },
        { title: 'Completion certificate', sub: 'Issued after 10 weeks and 20+ merged PRs. Verifiable and LinkedIn-ready.' },
        { title: 'Lifetime content access', sub: 'Curriculum updates go to your account forever. No re-purchase, no expiry.' },
      ],
      cta: 'Start Solo',
      accent: '#6B7280',
      recommended: false,
    },
    {
      id: 'cohort',
      name: 'Cohort',
      price: '₹13,999',
      badge: 'MOST POPULAR',
      tagline: 'Build projects + get placement-ready.',
      desc: 'Everything in Solo plus resume guidance, job application strategy, interview prep material, and one mock interview with a real developer.',
      features: [
        { title: 'Everything in Solo', sub: 'Full 10-week curriculum, code reviews on every PR, Discord, certificate, and lifetime access.' },
        { title: 'Resume writing guide & template', sub: 'Learn how to write a developer resume that gets past the first filter. Includes a template and real examples.' },
        { title: 'Job application strategy', sub: 'Which companies to apply to, in what order, how to write cover letters, and how to follow up.' },
        { title: 'Interview preparation resources', sub: 'Curated DSA problems, project walkthrough practice, and behavioral question prep for fresher interviews.' },
        { title: '1 mock interview session', sub: 'A 45-minute interview with a hired freelance developer. Written feedback on what to improve.' },
      ],
      cta: 'Join Cohort 3',
      accent: C.accent,
      recommended: true,
    },
    {
      id: 'mentored',
      name: '1:1 Placement',
      price: '₹24,999',
      badge: 'MAXIMUM SUPPORT',
      tagline: 'Build projects + full placement support.',
      desc: 'Everything in Cohort plus a personal resume rewrite, LinkedIn overhaul, 3 mock interviews, and step-by-step application guidance.',
      features: [
        { title: 'Everything in Cohort', sub: 'Full curriculum, code reviews on every PR, resume guide, application strategy, and 1 mock interview.' },
        { title: 'Personal resume rewrite', sub: 'We write your resume for you — based on your projects and background. ATS-optimised, one revision included.' },
        { title: 'LinkedIn profile overhaul', sub: 'Headline, about section, and projects rewritten to attract recruiters. One revision included.' },
        { title: '3 mock interview sessions', sub: 'Three separate sessions with hired freelance developers. Each with written feedback and specific next steps.' },
        { title: 'Application tracking & guidance', sub: 'Weekly async check-in — share your applications, we tell you exactly what to do next.' },
      ],
      cta: 'Apply for 1:1',
      accent: '#A78BFA',
      recommended: false,
    },
  ]

  return (
    <section id="pricing" style={{ padding:'80px 48px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <Reveal>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:12 }}>PRICING</div>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:56, flexWrap:'wrap', gap:20 }}>
            <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:42, fontWeight:700, letterSpacing:'-0.03em', color:C.text, margin:0 }}>
              No hidden fees.<br/>No subscriptions.
            </h2>
            <div style={{ fontSize:12, color:C.text3, fontFamily:'JetBrains Mono,monospace', border:`1px solid ${C.border}`, padding:'8px 16px', letterSpacing:'0.04em' }}>
              7-day refund · no questions asked
            </div>
          </div>
        </Reveal>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <div style={{
                padding:'32px',
                borderRight: i < plans.length-1 ? `1px solid ${C.border}` : 'none',
                borderTop: `2px solid ${p.accent}`,
                background: p.recommended ? 'rgba(59,130,246,0.04)' : p.id === 'mentored' ? 'rgba(167,139,250,0.03)' : 'transparent',
                display:'flex', flexDirection:'column',
                minHeight: 640,
              }}>
                {/* Badge */}
                <div style={{ height:20, marginBottom:16 }}>
                  {p.badge && (
                    <span style={{
                      fontSize:9, fontWeight:700,
                      color: p.recommended ? C.accent : '#A78BFA',
                      letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif",
                    }}>{p.badge}</span>
                  )}
                </div>

                {/* Plan name & tagline */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:"'Inter', sans-serif", fontSize:18, fontWeight:700, color:C.text, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:C.text3 }}>{p.tagline}</div>
                </div>

                {/* Price */}
                <div style={{ marginBottom:20 }}>
                  <span style={{ fontFamily:"'Inter', sans-serif", fontSize:40, fontWeight:700, color:C.text, letterSpacing:'-0.03em' }}>{p.price}</span>
                  <span style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:C.text3, marginLeft:6 }}>one-time</span>
                </div>

                {/* Description */}
                <p style={{ fontSize:13, color:C.text3, lineHeight:1.7, fontFamily:"'Inter', sans-serif", marginBottom:24, minHeight:54 }}>{p.desc}</p>

                {/* Features */}
                <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:32, flex:1 }}>
                  {p.features.map(f => (
                    <div key={f.title} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                      <span style={{ color: p.recommended ? C.accent : p.id === 'mentored' ? '#A78BFA' : C.text3, fontSize:11, fontFamily:'JetBrains Mono,monospace', flexShrink:0, marginTop:2 }}>✓</span>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color: p.recommended || p.id === 'mentored' ? C.text : C.text2, fontFamily:"'Inter', sans-serif", lineHeight:1.4, marginBottom:2 }}>{f.title}</div>
                        <div style={{ fontSize:11, color:C.text3, fontFamily:"'Inter', sans-serif", lineHeight:1.5 }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button onClick={onApply} style={{
                  width:'100%', padding:'12px',
                  background: p.recommended ? C.accent : p.id === 'mentored' ? 'rgba(167,139,250,0.12)' : 'transparent',
                  border: p.recommended ? 'none' : p.id === 'mentored' ? '1px solid rgba(167,139,250,0.3)' : `1px solid ${C.border2}`,
                  color: p.recommended ? '#fff' : p.id === 'mentored' ? '#A78BFA' : C.text3,
                  fontWeight:700, fontSize:13, cursor:'pointer',
                  fontFamily:"'Inter', sans-serif", letterSpacing:'0.04em',
                  transition:'opacity 0.15s',
                  marginTop:'auto',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >{p.cta}</button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Guarantee note */}
        <Reveal>
          <div style={{ marginTop:32, textAlign:'center' }}>
            <p style={{ fontSize:12, color:C.text3, fontFamily:"'Inter', sans-serif", lineHeight:1.7 }}>
              All plans include a <strong style={{ color:C.text2 }}>7-day full refund</strong> if you haven't opened your first PR yet.
              No forms, no questions. Email <span style={{ fontFamily:'JetBrains Mono,monospace' }}>support@devforge.in</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    { quote: 'I had 3 interviews lined up before the program even ended. The PR workflow alone is worth the fee — it is how real companies work.', name:'Priya Sharma', detail:'Cohort 2 · Now at Razorpay' },
    { quote: 'Every week I was genuinely scared I wouldn\'t finish — and then I did. That\'s the kind of confidence that shows up in interviews.', name:'Karan Mehta', detail:'Cohort 2 · Now at Zerodha' },
    { quote: 'The code reviews were brutal in the best way. By Week 6 I was writing code that didn\'t get comments at all — that\'s when I knew I\'d actually levelled up.', name:'Ananya Roy', detail:'Cohort 2 · Now at a Bangalore startup' },
  ]

  return (
    <section id="testimonials" style={{ padding:'80px 48px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <Reveal>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:12 }}>TESTIMONIALS</div>
          <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:42, fontWeight:700, letterSpacing:'-0.03em', color:C.text, margin:'0 0 56px' }}>
            From the people who built the products.
          </h2>
        </Reveal>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 80}>
              <div style={{
                padding:'32px',
                borderRight: i < quotes.length-1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ fontFamily:"'Inter', sans-serif", fontSize:48, color:C.border2, lineHeight:1, marginBottom:16 }}>"</div>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:16, color:C.text2, lineHeight:1.7, margin:'0 0 28px' }}>{q.quote}</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:28, height:28, background:C.accent, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:11, fontFamily:"'Inter', sans-serif" }}>
                    {q.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text, fontFamily:"'Inter', sans-serif" }}>{q.name}</div>
                    <div style={{ fontSize:11, color:C.text3, fontFamily:'JetBrains Mono,monospace', marginTop:2 }}>{q.detail}</div>
                  </div>
                </div>
              </div>
            </Reveal>
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
    { q:'Do I need a CS degree?', a:'No. Most students are engineering graduates from non-CS branches or working professionals. What matters is commitment and the ability to spend 3–4 focused hours daily.' },
    { q:'What level of programming knowledge is required?', a:'You should know basic JavaScript — variables, functions, arrays, loops. If you can write a function that filters an array, you are ready.' },
    { q:'How is this different from YouTube tutorials?', a:'Tutorials teach you to watch. This program teaches you to build. Every day you open a real pull request that gets reviewed with real feedback. You cannot fake your way through that.' },
    { q:'Can I do this while working full-time?', a:'Yes. The program is fully async — no live sessions, no fixed schedule. 3–4 focused hours daily is recommended. Most students do early morning or dedicated evening blocks.' },
    { q:'What happens after the program?', a:'You leave with 3 deployed products, 65+ merged PRs, and access to our placement network. We track every student\'s placement and optimize the curriculum based on what interviewers actually test.' },
  ]

  return (
    <section style={{ padding:'80px 48px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <Reveal>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:12 }}>FAQ</div>
          <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:42, fontWeight:700, letterSpacing:'-0.03em', color:C.text, margin:'0 0 48px' }}>
            Common questions.
          </h2>
        </Reveal>
        {items.map((item, i) => (
          <div key={item.q} style={{ borderBottom:`1px solid ${C.border}` }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'20px 0', background:'none', border:'none', cursor:'pointer',
                textAlign:'left',
              }}
            >
              <span style={{ fontSize:15, fontWeight:600, color: open === i ? C.accent : C.text, fontFamily:"'Inter', sans-serif", transition:'color 0.1s' }}>{item.q}</span>
              <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:16, color:C.text3, transition:'transform 0.2s', transform: open===i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
            </button>
            {open === i && (
              <div style={{ paddingBottom:20, fontSize:14, color:C.text2, lineHeight:1.8, fontFamily:"'Inter', sans-serif" }}>{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA({ onApply }) {
  return (
    <section style={{ padding:'100px 48px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
        <Reveal>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:20 }}>COHORT 3 · LIMITED SEATS REMAINING</div>
          <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:52, fontWeight:700, letterSpacing:'-0.03em', color:C.text, margin:'0 0 20px', lineHeight:1.05 }}>
            Your GitHub should speak<br/><span style={{ color:C.accent }}>for itself.</span>
          </h2>
          <p style={{ fontSize:15, color:C.text2, lineHeight:1.8, fontFamily:"'Inter', sans-serif", marginBottom:40 }}>
            Interviews are won before you walk in. 65+ merged PRs, 3 deployed products, and code your interviewers can actually open.
          </p>
          <button onClick={onApply} style={{
            background:C.accent, border:'none', cursor:'pointer',
            fontSize:15, fontWeight:700, color:'#fff',
            fontFamily:"'Inter', sans-serif", padding:'16px 40px',
            letterSpacing:'0.04em', transition:'opacity 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >Apply for Cohort 3 →</button>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding:'40px 48px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:22, height:22, background:C.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:9, fontWeight:800, color:'#fff', fontFamily:'JetBrains Mono,monospace' }}>DF</span>
        </div>
        <span style={{ fontFamily:"'Inter', sans-serif", fontWeight:700, fontSize:14, color:C.text3, letterSpacing:'-0.02em' }}>DevForge</span>
      </div>
      <div style={{ display:'flex', gap:28 }}>
        {['Privacy','Terms','support@devforge.in'].map(l => (
          <a key={l} href="#" style={{ fontSize:12, color:C.text3, textDecoration:'none', fontFamily:"'Inter', sans-serif", transition:'color 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.color = C.text2}
          onMouseLeave={e => e.currentTarget.style.color = C.text3}
          >{l}</a>
        ))}
      </div>
      <div style={{ fontSize:11, color:C.text3, fontFamily:'JetBrains Mono,monospace' }}>© 2025 DevForge</div>
    </footer>
  )
}

// ─── Apply modal ──────────────────────────────────────────────────────────────
function ApplyModal({ onClose }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', plan:'Cohort — ₹13,999' })

  const [done, setDone] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setDone(true)
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.7)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:200,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background:C.surface, border:`1px solid ${C.border2}`,
        width:480, padding:'36px', position:'relative',
      }}>
        <button onClick={onClose} style={{
          position:'absolute', top:16, right:16, background:'none', border:'none',
          cursor:'pointer', color:C.text3, fontSize:18, lineHeight:1,
          fontFamily:'JetBrains Mono,monospace',
        }}>×</button>

        {done ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:13, color:C.green, marginBottom:16, letterSpacing:'0.06em' }}>✓ APPLICATION RECEIVED</div>
            <div style={{ fontFamily:"'Inter', sans-serif", fontSize:24, fontWeight:700, color:C.text, marginBottom:12, letterSpacing:'-0.02em' }}>You're in the queue.</div>
            <p style={{ fontSize:14, color:C.text2, fontFamily:"'Inter', sans-serif", lineHeight:1.8, marginBottom:20 }}>
              We'll email <strong style={{ color:C.text }}>{form.email}</strong> within 24 hours with your admission status and payment link.
            </p>
            <div style={{ background:C.surface2, border:`1px solid ${C.border}`, padding:'16px', textAlign:'left' }}>
              <div style={{ fontSize:11, color:C.text3, fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.08em', marginBottom:10 }}>WHAT HAPPENS NEXT</div>
              {['We review your application (same day)','You receive admission confirmation + payment link','Pay to lock your seat — cohort starts within 7 days','Get instant access to Week 1 content & Discord'].map((s, i) => (
                <div key={i} style={{ display:'flex', gap:10, marginBottom:6, fontSize:12, color:C.text2, fontFamily:"'Inter', sans-serif" }}>
                  <span style={{ color:C.accent, fontFamily:'JetBrains Mono,monospace', flexShrink:0 }}>{i+1}.</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:'0.14em', fontFamily:"'Inter', sans-serif", marginBottom:14 }}>APPLY FOR COHORT 3</div>
            <h2 style={{ fontFamily:"'Inter', sans-serif", fontSize:26, fontWeight:700, color:C.text, margin:'0 0 28px', letterSpacing:'-0.02em' }}>
              Reserve your seat
            </h2>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[['Full name','name','text'],['Email address','email','email'],['Phone number','phone','tel']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ fontSize:10, fontWeight:700, color:C.text3, letterSpacing:'0.1em', fontFamily:"'Inter', sans-serif", display:'block', marginBottom:7 }}>{label.toUpperCase()}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({...form, [key]:e.target.value})}
                    style={{
                      width:'100%', padding:'10px 12px',
                      background:C.surface2, border:`1px solid ${C.border}`,
                      color:C.text, fontSize:13, fontFamily:"'Inter', sans-serif",
                      outline:'none', boxSizing:'border-box', transition:'border-color 0.1s',
                    }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:C.text3, letterSpacing:'0.1em', fontFamily:"'Inter', sans-serif", display:'block', marginBottom:7 }}>PLAN</label>
                <select
                  value={form.plan}
                  onChange={e => setForm({...form, plan:e.target.value})}
                  style={{
                    width:'100%', padding:'10px 12px',
                    background:C.surface2, border:`1px solid ${C.border}`,
                    color:C.text, fontSize:13, fontFamily:"'Inter', sans-serif",
                    outline:'none', boxSizing:'border-box',
                  }}
                >
                  <option>Cohort — ₹13,999</option>
                  <option>Solo — ₹7,999</option>
                  <option>1:1 Placement — ₹24,999</option>
                </select>
              </div>
              <button type="submit" style={{
                background:C.accent, border:'none', cursor:'pointer',
                fontSize:13, fontWeight:700, color:'#fff',
                fontFamily:"'Inter', sans-serif", padding:'13px',
                letterSpacing:'0.06em', marginTop:8,
                transition:'opacity 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >SUBMIT APPLICATION</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div style={{ background:C.bg, minHeight:'100vh', fontFamily:"'Inter', sans-serif" }}>
      <ScrollProgress/>
      <Navbar onApply={() => setShowModal(true)}/>
      <Hero onApply={() => setShowModal(true)}/>
      <ToolsBar/>
      <Stats/>
      <Projects/>
      <Curriculum/>
      <HowItWorks/>
      <Pricing onApply={() => setShowModal(true)}/>
      <Testimonials/>
      <FAQ/>
      <CTA onApply={() => setShowModal(true)}/>
      <Footer/>
      {showModal && <ApplyModal onClose={() => setShowModal(false)}/>}
    </div>
  )
}
