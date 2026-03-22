import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Login from '../pages/Login'

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: {} }),
}))

describe('Login Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    localStorage.clear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form', () => {
    render(<Login />)
    
    expect(screen.getByText('PortSync Lanka')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@portsync.lk/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  it('should show error when fields are empty', async () => {
    render(<Login />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    })
  })

  it('should show error on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    })

    render(<Login />)

    const emailInput = screen.getByPlaceholderText(/you@portsync.lk/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should store token on successful login', async () => {
    const mockToken = 'test_token_123'
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', role: 'admin' }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken, user: mockUser }),
    })

    render(<Login />)

    const emailInput = screen.getByPlaceholderText(/you@portsync.lk/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken)
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_user', JSON.stringify(mockUser))
    })
  })

  it('should toggle password visibility', () => {
    render(<Login />)

    const passwordInput = screen.getByPlaceholderText(/••••••••/i)
    const toggleButton = screen.getByRole('button', {
      name: /eye|eye off/i,
    }).closest('button')

    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should have link to forgot password', () => {
    render(<Login />)
    
    const forgotLink = screen.getByRole('link', { name: /forgot password/i })
    expect(forgotLink).toHaveAttribute('href', '/forgot-password')
  })

  it('should have link to register', () => {
    render(<Login />)
    
    const registerLink = screen.getByRole('link', { name: /register/i })
    expect(registerLink).toHaveAttribute('href', '/register')
  })
})
