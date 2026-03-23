import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Features from '../components/Features';
import UIComponents from '../utils/UIComponents';

describe('UI Components', () => {
  
  describe('Navbar Component', () => {
    it('renders navigation links', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/home/i)).toBeInTheDocument();
      expect(screen.getByText(/features/i)).toBeInTheDocument();
      expect(screen.getByText(/about/i)).toBeInTheDocument();
      expect(screen.getByText(/contact/i)).toBeInTheDocument();
    });

    it('displays login button for unauthenticated users', () => {
      localStorage.getItem = jest.fn(() => null);
      
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );
      
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('displays logout button for authenticated users', () => {
      localStorage.getItem = jest.fn(() => 'test-token');
      
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );
      
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('navigates to login on login button click', () => {
      localStorage.getItem = jest.fn(() => null);
      
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);
      
      expect(window.location.pathname).not.toBe('/');
    });
  });

  describe('Footer Component', () => {
    it('renders footer content', () => {
      render(
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/maritimeflow/i)).toBeInTheDocument();
      expect(screen.getByText(/copyright/i)).toBeInTheDocument();
    });

    it('renders social media links', () => {
      render(
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      );
      
      const socialLinks = screen.getAllByRole('link');
      expect(socialLinks.length).toBeGreaterThan(0);
    });

    it('renders footer links', () => {
      render(
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/privacy/i)).toBeInTheDocument();
      expect(screen.getByText(/terms/i)).toBeInTheDocument();
    });
  });

  describe('Hero Component', () => {
    it('renders hero content', () => {
      render(
        <BrowserRouter>
          <Hero />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/maritime/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });

    it('displays call-to-action button', () => {
      render(
        <BrowserRouter>
          <Hero />
        </BrowserRouter>
      );
      
      const ctaButton = screen.getByRole('button', { name: /get started/i });
      expect(ctaButton).toBeInTheDocument();
    });
  });

  describe('Features Component', () => {
    it('renders feature cards', () => {
      render(
        <BrowserRouter>
          <Features />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/real-time tracking/i)).toBeInTheDocument();
      expect(screen.getByText(/advanced analytics/i)).toBeInTheDocument();
    });

    it('displays feature descriptions', () => {
      render(
        <BrowserRouter>
          <Features />
        </BrowserRouter>
      );
      
      const descriptions = screen.getAllByText(/provides|enables|supports/i);
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe('UIComponents Library', () => {
    it('renders LoadingSpinner', () => {
      const { LoadingSpinner } = UIComponents;
      render(<LoadingSpinner />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('renders Badge with correct variant', () => {
      const { Badge } = UIComponents;
      
      const { rerender } = render(
        <Badge variant="success">Success</Badge>
      );
      
      expect(screen.getByText('Success')).toHaveClass('bg-green-100');
      
      rerender(<Badge variant="error">Error</Badge>);
      expect(screen.getByText('Error')).toHaveClass('bg-red-100');
    });

    it('renders Button with correct variant', () => {
      const { Button } = UIComponents;
      const handleClick = jest.fn();
      
      render(
        <Button onClick={handleClick} variant="primary">
          Click me
        </Button>
      );
      
      const button = screen.getByRole('button', { name: /click me/i });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalled();
      expect(button).toHaveClass('bg-blue-600');
    });

    it('renders Modal and closes on backdrop click', () => {
      const { Modal } = UIComponents;
      const handleClose = jest.fn();
      
      render(
        <Modal isOpen={true} onClose={handleClose}>
          Modal Content
        </Modal>
      );
      
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
      
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      
      expect(handleClose).toHaveBeenCalled();
    });

    it('renders Alert with correct type', () => {
      const { Alert } = UIComponents;
      
      const { rerender } = render(
        <Alert type="info">Info message</Alert>
      );
      
      expect(screen.getByText('Info message')).toBeInTheDocument();
      
      rerender(<Alert type="warning">Warning message</Alert>);
      expect(screen.getByText('Warning message')).toHaveClass('bg-yellow-50');
    });

    it('renders FormInput with validation', () => {
      const { FormInput } = UIComponents;
      
      render(
        <FormInput
          label="Email"
          type="email"
          placeholder="Enter email"
          error="Invalid email"
        />
      );
      
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('renders Card component', () => {
      const { Card } = UIComponents;
      
      render(
        <Card>
          <div>Card content</div>
        </Card>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders Tabs component', () => {
      const { Tabs } = UIComponents;
      
      render(
        <Tabs
          tabs={[
            { label: 'Tab 1', content: 'Content 1' },
            { label: 'Tab 2', content: 'Content 2' }
          ]}
        />
      );
      
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });

    it('renders Dropdown menu', () => {
      const { Dropdown } = UIComponents;
      const handleSelect = jest.fn();
      
      render(
        <Dropdown
          items={[
            { label: 'Option 1', value: 'opt1' },
            { label: 'Option 2', value: 'opt2' }
          ]}
          onSelect={handleSelect}
        />
      );
      
      const option = screen.getByText('Option 1');
      fireEvent.click(option);
      
      expect(handleSelect).toHaveBeenCalledWith('opt1');
    });
  });

  describe('Component Accessibility', () => {
    it('Navbar has proper ARIA labels', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('Button components have proper text', () => {
      render(
        <BrowserRouter>
          <Hero />
        </BrowserRouter>
      );
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.textContent).not.toBe('');
      });
    });

    it('Modal closes with Escape key', () => {
      const { Modal } = UIComponents;
      const handleClose = jest.fn();
      
      render(
        <Modal isOpen={true} onClose={handleClose}>
          Modal Content
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Component Styling', () => {
    it('Badge applies correct color classes', () => {
      const { Badge } = UIComponents;
      
      const testVariants = ['success', 'error', 'warning', 'info'];
      
      testVariants.forEach(variant => {
        const { unmount } = render(
          <Badge variant={variant}>Test</Badge>
        );
        
        const badge = screen.getByText('Test');
        expect(badge).toHaveClass(`bg-${
          variant === 'success' ? 'green' :
          variant === 'error' ? 'red' :
          variant === 'warning' ? 'yellow' :
          'blue'
        }-100`);
        
        unmount();
      });
    });

    it('Button applies correct size classes', () => {
      const { Button } = UIComponents;
      
      render(
        <Button size="sm">Small</Button>
      );
      expect(screen.getByText('Small')).toHaveClass('px-3', 'py-1', 'text-sm');
      
      const { unmount } = render(
        <Button size="lg">Large</Button>
      );
      expect(screen.getByText('Large')).toHaveClass('px-6', 'py-3', 'text-lg');
      unmount();
    });
  });
});
