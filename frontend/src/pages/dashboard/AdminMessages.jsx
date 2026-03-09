import React, { useEffect, useState } from 'react'
import { Trash2, Search, MessageSquare, X, Mail, User, Tag, Calendar } from 'lucide-react'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
})

export default function AdminMessages() {
  const [records, setRecords]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null)   // message to view in modal

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/contact', { headers: authHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setRecords(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id, e) {
    e.stopPropagation()
    if (!window.confirm('Delete this message? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE', headers: authHeaders() })
      const d   = await res.json()
      if (!res.ok) { setError(d.message || 'Delete failed.'); return }
      if (selected?.message_id === id) setSelected(null)
      load()
    } catch {
      setError('Failed to delete message.')
    }
  }

  const filtered = records.filter(r =>
    [r.name, r.email, r.subject, r.message]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search messages…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64
                       focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
          />
        </div>
        <span className="text-sm text-gray-500">
          {records.length} message{records.length !== 1 ? 's' : ''} received
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Messages list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading messages…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search ? 'No messages match your search.' : 'No contact messages yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-5 py-3 text-left font-medium">Sender</th>
                  <th className="px-5 py-3 text-left font-medium">Email</th>
                  <th className="px-5 py-3 text-left font-medium">Subject</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr
                    key={r.message_id}
                    onClick={() => setSelected(r)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0B3D91]/10 text-[#0B3D91] flex items-center
                                        justify-center text-xs font-bold shrink-0">
                          {r.name?.charAt(0).toUpperCase()}
                        </div>
                        {r.name}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{r.email}</td>
                    <td className="px-5 py-3 text-gray-700 max-w-xs">
                      <span className="truncate block">{r.subject}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {r.submitted_date ? new Date(r.submitted_date).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={(e) => handleDelete(r.message_id, e)}
                        title="Delete"
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
          {filtered.length} of {records.length} message{records.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Message detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="font-semibold text-gray-800">Message Detail</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Sender</p>
                    <p className="text-sm font-medium text-gray-800">{selected.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <p className="text-sm text-gray-700 break-all">{selected.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 col-span-2">
                  <Tag className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Subject</p>
                    <p className="text-sm font-medium text-gray-800">{selected.subject}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 col-span-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Received</p>
                    <p className="text-sm text-gray-600">
                      {selected.submitted_date
                        ? new Date(selected.submitted_date).toLocaleString()
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Message</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm
                             hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={(e) => handleDelete(selected.message_id, e)}
                  className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-medium
                             hover:bg-red-600 transition-colors"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
