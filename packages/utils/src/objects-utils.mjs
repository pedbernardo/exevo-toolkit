/**
 * Removes falsey values from an object.
 * @param {object} obj - raw object to clean
 * @returns {object} - cleaned object
 */
export function removeFalseyFromObject (obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => Boolean(v)))
}
