import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Intercept every fetch response — if the server returns 401 the session has
// expired or the token is invalid; clear storage and redirect to login.
const _origFetch = window.fetch
window.fetch = async (...args) => {
  const res = await _origFetch(...args)
  if (res.status === 401) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || ''
    // Only auto-logout for API calls, not for asset fetches or auth endpoints
    if (url.includes('/api/') && !url.includes('/api/auth/login') && !url.includes('/api/auth/register')) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
  }
  return res
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
