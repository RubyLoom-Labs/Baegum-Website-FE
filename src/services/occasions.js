/**
 * Occasions Service
 * Handles occasions API calls
 */

import { get } from './api';

/**
 * Get first page occasions
 * GET /api/occasions/first-page
 * @returns {Promise} Response with occasions data
 */
export function getFirstPageOccasions() {
  return get('/api/occasions/first-page');
}

/**
 * Get products by occasion ID
 * GET /api/occasions/:id/products
 * @param {number} occasionId - The occasion ID
 * @param {number} limit - Number of products to fetch (default: 5)
 * @returns {Promise} Response with products for the occasion
 */
export function getProductsByOccasionId(occasionId, limit = 5) {
  return get(`/api/occasions/${occasionId}/products?limit=${limit}`);
}
