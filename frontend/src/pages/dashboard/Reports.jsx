import React, { useEffect, useState } from 'react'
import { Plus, Trash2, X, Search, BarChart2 } from 'lucide-react'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
})

const REPORT_TYPES = [
  { value: 'shipment_summary',   label: 'Shipment Summary' },
  { value: 'container_status',   label: 'Container Status' },
  { value: 'document_overview',  label: 'Document Overview' },
  { value: 'operational_report', label: 'Operational Report' },
]

const TYPE_COLORS = {
  shipment_summary:   'bg-blue-100   text-blue-700',
  container_status:   'bg-green-100  text-green-700',
  document_overview:  'bg-amber-100  text-amber-700',
  operational_report: 'bg-purple-100 text-purple-700',
}

const EMPTY = { title: '', report_type: 'shipment_summary' }

export default function ReportsView({ user }) {
  const [records, setRecords]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
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
      const res  = await fetch('/api/reports', { headers: authHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setRecords(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Failed to load reports.')
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
    if (!form.title.trim()) {
      setFormError('Report title is required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const res  = await fetch('/api/reports', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title: form.title.trim(), report_type: form.report_type }),
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
    if (!window.confirm('Delete this report? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE', headers: authHeaders() })
      if (!res.ok) { const d = await res.json(); setError(d.message || 'Delete failed.'); return }
      load()
    } catch {
      setError('Failed to delete report.')
    }
  }

  const filtered = records.filter(r =>
    [r.title, r.report_type, r.generated_by_name]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  const typeLabel = (v) => REPORT_TYPES.find(t => t.value === v)?.label || v

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64
                       focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
          />
        </div>
        {canEdit && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#0B3D91] text-white px-4 py-2 rounded-lg
                       text-sm font-medium hover:bg-[#0a3580] transition-colors"
          >
            <Plus className="w-4 h-4" /> Generate Report
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {REPORT_TYPES.map(({ value, label }) => {
          const count = records.filter(r => r.report_type === value).length
          if (count === 0) return null
          return (
            <span key={value} className={`px-3 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[value] || 'bg-gray-100 text-gray-600'}`}>
              {label}: {count}
            </span>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading reports…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search ? 'No reports match your search.' : canEdit ? 'No reports generated yet. Click "Generate Report" to create one.' : 'No reports available yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-5 py-3 text-left font-medium">Title</th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-left font-medium">Generated By</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  {canDelete && <th className="px-5 py-3 text-right font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{r.title}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[r.report_type] || 'bg-gray-100 text-gray-600'}`}>
                        {typeLabel(r.report_type)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{r.generated_by_name || '—'}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {r.generated_at ? new Date(r.generated_at).toLocaleString() : '—'}
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
          {filtered.length} of {records.length} report{records.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="font-semibold text-gray-800">Generate Report</h3>
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Report Type</label>
                <select
                  name="report_type"
                  value={form.report_type}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                >
                  {REPORT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Report Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder={`e.g. ${REPORT_TYPES.find(t => t.value === form.report_type)?.label} — March 2026`}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                />
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
                  {saving ? 'Generating…' : 'Generate Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
