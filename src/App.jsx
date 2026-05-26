import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login   from './pages/Login'
import Dashboard      from './pages/Dashboard'
import TaskBoard      from './pages/TaskBoard'
import Lessons        from './pages/Lessons'
import Progress       from './pages/Progress'
import Profile        from './pages/Profile'
import Settings       from './pages/Settings'
import Community      from './pages/Community'
import AdminDashboard   from './pages/admin/AdminDashboard'
import Cohorts          from './pages/admin/Cohorts'
import Students         from './pages/admin/Students'
import Tickets          from './pages/admin/Tickets'
import AdminLessons     from './pages/admin/AdminLessons'
import Announcements    from './pages/admin/Announcements'
import Payments         from './pages/admin/Payments'
import AdminApplications from './pages/admin/AdminApplications'
import Analytics          from './pages/admin/Analytics'

const P = ({ c: C }) => <ProtectedRoute><C /></ProtectedRoute>
const A = ({ c: C }) => <AdminRoute><C /></AdminRoute>

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<Landing />} />
        <Route path="/login" element={<Login />}   />

        {/* Student portal */}
        <Route path="/dashboard" element={<P c={Dashboard}  />} />
        <Route path="/tasks"     element={<P c={TaskBoard}  />} />
        <Route path="/lessons"   element={<P c={Lessons}    />} />
        <Route path="/progress"  element={<P c={Progress}   />} />
        <Route path="/profile"   element={<P c={Profile}    />} />
        <Route path="/settings"  element={<P c={Settings}   />} />
        <Route path="/community" element={<P c={Community}  />} />

        {/* Admin */}
        <Route path="/admin"               element={<A c={AdminDashboard} />} />
        <Route path="/admin/cohorts"       element={<A c={Cohorts}        />} />
        <Route path="/admin/students"      element={<A c={Students}       />} />
        <Route path="/admin/tickets"       element={<A c={Tickets}        />} />
        <Route path="/admin/lessons"       element={<A c={AdminLessons}   />} />
        <Route path="/admin/announcements" element={<A c={Announcements}  />} />
        <Route path="/admin/payments"      element={<A c={Payments}          />} />
        <Route path="/admin/applications" element={<A c={AdminApplications} />} />
        <Route path="/admin/analytics"    element={<A c={Analytics}          />} />
      </Routes>
    </BrowserRouter>
  )
}
