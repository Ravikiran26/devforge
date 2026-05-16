import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.accessToken)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export function AdminRoute({ children }) {
  const { accessToken, user } = useAuthStore()
  if (!accessToken) return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}
