import React, { useState } from 'react'
import { Anchor, LayoutDashboard, Ship, Package, FileText, BarChart2, LogOut, Menu, X, Users, MessageSquare } from 'lucide-react'
import Overview       from './dashboard/Overview'
import ShipmentsView  from './dashboard/Shipments'
import ContainersView from './dashboard/Containers'
import DocumentsView  from './dashboard/Documents'
import ReportsView    from './dashboard/Reports'
import AdminUsers     from './dashboard/AdminUsers'
import AdminMessages  from './dashboard/AdminMessages'

const BASE_NAV = [
  { id: 'overview',   label: 'Dashboard',  Icon: LayoutDashboard },
  { id: 'shipments',  label: 'Shipments',  Icon: Ship },
  { id: 'containers', label: 'Containers', Icon: Package },
  { id: 'documents',  label: 'Documents',  Icon: FileText },
  { id: 'reports',    label: 'Reports',    Icon: BarChart2 },
]

const ADMIN_NAV = [
  { id: 'users',    label: 'User Management', Icon: Users },
  { id: 'messages', label: 'Contact Messages', Icon: MessageSquare },
]

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  window.location.href = '/login'
}

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}')
  const isAdmin = user.role === 'admin'

  const NAV = isAdmin ? [...BASE_NAV, ...ADMIN_NAV] : BASE_NAV

  const views = {
    overview:   <Overview   user={user} onNavigate={setActiveView} />,
    shipments:  <ShipmentsView  user={user} />,
    containers: <ContainersView user={user} />,
    documents:  <DocumentsView  user={user} />,
    reports:    <ReportsView    user={user} />,
    users:      <AdminUsers     currentUserId={user.id} />,
    messages:   <AdminMessages />,
  }

  const currentLabel = NAV.find(n => n.id === activeView)?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B3D91] text-white flex flex-col
                         transform transition-transform duration-200
                         md:relative md:translate-x-0
                         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
          {BASE_NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveView(id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                          font-medium transition-colors text-left
                          ${activeView === id
                            ? 'bg-white/20 text-white'
                            : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}

          {isAdmin && (
            <>
              <div className="pt-3 pb-1 px-4">
                <p className="text-blue-300/60 text-xs font-semibold uppercase tracking-wider">
                  Administration
                </p>
              </div>
              {ADMIN_NAV.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => { setActiveView(id); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                              font-medium transition-colors text-left
                              ${activeView === id
                                ? 'bg-white/20 text-white'
                                : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </>
          )}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
              <p className="text-blue-200 text-xs capitalize">
                {user.role === 'viewer' ? 'View Only' : (user.role || 'viewer')}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                       font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(v => !v)}
            >
              {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{currentLabel}</h1>
          </div>
          <p className="text-sm text-gray-500 hidden sm:block">
            Welcome, <span className="font-medium text-gray-800">{user.name}</span>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full capitalize
              ${ user.role === 'admin'    ? 'bg-red-100 text-red-700'
               : user.role === 'operator' ? 'bg-blue-100 text-[#0B3D91]'
               : 'bg-gray-100 text-gray-500' }`}>
              {user.role === 'viewer' ? 'View Only' : user.role}
            </span>
          </p>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {views[activeView]}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
