import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, FileText, BarChart2,
  Bell, Settings, LogOut, Anchor, Ship, TrendingUp,
} from 'lucide-react'

const stats = [
  { label: 'Active Shipments', value: '142', icon: <Ship className="w-5 h-5" />, color: 'bg-blue-50 text-[#0B3D91]' },
  { label: 'Containers In Port', value: '89', icon: <Package className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
  { label: 'Pending Documents', value: '27', icon: <FileText className="w-5 h-5" />, color: 'bg-yellow-50 text-yellow-600' },
  { label: 'Reports Generated', value: '318', icon: <BarChart2 className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
]

const sidebarLinks = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, active: true },
  { label: 'Shipments', icon: <Ship className="w-4 h-4" /> },
  { label: 'Containers', icon: <Package className="w-4 h-4" /> },
  { label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  { label: 'Reports', icon: <BarChart2 className="w-4 h-4" /> },
  { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
]

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  window.location.href = '/login'
}

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0B3D91] text-white flex flex-col min-h-screen hidden md:flex">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="bg-white/20 p-2 rounded-lg">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">PortSync Lanka</p>
            <p className="text-blue-200 text-xs">Management System</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarLinks.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm 
                         font-medium transition-colors text-left
                         ${item.active
                           ? 'bg-white/20 text-white'
                           : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm 
                       font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-xs">Welcome back, Port Administrator</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-[#0B3D91] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">PA</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
          >
            {stats.map((s) => (
              <div key={s.label}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 
                           flex items-center gap-4">
                <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Placeholder Chart Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {/* Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Shipment Activity</h2>
                <TrendingUp className="w-4 h-4 text-[#0B3D91]" />
              </div>
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl 
                              flex items-center justify-center">
                <p className="text-[#0B3D91] text-sm font-medium">
                  Chart will render here — connect your analytics API
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: 'New Shipment', icon: <Ship className="w-4 h-4" /> },
                  { label: 'Upload Document', icon: <FileText className="w-4 h-4" /> },
                  { label: 'Generate Report', icon: <BarChart2 className="w-4 h-4" /> },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 
                               hover:bg-blue-100 text-[#0B3D91] rounded-xl text-sm 
                               font-medium transition-colors"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-[#0B3D91] transition-colors"
            >
              ← Back to Main Site
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
