import React, { useEffect, useState } from 'react'
import { Plus, Trash2, X, Search, FileText } from 'lucide-react'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
})

const DOC_TYPES = [
  'Bill of Lading',
  'Manifest',
  'Certificate of Origin',
  'Customs Declaration',
  'Request',
  'Report',
  'Approval',
  'Internal Memo',
]

const TYPE_COLORS = {
  'Bill of Lading':       'bg-blue-100   text-blue-700',
  'Manifest':             'bg-indigo-100 text-indigo-700',
  'Certificate of Origin':'bg-green-100  text-green-700',
  'Customs Declaration':  'bg-purple-100 text-purple-700',
  'Request':              'bg-amber-100  text-amber-700',
  'Report':               'bg-cyan-100   text-cyan-700',
  'Approval':             'bg-emerald-100 text-emerald-700',
  'Internal Memo':        'bg-gray-100   text-gray-600',
}

const EMPTY = { doc_type: 'Bill of Lading', file_name: '', file_path: '', shipment_id: '' }

export default function DocumentsView({ user }) {
  const [records, setRecords]     = useState([])
  const [shipments, setShipments] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [filterType, setFilter]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')

  const canEdit   = user.role === 'admin' || user.role === 'operator'
  const canDelete = user.role === 'admin'

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [dRes, sRes] = await Promise.all([
        fetch('/api/documents', { headers: authHeaders() }),
        fetch('/api/shipments', { headers: authHeaders() }),
      ])
      const [dData, sData] = await Promise.all([dRes.json(), sRes.json()])
      if (!dRes.ok) throw new Error(dData.message)
      setRecords(Array.isArray(dData) ? dData : [])
      setShipments(Array.isArray(sData) ? sData : [])
    } catch (e) {
      setError(e.message || 'Failed to load documents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm(EMPTY)
    setFormError('')
    setShowModal(true)
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.file_name.trim()) {
      setFormError('Document name is required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        doc_type:    form.doc_type,
        file_name:   form.file_name.trim(),
        file_path:   form.file_path.trim() || '',
        shipment_id: form.shipment_id ? parseInt(form.shipment_id) : null,
      }
      const res  = await fetch('/api/documents', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
      const data = await res.json()
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
    if (!window.confirm('Delete this document record? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE', headers: authHeaders() })
      if (!res.ok) { const d = await res.json(); setError(d.message || 'Delete failed.'); return }
      load()
    } catch {
      setError('Failed to delete document.')
    }
  }

  const filtered = records.filter(r => {
    const matchSearch = [r.file_name, r.doc_type, r.tracking_number, r.uploaded_by_name]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchType = !filterType || r.doc_type === filterType
    return matchSearch && matchType
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
              placeholder="Search documents…"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56
                         focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600
                       focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
          >
            <option value="">All Types</option>
            {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {canEdit && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#0B3D91] text-white px-4 py-2 rounded-lg
                       text-sm font-medium hover:bg-[#0a3580] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Document
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading documents…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search || filterType ? 'No documents match your filters.' : 'No documents yet. Click "Add Document" to upload one.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-5 py-3 text-left font-medium">Document Name</th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-left font-medium">Shipment</th>
                  <th className="px-5 py-3 text-left font-medium">Uploaded By</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-left font-medium">Reference</th>
                  {canDelete && <th className="px-5 py-3 text-right font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{r.file_name}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[r.doc_type] || 'bg-gray-100 text-gray-600'}`}>
                        {r.doc_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 font-mono text-xs">{r.tracking_number || '—'}</td>
                    <td className="px-5 py-3 text-gray-500">{r.uploaded_by_name || '—'}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {r.uploaded_at ? new Date(r.uploaded_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs truncate max-w-[120px]">
                      {r.file_path || '—'}
                    </td>
                    {canDelete && (
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDelete(r.id)}
                          title="Delete"
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} of {records.length} document{records.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="font-semibold text-gray-800">Add Document</h3>
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Document Type</label>
                <select
                  name="doc_type"
                  value={form.doc_type}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                >
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Document Name *</label>
                <input
                  name="file_name"
                  value={form.file_name}
                  onChange={handleChange}
                  placeholder="e.g. BL-2026-001 Ocean Star"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Reference / File Path</label>
                <input
                  name="file_path"
                  value={form.file_path}
                  onChange={handleChange}
                  placeholder="Optional — URL, path, or reference number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Linked Shipment</label>
                <select
                  name="shipment_id"
                  value={form.shipment_id}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                >
                  <option value="">— Not linked —</option>
                  {shipments.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.tracking_number}{s.vessel_name ? ` — ${s.vessel_name}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-[#0B3D91] text-white rounded-lg
                             hover:bg-[#0a3580] disabled:opacity-60 transition-colors"
                >
                  {saving ? 'Saving…' : 'Add Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
