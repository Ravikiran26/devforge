import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const C = {
  bg: '#0d1117', surface: '#161b22', border: '#30363d',
  text: '#e6edf3', text2: '#8b949e', text3: '#6e7681',
  accent: '#f59e0b',
}

export default function LegalLayout({ title, lastUpdated, children }) {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '14px 48px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: C.text2, cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif", padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = C.accent}
          onMouseLeave={e => e.currentTarget.style.color = C.text2}
        >
          <ArrowLeft size={14} /> Back to SprintForge
        </button>
        <span style={{ color: C.border }}>|</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 18, height: 18, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 7, fontWeight: 800, color: '#000', fontFamily: 'JetBrains Mono,monospace' }}>SF</span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, fontSize: 12, color: C.text2 }}>SprintForge</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.12em', fontFamily: 'JetBrains Mono,monospace', marginBottom: 10 }}>
            LEGAL
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: C.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <p style={{ fontSize: 13, color: C.text3, fontFamily: 'JetBrains Mono,monospace', margin: 0 }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 36 }}>
          {children}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: C.text3, fontFamily: 'JetBrains Mono,monospace' }}>© 2026 SprintForge. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Refund Policy', '/refund']].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 11, color: C.text3, textDecoration: 'none', fontFamily: 'JetBrains Mono,monospace' }}
              onMouseEnter={e => e.currentTarget.style.color = C.accent}
              onMouseLeave={e => e.currentTarget.style.color = C.text3}
            >{label}</a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3', margin: '0 0 12px', letterSpacing: '-0.01em' }}>{title}</h2>
      <div style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}

export function P({ children }) {
  return <p style={{ margin: '0 0 12px' }}>{children}</p>
}

export function UL({ items }) {
  return (
    <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
      {items.map((item, i) => <li key={i} style={{ marginBottom: 6 }}>{item}</li>)}
    </ul>
  )
}
