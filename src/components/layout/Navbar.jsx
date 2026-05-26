import { useState, useRef, useEffect } from 'react'
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'

const C = {
  bg:      '#161B22',
  border:  '#30363D',
  surface: '#21262D',
  text:    '#E6EDF3',
  text2:   '#8B949E',
  text3:   '#6E7681',
  accent:  '#3B82F6',
  red:     '#F85149',
}

export default function Navbar({ title = 'Dashboard' }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen,  setUserOpen]  = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const notifRef = useRef(null)
  const userRef  = useRef(null)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const name = user?.name ?? 'Student'

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/student/notifications').then(r => r.data),
    staleTime: 60_000,
  })

  const markRead = useMutation({
    mutationFn: () => api.post('/student/notifications/read'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header style={{
      height: 56,
      background: C.bg,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', flexShrink: 0,
      position: 'sticky', top: 0, zIndex: 30,
    }}>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: C.text,
        margin: 0,
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h1>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>

        {/* Search */}
        <div style={{ position:'relative' }}>
          <Search size={13} style={{
            position:'absolute', left:11, top:'50%',
            transform:'translateY(-50%)', color:C.text3, pointerEvents:'none',
          }}/>
          <input
            type="text"
            placeholder="Search…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            style={{
              paddingLeft:32, paddingRight:14, paddingTop:7, paddingBottom:7,
              fontSize:12, fontFamily:"'Inter', sans-serif",
              border:`1px solid ${C.border}`,
              background: C.surface,
              color: C.text2,
              width:180,
              outline:'none',
              transition:'border-color 0.12s',
            }}
            onFocus={e => e.target.style.borderColor = C.accent}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position:'relative' }}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false) }}
            style={{
              position:'relative', background:'none', border:'none',
              cursor:'pointer', padding:'8px', color: notifOpen ? C.accent : C.text3,
              display:'flex', alignItems:'center', transition:'color 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.text2}
            onMouseLeave={e => e.currentTarget.style.color = notifOpen ? C.accent : C.text3}
          >
            <Bell size={16}/>
            {unread > 0 && (
              <span style={{
                position:'absolute', top:6, right:6,
                width:6, height:6,
                background: C.accent, borderRadius:'50%',
              }}/>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position:'absolute', top:44, right:0, width:300,
              background: C.bg, border:`1px solid ${C.border}`,
              zIndex:100,
            }}>
              <div style={{
                padding:'12px 16px 10px',
                borderBottom:`1px solid ${C.border}`,
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span style={{ fontSize:11, fontWeight:700, color:C.text, letterSpacing:'0.06em', fontFamily:"'Inter', sans-serif" }}>
                  NOTIFICATIONS {unread > 0 && (
                    <span style={{ marginLeft:6, fontSize:10, background:C.accent, color:'#fff', padding:'1px 6px', fontWeight:800 }}>{unread}</span>
                  )}
                </span>
                <span onClick={() => markRead.mutate()} style={{ fontSize:11, color:C.text3, cursor:'pointer', fontFamily:"'Inter', sans-serif" }}>Mark read</span>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding:'24px 16px', textAlign:'center', fontSize:12, color:C.text3, fontFamily:"'Inter', sans-serif" }}>
                  No notifications yet
                </div>
              ) : notifications.map(n => (
                <div key={n.id} style={{
                  display:'flex', alignItems:'flex-start', gap:12,
                  padding:'12px 16px',
                  borderBottom:`1px solid ${C.border}`,
                  cursor:'pointer',
                  transition:'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.surface}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width:6, height:6, borderRadius:'50%', marginTop:5, flexShrink:0,
                    background: !n.read ? C.accent : C.text3,
                  }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color:C.text, lineHeight:1.4, fontWeight: !n.read ? 500 : 400 }}>{n.message}</div>
                    <div style={{ fontSize:10, color:C.text3, marginTop:2, fontFamily:'JetBrains Mono,monospace' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ padding:'10px 16px', textAlign:'center' }}>
                <span style={{ fontSize:11, color:C.text3, cursor:'pointer', fontFamily:"'Inter', sans-serif" }}>View all</span>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div ref={userRef} style={{ position:'relative' }}>
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false) }}
            style={{
              display:'flex', alignItems:'center', gap:8,
              background: userOpen ? C.surface : 'none',
              border:`1px solid ${userOpen ? C.border : 'transparent'}`,
              padding:'4px 10px 4px 4px', cursor:'pointer',
              transition:'background 0.1s, border-color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.border }}
            onMouseLeave={e => { if (!userOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent' } }}
          >
            <div style={{
              width:26, height:26, background:C.accent,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:800, fontSize:11, flexShrink:0,
              fontFamily:"'Inter', sans-serif",
            }}>
              {name[0].toUpperCase()}
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:C.text2, fontFamily:"'Inter', sans-serif" }}>
              {name.split(' ')[0]}
            </span>
            <ChevronDown size={11} color={C.text3} style={{ transform: userOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.15s' }}/>
          </button>

          {userOpen && (
            <div style={{
              position:'absolute', top:44, right:0, width:190,
              background:C.bg, border:`1px solid ${C.border}`,
              zIndex:100,
            }}>
              <div style={{ padding:'12px 14px', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{name}</div>
                <div style={{ fontSize:10, color:C.text3, marginTop:2, fontFamily:'JetBrains Mono,monospace' }}>{user?.email}</div>
              </div>
              {[
                { icon: User,     label: 'Profile',  to: '/profile'  },
                { icon: Settings, label: 'Settings', to: '/settings' },
              ].map(({ icon: Icon, label, to }) => (
                <button
                  key={to}
                  onClick={() => { navigate(to); setUserOpen(false) }}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', gap:9,
                    padding:'10px 14px', background:'none', border:'none',
                    cursor:'pointer', fontSize:12, fontWeight:500, color:C.text2,
                    textAlign:'left', fontFamily:"'Inter', sans-serif",
                    transition:'color 0.1s, background 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.text }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.text2 }}
                >
                  <Icon size={13} color={C.text3}/> {label}
                </button>
              ))}
              <div style={{ borderTop:`1px solid ${C.border}` }}>
                <button
                  onClick={() => { logout(); navigate('/login', { replace: true }) }}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', gap:9,
                    padding:'10px 14px', background:'none', border:'none',
                    cursor:'pointer', fontSize:12, fontWeight:500, color:C.red,
                    textAlign:'left', fontFamily:"'Inter', sans-serif",
                    transition:'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,85,85,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={13}/> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
