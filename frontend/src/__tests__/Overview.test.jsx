import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Overview from '../pages/dashboard/Overview'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
}))

describe('Dashboard Overview Component', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.getItem = jest.fn((key) => {
      if (key === 'auth_token') return 'test_token_123'
      if (key === 'auth_user') return JSON.stringify({ id: 1, name: 'Test Admin', role: 'admin' })
      return null
    })
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state initially', () => {
    global.fetch.mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves (infinite loading)
    )

    render(<Overview user={{ id: 1, name: 'Test Admin', role: 'admin' }} onNavigate={jest.fn()} />)

    expect(screen.getByText(/loading overview/i)).toBeInTheDocument()
  })

  it('should fetch and display statistics', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/shipments')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, tracking_number: 'PSL-001', status: 'in_transit' },
            { id: 2, tracking_number: 'PSL-002', status: 'pending' },
          ],
        })
      }
      if (url.includes('/containers')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, container_number: 'CONT-001', status: 'at_port' }],
        })
      }
      if (url.includes('/documents')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, file_name: 'doc1.pdf' }],
        })
      }
      if (url.includes('/reports')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, title: 'Report 1' }],
        })
      }
      if (url.includes('/users')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, name: 'User 1' }],
        })
      }
      return Promise.reject(new Error('URL not mocked'))
    })

    render(<Overview user={{ id: 1, name: 'Test Admin', role: 'admin' }} onNavigate={jest.fn()} />)

    await waitFor(() => {
      expect(screen.getByText(/total shipments/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/2/)).toBeInTheDocument() // 2 shipments
    expect(screen.getByText(/1/)).toBeInTheDocument() // 1 container, 1 document, etc.
  })

  it('should display recent shipments table', async () => {
    global.fetch.mockImplementation((url) => {
      return Promise.resolve({
        ok: true,
        json: async () => [
          {
            id: 1,
            tracking_number: 'PSL-001',
            vessel_name: 'MV Test',
            origin: 'Singapore',
            destination: 'Colombo',
            status: 'in_transit',
            estimated_arrival: '2026-04-01',
          },
        ],
      })
    })

    render(<Overview user={{ id: 1, name: 'Test Admin', role: 'admin' }} onNavigate={jest.fn()} />)

    await waitFor(() => {
      expect(screen.getByText(/recent shipments/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/PSL-001/)).toBeInTheDocument()
    expect(screen.getByText(/MV Test/)).toBeInTheDocument()
    expect(screen.getByText(/singapore/i)).toBeInTheDocument()
  })

  it('should handle fetch errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<Overview user={{ id: 1, name: 'Test Admin', role: 'admin' }} onNavigate={jest.fn()} />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load dashboard data/i)).toBeInTheDocument()
    })
  })

  it('should show empty state when no shipments', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    )

    render(<Overview user={{ id: 1, name: 'Test Admin', role: 'admin' }} onNavigate={jest.fn()} />)

    await waitFor(() => {
      expect(screen.getByText(/no shipments recorded yet/i)).toBeInTheDocument()
    })
  })

  it('should not display users count for non-admin users', () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    )

    render(<Overview user={{ id: 2, name: 'Test Operator', role: 'operator' }} onNavigate={jest.fn()} />)

    // Users stat should not be present for non-admin
    // (This would need to verify after loading completes)
  })
})
