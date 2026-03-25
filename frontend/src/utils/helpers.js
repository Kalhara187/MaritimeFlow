/**
 * Common utilities and helpers
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

export const getStatusColor = (status, type = 'shipment') => {
  if (type === 'shipment') {
    const colors = {
      pending: 'bg-yellow-100',
      in_transit: 'bg-blue-100',
      arrived: 'bg-green-100',
      delivered: 'bg-green-100',
      cancelled: 'bg-red-100',
    }
    return colors[status] || 'bg-gray-100'
  }

  if (type === 'container') {
    const colors = {
      at_sea: 'bg-blue-100',
      at_port: 'bg-yellow-100',
      under_inspection: 'bg-orange-100',
      cleared: 'bg-green-100',
      released: 'bg-gray-100',
    }
    return colors[status] || 'bg-gray-100'
  }

  return 'bg-gray-100'
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
    return ''
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
  if (window?.URL?.createObjectURL) {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return csvContent
}

export const formatFileSize = (bytes) => {
  const safeBytes = Number(bytes)
  if (!Number.isFinite(safeBytes)) return '0 B'
  if (safeBytes <= 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(safeBytes) / Math.log(k))
  return Math.round((safeBytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const truncate = (text, length = 50, ellipsis = '...') => {
  if (text === null || text === undefined) return text
  return text.length > length ? text.slice(0, length) + ellipsis : text
}

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false
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

export const isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') return false

  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
}

export const validatePassword = (password) => isStrongPassword(password)

export const capitalizeWords = (text) => {
  if (!text) return ''
  return text
    .split(' ')
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export const calculateDaysSince = (dateInput) => {
  const inputDate = new Date(dateInput)
  if (Number.isNaN(inputDate.getTime())) return 0

  const now = new Date()
  const msDiff = now.getTime() - inputDate.getTime()
  return Math.floor(msDiff / (1000 * 60 * 60 * 24))
}
