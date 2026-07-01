import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

/**
 * Wraps a route and redirects unauthenticated users to /login.
 * Pass `redirect={false}` if you want optional auth (no redirect).
 */
export default function ProtectedRoute({ children, redirect = true }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated && redirect) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
