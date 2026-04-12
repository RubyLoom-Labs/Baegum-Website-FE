/**
 * API Service
 * Centralized place for all API calls
 */

import { getCookie } from '@/utils/cookies';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

/**
 * Get authorization token from cookie
 */
function getAuthToken() {
  return getCookie('authToken');
}

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(status, statusText, data) {
    const message = getErrorMessage(status, statusText, data);
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Get user-friendly error message based on status code and response data
 */
function getErrorMessage(status, statusText, data) {
  // Try to get message from response data first
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (data?.errors && typeof data.errors === 'object') {
    const firstError = Object.values(data.errors)[0];
    if (typeof firstError === 'string') return firstError;
    if (Array.isArray(firstError) && firstError.length > 0) return firstError[0];
  }

  // Fall back to status-based messages
  switch (status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return "Invalid credentials. Please try again.";
    case 403:
      return "Access denied. You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "This email is already registered. Please try logging in.";
    case 422:
      return "Validation error. Please check your input.";
    case 429:
      return "Too many attempts. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    case 502:
    case 503:
    case 504:
      return "Server is temporarily unavailable. Please try again later.";
    default:
      return `${statusText || 'Error'} - Please try again.`;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const defaultOptions = {
    headers: {},
    timeout: API_TIMEOUT,
  }

  // Only set Content-Type if not a FormData request
  if (!options.skipContentType) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }

  // Add authorization token if available
  const token = getAuthToken();
  if (token) {
    const trimmedToken = token.trim();
    defaultOptions.headers.Authorization = `Bearer ${trimmedToken}`;

    // Debug logging
    console.log('🔐 API Request Debug:', {
      endpoint,
      tokenLength: trimmedToken.length,
      tokenStart: trimmedToken.substring(0, 20) + '...',
      hasToken: !!trimmedToken
    });
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new APIError(response.status, response.statusText, data);
      console.error('API Error:', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        responseData: error.data
      });
      throw error;
    }

    return data;
  } catch (error) {
    // If it's an APIError, preserve its message
    if (error instanceof APIError) {
      console.error('API Error caught:', error.message);
      throw error;
    }

    // For other errors, wrap them with a user-friendly message
    console.error('Request Error:', error);
    throw new Error(error.message || 'Something went wrong. Please try again.');
  }
}

/**
 * GET request
 */
export function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' })
}

/**
 * POST request with FormData (for file uploads)
 */
export function postFormData(endpoint, formData) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: formData,
    skipContentType: true, // Tell apiRequest not to set Content-Type
  })
}

/**
 * POST request
 */
export function post(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * PUT request
 */
export function put(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * DELETE request
 */
export function deleteRequest(endpoint, data) {
  const options = { method: 'DELETE' };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return apiRequest(endpoint, options);
}

export default {
  get,
  post,
  postFormData,
  put,
  deleteRequest,
}
