/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - A random integer between min and max.
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
