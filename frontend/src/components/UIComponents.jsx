/**
 * Reusable UI Components
 */

import React from 'react'
import { Loader } from 'lucide-react'

// Loading Spinner
export function LoadingSpinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex items-center justify-center">
      <Loader className={`${sizes[size]} animate-spin text-[#0B3D91]`} />
    </div>
  )
}

// Loading Skeleton
export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded ${className}`} />
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action = null }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-center mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}

// Statistics Card
export function StatCard({ label, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-xl ${widths[size]} w-full`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

// Badge
export function Badge({ label = null, status = null, type = 'shipment' }) {
  const shipmentStatuses = {
    pending:   'bg-yellow-100 text-yellow-700',
    in_transit:'bg-blue-100 text-blue-700',
    arrived:   'bg-green-100 text-green-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const containerStatuses = {
    at_sea:           'bg-blue-100 text-blue-700',
    at_port:          'bg-indigo-100 text-indigo-700',
    under_inspection: 'bg-amber-100 text-amber-700',
    cleared:          'bg-green-100 text-green-700',
    released:         'bg-gray-100 text-gray-600',
  }

  const shipmentLabels = {
    pending:   'Pending',
    in_transit:'In Transit',
    arrived:   'Arrived',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }

  const containerLabels = {
    at_sea:           'At Sea',
    at_port:          'At Port',
    under_inspection: 'Under Inspection',
    cleared:          'Cleared',
    released:         'Released',
  }

  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
  }

  // Determine the color and label based on status
  let colorClass = colors.gray
  let displayLabel = label

  if (status) {
    if (type === 'container') {
      colorClass = containerStatuses[status] || colors.gray
      displayLabel = containerLabels[status] || status
    } else {
      colorClass = shipmentStatuses[status] || colors.gray
      displayLabel = shipmentLabels[status] || status
    }
  } else if (label && !Object.keys(colors).includes('color')) {
    // Fallback to color if provided
    colorClass = colors[label] || colors.gray
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {displayLabel}
    </span>
  )
}

// Button variations
export function Button({ children, variant = 'primary', size = 'md', loading = false, ...props }) {
  const variants = {
    primary: 'bg-[#0B3D91] text-white hover:bg-[#0a3166] active:bg-[#082347]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    success: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   ${variants[variant]} ${sizes[size]}`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

// Breadcrumb
export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-gray-400">/</span>}
          {item.href ? (
            <a href={item.href} className="text-[#0B3D91] hover:underline">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-600">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Alert
export function Alert({ type = 'info', title, message, onClose = null }) {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error: 'bg-red-50 border-red-200 text-red-700',
  }

  return (
    <div className={`border rounded-lg p-4 ${colors[type]}`}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-current opacity-70 hover:opacity-100">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
