import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard, Users, BookOpen, Ticket,
  Megaphone, CreditCard, GraduationCap, Bell, LogOut,
  Code2, ClipboardList,
} from 'lucide-react'

const NAV = [
  { to: '/admin',                icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/admin/applications',   icon: ClipboardList,   label: 'Applications'  },
  { to: '/admin/cohorts',        icon: GraduationCap,   label: 'Cohorts'       },
  { to: '/admin/students',       icon: Users,           label: 'Students'      },
  { to: '/admin/tickets',        icon: Ticket,          label: 'Tickets'       },
  { to: '/admin/lessons',        icon: BookOpen,        label: 'Lessons'       },
  { to: '/admin/announcements',  icon: Megaphone,       label: 'Announcements' },
  { to: '/admin/payments',       icon: CreditCard,      label: 'Payments'      },
]

function AdminSidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const name = user?.name ?? 'Admin'

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#1e1b4b',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '20px 18px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          width: 34,
          height: 34,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
        }}>
          <Code2 size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
            DevForge
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 1 }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* User chip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        margin: '0 0 4px',
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          flexShrink: 0,
        }}>
          {name[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)',
            padding: 5,
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          <LogOut size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '10px 12px 6px' }}>
          Navigation
        </div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 13.5,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              transition: 'all 0.15s',
              borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
              marginLeft: -2,
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
              }
            }}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 18px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        fontSize: 10,
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        DevForge Academy · Admin v4<br />
        <span style={{ color: 'rgba(255,255,255,0.12)' }}>Delhi Region</span>
      </div>
    </aside>
  )
}

function AdminNavbar({ title }) {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <header style={{
      height: 60,
      background: '#ffffff',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      flexShrink: 0,
      boxShadow: '0 1px 0 #f1f5f9',
    }}>
      <h1 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
        {title}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: '6px 14px',
          fontSize: 13,
          color: '#64748b',
          fontWeight: 500,
        }}>
          <span style={{ fontSize: 14 }}>📅</span>
          {today}
        </div>
        <button style={{
          position: 'relative',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          cursor: 'pointer',
          color: '#64748b',
          padding: '7px 8px',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Bell size={17} />
          <span style={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: 8,
            height: 8,
            background: '#ef4444',
            borderRadius: '50%',
            border: '1.5px solid #fff',
          }} />
        </button>
      </div>
    </header>
  )
}

export default function AdminLayout({ title = 'Admin Overview', children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
    }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <AdminNavbar title={title} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
