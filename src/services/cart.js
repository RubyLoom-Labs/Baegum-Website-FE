/**
 * Cart Service
 * Handles cart-related API calls (get cart, add items, remove items, etc.)
 */

import { get, post, put, deleteRequest } from './api';

/**
 * Get user's current cart items
 * GET /api/users/cart-items
 * @returns {Promise} Array of cart items with cart IDs
 */
export function getCartItems() {
  return get('/api/users/cart-items');
}

/**
 * Add item to user's cart
 * POST /api/users/cart-items
 * @param {object} cartItemData - Cart item details (product_id, quantity, variant, price, etc.)
 * @returns {Promise} Created cart item
 */
export function addToCart(cartItemData) {
  return post('/api/users/cart-items', cartItemData);
}

/**
 * Update cart item quantity
 * PUT /api/users/cart-items/:cartItemId
 * @param {number|string} cartItemId - Cart item ID
 * @param {object} updateData - Update data (quantity, etc.)
 * @returns {Promise} Updated cart item
 */
export function updateCartItem(cartItemId, updateData) {
  return put(`/api/users/cart-items/${cartItemId}`, updateData);
}

/**
 * Remove item from cart
 * DELETE /api/users/cart-items/:cartItemId
 * @param {number|string} cartItemId - Cart item ID
 * @param {object} deleteData - Delete data (product_id, variant_id)
 * @returns {Promise} Success response
 */
export function removeFromCart(cartItemId, deleteData) {
  return deleteRequest(`/api/users/cart-items/${cartItemId}`, deleteData);
}

/**
 * Clear entire cart
 * DELETE /api/users/cart
 * @returns {Promise} Success response
 */
export function clearCart() {
  return deleteRequest('/api/users/cart');
}

/**
 * Get cart summary/totals
 * GET /api/users/cart/summary
 * @returns {Promise} Cart totals (item count, subtotal, etc.)
 */
export function getCartSummary() {
  return get('/api/users/cart/summary');
}

/**
 * Update cart status
 * PUT /api/users/cart/status
 * @param {number} status - New cart status (e.g., 2 for completed/checked out)
 * @returns {Promise} Updated cart with new status
 */
export function updateCartStatus(status) {
  return put('/api/users/cart/status', { status });
}
