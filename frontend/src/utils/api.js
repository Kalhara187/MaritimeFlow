/**
 * API utilities and helpers
 */

import axios from 'axios'

const API_BASE = '/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const api = {
  // Auth
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (data) => apiClient.post('/auth/register', data),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
    changePassword: (data) => apiClient.post('/auth/change-password', data),
  },

  // Shipments
  shipments: {
    list: (params) => apiClient.get('/shipments', { params }),
    get: (id) => apiClient.get(`/shipments/${id}`),
    create: (data) => apiClient.post('/shipments', data),
    update: (id, data) => apiClient.put(`/shipments/${id}`, data),
    delete: (id) => apiClient.delete(`/shipments/${id}`),
  },

  // Containers
  containers: {
    list: (params) => apiClient.get('/containers', { params }),
    get: (id) => apiClient.get(`/containers/${id}`),
    create: (data) => apiClient.post('/containers', data),
    update: (id, data) => apiClient.put(`/containers/${id}`, data),
    delete: (id) => apiClient.delete(`/containers/${id}`),
    getHistory: (id) => apiClient.get(`/containers/${id}/history`),
  },

  // Documents
  documents: {
    list: () => apiClient.get('/documents'),
    get: (id) => apiClient.get(`/documents/${id}`),
    create: (data) => apiClient.post('/documents', data),
    upload: (formData) =>
      apiClient.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    update: (id, data) => apiClient.put(`/documents/${id}`, data),
    delete: (id) => apiClient.delete(`/documents/${id}`),
  },

  // Reports
  reports: {
    list: (params) => apiClient.get('/reports', { params }),
    get: (id) => apiClient.get(`/reports/${id}`),
    create: (data) => apiClient.post('/reports', data),
    delete: (id) => apiClient.delete(`/reports/${id}`),
  },

  // Dashboard
  dashboard: {
    stats: () => apiClient.get('/dashboard/stats'),
    trends: () => apiClient.get('/dashboard/shipment-trends'),
    containerTypes: () => apiClient.get('/dashboard/container-types'),
    portActivity: () => apiClient.get('/dashboard/port-activity'),
  },

  // Users
  users: {
    list: () => apiClient.get('/users'),
    get: (id) => apiClient.get(`/users/${id}`),
    create: (data) => apiClient.post('/users', data),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`),
  },

  // Contact
  contact: {
    list: () => apiClient.get('/contact'),
    submit: (data) => apiClient.post('/contact', data),
    delete: (id) => apiClient.delete(`/contact/${id}`),
  },
}
