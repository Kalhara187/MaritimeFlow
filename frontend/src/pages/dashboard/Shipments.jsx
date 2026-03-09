import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Search, Ship } from 'lucide-react'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
})

const STATUSES  = ['pending', 'in_transit', 'arrived', 'delivered', 'cancelled']
const STATUS_LABELS = {
  pending:   'Pending',
  in_transit:'In Transit',
  arrived:   'Arrived',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}
const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  in_transit:'bg-blue-100   text-blue-700',
  arrived:   'bg-green-100  text-green-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100    text-red-700',
}

const EMPTY = { tracking_number: '', vessel_name: '', origin: '', destination: '', status: 'pending', estimated_arrival: '' }

export default function ShipmentsView({ user }) {
  const [records, setRecords]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')

  const canEdit   = user.role === 'admin' || user.role === 'operator'
  const canDelete = user.role === 'admin'

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/shipments', { headers: authHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setRecords(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Failed to load shipments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (r) => {
    setEditing(r.id)
    setForm({
      tracking_number:   r.tracking_number,
      vessel_name:       r.vessel_name || '',
      origin:            r.origin,
      destination:       r.destination,
      status:            r.status,
      estimated_arrival: r.estimated_arrival ? r.estimated_arrival.slice(0, 10) : '',
    })
    setFormError('')
    setShowModal(true)
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.tracking_number || !form.origin || !form.destination) {
      setFormError('Tracking number, origin, and destination are required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const url    = editing ? `/api/shipments/${editing}` : '/api/shipments'
      const method = editing ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) })
      const data   = await res.json()
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
    if (!window.confirm('Delete this shipment? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/shipments/${id}`, { method: 'DELETE', headers: authHeaders() })
      if (!res.ok) { const d = await res.json(); setError(d.message || 'Delete failed.'); return }
      load()
    } catch {
      setError('Failed to delete shipment.')
    }
  }

  const filtered = records.filter(r =>
    [r.tracking_number, r.vessel_name, r.origin, r.destination]
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
            placeholder="Search by tracking #, vessel, route…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-72
                       focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
          />
        </div>
        {canEdit && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#0B3D91] text-white px-4 py-2 rounded-lg
                       text-sm font-medium hover:bg-[#0a3580] transition-colors"
          >
            <Plus className="w-4 h-4" /> New Shipment
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading shipments…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search ? 'No results match your search.' : canEdit ? 'No shipments yet. Click "New Shipment" to add one.' : 'No shipment records found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-5 py-3 text-left font-medium">Tracking #</th>
                  <th className="px-5 py-3 text-left font-medium">Vessel</th>
                  <th className="px-5 py-3 text-left font-medium">Origin</th>
                  <th className="px-5 py-3 text-left font-medium">Destination</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">ETA</th>
                  <th className="px-5 py-3 text-left font-medium">Added By</th>
                  {canEdit && <th className="px-5 py-3 text-right font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-[#0B3D91]">{r.tracking_number}</td>
                    <td className="px-5 py-3 text-gray-700">{r.vessel_name || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{r.origin}</td>
                    <td className="px-5 py-3 text-gray-600">{r.destination}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {r.estimated_arrival ? new Date(r.estimated_arrival).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-500">{r.created_by_name || '—'}</td>
                    {canEdit && (
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(r)}
                            title="Edit"
                            className="p-1.5 text-gray-400 hover:text-[#0B3D91] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {canDelete && (
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
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} of {records.length} shipment{records.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="font-semibold text-gray-800">{editing ? 'Edit Shipment' : 'New Shipment'}</h3>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tracking Number *</label>
                  <input
                    name="tracking_number"
                    value={form.tracking_number}
                    onChange={handleChange}
                    disabled={!!editing}
                    placeholder="e.g. PSL-2026-001"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                               disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Vessel Name</label>
                  <input
                    name="vessel_name"
                    value={form.vessel_name}
                    onChange={handleChange}
                    placeholder="e.g. MV Ocean Star"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Origin *</label>
                  <input
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    placeholder="e.g. Singapore"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Destination *</label>
                  <input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="e.g. Colombo Port"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Estimated Arrival</label>
                  <input
                    type="date"
                    name="estimated_arrival"
                    value={form.estimated_arrival}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                  />
                </div>
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
                  {saving ? 'Saving…' : editing ? 'Update Shipment' : 'Create Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
