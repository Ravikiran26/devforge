import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { GitBranch, MessageCircle, Trophy, Star, Flame, ExternalLink } from 'lucide-react'

const COLORS = ['#4f46e5', '#0891b2', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0284c7', '#9333ea']

const PEERS = [
  { id: 1, name: 'Amit Rajan',   prs: 9, grade: 91, week: 4, status: 'Active',  streak: 12, badges: ['🔥', '⭐'] },
  { id: 2, name: 'Priya Sharma', prs: 8, grade: 88, week: 4, status: 'Active',  streak: 9,  badges: ['⭐']       },
  { id: 3, name: 'Ravikiran',    prs: 8, grade: 88, week: 4, status: 'Active',  streak: 7,  badges: ['⭐'], me: true },
  { id: 4, name: 'Sneha Kapur',  prs: 5, grade: 82, week: 3, status: 'Active',  streak: 5,  badges: []           },
  { id: 5, name: 'Vikram Singh', prs: 7, grade: 79, week: 4, status: 'Active',  streak: 6,  badges: []           },
  { id: 6, name: 'Rahul Verma',  prs: 6, grade: 74, week: 4, status: 'Active',  streak: 4,  badges: []           },
  { id: 7, name: 'Divya Nair',   prs: 3, grade: 65, week: 2, status: 'At Risk', streak: 1,  badges: []           },
]

const FEED = [
  { id: 1,  user: 'Amit Rajan',   action: 'merged PR',        detail: 'feat: implement RBAC for protected routes',  time: '2h ago',   type: 'pr'      },
  { id: 2,  user: 'Priya Sharma', action: 'completed lesson',  detail: 'JWT authentication flow (Week 3)',           time: '3h ago',   type: 'lesson'  },
  { id: 3,  user: 'Vikram Singh', action: 'submitted PR',      detail: 'feat: build Task Dashboard UI',             time: '5h ago',   type: 'pr'      },
  { id: 4,  user: 'Sneha Kapur',  action: 'earned badge',      detail: '⭐ Consistent Learner — 5-day streak',      time: 'Yesterday', type: 'badge'  },
  { id: 5,  user: 'Amit Rajan',   action: 'got score',         detail: '92/100 on Week 3 — JWT Auth Middleware',    time: 'Yesterday', type: 'grade'  },
  { id: 6,  user: 'Rahul Verma',  action: 'merged PR',         detail: 'fix: validate request body schemas',        time: '2 days ago', type: 'pr'    },
  { id: 7,  user: 'Divya Nair',   action: 'joined session',    detail: 'Live Session: Week 3 Code Review',          time: '3 days ago', type: 'session'},
]

const FEED_COLOR = { pr: '#4f46e5', lesson: '#059669', badge: '#f59e0b', grade: '#7c3aed', session: '#0891b2' }
const FEED_BG    = { pr: '#eef2ff', lesson: '#ecfdf5', badge: '#fffbeb', grade: '#f5f3ff', session: '#e0f2fe' }

const RESOURCES = [
  { label: 'Discord Server',   desc: 'Ask doubts, share PRs, find study buddies', icon: '💬', url: '#' },
  { label: 'Cohort 3 Notion',  desc: 'Sprint docs, session recordings, resources', icon: '📋', url: '#' },
  { label: 'GitHub Org',       desc: 'All starter repos and submission guidelines', icon: '🐙', url: '#' },
  { label: 'Office Hours Cal', desc: 'Book 1:1 with mentor — 30 min slots',        icon: '📅', url: '#' },
]

function Avatar({ name, i, size = 34, me }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: me ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : COLORS[i % COLORS.length],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
      boxShadow: me ? '0 0 0 2px #fff, 0 0 0 4px #f59e0b' : 'none',
    }}>
      {name[0]}
    </div>
  )
}

