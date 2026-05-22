import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard, CheckSquare, BookOpen, TrendingUp,
  Users, Settings, LogOut, UserCircle, MessageCircle,
  ChevronLeft, ChevronRight,
} from 'lucide-react'

const NAV_MAIN = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Task Board' },
  { to: '/lessons',   icon: BookOpen,        label: 'Lessons'    },
  { to: '/progress',  icon: TrendingUp,      label: 'Progress'   },
]
const NAV_OTHER = [
  { to: '/community', icon: Users,      label: 'Community' },
  { to: '/profile',   icon: UserCircle, label: 'Profile'   },
  { to: '/settings',  icon: Settings,   label: 'Settings'  },
]

const C = {
  bg:      '#0D1117',
  surface: '#161B22',
  border:  '#30363D',
  text:    '#E6EDF3',
  text2:   '#8B949E',
  text3:   '#6E7681',
  accent:  '#3B82F6',
}

function NavItem({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: collapsed ? '10px 0' : '9px 16px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        textDecoration: 'none',
        color: isActive ? C.accent : C.text2,
        fontFamily: "'Inter', sans-serif",
        fontWeight: isActive ? 600 : 400,
        fontSize: 13,
        letterSpacing: '0.01em',
        transition: 'color 0.1s',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        borderLeft: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
        background: isActive ? 'rgba(59,130,246,0.05)' : 'transparent',
      })}
    >
      {({ isActive }) => (
        <>
          <Icon size={15} style={{ flexShrink: 0 }} />
          {!collapsed && <span>{label}</span>}
        </>
      )}
    </NavLink>
  )
}

function SectionLabel({ label, collapsed }) {
  if (collapsed) return <div style={{ height: 6 }} />
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, color: C.text3,
      letterSpacing: '0.14em', padding: '6px 16px 4px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {label}
    </div>
  )
}

function WeekProgress({ collapsed, student }) {
  if (collapsed) return null
  const TOTAL_WEEKS = 10
  const week = student?.currentWeek ?? 1
  const pct  = Math.round((week / TOTAL_WEEKS) * 100)
  return (
    <div style={{ margin:'0 12px 12px', padding:'12px 13px', border:`1px solid ${C.border}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
        <span style={{ fontSize:9, fontWeight:700, color:C.text3, letterSpacing:'0.12em', fontFamily:"'Inter', sans-serif" }}>COHORT PROGRESS</span>
        <span style={{ fontSize:10, fontWeight:700, color:C.accent, fontFamily:'JetBrains Mono,monospace' }}>{pct}%</span>
      </div>
      <div style={{ fontSize:12, color:C.text2, marginBottom:8, fontWeight:500 }}>Week {week} of {TOTAL_WEEKS}</div>
      <div style={{ height:2, background:C.border, borderRadius:1 }}>
        <div style={{ width:`${pct}%`, height:'100%', background:C.accent, borderRadius:1, transition:'width 0.5s ease' }}/>
      </div>
      <div style={{ fontSize:10, color:C.text3, marginTop:6, fontFamily:"'Inter', sans-serif" }}>{TOTAL_WEEKS - week} weeks remaining</div>
    </div>
  )
}

function UserProfile({ collapsed }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const name = user?.name ?? 'Student'
  const week = user?.student?.currentWeek ?? 1

  return (
    <div style={{
      borderTop: `1px solid ${C.border}`,
      padding: collapsed ? '10px 0' : '10px 12px',
      display: 'flex', alignItems: 'center', gap: 9,
      justifyContent: collapsed ? 'center' : 'flex-start',
    }}>
      <div style={{
        width: 28, height: 28,
        background: C.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: 11,
        flexShrink: 0, fontFamily: "'Inter', sans-serif",
      }}>
        {name[0].toUpperCase()}
      </div>
      {!collapsed && (
        <>
          <div style={{ flex:1, overflow:'hidden' }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</div>
            <div style={{ fontSize:10, color:C.text3, marginTop:1, fontFamily:'JetBrains Mono,monospace' }}>W{week}</div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login', { replace: true }) }}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.text3, padding:4, display:'flex', alignItems:'center', transition:'color 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.text3}
          >
            <LogOut size={13}/>
          </button>
        </>
      )}
    </div>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuthStore()

  return (
    <aside style={{
      width: collapsed ? 52 : 210,
      minHeight: '100vh',
      background: C.bg,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0, position: 'relative',
    }}>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute', top: 20, right: -11,
          width: 22, height: 22,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', color: C.text3,
          zIndex: 10, transition: 'color 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.accent}
        onMouseLeave={e => e.currentTarget.style.color = C.text3}
      >
        {collapsed ? <ChevronRight size={11}/> : <ChevronLeft size={11}/>}
      </button>

      {/* Logo */}
      <div style={{
        padding: collapsed ? '18px 0 16px' : '18px 14px 16px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 9, flexShrink: 0,
      }}>
        <div style={{
          width: 26, height: 26, background: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize:10, fontWeight:800, color:'#fff', fontFamily:'JetBrains Mono,monospace', lineHeight:1 }}>DF</span>
        </div>
        {!collapsed && (
          <span style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16,
            color: C.text, letterSpacing: '-0.02em',
          }}>
            DevForge
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: collapsed ? '10px 6px' : '10px 0',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto', overflowX: 'hidden', gap: 1,
      }}>
        <SectionLabel label="MAIN" collapsed={collapsed}/>
        {NAV_MAIN.map(item => <NavItem key={item.to} {...item} collapsed={collapsed}/>)}

        <div style={{ height:1, background:C.border, margin: collapsed ? '8px 4px' : '8px 14px' }}/>

        <SectionLabel label="OTHER" collapsed={collapsed}/>
        {NAV_OTHER.map(item => <NavItem key={item.to} {...item} collapsed={collapsed}/>)}

        {!collapsed && (
          <div style={{ padding:'14px 12px 0' }}>
            <a href="#" style={{
              display:'flex', alignItems:'center', gap:7,
              padding:'8px 12px', border:`1px solid ${C.border}`,
              color:C.text2, fontSize:12, fontWeight:500,
              textDecoration:'none', fontFamily:"'Inter', sans-serif",
              transition:'border-color 0.1s, color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text2 }}
            >
              <MessageCircle size={12}/> Join Discord
            </a>
          </div>
        )}
      </nav>

      <WeekProgress collapsed={collapsed} student={user?.student}/>
      <UserProfile collapsed={collapsed}/>
    </aside>
  )
}
