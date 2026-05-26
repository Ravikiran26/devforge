import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useIsMobile } from '../../lib/useIsMobile'
import { useTheme } from '../../hooks/useTheme'

export default function DashboardLayout({ title, children }) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const C = useTheme()

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Dark overlay when mobile sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 40 }}
        />
      )}

      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <Navbar
          title={title}
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '16px' : '28px 32px',
          background: C.bg,
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
