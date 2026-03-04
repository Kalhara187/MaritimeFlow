import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

/**
 * Wraps a route that requires authentication.
 * If the user is not authenticated, redirects them to /login
 * and preserves the intended destination via location state.
 *
 * Usage:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation()

  // Replace this check with your real auth logic (e.g. read from context / localStorage)
  const isAuthenticated = Boolean(localStorage.getItem('auth_token'))

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
