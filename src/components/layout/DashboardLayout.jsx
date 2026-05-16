import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardLayout({ title, children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0D1117',
      fontFamily: "'Inter', sans-serif",
    }}>
      <Sidebar />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <Navbar title={title} />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px',
          background: '#0D1117',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
