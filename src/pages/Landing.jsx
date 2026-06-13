import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://devforge-production-742c.up.railway.app/api'

const C = {
  bg:      '#07070C',
  bg2:     '#0B0B12',
  surface: '#101018',
  sur2:    '#15151E',
  border:  '#1C1C2A',
  bord2:   '#282838',
  text:    '#F0F0F4',
  text2:   '#9292A8',
  text3:   '#5A5A70',
  amber:   '#F59E0B',
  amberDk: '#D97706',
  violet:  '#8B5CF6',
  green:   '#10B981',
  red:     '#EF4444',
  blue:    '#3B82F6',
  dk: {
    bg:      '#0D1117',
    surface: '#161B22',
    surface2:'#21262D',
    border:  '#30363D',
    text:    '#E6EDF3',
    text2:   '#8B949E',
    text3:   '#6E7681',
    accent:  '#F59E0B',
    green:   '#3FB950',
    red:     '#FCA5A5',
  }
}

const PILOT_SEATS_LEFT = 12
const WHATSAPP_NUMBER  = '919390545942'

const ease = [0.22, 1, 0.36, 1]
const fade = { hidden:{ opacity:0, y:24 }, visible:{ opacity:1, y:0, transition:{ duration:0.6, ease } } }
const viewportOnce = { once:true, margin:'-60px' }

const gText = {
  background: `linear-gradient(120deg, ${C.amber} 0%, #FB923C 70%, ${C.violet} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0,1], [0,1])
  return (
    <motion.div style={{
      position:'fixed', top:0, left:0, right:0, height:2,
      background:`linear-gradient(90deg, ${C.amber}, #FB923C, ${C.violet})`,
      scaleX, transformOrigin:'left', zIndex:100,
    }}/>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onApply }) {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive:true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <motion.nav
      initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
      style={{
        position:'fixed', top:0, left:0, right:0, zIndex:50, height:60,
        background: scrolled ? 'rgba(7,7,12,0.96)' : 'rgba(7,7,12,0.6)',
        borderBottom:`1px solid ${scrolled ? C.border : 'transparent'}`,
        backdropFilter:'blur(20px)',
        transition:'all 0.3s',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 48px',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:30, height:30, background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 16px ${C.amber}40` }}>
          <span style={{ fontSize:11, fontWeight:900, color:'#000', fontFamily:'Inter,sans-serif' }}>DF</span>
        </div>
        <span style={{ fontWeight:700, fontSize:15, color:C.text, letterSpacing:'-0.02em' }}>DevForge</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:36 }}>
        {['Projects','Curriculum','Pricing'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`}
            style={{ fontSize:14, fontWeight:500, color:C.text3, textDecoration:'none', transition:'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.text3}
          >{l}</a>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => navigate('/login')}
          style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:500, color:C.text3, padding:'6px 12px', transition:'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.text3}
        >Login</button>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+want+to+know+more+about+DevForge`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize:14, fontWeight:500, color:C.text2, textDecoration:'none', padding:'7px 16px', border:`1px solid ${C.border}`, borderRadius:7, transition:'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#25D366'; e.currentTarget.style.color='#25D366' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.text2 }}
        >WhatsApp</a>
        <button onClick={onApply}
          style={{ background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, border:'none', borderRadius:7, cursor:'pointer', fontSize:14, fontWeight:700, color:'#000', padding:'8px 20px', transition:'opacity 0.15s', boxShadow:`0 4px 20px ${C.amber}35` }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >Apply Now →</button>
      </div>
    </motion.nav>
  )
}

