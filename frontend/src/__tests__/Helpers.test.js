import {
  formatDate,
  getStatusColor,
  formatFileSize,
  validateEmail,
  validatePassword,
  truncate,
  exportToCSV,
  getInitials,
  isStrongPassword,
  capitalizeWords,
  calculateDaysSince
} from '../utils/helpers';

describe('Helper Functions', () => {
  
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('handles string date input', () => {
      const result = formatDate('2024-01-15');
      
      expect(result).not.toBeNull();
      expect(result).toBeTruthy();
    });

    it('returns formatted date with time', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDate(date);
      
      expect(result).toContain('2024');
    });
  });

  describe('getStatusColor', () => {
    it('returns green for delivered status', () => {
      const color = getStatusColor('delivered');
      
      expect(color).toBe('bg-green-100');
    });

    it('returns yellow for pending status', () => {
      const color = getStatusColor('pending');
      
      expect(color).toBe('bg-yellow-100');
    });

    it('returns blue for in_transit status', () => {
      const color = getStatusColor('in_transit');
      
      expect(color).toBe('bg-blue-100');
    });

    it('returns red for cancelled status', () => {
      const color = getStatusColor('cancelled');
      
      expect(color).toBe('bg-red-100');
    });

    it('returns gray for unknown status', () => {
      const color = getStatusColor('unknown');
      
      expect(color).toBe('bg-gray-100');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('handles zero bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('rounds file size appropriately', () => {
      const result = formatFileSize(1536); // 1.5 KB
      
      expect(result).toContain('KB');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email format', () => {
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('rejects empty email', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('accepts strong password', () => {
      expect(validatePassword('SecurePass123!')).toBe(true);
      expect(validatePassword('MyP@ss2024')).toBe(true);
    });

    it('rejects password without uppercase', () => {
      expect(validatePassword('securepass123!')).toBe(false);
    });

    it('rejects password without lowercase', () => {
      expect(validatePassword('SECUREPASS123!')).toBe(false);
    });

    it('rejects password without numbers', () => {
      expect(validatePassword('SecurePass!')).toBe(false);
    });

    it('rejects password without special characters', () => {
      expect(validatePassword('SecurePass123')).toBe(false);
    });

    it('rejects short password', () => {
      expect(validatePassword('Pass1!')).toBe(false);
    });

    it('rejects empty password', () => {
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('truncate', () => {
    it('truncates long string', () => {
      const result = truncate('This is a very long string', 10);
      
      expect(result).toBe('This is a ...');
      expect(result.length).toBeLessThanOrEqual(13);
    });

    it('returns original string if shorter than limit', () => {
      const text = 'Short';
      const result = truncate(text, 10);
      
      expect(result).toBe(text);
    });

    it('handles custom ellipsis', () => {
      const result = truncate('Long string here', 8, '...');
      
      expect(result).toContain('...');
    });
  });

  describe('exportToCSV', () => {
    it('creates CSV from array of objects', () => {
      const data = [
        { id: 1, name: 'Item 1', status: 'active' },
        { id: 2, name: 'Item 2', status: 'inactive' }
      ];
      
      const csv = exportToCSV(data);
      
      expect(csv).toContain('id');
      expect(csv).toContain('name');
      expect(csv).toContain('status');
      expect(csv).toContain('1');
      expect(csv).toContain('Item 1');
    });

    it('handles array with empty data', () => {
      const data = [];
      const csv = exportToCSV(data);
      
      expect(csv).toBeDefined();
    });

    it('escapes special characters in CSV', () => {
      const data = [
        { id: 1, description: 'Contains, comma and "quotes"' }
      ];
      
      const csv = exportToCSV(data);
      
      expect(csv).toContain('"');
    });
  });

  describe('getInitials', () => {
    it('returns initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith')).toBe('JS');
    });

    it('handles single name', () => {
      const result = getInitials('John');
      
      expect(result).toBe('J');
    });

    it('handles empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('returns uppercase initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  describe('isStrongPassword', () => {
    it('returns true for strong passwords', () => {
      expect(isStrongPassword('SecurePass123!')).toBe(true);
      expect(isStrongPassword('MyP@ssw0rd')).toBe(true);
    });

    it('returns false for weak passwords', () => {
      expect(isStrongPassword('weak')).toBe(false);
      expect(isStrongPassword('123456')).toBe(false);
      expect(isStrongPassword('password')).toBe(false);
    });

    it('checks password criteria', () => {
      const weakPassword = 'OnlyUpper';
      const strongPassword = 'Upper123!';
      
      expect(isStrongPassword(weakPassword)).toBe(false);
      expect(isStrongPassword(strongPassword)).toBe(true);
    });
  });

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('john doe')).toBe('John Doe');
      expect(capitalizeWords('hello world test')).toBe('Hello World Test');
    });

    it('handles already capitalized text', () => {
      expect(capitalizeWords('John Doe')).toBe('John Doe');
    });

    it('handles single word', () => {
      expect(capitalizeWords('john')).toBe('John');
    });

    it('handles empty string', () => {
      expect(capitalizeWords('')).toBe('');
    });
  });

  describe('calculateDaysSince', () => {
    it('calculates days since date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      const result = calculateDaysSince(pastDate);
      
      expect(result).toBe(5);
    });

    it('returns 0 for today', () => {
      const today = new Date();
      const result = calculateDaysSince(today);
      
      expect(result).toBe(0);
    });

    it('handles future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      
      const result = calculateDaysSince(futureDate);
      
      expect(result).toBeLessThan(0);
    });

    it('handles string dates', () => {
      const pastDate = new Date('2024-01-10');
      const result = calculateDaysSince(pastDate);
      
      expect(typeof result).toBe('number');
    });
  });

  describe('Helper functions edge cases', () => {
    it('validateEmail rejects null', () => {
      expect(validateEmail(null)).toBe(false);
    });

    it('validatePassword handles null', () => {
      expect(validatePassword(null)).toBe(false);
    });

    it('truncate handles null string', () => {
      expect(truncate(null, 10)).toBe(null);
    });

    it('getInitials handles null', () => {
      expect(getInitials(null)).toBe('');
    });

    it('formatFileSize handles negative bytes', () => {
      const result = formatFileSize(-1024);
      expect(result).toContain('B') || expect(result).toContain('KB');
    });
  });

  describe('Helper functions integration', () => {
    it('combines date formatting with day calculation', () => {
      const pastDate = new Date('2024-01-10');
      const formatted = formatDate(pastDate);
      const daysSince = calculateDaysSince(pastDate);
      
      expect(formatted).toBeTruthy();
      expect(typeof daysSince).toBe('number');
    });

    it('validates and capitalizes user name', () => {
      const userEmail = 'john@example.com';
      const isValid = validateEmail(userEmail);
      
      const initials = getInitials('John Doe');
      
      expect(isValid).toBe(true);
      expect(initials).toBe('JD');
    });

    it('exports data with formatted fields', () => {
      const data = [
        { id: 1, name: 'john doe', status: 'pending', size: 1024 }
      ];
      
      const csv = exportToCSV(data);
      
      expect(csv).toContain('1');
      expect(csv).toContain('john doe');
    });
  });
});
