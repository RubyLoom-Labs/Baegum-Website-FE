/**
 * User Service
 * Handles user-related API calls (addresses, profile, etc.)
 */

import { get, post, put, deleteRequest } from './api';

/**
 * Get user's saved addresses
 * GET /api/users/addresses
 * @returns {Promise} Array of user addresses
 */
export function getUserAddresses() {
  return get('/api/users/addresses');
}

/**
 * Create a new address for the user
 * POST /api/users/addresses
 * @param {object} addressData - Address details
 * @returns {Promise} Created address object
 */
export function createUserAddress(addressData) {
  return post('/api/users/addresses', addressData);
}

/**
 * Update an existing address
 * PUT /api/users/addresses/:id
 * @param {number|string} addressId - Address ID
 * @param {object} addressData - Updated address details
 * @returns {Promise} Updated address object
 */
export function updateUserAddress(addressId, addressData) {
  return put(`/api/users/addresses/${addressId}`, addressData);
}

/**
 * Delete an address
 * DELETE /api/users/addresses/:id
 * @param {number|string} addressId - Address ID
 * @returns {Promise} Success response
 */
export function deleteUserAddress(addressId) {
  return deleteRequest(`/api/users/addresses/${addressId}`);
}

/**
 * Set default address
 * PUT /api/users/addresses/:id/default
 * @param {number|string} addressId - Address ID to set as default
 * @returns {Promise} Updated address object
 */
export function setDefaultAddress(addressId) {
  return put(`/api/users/addresses/${addressId}/default`, {});
}

/**
 * Update user profile
 * PUT /api/users/profile
 * @param {object} profileData - Profile details (firstName, lastName, email, phone, dob, gender)
 * @returns {Promise} Updated user object
 */
export function updateUserProfile(profileData) {
  return put('/api/users/profile', profileData);
}

/**
 * Get current user's profile
 * GET /api/users/profile
 * @returns {Promise} Current user's profile object
 */
export function getUserProfile() {
  return get('/api/users/profile');
}
