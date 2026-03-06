import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Anchor, User, Mail, AtSign, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'

const API_BASE = 'http://localhost:5000/api'

const ROLES = [
  { value: 'viewer',   label: 'Viewer'   },
  { value: 'operator', label: 'Operator' },
  { value: 'admin',    label: 'Admin'    },
]

const Register = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'viewer',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.username || !form.password) {
      setError('All fields are required.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.')
        return
      }
      setSuccess('Account created successfully! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1800)
    } catch {
      setError('Unable to reach the server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3D91] via-[#1557c0] to-[#1E90FF]
                    flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#0B3D91] p-3 rounded-2xl mb-3">
              <Anchor className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PortSync Lanka</h1>
            <p className="text-gray-500 text-sm mt-1">Create your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                            rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm
                            rounded-xl px-4 py-3 mb-5">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Perera"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                             focus:border-[#0B3D91] transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@portsync.lk"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                             focus:border-[#0B3D91] transition"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="john_perera"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                             focus:border-[#0B3D91] transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                             focus:border-[#0B3D91] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                User Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                           focus:border-[#0B3D91] transition bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B3D91] hover:bg-[#0a3480] text-white font-semibold
                         py-3 rounded-xl flex items-center justify-center gap-2
                         transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white
                                 rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0B3D91] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
