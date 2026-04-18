/**
 * Authentication Service
 * Handles login, signup, and social authentication
 */

import { post } from './api.js';

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response with token and user data
 */
export async function loginWithEmail(email, password) {
  try {
    const response = await post('/api/auth/login', {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error('Login failed:', error.message);
    // Throw the error with its message preserved
    throw error;
  }
}

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response with token and user data
 */
export async function signupWithEmail(email, password) {
  try {
    const response = await post('/api/auth/signup', {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error('Signup failed:', error.message);
    throw error;
  }
}

/**
 * Login with Google (OAuth)
 * @param {string} googleToken - Google ID token from Google Sign-In
 * @returns {Promise} Response with token and user data
 */
export async function loginWithGoogle(googleToken) {
  try {
    const response = await post('/api/auth/google', {
      token: googleToken,
    });
    return response;
  } catch (error) {
    console.error('Google login failed:', error.message);
    throw error;
  }
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise}
 */
export async function requestPasswordReset(email) {
  try {
    const response = await post('/api/auth/forget-password', {
      email,
    });
    return response;
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
}

/**
 * Reset password with token and new password
 * @param {string} token - Reset token from email
 * @param {string} password - New password
 * @returns {Promise}
 */
export async function resetPasswordWithToken(token, password) {
  try {
    const response = await post('/api/auth/reset-password', {
      token,
      password,
    });
    return response;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
}

export default {
  loginWithEmail,
  signupWithEmail,
  loginWithGoogle,
  requestPasswordReset,
  resetPasswordWithToken,
};
