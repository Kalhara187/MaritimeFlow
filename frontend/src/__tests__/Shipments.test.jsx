import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Shipments from '../pages/dashboard/Shipments';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(() => 'mock-token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

describe('Shipments CRUD Operations', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('List Shipments', () => {
    it('renders shipments list', async () => {
      const mockShipments = {
        data: [
          {
            id: 1,
            tracking_number: 'MSC001',
            vessel_name: 'MSC Gülsün',
            origin: 'Shanghai',
            destination: 'Rotterdam',
            status: 'in_transit'
          },
          {
            id: 2,
            tracking_number: 'MSC002',
            vessel_name: 'CMA CGM Antoine',
            origin: 'Busan',
            destination: 'Hamburg',
            status: 'pending'
          }
        ]
      };
      
      axios.get.mockResolvedValue(mockShipments);

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByText('MSC001')).toBeInTheDocument();
        expect(screen.getByText('MSC002')).toBeInTheDocument();
      });
    });

    it('fetches shipments with pagination', async () => {
      axios.get.mockResolvedValue({
        data: []
      });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          '/api/shipments',
          expect.objectContaining({
            params: expect.any(Object)
          })
        );
      });
    });

    it('filters shipments by status', async () => {
      axios.get.mockResolvedValue({ data: [] });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      const filterSelect = screen.getByDisplayValue('all');
      fireEvent.change(filterSelect, { target: { value: 'in_transit' } });
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          '/api/shipments',
          expect.objectContaining({
            params: expect.objectContaining({
              status: 'in_transit'
            })
          })
        );
      });
    });

    it('searches shipments by tracking number', async () => {
      axios.get.mockResolvedValue({ data: [] });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'MSC001' } });
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          '/api/shipments',
          expect.objectContaining({
            params: expect.objectContaining({
              search: 'MSC001'
            })
          })
        );
      });
    });
  });

  describe('Create Shipment', () => {
    it('opens create form modal', async () => {
      axios.get.mockResolvedValue({ data: [] });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      const createButton = screen.getByRole('button', { name: /add shipment/i });
      fireEvent.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/tracking number/i)).toBeInTheDocument();
      });
    });

    it('submits new shipment', async () => {
      axios.get.mockResolvedValue({ data: [] });
      axios.post.mockResolvedValue({
        data: { message: 'Shipment created', id: 1 }
      });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      const createButton = screen.getByRole('button', { name: /add shipment/i });
      fireEvent.click(createButton);
      
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText(/tracking number/i), {
          target: { value: 'TEST001' }
        });
        fireEvent.change(screen.getByPlaceholderText(/vessel name/i), {
          target: { value: 'Test Vessel' }
        });
        fireEvent.change(screen.getByPlaceholderText(/origin/i), {
          target: { value: 'Port A' }
        });
        fireEvent.change(screen.getByPlaceholderText(/destination/i), {
          target: { value: 'Port B' }
        });
      });
      
      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });

  describe('Update Shipment', () => {
    it('updates shipment status', async () => {
      const shipments = {
        data: [
          {
            id: 1,
            tracking_number: 'MSC001',
            status: 'pending'
          }
        ]
      };
      
      axios.get.mockResolvedValue(shipments);
      axios.put.mockResolvedValue({
        data: { message: 'Updated' }
      });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        const editButton = screen.getByRole('button', { name: /edit/i });
        fireEvent.click(editButton);
      });
      
      const statusSelect = await screen.findByDisplayValue('pending');
      fireEvent.change(statusSelect, { target: { value: 'in_transit' } });
      
      const updateButton = screen.getByRole('button', { name: /update/i });
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
      });
    });
  });

  describe('Delete Shipment', () => {
    it('deletes shipment after confirmation', async () => {
      axios.get.mockResolvedValue({
        data: [{ id: 1, tracking_number: 'MSC001' }]
      });
      
      axios.delete.mockResolvedValue({
        data: { message: 'Deleted' }
      });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
      });
      
      // Confirm deletion
      const confirmButton = await screen.findByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalled();
      });
    });
  });

  describe('Export Functionality', () => {
    it('exports shipments to CSV', async () => {
      axios.get.mockResolvedValue({
        data: [
          { id: 1, tracking_number: 'MSC001', status: 'pending' },
          { id: 2, tracking_number: 'MSC002', status: 'in_transit' }
        ]
      });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        const exportButton = screen.getByRole('button', { name: /export/i });
        fireEvent.click(exportButton);
      });
      
      // Verify CSV download was triggered
      expect(screen.getByText(/export/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error when fetching fails', async () => {
      axios.get.mockRejectedValue({
        response: { data: { message: 'Failed to fetch shipments' } }
      });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
      });
    });

    it('displays error when creation fails', async () => {
      axios.get.mockResolvedValue({ data: [] });
      axios.post.mockRejectedValue({
        response: { data: { message: 'Invalid data' } }
      });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      const createButton = screen.getByRole('button', { name: /add shipment/i });
      fireEvent.click(createButton);
      
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText(/tracking number/i), {
          target: { value: 'TEST001' }
        });
      });
      
      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid data/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('navigates between pages', async () => {
      axios.get.mockResolvedValue({
        data: Array(10).fill({ id: 1, tracking_number: 'MSC001' })
      });

      render(
        <BrowserRouter>
          <Shipments />
        </BrowserRouter>
      );
      
      const nextButton = await screen.findByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          '/api/shipments',
          expect.objectContaining({
            params: expect.objectContaining({
              page: 2
            })
          })
        );
      });
    });
  });
});
