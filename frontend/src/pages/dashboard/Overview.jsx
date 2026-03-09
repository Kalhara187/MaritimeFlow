import React, { useEffect, useState } from 'react'
import { Ship, Package, FileText, BarChart2, TrendingUp, AlertCircle, Users } from 'lucide-react'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
})

const SHIP_STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  in_transit: 'bg-blue-100   text-blue-700',
  arrived:    'bg-green-100  text-green-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-red-100    text-red-700',
}

export default function Overview({ user, onNavigate }) {
  const isAdmin = user?.role === 'admin'
  const [stats, setStats]                   = useState({ shipments: 0, containers: 0, documents: 0, reports: 0, users: 0 })
  const [recentShipments, setRecentShipments] = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')

  useEffect(() => {
    async function load() {
      try {
        const requests = [
          fetch('/api/shipments',  { headers: authHeaders() }),
          fetch('/api/containers', { headers: authHeaders() }),
          fetch('/api/documents',  { headers: authHeaders() }),
          fetch('/api/reports',    { headers: authHeaders() }),
        ]
        if (isAdmin) requests.push(fetch('/api/users', { headers: authHeaders() }))

        const responses = await Promise.all(requests)
        const [shipments, containers, documents, reports, users] = await Promise.all(
          responses.map(r => r.json())
        )
        setStats({
          shipments:  Array.isArray(shipments)  ? shipments.length  : 0,
          containers: Array.isArray(containers) ? containers.length : 0,
          documents:  Array.isArray(documents)  ? documents.length  : 0,
          reports:    Array.isArray(reports)    ? reports.length    : 0,
          users:      Array.isArray(users)      ? users.length      : 0,
        })
        setRecentShipments(Array.isArray(shipments) ? shipments.slice(0, 6) : [])
      } catch {
        setError('Failed to load dashboard data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAdmin])

  const statCards = [
    { label: 'Total Shipments',    value: stats.shipments,  Icon: Ship,      bg: 'bg-blue-50',   fg: 'text-[#0B3D91]', view: 'shipments'  },
    { label: 'Containers in Port', value: stats.containers, Icon: Package,   bg: 'bg-green-50',  fg: 'text-green-600', view: 'containers' },
    { label: 'Active Documents',   value: stats.documents,  Icon: FileText,  bg: 'bg-amber-50',  fg: 'text-amber-600', view: 'documents'  },
    { label: 'Reports Generated',  value: stats.reports,    Icon: BarChart2, bg: 'bg-purple-50', fg: 'text-purple-600',view: 'reports'    },
    ...(isAdmin ? [{ label: 'Registered Users', value: stats.users, Icon: Users, bg: 'bg-rose-50', fg: 'text-rose-600', view: 'users' }] : []),
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <span className="text-sm">Loading overview…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, Icon, bg, fg, view }) => (
          <button
            key={label}
            onClick={() => onNavigate(view)}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4
                       hover:shadow-md transition-shadow text-left w-full"
          >
            <div className={`p-3 rounded-xl ${bg} ${fg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent shipments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0B3D91]" />
            <h2 className="font-semibold text-gray-800">Recent Shipments</h2>
          </div>
          <button
            onClick={() => onNavigate('shipments')}
            className="text-sm text-[#0B3D91] hover:underline"
          >
            View all →
          </button>
        </div>

        {recentShipments.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No shipments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-6 py-3 text-left font-medium">Tracking #</th>
                  <th className="px-6 py-3 text-left font-medium">Vessel</th>
                  <th className="px-6 py-3 text-left font-medium">Route</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentShipments.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono font-medium text-[#0B3D91]">{s.tracking_number}</td>
                    <td className="px-6 py-3 text-gray-700">{s.vessel_name || '—'}</td>
                    <td className="px-6 py-3 text-gray-600">{s.origin} → {s.destination}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SHIP_STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-600'}`}>
                        {s.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {s.estimated_arrival ? new Date(s.estimated_arrival).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
