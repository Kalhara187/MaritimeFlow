import React, { useEffect, useState } from 'react'
import { Ship, Package, FileText, BarChart2, TrendingUp, AlertCircle, Users, PieChart } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { LoadingSpinner } from '../../components/UIComponents'
import { api } from '../../utils/api'

const SHIP_STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  in_transit: 'bg-blue-100   text-blue-700',
  arrived:    'bg-green-100  text-green-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-red-100    text-red-700',
}

const CHART_COLORS = ['#0B3D91', '#1E90FF', '#FFB534', '#10B981', '#EF4444']

export default function Overview({ user, onNavigate }) {
  const isAdmin = user?.role === 'admin'
  const [stats, setStats] = useState({
    shipments: { total: 0, pending: 0, in_transit: 0, arrived: 0, delivered: 0 },
    containers: { total: 0, at_sea: 0, at_port: 0, cleared: 0, released: 0 },
    documents: 0,
    users: 0,
  })
  const [trends, setTrends] = useState([])
  const [containerTypes, setContainerTypes] = useState([])
  const [portActivity, setPortActivity] = useState({ origins: [], destinations: [] })
  const [recentShipments, setRecentShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, trendsRes, typesRes, activityRes, shipmentsRes] = await Promise.all([
          api.dashboard.stats(),
          api.dashboard.trends(),
          api.dashboard.containerTypes(),
          api.dashboard.portActivity(),
          api.shipments.list({ limit: 6 }),
        ])

        setStats(statsRes.data)
        setTrends((trendsRes.data || []).slice(0, 30))
        setContainerTypes(typesRes.data || [])
        setPortActivity({
          origins: activityRes.data?.top_origins || [],
          destinations: activityRes.data?.top_destinations || [],
        })

        const shipmentData = shipmentsRes.data
        if (shipmentData?.data) {
          setRecentShipments(shipmentData.data.slice(0, 6))
        } else if (Array.isArray(shipmentData)) {
          setRecentShipments(shipmentData.slice(0, 6))
        }
      } catch (e) {
        setError(e.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <LoadingSpinner />
        <p className="text-gray-400 text-sm mt-4">Loading overview…</p>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Shipments', value: stats.shipments?.total || 0, Icon: Ship, bg: 'bg-blue-50', fg: 'text-[#0B3D91]', view: 'shipments' },
    { label: 'Containers', value: stats.containers?.total || 0, Icon: Package, bg: 'bg-green-50', fg: 'text-green-600', view: 'containers' },
    { label: 'Documents', value: stats.documents || 0, Icon: FileText, bg: 'bg-amber-50', fg: 'text-amber-600', view: 'documents' },
    { label: 'Reports', value: stats.documents || 0, Icon: BarChart2, bg: 'bg-purple-50', fg: 'text-purple-600', view: 'reports' },
    ...(isAdmin ? [{ label: 'Users', value: stats.users || 0, Icon: Users, bg: 'bg-rose-50', fg: 'text-rose-600', view: 'users' }] : []),
  ]

  const shipmentStatusData = [
    { name: 'Pending', value: stats.shipments?.pending || 0 },
    { name: 'In Transit', value: stats.shipments?.in_transit || 0 },
    { name: 'Arrived', value: stats.shipments?.arrived || 0 },
    { name: 'Delivered', value: stats.shipments?.delivered || 0 },
  ].filter(d => d.value > 0)

  const containerStatusData = [
    { name: 'At Sea', value: stats.containers?.at_sea || 0 },
    { name: 'At Port', value: stats.containers?.at_port || 0 },
    { name: 'Cleared', value: stats.containers?.cleared || 0 },
    { name: 'Released', value: stats.containers?.released || 0 },
  ].filter(d => d.value > 0)

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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Status Pie */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#0B3D91]" />
            Shipment Status Distribution
          </h3>
          {shipmentStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie data={shipmentStatusData} cx="50%" cy="50%" outerRadius={80} label>
                {shipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-8">No shipment data</p>
          )}
        </div>

        {/* Container Status Pie */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-green-600" />
            Container Status Distribution
          </h3>
          {containerStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie data={containerStatusData} cx="50%" cy="50%" outerRadius={80} label>
                {containerStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-8">No container data</p>
          )}
        </div>
      </div>

      {/* Trends Chart */}
      {trends.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0B3D91]" />
            Shipment Trends (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#0B3D91" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="in_transit" stroke="#1E90FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Port Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Origins */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Origin Ports</h3>
          {portActivity.origins.length > 0 ? (
            <div className="space-y-3">
              {portActivity.origins.slice(0, 5).map((port, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700">{port.port}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-40 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#0B3D91] h-full"
                        style={{ width: `${(port.shipments / Math.max(...portActivity.origins.map(p => p.shipments))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-10 text-right">{port.shipments}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No data</p>
          )}
        </div>

        {/* Top Destinations */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Destination Ports</h3>
          {portActivity.destinations.length > 0 ? (
            <div className="space-y-3">
              {portActivity.destinations.slice(0, 5).map((port, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700">{port.port}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-40 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-600 h-full"
                        style={{ width: `${(port.shipments / Math.max(...portActivity.destinations.map(p => p.shipments))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-10 text-right">{port.shipments}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No data</p>
          )}
        </div>
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