// ─── Dashboard Mockup (dark — GitHub theme) ───────────────────────────────────
function DashboardMockup() {
  const D = C.dk
  const tickets = [
    { code:'LB-005', title:'Invoice PDF — Cloudinary upload',     status:'In Review',   color:D.red    },
    { code:'LB-006', title:'Dashboard revenue aggregation',       status:'In Progress', color:D.accent },
    { code:'LB-007', title:'Role-based access — admin panel',     status:'Todo',        color:D.text3  },
  ]
  return (
    <div style={{ width:'100%', height:'100%', fontFamily:'JetBrains Mono,monospace', display:'flex', flexDirection:'column', overflow:'hidden', background:D.bg }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 200px', gap:10, padding:10, flex:1, overflow:'hidden' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ background:D.surface, border:`1px solid ${D.border}`, borderLeft:`3px solid ${D.accent}`, padding:'10px 12px' }}>
            <div style={{ fontSize:9, color:D.text3, marginBottom:3 }}>{'>'} week 5 of 12</div>
            <div style={{ fontSize:13, fontWeight:700, color:D.text, marginBottom:6 }}>Welcome back, Ravikiran</div>
            <div style={{ height:2, background:D.border, overflow:'hidden' }}>
              <div style={{ height:'100%', width:'50%', background:D.accent }} />
            </div>
            <div style={{ fontSize:9, color:D.text3, marginTop:3 }}>50% complete · 5 weeks remaining</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:D.border }}>
            {[{l:'PRS MERGED',v:'24',c:D.green},{l:'LESSONS',v:'18',c:D.accent},{l:'AVG GRADE',v:'91',c:D.text2}].map(s => (
              <div key={s.l} style={{ background:D.surface, padding:'8px 10px', borderTop:`2px solid ${s.c}` }}>
                <div style={{ fontSize:8, color:D.text3, marginBottom:3, letterSpacing:'0.1em' }}>{s.l}</div>
                <div style={{ fontSize:18, fontWeight:700, color:s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, color:D.text3, marginBottom:5, letterSpacing:'0.1em' }}>ACTIVE TICKETS</div>
            {tickets.map(t => (
              <div key={t.code} style={{ background:D.surface, border:`1px solid ${D.border}`, borderLeft:`2px solid ${t.color}`, padding:'6px 10px', marginBottom:5 }}>
                <div style={{ fontSize:9, color:D.text3, marginBottom:2 }}>{t.code}</div>
                <div style={{ fontSize:10, color:D.text2 }}>{t.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:t.color }} />
                  <span style={{ fontSize:8, color:D.text3 }}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ background:D.surface, border:`1px solid ${D.border}`, padding:'10px 12px', flex:1 }}>
            <div style={{ fontSize:9, color:D.text3, letterSpacing:'0.1em', marginBottom:8 }}>THIS WEEK</div>
            {[{l:'Cloudinary upload endpoint',d:true},{l:'Invoice PDF generation',d:true},{l:'Dashboard revenue query',d:false}].map((g,i) => (
              <div key={i} style={{ display:'flex', gap:7, alignItems:'center', padding:'4px 0', borderBottom:i<2?`1px solid ${D.border}`:'none' }}>
                <div style={{ width:10, height:10, border:`1px solid ${g.d?D.accent:D.border}`, background:g.d?D.accent:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {g.d && <Check size={6} color="#000" />}
                </div>
                <span style={{ fontSize:8, color:g.d?D.text3:D.text2, textDecoration:g.d?'line-through':'none' }}>{g.l}</span>
              </div>
            ))}
            <div style={{ marginTop:8, height:2, background:D.border }}>
              <div style={{ height:'100%', width:'66%', background:D.accent }} />
            </div>
            <div style={{ fontSize:9, color:D.accent, marginTop:3 }}>2/3 done</div>
          </div>
          <div style={{ background:D.surface, border:`1px solid ${D.border}`, padding:'10px 12px' }}>
            <div style={{ fontSize:9, color:D.text3, letterSpacing:'0.1em', marginBottom:6 }}>LATEST PR</div>
            <div style={{ background:D.surface2, borderLeft:`2px solid ${D.green}`, padding:'5px 7px', marginBottom:4 }}>
              <div style={{ fontSize:8, color:D.green, marginBottom:1 }}>✓ Logic correct</div>
              <div style={{ fontSize:8, color:D.text3, lineHeight:1.4 }}>Good use of multer. Add file size validation.</div>
            </div>
            <div style={{ background:D.surface2, borderLeft:`2px solid ${D.accent}`, padding:'5px 7px' }}>
              <div style={{ fontSize:8, color:D.accent, marginBottom:1 }}>⚠ Suggestion</div>
              <div style={{ fontSize:8, color:D.text3, lineHeight:1.4 }}>Store only the URL in DB, not full response.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onApply }) {
  return (
    <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:60, background:C.bg, position:'relative', overflow:'hidden' }}>

      {/* Ambient orbs */}
      <div style={{ position:'absolute', top:'-15%', right:'-10%', width:'700px', height:'700px', background:`radial-gradient(ellipse, ${C.amber}0C 0%, transparent 65%)`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-20%', left:'-10%', width:'600px', height:'600px', background:`radial-gradient(ellipse, ${C.violet}0A 0%, transparent 65%)`, pointerEvents:'none' }} />

      {/* Dot grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle, ${C.border} 1px, transparent 1px)`, backgroundSize:'28px 28px', opacity:0.5, pointerEvents:'none' }} />

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'60px 48px', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center', position:'relative' }}>

        {/* Left — copy */}
        <div>
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}
            style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${C.amber}12`, border:`1px solid ${C.amber}28`, borderRadius:100, padding:'6px 14px', marginBottom:32 }}
          >
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.green, display:'inline-block' }} />
            <span style={{ fontSize:12, fontWeight:600, color:C.amber, letterSpacing:'0.03em' }}>{PILOT_SEATS_LEFT} founding seats · enroll today</span>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.2, ease }}
            style={{ fontSize:'clamp(40px,5.5vw,68px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.03em', margin:'0 0 24px', fontFamily:'Inter,sans-serif' }}
          >
            <span style={{ color:C.text }}>Build 3 real products</span><br />
            <span style={gText}>in 12 weeks.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35, ease }}
            style={{ fontSize:18, color:C.text2, lineHeight:1.75, maxWidth:480, margin:'0 0 40px', fontWeight:400 }}
          >
            65+ merged pull requests. 3 deployed apps. A GitHub profile that gets you past the first screening call.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.5, ease }}
            style={{ display:'flex', alignItems:'center', gap:14, marginBottom:44, flexWrap:'wrap' }}
          >
            <button onClick={onApply}
              style={{ background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, border:'none', borderRadius:10, cursor:'pointer', fontSize:15, fontWeight:700, color:'#000', padding:'14px 36px', display:'flex', alignItems:'center', gap:8, boxShadow:`0 8px 32px ${C.amber}40`, transition:'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 12px 40px ${C.amber}50` }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 8px 32px ${C.amber}40` }}
            >Enroll Now <ArrowRight size={16} /></button>

            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+want+to+know+more+about+DevForge`}
              target="_blank" rel="noopener noreferrer"
              style={{ fontSize:15, fontWeight:600, color:C.text2, textDecoration:'none', border:`1px solid ${C.bord2}`, borderRadius:10, padding:'13px 28px', display:'flex', alignItems:'center', gap:8, transition:'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#25D366'; e.currentTarget.style.color='#25D366' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.bord2; e.currentTarget.style.color=C.text2 }}
            >{WA_ICON} Talk to us</a>
          </motion.div>

          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5, delay:0.7 }}
            style={{ display:'flex', gap:24, flexWrap:'wrap' }}
          >
            {['ECE / Mech / Any branch','Real PRs, real feedback','Job support included'].map(b => (
              <div key={b} style={{ display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ color:C.green, fontSize:12, fontWeight:700 }}>✓</span>
                <span style={{ fontSize:13, color:C.text3, fontWeight:500 }}>{b}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — portal preview */}
        <motion.div
          initial={{ opacity:0, x:32 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.3, ease }}
        >
          <div style={{ borderRadius:14, overflow:'hidden', border:`1px solid ${C.border}`, boxShadow:`0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.border}` }}>
            <div style={{ height:36, background:'#0D1117', display:'flex', alignItems:'center', padding:'0 14px', gap:7, borderBottom:`1px solid #30363D` }}>
              {['#EF4444','#F59E0B','#10B981'].map((c,i) => (
                <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c, opacity:0.8 }} />
              ))}
              <div style={{ flex:1, margin:'0 12px', background:'#21262D', borderRadius:4, height:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:10, color:'#6E7681', fontFamily:'Inter,sans-serif' }}>app.devforge.in/dashboard</span>
              </div>
            </div>
            <div style={{ height:420 }}>
              <DashboardMockup />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value:'65+',   label:'Pull requests merged',  sub:'per student, every one reviewed'   },
    { value:'3',     label:'Products shipped',       sub:'deployed to production'             },
    { value:'12',    label:'Weeks',                  sub:'zero to job-ready portfolio'        },
    { value:'< 24h', label:'Mentor feedback',        sub:'on every PR, no waiting'            },
  ]
  return (
    <section style={{ padding:'64px 48px', background:C.bg2, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:i*0.08 }}
            style={{ paddingRight:i<3?40:0, paddingLeft:i>0?40:0, borderRight:i<3?`1px solid ${C.border}`:'none' }}
          >
            <div style={{ fontSize:50, fontWeight:800, lineHeight:1, marginBottom:8, letterSpacing:'-0.03em', background:`linear-gradient(120deg, ${C.amber}, #FB923C)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{s.value}</div>
            <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:13, color:C.text3 }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Tools marquee ────────────────────────────────────────────────────────────
function ToolsBar() {
  const tools = ['React','Node.js','Express','PostgreSQL','Prisma','GitHub','Vercel','JWT','Razorpay','Socket.io','Cloudinary','Railway','Claude API']
  const doubled = [...tools, ...tools]
  return (
    <div style={{ borderBottom:`1px solid ${C.border}`, background:C.surface, overflow:'hidden', display:'flex', alignItems:'center' }}>
      <div style={{ fontSize:10, fontWeight:700, color:C.text3, letterSpacing:'0.14em', whiteSpace:'nowrap', padding:'14px 20px', borderRight:`1px solid ${C.border}`, flexShrink:0, textTransform:'uppercase' }}>Stack</div>
      <div style={{ overflow:'hidden', flex:1 }}>
        <motion.div animate={{ x:['0%','-50%'] }} transition={{ repeat:Infinity, duration:30, ease:'linear' }}
          style={{ display:'flex', width:'max-content' }}
        >
          {doubled.map((t,i) => (
            <div key={i} style={{ fontSize:12, fontWeight:500, color:C.text3, padding:'14px 22px', borderRight:`1px solid ${C.border}`, whiteSpace:'nowrap', transition:'color 0.15s', fontFamily:'JetBrains Mono,monospace' }}
              onMouseEnter={e => e.currentTarget.style.color=C.amber}
              onMouseLeave={e => e.currentTarget.style.color=C.text3}
            >{t}</div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const projects = [
    {
      num:'01', name:'Ordering & Payments App', weeks:'Weeks 5–6', accent:C.green,
      desc:'Full-stack ordering system with server-side payment verification, real-time order tracking, and a live kitchen dashboard.',
      tags:['Node.js','Express','PostgreSQL','Razorpay','Socket.io'],
    },
    {
      num:'02', name:'SaaS Billing Platform', weeks:'Weeks 7–9', accent:C.amber,
      desc:'Multi-tenant billing SaaS — GST invoices, PDF generation, payment tracking, and a full React dashboard.',
      tags:['React','pdf-lib','GST Logic','TanStack Query','Cloudinary'],
    },
    {
      num:'03', name:'AI-Powered Web App', weeks:'Weeks 10–11', accent:C.violet,
      desc:'Integrate Claude AI for intelligent automation, set up GitHub Actions CI/CD, and deploy a production-grade app.',
      tags:['Claude API','GitHub Actions','Nodemailer','Vercel','Railway'],
    },
  ]
  return (
    <section id="projects" style={{ padding:'80px 48px', background:C.bg, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom:52 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>What you'll build</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:800, color:C.text, margin:0, letterSpacing:'-0.03em', lineHeight:1.1 }}>
            3 real products.<br /><span style={{ color:C.text3, fontWeight:600, fontSize:'0.85em' }}>All on your GitHub.</span>
          </h2>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {projects.map((p, i) => (
            <motion.div key={p.num} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:i*0.1 }}>
              <div style={{ padding:'28px', border:`1px solid ${C.border}`, borderTop:`3px solid ${p.accent}`, borderRadius:12, height:'100%', boxSizing:'border-box', background:C.surface, transition:'border-color 0.2s, transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 20px 60px rgba(0,0,0,0.4)` }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:p.accent, letterSpacing:'0.1em', textTransform:'uppercase' }}>{p.weeks}</span>
                  <span style={{ fontSize:28, fontWeight:800, color:C.border, letterSpacing:'-0.02em', lineHeight:1 }}>{p.num}</span>
                </div>
                <h3 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 12px', letterSpacing:'-0.015em' }}>{p.name}</h3>
                <p style={{ fontSize:13, color:C.text2, lineHeight:1.75, margin:'0 0 20px' }}>{p.desc}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontSize:11, color:C.text3, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:4, padding:'3px 8px', fontWeight:500, fontFamily:'JetBrains Mono,monospace' }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Curriculum ───────────────────────────────────────────────────────────────
