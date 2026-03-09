import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Search, Users } from 'lucide-react'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
})

const ROLES = ['admin', 'operator', 'viewer']
const ROLE_COLORS = {
  admin:    'bg-red-100    text-red-700',
  operator: 'bg-blue-100   text-blue-700',
  viewer:   'bg-gray-100   text-gray-600',
}

const EMPTY_FORM = { name: '', email: '', username: '', password: '', role: 'viewer' }

export default function AdminUsers({ currentUserId }) {
  const [records, setRecords]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [filterRole, setFilter]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)   // null = create
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/users', { headers: authHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setRecords(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (r) => {
    setEditing(r.id)
    setForm({ name: r.name, email: r.email, username: r.username || '', password: '', role: r.role })
    setFormError('')
    setShowModal(true)
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    const isCreate = editing === null

    if (!form.name.trim() || !form.email.trim())
      return setFormError('Name and email are required.')
    if (isCreate && (!form.username.trim() || !form.password))
      return setFormError('Username and password are required.')
    if (isCreate && form.password.length < 6)
      return setFormError('Password must be at least 6 characters.')

    setSaving(true)
    setFormError('')
    try {
      let res, data
      if (isCreate) {
        res  = await fetch('/api/users', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(form),
        })
      } else {
        res  = await fetch(`/api/users/${editing}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ name: form.name, email: form.email, role: form.role }),
        })
      }
      data = await res.json()
      if (!res.ok) { setFormError(data.message || 'Save failed.'); return }
      setShowModal(false)
      load()
    } catch {
      setFormError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user account? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE', headers: authHeaders() })
      const d   = await res.json()
      if (!res.ok) { setError(d.message || 'Delete failed.'); return }
      load()
    } catch {
      setError('Failed to delete user.')
    }
  }

  const filtered = records.filter(r => {
    const matchSearch = [r.name, r.email, r.username]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchRole = !filterRole || r.role === filterRole
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, username…"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64
                         focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
            />
          </div>
          <select
            value={filterRole}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600
                       focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0B3D91] text-white px-4 py-2 rounded-lg
                     text-sm font-medium hover:bg-[#0a3580] transition-colors"
        >
          <Plus className="w-4 h-4" /> New User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Role summary chips */}
      <div className="flex flex-wrap gap-2">
        {ROLES.map(r => {
          const count = records.filter(u => u.role === r).length
          if (count === 0) return null
          return (
            <button
              key={r}
              onClick={() => setFilter(filterRole === r ? '' : r)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                          ${filterRole === r
                            ? ROLE_COLORS[r] + ' border-current'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search || filterRole ? 'No users match your filter.' : 'No users found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-5 py-3 text-left font-medium">Name</th>
                  <th className="px-5 py-3 text-left font-medium">Email</th>
                  <th className="px-5 py-3 text-left font-medium">Username</th>
                  <th className="px-5 py-3 text-left font-medium">Role</th>
                  <th className="px-5 py-3 text-left font-medium">Joined</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0B3D91]/10 text-[#0B3D91] flex items-center
                                        justify-center text-xs font-bold shrink-0">
                          {r.name?.charAt(0).toUpperCase()}
                        </div>
                        {r.name}
                        {r.id === currentUserId && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{r.email}</td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">@{r.username}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${ROLE_COLORS[r.role] || 'bg-gray-100 text-gray-600'}`}>
                        {r.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(r)}
                          title="Edit"
                          className="p-1.5 text-gray-400 hover:text-[#0B3D91] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {r.id !== currentUserId && (
                          <button
                            onClick={() => handleDelete(r.id)}
                            title="Delete"
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} of {records.length} user{records.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="font-semibold text-gray-800">
                  {editing ? 'Edit User' : 'Create New User'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Perera"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                />
              </div>

              {editing === null && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Username *</label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="e.g. jperera"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm
                             hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#0B3D91] text-white rounded-lg py-2 text-sm font-medium
                             hover:bg-[#0a3580] transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
