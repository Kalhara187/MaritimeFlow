import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Anchor, Lock, Eye, EyeOff, CheckCircle, KeyRound } from 'lucide-react'

const API_BASE = '/api'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [token, setToken]               = useState(searchParams.get('token') || '')
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token.trim()) { setError('Reset token is required.'); return }
    if (!password)     { setError('Please enter a new password.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    setError('')
    try {
      const res  = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Reset failed.'); return }
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch {
      setError('Unable to reach the server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3D91] via-[#1557c0] to-[#1E90FF]
                    flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#0B3D91] p-3 rounded-2xl mb-3">
              <Anchor className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your reset token and new password.</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="bg-green-50 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <p className="text-green-700 font-semibold text-center">Password updated successfully!</p>
              <p className="text-gray-500 text-sm text-center">Redirecting to login…</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                                rounded-xl px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Token */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reset Token
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={token}
                      onChange={e => { setToken(e.target.value); setError('') }}
                      placeholder="Paste your reset token here"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                                 focus:border-[#0B3D91] transition font-mono"
                    />
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError('') }}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                                 focus:border-[#0B3D91] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setError('') }}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                                 focus:border-[#0B3D91] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B3D91] hover:bg-[#0a3480] text-white font-semibold
                             py-3 rounded-xl flex items-center justify-center gap-2
                             transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            <Link to="/login" className="text-[#0B3D91] font-semibold hover:underline">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword
