/**
 * API Service
 * Centralized place for all API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

/**
 * Get authorization token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT,
  }

  // Add authorization token if available
  const token = getAuthToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

/**
 * GET request
 */
export function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' })
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
export function deleteRequest(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' })
}

export default {
  get,
  post,
  put,
  deleteRequest,
}
