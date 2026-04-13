/**
 * Promo Service
 * Handles promotional banner API calls
 */

import { get } from './api';

/**
 * Get all promotional banners
 * GET /api/promos
 * @returns {Promise} Array of promo banners
 */
export function getPromos() {
  return get('/api/promo-banners');
}
