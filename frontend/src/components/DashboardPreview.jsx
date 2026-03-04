import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Package, Ship, CheckCircle2 } from 'lucide-react'

const StatCard = ({ icon, label, value, change, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
    <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-500 text-xs truncate">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
      <p className="text-emerald-600 text-xs font-medium">{change}</p>
    </div>
  </div>
)

const BarChart = () => {
  const bars = [
    { month: 'Sep', height: 55, color: 'bg-blue-300' },
    { month: 'Oct', height: 70, color: 'bg-blue-400' },
    { month: 'Nov', height: 45, color: 'bg-blue-300' },
    { month: 'Dec', height: 90, color: 'bg-[#0B3D91]' },
    { month: 'Jan', height: 75, color: 'bg-blue-400' },
    { month: 'Feb', height: 60, color: 'bg-blue-300' },
    { month: 'Mar', height: 85, color: 'bg-[#1E90FF]' },
  ]

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm font-bold text-gray-800">Monthly Shipments</p>
          <p className="text-xs text-gray-400">Last 7 months</p>
        </div>
        <span className="bg-blue-100 text-[#0B3D91] text-xs px-2 py-0.5 rounded-full font-medium">
          +18% vs last year
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-24">
        {bars.map((bar) => (
          <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${bar.height}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
              className={`w-full rounded-t-sm ${bar.color}`}
              style={{ minHeight: '4px' }}
            />
            <span className="text-gray-400 text-[9px]">{bar.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DonutChart = () => {
  const total = 100
  const cleared = 72
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (cleared / total) * circumference

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <p className="text-sm font-bold text-gray-800 mb-1">Container Status</p>
      <p className="text-xs text-gray-400 mb-4">Current month distribution</p>
      <div className="flex items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <motion.circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke="#0B3D91"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
          <text x="40" y="45" textAnchor="middle" className="text-xs" 
                fill="#0B3D91" fontSize="14" fontWeight="bold">{cleared}%</text>
        </svg>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0B3D91]" />
            <span className="text-gray-600">Cleared ({cleared}%)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
            <span className="text-gray-600">In Progress (18%)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-400" />
            <span className="text-gray-600">Held (10%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const RecentActivity = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <p className="text-sm font-bold text-gray-800 mb-3">Recent Shipments</p>
    <div className="space-y-2.5">
      {[
        { id: 'SHP-2024-089', vessel: 'MV Colombo Star', status: 'Arrived', color: 'text-emerald-600 bg-emerald-50' },
        { id: 'SHP-2024-090', vessel: 'MV Ceylon Pride', status: 'In Transit', color: 'text-blue-600 bg-blue-50' },
        { id: 'SHP-2024-091', vessel: 'MV Lanka Bay', status: 'Departed', color: 'text-gray-500 bg-gray-50' },
        { id: 'SHP-2024-092', vessel: 'MV Port Eagle', status: 'Pending', color: 'text-amber-600 bg-amber-50' },
      ].map((item) => (
        <div key={item.id} className="flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-gray-700">{item.id}</p>
            <p className="text-gray-400">{item.vessel}</p>
          </div>
          <span className={`px-2 py-0.5 rounded-full font-medium ${item.color}`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  </div>
)

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0B3D91] via-[#0d3f96] to-[#1557c0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-white/20 text-white text-sm font-semibold 
                           px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            Analytics Dashboard
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Analytics Dashboard for<br />
            <span className="text-[#7dd3fc]">Real-Time Decision Making</span>
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Monitor every aspect of your port operations from a single, unified dashboard.
          </p>
        </motion.div>

        {/* Dashboard Mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#f0f4f8] rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Browser-style header */}
          <div className="bg-[#1e2a3b] px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-3 bg-[#2d3748] rounded px-3 py-1 text-gray-400 text-xs 
                             max-w-xs font-mono">
              plms.portlogistics.lk/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div className="bg-gray-50 p-4 md:p-6">
            {/* Top nav bar mock */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#0B3D91] rounded" />
                <span className="text-sm font-bold text-gray-700">Port Logistics Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-2 bg-gray-200 rounded" />
                <div className="w-7 h-7 bg-[#0B3D91] rounded-full" />
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <StatCard
                icon={<Ship className="w-4 h-4 text-[#0B3D91]" />}
                label="Total Shipments"
                value="1,284"
                change="↑ 12% this month"
                color="bg-blue-100"
              />
              <StatCard
                icon={<Package className="w-4 h-4 text-orange-600" />}
                label="Total Containers"
                value="8,452"
                change="↑ 8% this month"
                color="bg-orange-100"
              />
              <StatCard
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                label="Cleared Containers"
                value="6,084"
                change="↑ 5% this month"
                color="bg-emerald-100"
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4 text-purple-600" />}
                label="Clearance Rate"
                value="72%"
                change="↑ 3% this month"
                color="bg-purple-100"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <BarChart />
              </div>
              <DonutChart />
            </div>

            {/* Recent Activity */}
            <div className="mt-3">
              <RecentActivity />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DashboardPreview
