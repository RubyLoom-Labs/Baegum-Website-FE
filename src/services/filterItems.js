import api from './api'
import { getCookie } from '@/utils/cookies'

export const getItems = async (endpoint) => {
  const response = await api.get(endpoint)
  return response;
}

/**
 * Get items with explicit bearer token authentication
 * Used for endpoints that require authenticated requests
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response data
 */
export const getItemsWithAuth = async (endpoint) => {
  const token = getCookie('authToken');
  
  // If no token, fall back to regular getItems which will attempt without auth
  if (!token) {
    return getItems(endpoint);
  }

  // Make the request with explicit Authorization header
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.trim()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
