/**
 * Utility functions for the application
 */

/**
 * Format a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 100) {
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId = null

  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * Clone an object deeply
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
