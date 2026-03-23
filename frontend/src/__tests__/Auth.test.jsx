import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Authentication Flows', () => {
  
  describe('Login Component', () => {
    it('renders login form', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('validates email format', async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByPlaceholderText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('submits login form with valid credentials', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: 1, email: 'test@example.com', role: 'admin' }
        }
      };
      axios.post.mockResolvedValue(mockResponse);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'Password123!' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/api/auth/login',
          expect.objectContaining({
            email: 'test@example.com',
            password: 'Password123!'
          })
        );
      });
    });

    it('displays error on failed login', async () => {
      axios.post.mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } }
      });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'wrongpassword' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Component', () => {
    it('renders registration form', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/^password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('validates password strength', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const passwordInput = screen.getByPlaceholderText(/^password/i);
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('submits registration with valid data', async () => {
      const mockResponse = {
        data: { message: 'Registration successful', user: { id: 1 } }
      };
      axios.post.mockResolvedValue(mockResponse);

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      fireEvent.change(screen.getByPlaceholderText(/name/i), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/^password/i), {
        target: { value: 'SecurePass123!' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/api/auth/register',
          expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'SecurePass123!'
          })
        );
      });
    });
  });

  describe('Forgot Password Component', () => {
    it('renders forgot password form', () => {
      render(
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      );
      
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send reset/i })).toBeInTheDocument();
    });

    it('submits reset email request', async () => {
      axios.post.mockResolvedValue({
        data: { message: 'Reset link sent to your email' }
      });

      render(
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      );
      
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /send reset/i }));
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/api/auth/forgot-password',
          expect.objectContaining({
            email: 'test@example.com'
          })
        );
      });
    });

    it('displays success message on email sent', async () => {
      axios.post.mockResolvedValue({
        data: { message: 'Reset link sent' }
      });

      render(
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      );
      
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /send reset/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/reset link sent/i)).toBeInTheDocument();
      });
    });
  });
});
