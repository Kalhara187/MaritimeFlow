/**
 * Validation utilities for request inputs
 */

/**
 * Validates email format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates password strength
 * @param {string} password
 * @returns {object} { valid: boolean, message: string }
 */
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters long.',
    };
  }
  return { valid: true, message: '' };
};

/**
 * Validates required fields
 * @param {object} data
 * @param {string[]} requiredFields
 * @returns {object} { valid: boolean, message: string }
 */
const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter((field) => !data[field]);
  if (missing.length > 0) {
    return {
      valid: false,
      message: `Required fields missing: ${missing.join(', ')}`,
    };
  }
  return { valid: true, message: '' };
};

/**
 * Validates string length
 * @param {string} value
 * @param {number} maxLength
 * @returns {boolean}
 */
const isValidLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

/**
 * Validates shipment status
 * @param {string} status
 * @returns {boolean}
 */
const isValidShipmentStatus = (status) => {
  const validStatuses = ['pending', 'in_transit', 'arrived', 'delivered', 'cancelled'];
  return validStatuses.includes(status);
};

/**
 * Validates container status
 * @param {string} status
 * @returns {boolean}
 */
const isValidContainerStatus = (status) => {
  const validStatuses = ['at_sea', 'at_port', 'under_inspection', 'cleared', 'released'];
  return validStatuses.includes(status);
};

/**
 * Sanitizes input string - removes leading/trailing whitespace
 * @param {string} input
 * @returns {string}
 */
const sanitizeString = (input) => {
  return typeof input === 'string' ? input.trim() : '';
};

module.exports = {
  isValidEmail,
  validatePassword,
  validateRequiredFields,
  isValidLength,
  isValidShipmentStatus,
  isValidContainerStatus,
  sanitizeString,
};
