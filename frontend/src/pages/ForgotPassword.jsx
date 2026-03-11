import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Anchor, Mail, ArrowRight, CheckCircle } from 'lucide-react'

const API_BASE = '/api'

const ForgotPassword = () => {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email address.'); return }
    setLoading(true)
    setError('')
    try {
      const res  = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Request failed.'); return }
      setSent(true)
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
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
            <p className="text-gray-500 text-sm mt-1 text-center">
              Enter your email and we'll generate a reset link.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                            rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-6 flex flex-col items-center text-center gap-3">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <p className="text-green-700 font-semibold">Check your email</p>
              <p className="text-gray-500 text-sm">
                A password reset link has been sent to <strong>{email}</strong>.
                Please check your inbox (and spam folder) — the link expires in{' '}
                <strong>15 minutes</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    placeholder="you@portsync.lk"
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
                    <ArrowRight className="w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-[#0B3D91] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-white/70 text-sm mt-6">
          <Link to="/" className="hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
