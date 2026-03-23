/**
 * Common utilities and helpers
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

export const getStatusColor = (status, type = 'shipment') => {
  if (type === 'shipment') {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_transit: 'bg-blue-100 text-blue-700',
      arrived: 'bg-green-100 text-green-700',
      delivered: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  if (type === 'container') {
    const colors = {
      at_sea: 'bg-blue-100 text-blue-700',
      at_port: 'bg-yellow-100 text-yellow-700',
      under_inspection: 'bg-orange-100 text-orange-700',
      cleared: 'bg-green-100 text-green-700',
      released: 'bg-emerald-100 text-emerald-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return 'bg-gray-100 text-gray-700'
}

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    in_transit: 'In Transit',
    arrived: 'Arrived',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    at_sea: 'At Sea',
    at_port: 'At Port',
    under_inspection: 'Under Inspection',
    cleared: 'Cleared',
    released: 'Released',
    admin: 'Admin',
    operator: 'Operator',
    viewer: 'Viewer',
  }
  return labels[status] || status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1)
}

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`
          }
          return value || ''
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const truncate = (text, length = 50) => {
  return text.length > length ? text.slice(0, length) + '...' : text
}

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
