import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Search, Package, Download, Clock } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api from '../../utils/api'
import { exportToCSV } from '../../utils/helpers'
import { LoadingSpinner, Badge } from '../../components/UIComponents'

const STATUSES = ['at_sea', 'at_port', 'under_inspection', 'cleared', 'released']
const STATUS_LABELS = {
  at_sea:           'At Sea',
  at_port:          'At Port',
  under_inspection: 'Under Inspection',
  cleared:          'Cleared',
  released:         'Released',
}
const STATUS_COLORS = {
  at_sea:           'bg-blue-100   text-blue-700',
  at_port:          'bg-indigo-100 text-indigo-700',
  under_inspection: 'bg-amber-100  text-amber-700',
  cleared:          'bg-green-100  text-green-700',
  released:         'bg-gray-100   text-gray-600',
}

const TYPES = ['20ft', '40ft', '40ft_hc', 'reefer', 'open_top', 'flat_rack']
const TYPE_LABELS = {
  '20ft':     '20 ft',
  '40ft':     '40 ft',
  '40ft_hc':  '40 ft HC',
  'reefer':   'Reefer',
  'open_top': 'Open Top',
  'flat_rack':'Flat Rack',
}

const EMPTY = { container_number: '', shipment_id: '', type: '20ft', weight_kg: '', status: 'at_port' }

export default function ContainersView({ user }) {
  const { toast } = useToast()
  const [records, setRecords]       = useState([])
  const [shipments, setShipments]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilter]   = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [showHistory, setShowHistory] = useState(null)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')
  const [history, setHistory]       = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const canEdit   = user.role === 'admin' || user.role === 'operator'
  const canDelete = user.role === 'admin'

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [cData, sData] = await Promise.all([
        api.containers.list(),
        api.shipments.list(),
      ])
      setRecords(Array.isArray(cData.data) ? cData.data : [])
      setShipments(Array.isArray(sData.data) ? sData.data : [])
    } catch (e) {
      const msg = e.message || 'Failed to load containers.'
      setError(msg)
      toast({ type: 'error', message: msg })
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
      container_number: r.container_number,
      shipment_id:      r.shipment_id ? String(r.shipment_id) : '',
      type:             r.type,
      weight_kg:        r.weight_kg !== null ? String(r.weight_kg) : '',
      status:           r.status,
    })
    setFormError('')
    setShowModal(true)
  }

  const openHistory = async (id) => {
    setShowHistory(id)
    setHistoryLoading(true)
    try {
      const { data } = await api.containers.getHistory(id)
      setHistory(Array.isArray(data) ? data : [])
    } catch (e) {
      toast({ type: 'error', message: 'Failed to load history' })
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.container_number) {
      setFormError('Container number is required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        ...form,
        shipment_id: form.shipment_id ? parseInt(form.shipment_id) : null,
        weight_kg:   form.weight_kg   ? parseFloat(form.weight_kg) : null,
      }
      if (editing) {
        await api.containers.update(editing, payload)
        toast({ type: 'success', message: 'Container updated successfully' })
      } else {
        await api.containers.create(payload)
        toast({ type: 'success', message: 'Container created successfully' })
      }
      setShowModal(false)
      load()
    } catch (e) {
      setFormError(e.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this container? This cannot be undone.')) return
    try {
      await api.containers.delete(id)
      toast({ type: 'success', message: 'Container deleted successfully' })
      load()
    } catch (e) {
      const msg = e.message || 'Failed to delete container.'
      setError(msg)
      toast({ type: 'error', message: msg })
    }
  }

  const handleExport = () => {
    try {
      const data = filtered.map(r => ({
        'Container #': r.container_number,
        'Shipment': r.tracking_number || '—',
        'Type': TYPE_LABELS[r.type] || r.type,
        'Weight (kg)': r.weight_kg !== null ? Number(r.weight_kg).toLocaleString() : '—',
        'Status': STATUS_LABELS[r.status] || r.status,
      }))
      exportToCSV(data, 'containers.csv')
      toast({ type: 'success', message: 'Containers exported successfully' })
    } catch (e) {
      toast({ type: 'error', message: 'Export failed' })
    }
  }

  const filtered = records.filter(r => {
    const matchSearch = [r.container_number, r.tracking_number]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = !filterStatus || r.status === filterStatus
    return matchSearch && matchStatus
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
              placeholder="Search containers…"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56
                         focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600
                       focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {!loading && filtered.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg
                         text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          )}
          {canEdit && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-[#0B3D91] text-white px-4 py-2 rounded-lg
                         text-sm font-medium hover:bg-[#0a3580] transition-colors"
            >
              <Plus className="w-4 h-4" /> New Container
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(s => {
          const count = records.filter(r => r.status === s).length
          if (count === 0) return null
          return (
            <button
              key={s}
              onClick={() => setFilter(filterStatus === s ? '' : s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                          ${filterStatus === s
                            ? STATUS_COLORS[s] + ' border-current'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
            >
              {STATUS_LABELS[s]} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search || filterStatus ? 'No containers match your filters.' : canEdit ? 'No containers yet. Click "New Container" to add one.' : 'No container records found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-5 py-3 text-left font-medium">Container #</th>
                  <th className="px-5 py-3 text-left font-medium">Shipment</th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-left font-medium">Weight (kg)</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">History</th>
                  {canEdit && <th className="px-5 py-3 text-right font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-[#0B3D91]">{r.container_number}</td>
                    <td className="px-5 py-3 text-gray-600">{r.tracking_number || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{TYPE_LABELS[r.type] || r.type}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {r.weight_kg !== null ? Number(r.weight_kg).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <Badge status={r.status} type="container" />
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openHistory(r.id)}
                        title="View history"
                        className="p-1.5 text-gray-400 hover:text-[#0B3D91] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                    </td>
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

      {!loading && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} of {records.length} container{records.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="font-semibold text-gray-800">{editing ? 'Edit Container' : 'New Container'}</h3>
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Container Number *</label>
                <input
                  name="container_number"
                  value={form.container_number}
                  onChange={handleChange}
                  disabled={!!editing}
                  placeholder="e.g. ABCU1234567"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30
                             disabled:bg-gray-50 disabled:text-gray-400"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                  >
                    {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight_kg"
                    value={form.weight_kg}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 24000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
                  />
                </div>
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
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
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
                  {saving ? 'Saving…' : editing ? 'Update Container' : 'Create Container'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="font-semibold text-gray-800">Container Status History</h3>
              </div>
              <button
                onClick={() => setShowHistory(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-4">
              {historyLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : history.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">No status changes yet.</div>
              ) : (
                <div className="space-y-4">
                  {history.map((h, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[#0B3D91]" />
                        {idx < history.length - 1 && <div className="w-0.5 h-12 bg-gray-200" />}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <Badge status={h.status} type="container" />
                          <span className="text-xs text-gray-500">
                            {new Date(h.changed_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Changed by: {h.changed_by_name || 'System'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
