/**
 * Wishlist Service
 * Handles wishlist-related API calls (add, remove, get items)
 */

import { get, post, deleteRequest } from './api';

/**
 * Get user's wishlist items
 * GET /api/users/wishlist
 * @returns {Promise} Array of wishlist items
 */
export function getWishlistItems() {
  return get('/api/users/wishlist');
}

/**
 * Add product to user's wishlist
 * POST /api/users/wishlist
 * @param {number|string} productId - Product ID to add
 * @returns {Promise} Created wishlist item
 */
export function addToWishlist(productId) {
  return post('/api/users/wishlist', { product_id: productId });
}

/**
 * Remove product from user's wishlist
 * DELETE /api/users/wishlist/:productId
 * @param {number|string} productId - Product ID to remove
 * @returns {Promise} Success response
 */
export function removeFromWishlist(productId) {
  return deleteRequest(`/api/users/wishlist/${productId}`);
}
