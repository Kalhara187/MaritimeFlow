import '@testing-library/jest-dom'

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Mock window.location.href
delete window.location
window.location = { href: '' }

// Mock fetch for API calls
global.fetch = jest.fn()
