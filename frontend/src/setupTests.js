import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Polyfills for react-router/jsdom in Jest.
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
}

if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = jest.fn()
}

// Mock fetch for API calls
global.fetch = jest.fn()
