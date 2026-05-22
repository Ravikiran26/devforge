import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useIsMobile } from '../../lib/useIsMobile'

export default function DashboardLayout({ title, children }) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0D1117',
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
          background: '#0D1117',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
