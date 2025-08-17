/**
 * Converts a snake_case string to camelCase.
 * @param {string} str - snake_case string to convert
 * @returns {string} - converted camelCase string
 */
export function snakeCaseToCamelCase (str = '') {
  return str
    .toLowerCase()
    .replace(/(_\w)/g, (match) => match[1].toUpperCase())
}