function Curriculum() {
  const phaseColors = {
    foundations:'#6B7280', backend:'#3B82F6', frontend:'#06B6D4',
    auth:'#8B5CF6', project_1:'#10B981', project_2:'#F59E0B',
    project_3:'#EF4444', career:'#9CA3AF',
  }
  const weeks = [
    { w:1,  title:'Git, JavaScript, APIs & Developer Workflow',           tag:'foundations' },
    { w:2,  title:'Node.js, Express, PostgreSQL & Prisma',                tag:'backend'     },
    { w:3,  title:'React — State, Forms & TanStack Query',                tag:'frontend'    },
    { w:4,  title:'Authentication — JWT, Refresh Tokens & RBAC',          tag:'auth'        },
    { w:5,  title:'Project 1 — Payments, APIs & Backend Logic',           tag:'project_1'   },
    { w:6,  title:'Project 1 — Real-Time Features & Full Deploy',         tag:'project_1'   },
    { w:7,  title:'Project 2 — SaaS Backend & Business Logic',            tag:'project_2'   },
    { w:8,  title:'Project 2 — PDF Generation, React & Payments',         tag:'project_2'   },
    { w:9,  title:'Project 2 — Dashboard, Forms & Deploy',                tag:'project_2'   },
    { w:10, title:'Project 3 — AI API Integration & Email Notifications',  tag:'project_3'   },
    { w:11, title:'Project 3 — CI/CD Pipeline, React & Production',        tag:'project_3'   },
    { w:12, title:'Career Week — Resume, LinkedIn & Job Strategy',          tag:'career'      },
  ]
  return (
    <section id="curriculum" style={{ padding:'80px 48px', background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'260px 1fr', gap:72 }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ position:'sticky', top:80, alignSelf:'start' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>Curriculum</p>
          <h2 style={{ fontSize:36, fontWeight:800, color:C.text, margin:'0 0 16px', lineHeight:1.12, letterSpacing:'-0.03em' }}>
            12 weeks.<br /><span style={{ color:C.text3, fontWeight:600 }}>Real skills.</span>
          </h2>
          <p style={{ fontSize:14, color:C.text2, lineHeight:1.8, margin:0 }}>
            Each week builds on the last. By Week 10 you understand the full stack — from terminal to production.
          </p>
        </motion.div>

        <div>
          {weeks.map((w, i) => {
            const color = phaseColors[w.tag]
            return (
              <motion.div key={w.w} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:i*0.02 }}>
                <div style={{ display:'flex', alignItems:'center', gap:16, padding:'15px 0', borderBottom:i<weeks.length-1?`1px solid ${C.border}`:'none' }}
                  onMouseEnter={e => e.currentTarget.style.opacity='0.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >
                  <span style={{ fontSize:11, fontWeight:700, color:C.text3, flexShrink:0, width:28, fontFamily:'JetBrains Mono,monospace' }}>W{String(w.w).padStart(2,'0')}</span>
                  <span style={{ flex:1, fontSize:14, fontWeight:500, color:C.text2, lineHeight:1.5 }}>{w.title}</span>
                  <span style={{ fontSize:9, fontWeight:700, color, background:`${color}18`, borderRadius:4, padding:'3px 8px', letterSpacing:'0.07em', textTransform:'uppercase', flexShrink:0 }}>
                    {w.tag.replace('_',' ')}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n:'01', title:'Enroll & start today',     desc:'Within 24 hours you get full access — lessons, starter repo, Jira board, and Discord. No waiting.' },
    { n:'02', title:'Build daily, PR daily',    desc:'Every day you build a real feature and open a pull request against a real project.' },
    { n:'03', title:'Get feedback on every PR', desc:'Every PR is reviewed for logic, naming, security, and structure. Fix, push, repeat.' },
    { n:'04', title:'Ship & interview',          desc:'Leave with 3 deployed products, 65+ merged PRs, and a structured approach to job applications.' },
  ]
  return (
    <section style={{ padding:'80px 48px', background:C.bg, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom:52 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>How it works</p>
          <h2 style={{ fontSize:'clamp(24px,3.5vw,44px)', fontWeight:800, color:C.text, margin:0, letterSpacing:'-0.03em' }}>The process is the product.</h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:28 }}>
          {steps.map((s, i) => (
            <motion.div key={s.n} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:i*0.1 }}>
              <div style={{ padding:'24px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, height:'100%', boxSizing:'border-box', transition:'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor=C.amber}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
              >
                <div style={{ width:36, height:36, background:`${C.amber}18`, border:`1px solid ${C.amber}30`, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  <span style={{ fontSize:13, fontWeight:800, color:C.amber, fontFamily:'JetBrains Mono,monospace' }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize:15, fontWeight:700, color:C.text, margin:'0 0 10px', letterSpacing:'-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize:13, color:C.text2, lineHeight:1.8, margin:0 }}>{s.desc}</p>
              </div>
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
    { label:'Final-year or recent CS/IT/ECE graduates', desc:'No job yet, want a portfolio that shows you can actually build.' },
    { label:'Self-taught developers stuck in tutorial hell', desc:'You finish courses but can\'t build without a step-by-step guide.' },
    { label:'Working professionals switching to dev roles', desc:'You can spare 3–4 hours a day and need structured, real output.' },
    { label:'Students who want to skip the internship queue', desc:'Ship 3 real apps and show them instead of applying blind.' },
  ]
  const notFits = [
    { label:'Complete beginners with no JavaScript exposure', desc:'Try freeCodeCamp first — variables, functions, arrays. Then come back.' },
    { label:'Anyone looking for live classes or recorded lectures', desc:'This is not a course. It is a work environment.' },
  ]
  return (
    <section style={{ padding:'80px 48px', background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom:52 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>Is this for you?</p>
          <h2 style={{ fontSize:'clamp(24px,3.5vw,44px)', fontWeight:800, color:C.text, margin:0, letterSpacing:'-0.03em' }}>Who this is for.</h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.green, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:20 }}>Good fit</p>
            {fits.map((f, i) => (
              <motion.div key={f.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:i*0.06 }}>
                <div style={{ display:'flex', gap:14, padding:'16px 0', borderBottom:i<fits.length-1?`1px solid ${C.border}`:'none' }}>
                  <span style={{ color:C.green, fontSize:13, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>{f.label}</div>
                    <div style={{ fontSize:13, color:C.text2, lineHeight:1.65 }}>{f.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.red, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:20 }}>Not the right fit</p>
            {notFits.map((f, i) => (
              <motion.div key={f.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:i*0.06 }}>
                <div style={{ display:'flex', gap:14, padding:'16px 0', borderBottom:i<notFits.length-1?`1px solid ${C.border}`:'none' }}>
                  <span style={{ color:C.red, fontSize:13, fontWeight:700, flexShrink:0, marginTop:1 }}>✕</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>{f.label}</div>
                    <div style={{ fontSize:13, color:C.text2, lineHeight:1.65 }}>{f.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
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
      id:'LIVE_COHORT', name:'Builder', price:'₹7,000', badge:null,
      tagline:'Build real products. Ship real code.',
      desc:'Full 12-week curriculum, AI code review on every PR, mentor grading within 24 hours, and Discord community.',
      features:[
        { title:'Full 12-week project curriculum',      sub:'All lessons, project briefs, and code examples unlocked on day 1.' },
        { title:'AI code review on every pull request', sub:'Every PR reviewed for logic, naming, security, and architecture.' },
        { title:'Mentor grading within 24 hours',       sub:'Human feedback on every submission — not just automated checks.' },
        { title:'Completion certificate',               sub:'Issued after 12 weeks and 65+ merged PRs. LinkedIn-ready.' },
        { title:'Discord community access',             sub:'Ask questions, share PRs, get unblocked by peers.' },
        { title:'Lifetime content access',              sub:'Curriculum updates go to your account forever.' },
      ],
      cta:'Enroll — Builder', recommended:false,
    },
    {
      id:'MENTORED', name:'Builder + Placement Prep', price:'₹12,000', badge:'Most Popular',
      tagline:'Build + get placement-ready.',
      desc:'Everything in Builder, plus resume preparation, LinkedIn setup, job strategy, and a live 1:1 mock interview.',
      features:[
        { title:'Everything in Builder',             sub:'Full curriculum, AI reviews, mentor grading, certificate, lifetime access.' },
        { title:'Resume writing & review',          sub:'Write a developer resume that gets past the first filter. We review it.' },
        { title:'LinkedIn profile preparation',     sub:'Headline, about section, and featured projects set up for recruiters.' },
        { title:'Job application strategy session', sub:'Which companies, what order, when and how to follow up.' },
        { title:'1:1 mock interview (45 min)',      sub:'Live interview with a working developer. Written feedback included.' },
      ],
      cta:'Enroll — Builder+', recommended:true,
    },
  ]
  return (
    <section id="pricing" style={{ padding:'80px 48px', background:C.bg, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom:48, textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>Pricing</p>
          <h2 style={{ fontSize:'clamp(24px,3.5vw,44px)', fontWeight:800, color:C.text, margin:'0 0 14px', letterSpacing:'-0.03em' }}>
            Founding price. No fake discounts.
          </h2>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${C.amber}12`, border:`1px solid ${C.amber}25`, borderRadius:100, padding:'6px 16px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.amber, display:'inline-block' }} />
            <span style={{ fontSize:12, fontWeight:600, color:C.amber }}>{PILOT_SEATS_LEFT} seats at this price · goes up after seat 12</span>
          </div>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
          {plans.map((p, i) => (
            <motion.div key={p.id} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:i*0.1 }}>
              <div style={{
                padding:'32px', borderRadius:14, height:'100%', boxSizing:'border-box',
                border:p.recommended?`2px solid ${C.amber}`:`1px solid ${C.border}`,
                background:p.recommended?`${C.amber}08`:C.surface,
                display:'flex', flexDirection:'column',
                boxShadow:p.recommended?`0 0 60px ${C.amber}15`:'none',
              }}>
                {p.badge && (
                  <div style={{ marginBottom:16 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:C.amberDk, background:`${C.amber}22`, borderRadius:4, padding:'3px 10px', letterSpacing:'0.06em', textTransform:'uppercase' }}>{p.badge}</span>
                  </div>
                )}
                {!p.badge && <div style={{ height:24, marginBottom:16 }} />}
                <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.text3, marginBottom:20 }}>{p.tagline}</div>
                <div style={{ marginBottom:20 }}>
                  <span style={{ fontSize:44, fontWeight:800, color:p.recommended?C.amber:C.text, letterSpacing:'-0.03em', lineHeight:1 }}>{p.price}</span>
                  <span style={{ fontSize:13, color:C.text3, marginLeft:8 }}>one-time</span>
                </div>
                <p style={{ fontSize:13, color:C.text2, lineHeight:1.7, marginBottom:24 }}>{p.desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:28, flex:1 }}>
                  {p.features.map(f => (
                    <div key={f.title} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <span style={{ color:C.green, fontSize:12, fontWeight:700, flexShrink:0, marginTop:2 }}>✓</span>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:2 }}>{f.title}</div>
                        <div style={{ fontSize:12, color:C.text3, lineHeight:1.5 }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => onApply(p.id)}
                  style={{
                    width:'100%', padding:'13px', borderRadius:9, cursor:'pointer', fontWeight:700, fontSize:14,
                    background:p.recommended?`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`:'transparent',
                    border:p.recommended?'none':`1px solid ${C.bord2}`,
                    color:p.recommended?'#000':C.text2,
                    transition:'all 0.15s',
                    boxShadow:p.recommended?`0 4px 20px ${C.amber}40`:'none',
                  }}
                  onMouseEnter={e => {
                    if (p.recommended) { e.currentTarget.style.opacity='0.85' }
                    else { e.currentTarget.style.borderColor=C.amber; e.currentTarget.style.color=C.amber }
                  }}
                  onMouseLeave={e => {
                    if (p.recommended) { e.currentTarget.style.opacity='1' }
                    else { e.currentTarget.style.borderColor=C.bord2; e.currentTarget.style.color=C.text2 }
                  }}
                >{p.cta} →</button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginTop:24, textAlign:'center' }}>
          <p style={{ fontSize:12, color:C.text3, lineHeight:1.7, marginBottom:8 }}>
            7-day full refund if you haven't opened your first PR · <span style={{ color:C.text2 }}>support@devforge.in</span>
          </p>
          <p style={{ fontSize:12, color:C.text3, marginBottom:8 }}>
            Not sure which plan?{' '}<a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+can+you+help+me+choose+a+DevForge+plan%3F`} target="_blank" rel="noopener noreferrer" style={{ color:C.amber, textDecoration:'none', fontWeight:600 }}>WhatsApp us →</a>
          </p>
          <p style={{ fontSize:12, color:C.text3 }}>
            Enrolling 5+ from the same college?{' '}<a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I%27m+a+college+coordinator+interested+in+group+enrollment`} target="_blank" rel="noopener noreferrer" style={{ color:C.text2, textDecoration:'none' }}>Ask about group rates →</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Outcomes ─────────────────────────────────────────────────────────────────
function Outcomes() {
  const outcomes = [
    { label:'3 Deployed Products', stat:'3', unit:'live products', title:'Real apps, live URLs.', desc:'Restaurant ordering system with Razorpay. GST billing SaaS with PDF invoices. AI-powered client support desk on CI/CD. All public, all yours.' },
    { label:'65+ Merged PRs',      stat:'65+', unit:'merged PRs',  title:'A GitHub profile that speaks.', desc:'Every feature is a PR. Every PR gets reviewed for logic, security, and structure. Your history shows consistent, professional-grade output.' },
    { label:'Interview-Ready',     stat:'12', unit:'weeks',        title:'Show work, not certificates.', desc:'Walk into any interview with deployed URLs, a PR history, and the ability to explain every line. Real code answers real questions.' },
  ]
  return (
    <section style={{ padding:'80px 48px', background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom:52 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>What you leave with</p>
          <h2 style={{ fontSize:'clamp(24px,3.5vw,44px)', fontWeight:800, color:C.text, margin:0, letterSpacing:'-0.03em' }}>What you leave with.</h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {outcomes.map((o, i) => (
            <motion.div key={o.label} variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:i*0.1 }}>
              <div style={{ padding:'28px', border:`1px solid ${C.border}`, borderRadius:12, background:C.surface, height:'100%', boxSizing:'border-box', transition:'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor=C.amber}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
              >
                <p style={{ fontSize:10, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:16 }}>{o.label}</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:12 }}>
                  <span style={{ fontSize:48, fontWeight:800, lineHeight:1, letterSpacing:'-0.03em', background:`linear-gradient(120deg, ${C.amber}, #FB923C)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{o.stat}</span>
                  <span style={{ fontSize:13, color:C.text3 }}>{o.unit}</span>
                </div>
                <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:10 }}>{o.title}</div>
                <p style={{ fontSize:13, color:C.text2, lineHeight:1.75, margin:0 }}>{o.desc}</p>
              </div>
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
    { q:'When do I get access after enrolling?', a:'Within 24 hours of enrollment you get full access — Week 1 lessons, the starter repo, the Jira board, and the Discord community. You start at your own pace. No waiting for a batch or a cohort.' },
    { q:'Do I need a CS degree?', a:'No. Most students are engineering graduates from non-CS branches or working professionals. What matters is commitment and 3–4 focused hours daily.' },
    { q:'What programming knowledge is required?', a:'You should know basic JavaScript — variables, functions, arrays, loops. If you can write a function that filters an array, you are ready.' },
    { q:'How is this different from YouTube tutorials?', a:'Tutorials teach you to watch. This program teaches you to build. Every day you open a real pull request that gets reviewed. You cannot fake your way through that.' },
    { q:'Can I do this while working full-time?', a:'Yes. The program is fully async — no live sessions, no fixed schedule. 3–4 focused hours daily is recommended. Most students do early morning or evening blocks.' },
    { q:'What is the refund policy?', a:"Full refund within 7 days if you haven't opened your first pull request. No questions asked. After that, no refunds — you've started building." },
    { q:'What laptop or setup do I need?', a:'Any laptop made after 2015 works — Windows, Mac, or Linux. You need Node.js, Git, and VS Code installed. We send a setup guide on enrollment day. No paid tools required.' },
    { q:'What happens after the program?', a:'You leave with 3 deployed products, 65+ merged PRs, and a structured job application process. Discord access is lifetime.' },
    { q:'How does the AI code review work?', a:'Every pull request you open is automatically reviewed by an AI trained on the project rubric. It checks logic, naming conventions, security, and code structure. You see feedback within minutes. Your mentor grades it within 24 hours.' },
    { q:'Is the program in English or Hindi?', a:"All lesson content and mentor feedback is in English. WhatsApp and Discord conversations are mixed — use whichever you're comfortable with." },
  ]
  return (
    <section style={{ padding:'80px 48px', background:C.bg, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:720, margin:'0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom:40 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>FAQ</p>
          <h2 style={{ fontSize:'clamp(24px,3.5vw,44px)', fontWeight:800, color:C.text, margin:0, letterSpacing:'-0.03em' }}>Common questions.</h2>
        </motion.div>
        {items.map((item, i) => (
          <div key={item.q} style={{ borderBottom:`1px solid ${C.border}` }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 0', background:'none', border:'none', cursor:'pointer', textAlign:'left', gap:16 }}
            >
              <span style={{ fontSize:15, fontWeight:600, color:open===i?C.amber:C.text, transition:'color 0.15s', lineHeight:1.4 }}>{item.q}</span>
              <motion.span animate={{ rotate:open===i?45:0 }} transition={{ duration:0.2 }}
                style={{ fontSize:22, color:C.text3, display:'inline-block', flexShrink:0, lineHeight:1 }}
              >+</motion.span>
            </button>
            <AnimatePresence>
              {open===i && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.22 }} style={{ overflow:'hidden' }}>
                  <div style={{ paddingBottom:20, fontSize:14, color:C.text2, lineHeight:1.85 }}>{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div style={{ marginTop:32, textAlign:'center' }}>
          <p style={{ fontSize:14, color:C.text3 }}>
            Still have a question?{' '}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+have+a+question+about+DevForge`}
              target="_blank" rel="noopener noreferrer"
              style={{ color:C.amber, textDecoration:'none', fontWeight:600 }}
            >Ask on WhatsApp →</a>
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA({ onApply }) {
  return (
    <section style={{ padding:'100px 48px', background:C.bg2, borderBottom:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'800px', height:'400px', background:`radial-gradient(ellipse, ${C.amber}0A 0%, transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ maxWidth:640, margin:'0 auto', textAlign:'center', position:'relative' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <h2 style={{ fontSize:'clamp(32px,5vw,58px)', fontWeight:800, color:C.text, margin:'0 0 20px', lineHeight:1.08, letterSpacing:'-0.03em' }}>
            Your GitHub should<br /><span style={gText}>speak for itself.</span>
          </h2>
          <p style={{ fontSize:17, color:C.text2, lineHeight:1.8, marginBottom:44 }}>
            65+ merged PRs, 3 deployed products, and code your interviewers can actually open.
          </p>
          <button onClick={onApply}
            style={{ background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, border:'none', borderRadius:12, cursor:'pointer', fontSize:16, fontWeight:700, color:'#000', padding:'16px 56px', boxShadow:`0 8px 40px ${C.amber}45`, transition:'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 14px 48px ${C.amber}55` }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 8px 40px ${C.amber}45` }}
          >Start Building Today →</button>
          <p style={{ marginTop:20, fontSize:13, color:C.text3 }}>7-day full refund · no questions asked</p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── College / TPO Section ────────────────────────────────────────────────────
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
    <section style={{ padding:'80px 48px', background:C.bg, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginBottom:48 }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>For colleges & TPOs</p>
          <h2 style={{ fontSize:'clamp(22px,3vw,40px)', fontWeight:800, color:C.text, margin:'0 0 16px', letterSpacing:'-0.03em' }}>
            For College Coordinators & TPOs
          </h2>
          <p style={{ fontSize:15, color:C.text2, lineHeight:1.85, maxWidth:620, margin:0 }}>
            Companies have raised the bar for freshers. Resumes without proof of work get filtered before a human reads them. DevForge prepares students the way companies actually hire — through pull requests, deployed projects, and a GitHub history that survives a technical screen.
          </p>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <p style={{ fontSize:11, fontWeight:700, color:C.green, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:20 }}>What your students leave with</p>
            {outcomes.map((o, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'14px 0', borderBottom:i<outcomes.length-1?`1px solid ${C.border}`:'none' }}>
                <span style={{ color:C.green, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>
                <span style={{ fontSize:14, color:C.text2, lineHeight:1.65 }}>{o}</span>
              </div>
            ))}
          </motion.div>
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay:0.1 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:20 }}>What we offer for college partnerships</p>
            {offerings.map((o, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'14px 0', borderBottom:i<offerings.length-1?`1px solid ${C.border}`:'none' }}>
                <span style={{ color:C.amber, fontWeight:700, flexShrink:0, marginTop:1 }}>→</span>
                <span style={{ fontSize:14, color:C.text2, lineHeight:1.65 }}>{o}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={viewportOnce} style={{ marginTop:40, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I%27m+a+college+coordinator+and+want+to+discuss+DevForge+for+our+students`}
            target="_blank" rel="noopener noreferrer"
            style={{ background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, color:'#000', fontSize:14, fontWeight:700, padding:'12px 28px', borderRadius:9, textDecoration:'none', display:'inline-block', boxShadow:`0 4px 20px ${C.amber}35`, transition:'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >Book a College Demo →</a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I%27m+a+college+coordinator+and+want+to+discuss+DevForge+for+our+students`}
            target="_blank" rel="noopener noreferrer"
            style={{ color:C.text2, fontSize:14, fontWeight:500, textDecoration:'none', border:`1px solid ${C.bord2}`, borderRadius:9, padding:'11px 24px', transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=C.amber; e.currentTarget.style.color=C.amber }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.bord2; e.currentTarget.style.color=C.text2 }}
          >WhatsApp the team</a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── WhatsApp icon ────────────────────────────────────────────────────────────
const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// ─── WhatsApp Floating Button ─────────────────────────────────────────────────
function WhatsAppFloat() {
  const [visible, setVisible]   = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('scroll', onScroll, { passive:true })
    window.addEventListener('resize', onResize, { passive:true })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.a key="wa-float"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+want+to+know+more+about+DevForge`}
          target="_blank" rel="noopener noreferrer"
          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }} transition={{ duration:0.2 }}
          style={{
            position:'fixed', bottom:isMobile?80:28, right:isMobile?16:28, zIndex:200,
            background:'#25D366', color:'#fff', padding:isMobile?'12px':'11px 18px',
            borderRadius:isMobile?'50%':9, width:isMobile?48:'auto', height:isMobile?48:'auto',
            fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            boxShadow:'0 4px 20px rgba(37,211,102,0.45)', textDecoration:'none',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >
          {WA_ICON}
          {!isMobile && 'WhatsApp Us'}
        </motion.a>
      )}
    </AnimatePresence>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = [
    { label:'Privacy Policy', href:'/privacy' },
    { label:'Terms of Service', href:'/terms' },
    { label:'Refund Policy', href:'/refund' },
    { label:'support@devforge.in', href:'mailto:support@devforge.in' },
  ]
  return (
    <footer style={{ padding:'28px 48px', background:C.bg, borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:26, height:26, background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:10, fontWeight:900, color:'#000' }}>DF</span>
        </div>
        <span style={{ fontWeight:700, fontSize:14, color:C.text2 }}>DevForge</span>
      </div>
      <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
        {links.map(l => (
          <a key={l.href} href={l.href} style={{ fontSize:13, color:C.text3, textDecoration:'none', transition:'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color=C.text}
            onMouseLeave={e => e.currentTarget.style.color=C.text3}
          >{l.label}</a>
        ))}
      </div>
      <div style={{ fontSize:13, color:C.text3 }}>© 2026 DevForge</div>
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
  const [form, setForm]         = useState({ name:'', email:'', phone:'', college:'', plan:initialPlan })
  const [step, setStep]         = useState('apply')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const PLAN_OPTIONS = [
    { value:'LIVE_COHORT', label:'Builder — ₹7,000' },
    { value:'MENTORED',    label:'Builder + Placement Prep — ₹12,000' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.college) { setError('All fields are required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_URL}/apply`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ name:String(form.name), email:String(form.email), phone:String(form.phone), college:String(form.college), plan:String(form.plan) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setLoading(false); return }
      setStep('password'); setLoading(false)
    } catch (err) { setError(err?.message || 'Something went wrong. Please try again.'); setLoading(false) }
  }

  const handleSetPassword = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ name:String(form.name), email:String(form.email), password, college:String(form.college), plan:['LIVE_COHORT','MENTORED'].includes(form.plan)?form.plan:'LIVE_COHORT' }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) { setStep('done'); setLoading(false); return }
        setError(data.error || 'Failed to create account.'); setLoading(false); return
      }
      setStep('done'); setLoading(false)
    } catch (err) { setError(err?.message || 'Something went wrong. Please try again.'); setLoading(false) }
  }

  const inputStyle = {
    width:'100%', padding:'11px 14px', background:C.bg2,
    border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:14,
    fontFamily:'Inter,sans-serif', outline:'none', boxSizing:'border-box',
    transition:'border-color 0.15s, box-shadow 0.15s',
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(8px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div initial={{ opacity:0, y:20, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:20 }} transition={{ duration:0.25 }}
          style={{ background:C.surface, border:`1px solid ${C.bord2}`, borderRadius:14, width:480, padding:'36px', position:'relative', boxShadow:`0 40px 100px rgba(0,0,0,0.7)`, maxHeight:'90vh', overflowY:'auto' }}
        >
          <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer', color:C.text3, fontSize:22, lineHeight:1, width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4, transition:'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color=C.text}
            onMouseLeave={e => e.currentTarget.style.color=C.text3}
          >×</button>

          {step === 'done' ? (
            <div style={{ textAlign:'center', padding:'16px 0' }}>
              <div style={{ width:52, height:52, background:`${C.green}18`, border:`1px solid ${C.green}30`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <span style={{ color:C.green, fontSize:24 }}>✓</span>
              </div>
              <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:'0 0 10px', letterSpacing:'-0.02em' }}>You're in. Seat locked.</h2>
              <p style={{ fontSize:14, color:C.text2, lineHeight:1.8, marginBottom:28 }}>
                Your account is ready. Log in with <strong style={{ color:C.amber }}>{form.email}</strong> and the password you just set.
              </p>
              <button onClick={() => navigate('/login')}
                style={{ background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, border:'none', borderRadius:9, cursor:'pointer', fontSize:14, fontWeight:700, color:'#000', padding:'13px', width:'100%', boxShadow:`0 4px 20px ${C.amber}40`, transition:'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >Go to Login →</button>
            </div>
          ) : step === 'password' ? (
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:C.green, letterSpacing:'0.08em', marginBottom:16, textTransform:'uppercase' }}>✓ Seat Reserved</p>
              <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:'0 0 8px', letterSpacing:'-0.02em' }}>Set your password</h2>
              <p style={{ fontSize:14, color:C.text2, margin:'0 0 24px', lineHeight:1.6 }}>
                Create a password for <strong style={{ color:C.amber }}>{form.email}</strong>
              </p>
              {error && <div style={{ fontSize:13, color:C.red, background:`${C.red}12`, border:`1px solid ${C.red}25`, borderRadius:7, padding:'10px 14px', marginBottom:16 }}>{error}</div>}
              <form onSubmit={handleSetPassword} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[['Password', password, setPassword], ['Confirm password', confirm, setConfirm]].map(([label, val, setter]) => (
                  <div key={label}>
                    <label style={{ fontSize:12, fontWeight:600, color:C.text3, display:'block', marginBottom:7 }}>{label}</label>
                    <input type="password" value={val} placeholder="Min. 8 characters"
                      onChange={e => { setError(''); setter(e.target.value) }} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor=C.amber; e.target.style.boxShadow=`0 0 0 3px ${C.amber}18` }}
                      onBlur={e => { e.target.style.borderColor=C.border; e.target.style.boxShadow='none' }}
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  style={{ background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, border:'none', borderRadius:9, cursor:loading?'not-allowed':'pointer', fontSize:14, fontWeight:700, color:'#000', padding:'13px', marginTop:4, opacity:loading?0.7:1, boxShadow:`0 4px 20px ${C.amber}35`, transition:'opacity 0.15s' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity='0.85' }}
                  onMouseLeave={e => e.currentTarget.style.opacity=loading?'0.7':'1'}
                >{loading ? 'Creating account…' : 'Create Account & Login →'}</button>
              </form>
            </div>
          ) : (
            <>
              <p style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.08em', marginBottom:8, textTransform:'uppercase' }}>Get Started Today</p>
              <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:'0 0 6px', letterSpacing:'-0.02em' }}>Reserve your seat</h2>
              <p style={{ fontSize:14, color:C.text2, margin:'0 0 24px', lineHeight:1.6 }}>Access within 24 hours · {PILOT_SEATS_LEFT} seats at this price · no waiting</p>
              {error && <div style={{ fontSize:13, color:C.red, background:`${C.red}12`, border:`1px solid ${C.red}25`, borderRadius:7, padding:'10px 14px', marginBottom:16 }}>{error}</div>}
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[['Full name','name','text','Your full name'],['Email address','email','email','you@example.com'],['Mobile number','phone','tel','+91 98765 43210'],['College / University','college','text','e.g. JNTU Hyderabad']].map(([label,key,type,placeholder]) => (
                  <div key={key}>
                    <label style={{ fontSize:12, fontWeight:600, color:C.text3, display:'block', marginBottom:7 }}>{label}</label>
                    <input type={type} value={form[key]} placeholder={placeholder}
                      onChange={e => { const v=e.target.value; setError(''); setForm(prev => ({...prev,[key]:v})) }} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor=C.amber; e.target.style.boxShadow=`0 0 0 3px ${C.amber}18` }}
                      onBlur={e => { e.target.style.borderColor=C.border; e.target.style.boxShadow='none' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:C.text3, display:'block', marginBottom:7 }}>Plan</label>
                  <select value={form.plan} onChange={e => { const v=e.target.value; setForm(prev => ({...prev,plan:v})) }}
                    style={{ ...inputStyle, cursor:'pointer' }}
                  >{PLAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                </div>
                <button type="submit" disabled={loading}
                  style={{ background:`linear-gradient(135deg, ${C.amber}, ${C.amberDk})`, border:'none', borderRadius:9, cursor:loading?'not-allowed':'pointer', fontSize:14, fontWeight:700, color:'#000', padding:'13px', marginTop:4, opacity:loading?0.7:1, boxShadow:`0 4px 20px ${C.amber}35`, transition:'opacity 0.15s' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity='0.85' }}
                  onMouseLeave={e => e.currentTarget.style.opacity=loading?'0.7':'1'}
                >{loading ? 'Reserving seat…' : 'Reserve Seat →'}</button>
                <p style={{ fontSize:12, color:C.text3, textAlign:'center', margin:0 }}>Enroll today · access within 24 hours · {PILOT_SEATS_LEFT} seats at this price</p>
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
    <div style={{ background:C.bg, minHeight:'100vh', fontFamily:"'Inter', sans-serif" }}>
      <ScrollProgress />
      <Navbar onApply={openModal} />
      <Hero onApply={openModal} />
      <Stats />
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
