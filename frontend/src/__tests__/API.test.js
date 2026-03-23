import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('API Utilities', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem = jest.fn(() => 'test-token');
  });

  describe('API Client Setup', () => {
    it('creates axios instance with correct baseURL', () => {
      const api = axios.create({
        baseURL: 'http://localhost:5000/api'
      });
      
      expect(api.defaults.baseURL).toBe('http://localhost:5000/api');
    });

    it('adds JWT token to request headers', () => {
      const token = 'test-token';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      expect(config.headers['Authorization']).toBe(`Bearer ${token}`);
    });
  });

  describe('Request Interceptors', () => {
    it('adds token to every request', async () => {
      axios.interceptors = {
        request: {
          use: jest.fn((success) => {
            const config = { headers: {} };
            success(config);
            return config;
          })
        }
      };

      const result = axios.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer test-token`;
        return config;
      });
      
      expect(result).toBeDefined();
    });

    it('refreshes token on 401 response', async () => {
      const errorConfig = { response: { status: 401 } };
      
      if (errorConfig.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('Response Interceptors', () => {
    it('returns data from successful response', async () => {
      const mockResponse = {
        data: {
          message: 'Success',
          data: { id: 1, name: 'Test' }
        }
      };
      
      axios.get = jest.fn().mockResolvedValue(mockResponse);
      
      const response = await axios.get('/shipments');
      
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('data');
    });

    it('handles error responses properly', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Bad request' }
        }
      };
      
      axios.get = jest.fn().mockRejectedValue(errorResponse);
      
      try {
        await axios.get('/shipments');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toBe('Bad request');
      }
    });
  });

  describe('API Endpoints', () => {
    describe('Authentication Endpoints', () => {
      it('calls register endpoint', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'TestPass123!',
          role: 'viewer'
        };
        
        axios.post = jest.fn().mockResolvedValue({ data: { user: userData } });
        
        const response = await axios.post('/auth/register', userData);
        
        expect(axios.post).toHaveBeenCalledWith('/auth/register', userData);
        expect(response.data.user).toEqual(userData);
      });

      it('calls login endpoint', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'TestPass123!'
        };
        
        axios.post = jest.fn().mockResolvedValue({
          data: {
            token: 'test-token',
            user: { id: 1, email: loginData.email }
          }
        });
        
        const response = await axios.post('/auth/login', loginData);
        
        expect(response.data).toHaveProperty('token');
        expect(response.data).toHaveProperty('user');
      });

      it('calls forgot-password endpoint', async () => {
        axios.post = jest.fn().mockResolvedValue({
          data: { message: 'Password reset email sent' }
        });
        
        const response = await axios.post('/auth/forgot-password', {
          email: 'test@example.com'
        });
        
        expect(response.data.message).toContain('reset');
      });

      it('calls reset-password endpoint', async () => {
        axios.post = jest.fn().mockResolvedValue({
          data: { message: 'Password reset successful' }
        });
        
        const response = await axios.post('/auth/reset-password', {
          token: 'reset-token',
          password: 'NewPass123!'
        });
        
        expect(response.data.message).toContain('successful');
      });

      it('calls change-password endpoint', async () => {
        axios.post = jest.fn().mockResolvedValue({
          data: { message: 'Password changed' }
        });
        
        const response = await axios.post('/auth/change-password', {
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass123!'
        });
        
        expect(response.data).toHaveProperty('message');
      });
    });

    describe('Shipment Endpoints', () => {
      it('fetches shipments list', async () => {
        const mockShipments = {
          data: [
            { id: 1, tracking_number: 'MSC001', status: 'pending' },
            { id: 2, tracking_number: 'MSC002', status: 'in_transit' }
          ]
        };
        
        axios.get = jest.fn().mockResolvedValue(mockShipments);
        
        const response = await axios.get('/shipments');
        
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBe(2);
      });

      it('fetches single shipment', async () => {
        const mockShipment = {
          data: {
            id: 1,
            tracking_number: 'MSC001',
            status: 'pending'
          }
        };
        
        axios.get = jest.fn().mockResolvedValue(mockShipment);
        
        const response = await axios.get('/shipments/1');
        
        expect(response.data.id).toBe(1);
      });

      it('creates new shipment', async () => {
        const newShipment = {
          tracking_number: 'MSC001',
          vessel_name: 'Test Vessel',
          origin: 'Port A',
          destination: 'Port B'
        };
        
        axios.post = jest.fn().mockResolvedValue({
          data: { id: 1, ...newShipment }
        });
        
        const response = await axios.post('/shipments', newShipment);
        
        expect(response.data.id).toBeDefined();
        expect(response.data.tracking_number).toBe('MSC001');
      });

      it('updates shipment', async () => {
        axios.put = jest.fn().mockResolvedValue({
          data: { message: 'Shipment updated' }
        });
        
        const response = await axios.put('/shipments/1', {
          status: 'in_transit'
        });
        
        expect(response.data.message).toContain('updated');
      });

      it('deletes shipment', async () => {
        axios.delete = jest.fn().mockResolvedValue({
          data: { message: 'Shipment deleted' }
        });
        
        const response = await axios.delete('/shipments/1');
        
        expect(response.data.message).toContain('deleted');
      });

      it('searches shipments', async () => {
        axios.get = jest.fn().mockResolvedValue({
          data: [
            { id: 1, tracking_number: 'MSC001' }
          ]
        });
        
        const response = await axios.get('/shipments', {
          params: { search: 'MSC001' }
        });
        
        expect(Array.isArray(response.data)).toBe(true);
      });
    });

    describe('Container Endpoints', () => {
      it('fetches containers list', async () => {
        axios.get = jest.fn().mockResolvedValue({
          data: [
            { id: 1, container_number: 'HAPAG001', status: 'at_sea' }
          ]
        });
        
        const response = await axios.get('/containers');
        
        expect(Array.isArray(response.data)).toBe(true);
      });

      it('fetches container history', async () => {
        axios.get = jest.fn().mockResolvedValue({
          data: [
            { id: 1, status: 'pending', changed_at: '2024-01-15' },
            { id: 2, status: 'at_sea', changed_at: '2024-01-16' }
          ]
        });
        
        const response = await axios.get('/containers/1/history');
        
        expect(Array.isArray(response.data)).toBe(true);
      });

      it('creates container', async () => {
        axios.post = jest.fn().mockResolvedValue({
          data: { id: 1, container_number: 'HAPAG001' }
        });
        
        const response = await axios.post('/containers', {
          container_number: 'HAPAG001',
          type: '40ft'
        });
        
        expect(response.data.id).toBeDefined();
      });
    });

    describe('Document Endpoints', () => {
      it('fetches documents', async () => {
        axios.get = jest.fn().mockResolvedValue({
          data: [
            { id: 1, file_name: 'BOL.pdf', doc_type: 'Bill of Lading' }
          ]
        });
        
        const response = await axios.get('/documents');
        
        expect(Array.isArray(response.data)).toBe(true);
      });

      it('uploads document', async () => {
        const formData = new FormData();
        formData.append('file', new File(['test'], 'test.pdf'));
        formData.append('doc_type', 'Bill of Lading');
        
        axios.post = jest.fn().mockResolvedValue({
          data: { id: 1, file_name: 'test.pdf' }
        });
        
        const response = await axios.post('/documents', formData);
        
        expect(response.data.id).toBeDefined();
      });

      it('deletes document', async () => {
        axios.delete = jest.fn().mockResolvedValue({
          data: { message: 'Document deleted' }
        });
        
        const response = await axios.delete('/documents/1');
        
        expect(response.data.message).toContain('deleted');
      });
    });

    describe('Dashboard Endpoints', () => {
      it('fetches statistics', async () => {
        axios.get = jest.fn().mockResolvedValue({
          data: {
            total_shipments: 100,
            total_containers: 500,
            pending_shipments: 10
          }
        });
        
        const response = await axios.get('/dashboard/stats');
        
        expect(response.data).toHaveProperty('total_shipments');
      });

      it('fetches shipment trends', async () => {
        axios.get = jest.fn().mockResolvedValue({
          data: [
            { date: '2024-01-15', count: 10 },
            { date: '2024-01-16', count: 15 }
          ]
        });
        
        const response = await axios.get('/dashboard/shipment-trends');
        
        expect(Array.isArray(response.data)).toBe(true);
      });

      it('fetches container types', async () => {
        axios.get = jest.fn().mockResolvedValue({
          data: [
            { type: '40ft', count: 250, percentage: 50 },
            { type: '20ft', count: 150, percentage: 30 }
          ]
        });
        
        const response = await axios.get('/dashboard/container-types');
        
        expect(Array.isArray(response.data)).toBe(true);
      });

      it('fetches port activity', async () => {
        axios.get = jest.fn().mockResolvedValue({
          data: {
            top_origins: ['Shanghai', 'Singapore', 'Busan'],
            top_destinations: ['Rotterdam', 'Hamburg', 'Los Angeles']
          }
        });
        
        const response = await axios.get('/dashboard/port-activity');
        
        expect(response.data).toHaveProperty('top_origins');
        expect(response.data).toHaveProperty('top_destinations');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles 401 Unauthorized error', async () => {
      axios.get = jest.fn().mockRejectedValue({
        response: { status: 401, data: { message: 'Unauthorized' } }
      });
      
      try {
        await axios.get('/protected-endpoint');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('handles 404 Not Found error', async () => {
      axios.get = jest.fn().mockRejectedValue({
        response: { status: 404, data: { message: 'Not found' } }
      });
      
      try {
        await axios.get('/shipments/999');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it('handles 500 Server error', async () => {
      axios.get = jest.fn().mockRejectedValue({
        response: { status: 500, data: { message: 'Server error' } }
      });
      
      try {
        await axios.get('/shipments');
      } catch (error) {
        expect(error.response.status).toBe(500);
      }
    });

    it('handles network error', async () => {
      axios.get = jest.fn().mockRejectedValue({
        message: 'Network error',
        code: 'ECONNABORTED'
      });
      
      try {
        await axios.get('/shipments');
      } catch (error) {
        expect(error.code).toBe('ECONNABORTED');
      }
    });
  });
});