export default function Community() {
  const [tab, setTab] = useState('leaderboard')

  return (
    <DashboardLayout title="Community">

      {/* Discord banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f51e8, #5865f2)',
        borderRadius: 18,
        padding: '18px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(88,101,242,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}>💬</div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Join the DevForge Discord</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
              47 students online · ask doubts, share PRs, find your pair
            </div>
          </div>
        </div>
        <a href="#" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          background: '#fff',
          color: '#5865f2',
          fontWeight: 700,
          fontSize: 13,
          padding: '10px 20px',
          borderRadius: 11,
          textDecoration: 'none',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          Open Discord <ExternalLink size={13} />
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

        {/* Main panel */}
        <div>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: '#f8fafc', padding: 4, borderRadius: 12, border: '1px solid #e2e8f0', alignSelf: 'flex-start', width: 'fit-content' }}>
            {[['leaderboard', '🏆 Leaderboard'], ['feed', '📡 Activity Feed']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: '7px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 9,
                  border: 'none',
                  cursor: 'pointer',
                  background: tab === id ? '#fff' : 'transparent',
                  color: tab === id ? '#0f172a' : '#64748b',
                  boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Leaderboard */}
          {tab === 'leaderboard' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              {/* Podium */}
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                padding: '28px 24px 36px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 20,
              }}>
                {[PEERS[1], PEERS[0], PEERS[2]].map((p, idx) => {
                  const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3
                  const heights = [82, 108, 68]
                  return (
                    <div key={p.id} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</div>
                      <Avatar name={p.name} i={p.id} size={44} me={p.me} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 8, whiteSpace: 'nowrap' }}>{p.name.split(' ')[0]}</div>
                      <div style={{ fontSize: 11, color: '#a5b4fc', marginBottom: 10 }}>{p.grade}/100</div>
                      <div style={{
                        width: 64,
                        borderRadius: '8px 8px 0 0',
                        background: rank === 1 ? '#fbbf24' : rank === 2 ? '#94a3b8' : '#cd7c2d',
                        height: heights[idx],
                        boxShadow: rank === 1 ? '0 -4px 16px rgba(251,191,36,0.4)' : 'none',
                      }} />
                    </div>
                  )
                })}
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Rank', 'Student', 'PRs', 'Grade', 'Streak', 'Status'].map((h, i) => (
                      <th key={h} style={{ padding: '11px 18px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: i < 2 ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PEERS.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: i < PEERS.length - 1 ? '1px solid #f8fafc' : 'none', background: p.me ? '#fafafe' : 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = p.me ? '#fafafe' : 'transparent')}
                    >
                      <td style={{ padding: '13px 18px', fontSize: 14, fontWeight: 800, color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c2d' : '#cbd5e1', textAlign: 'center' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={p.name} i={i} me={p.me} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: p.me ? '#4f46e5' : '#1e293b' }}>
                              {p.name}
                              {p.me && <span style={{ fontSize: 10, background: '#eef2ff', color: '#4f46e5', borderRadius: 4, padding: '1px 6px', marginLeft: 6, fontWeight: 700 }}>you</span>}
                            </div>
                            {p.badges.length > 0 && (
                              <div style={{ fontSize: 12 }}>{p.badges.map((b, bi) => <span key={bi}>{b}</span>)}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#4f46e5' }}>{p.prs}</td>
                      <td style={{ padding: '13px 18px', textAlign: 'center', fontSize: 13, fontWeight: 800, color: p.grade >= 90 ? '#059669' : p.grade >= 75 ? '#4f46e5' : '#dc2626' }}>
                        {p.grade}/100
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <Flame size={12} color={p.streak >= 7 ? '#ef4444' : '#94a3b8'} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: p.streak >= 7 ? '#ef4444' : '#64748b' }}>{p.streak}d</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                          background: p.status === 'Active' ? '#ecfdf5' : '#fff7ed',
                          color: p.status === 'Active' ? '#065f46' : '#c2410c',
                          border: `1px solid ${p.status === 'Active' ? '#a7f3d0' : '#fed7aa'}`,
                        }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Activity Feed */}
          {tab === 'feed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FEED.map((item, i) => (
                <div key={item.id} style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  <Avatar name={item.user} i={i} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.user}</span>
                      <span style={{ fontSize: 13, color: '#64748b' }}>{item.action}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                        background: FEED_BG[item.type], color: FEED_COLOR[item.type],
                      }}>
                        {item.type}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 4, fontFamily: 'monospace' }}>{item.detail}</div>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 }}>{item.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Your standing */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Your Standing</div>
            <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#4f46e5', letterSpacing: '-0.04em' }}>#3</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>out of {PEERS.length} students</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['PRs', '8', '#4f46e5'], ['Grade', '88', '#059669'], ['Streak', '7d', '#ef4444'], ['Badges', '1', '#f59e0b']].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: 'center', padding: '12px 0', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Your Badges</div>
            {[
              { emoji: '⭐', label: 'Star Performer', desc: 'Top 3 in cohort for 2+ weeks' },
              { emoji: '🎯', label: 'Accuracy King',  desc: 'Average score above 85/100',  locked: true },
              { emoji: '🔥', label: 'On Fire',        desc: '7-day activity streak',        locked: true },
              { emoji: '🚀', label: 'Speed Coder',    desc: 'First to submit 3 sprints',    locked: true },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f8fafc', opacity: b.locked ? 0.4 : 1 }}>
                <div style={{ fontSize: 22, width: 36, textAlign: 'center' }}>{b.emoji}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{b.desc}</div>
                </div>
                {b.locked && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#cbd5e1' }}>🔒</span>}
              </div>
            ))}
          </div>

          {/* Resources */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Resources</div>
            {RESOURCES.map(r => (
              <a key={r.label} href={r.url} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #f8fafc', textDecoration: 'none', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{ fontSize: 18, width: 34, height: 34, background: '#f8fafc', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.desc}</div>
                </div>
                <ExternalLink size={12} color="#cbd5e1" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
