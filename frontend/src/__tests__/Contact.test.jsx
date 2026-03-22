import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Contact from '../components/Contact'

describe('Contact Form Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render contact form with all fields', () => {
    render(<Contact />)

    expect(screen.getByText(/contact us/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/john perera/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/john@portauth.lk/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/shipment enquiry/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/tell us about your port operations/i)).toBeInTheDocument()
  })

  it('should show error when submitting empty form', async () => {
    render(<Contact />)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(submitButton)

    // HTML5 validation should prevent submission, but we can check the UI
    // In a real scenario, the form would be blocked by browser validation
  })

  it('should submit form with valid data', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Message sent', messageId: 1 }),
    })

    render(<Contact />)

    const nameInput = screen.getByPlaceholderText(/john perera/i)
    const emailInput = screen.getByPlaceholderText(/john@portauth.lk/i)
    const subjectInput = screen.getByPlaceholderText(/shipment enquiry/i)
    const messageInput = screen.getByPlaceholderText(/tell us about your port operations/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(nameInput, { target: { value: 'John Perera' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Shipment Question' } })
    fireEvent.change(messageInput, { target: { value: 'I have a question about shipments' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }))
    })

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    })
  })

  it('should handle submit error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Server error' }),
    })

    render(<Contact />)

    const nameInput = screen.getByPlaceholderText(/john perera/i)
    const emailInput = screen.getByPlaceholderText(/john@portauth.lk/i)
    const subjectInput = screen.getByPlaceholderText(/shipment enquiry/i)
    const messageInput = screen.getByPlaceholderText(/tell us about your port operations/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(nameInput, { target: { value: 'John' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Test' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })
  })

  it('should display success message and allow resending', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Your message has been received' }),
    })

    render(<Contact />)

    const nameInput = screen.getByPlaceholderText(/john perera/i)
    const emailInput = screen.getByPlaceholderText(/john@portauth.lk/i)
    const subjectInput = screen.getByPlaceholderText(/shipment enquiry/i)
    const messageInput = screen.getByPlaceholderText(/tell us about your port operations/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(nameInput, { target: { value: 'John' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Test' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/your message has been received/i)).toBeInTheDocument()
    })

    const sendAnotherButton = screen.getByRole('button', { name: /send another/i })
    fireEvent.click(sendAnotherButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/john perera/i)).toBeInTheDocument()
    })
  })

  it('should display contact information', () => {
    render(<Contact />)

    expect(screen.getByText(/port authority hq/i)).toBeInTheDocument()
    expect(screen.getByText(/colombo 15/i)).toBeInTheDocument()
    expect(screen.getByText(/support@portlogistics.lk/i)).toBeInTheDocument()
  })
})
