import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import ProtectedRoute from '../components/ProtectedRoute'

// Mock component to render inside ProtectedRoute
const MockComponent = () => <div>Protected Content</div>

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render children when user is authenticated', () => {
    localStorage.getItem = jest.fn((key) => {
      if (key === 'auth_token') return 'test_token_123'
      return null
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect to login when user is not authenticated', () => {
    localStorage.getItem = jest.fn(() => null)

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </BrowserRouter>
    )

    // When redirected, the protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should redirect when auth_token is missing', () => {
    localStorage.getItem = jest.fn(() => null)

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should work with empty string token (not authenticated)', () => {
    localStorage.getItem = jest.fn(() => '')

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
