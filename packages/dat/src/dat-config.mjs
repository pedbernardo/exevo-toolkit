/**
 * Map of Tibia client versions to their corresponding .dat file signatures
 * @type {Record<string, number>}
 */
export const DAT_SIGNATURES = {
  710: 0x3DFF4B2A,
  740: 0x41BF619C,
  750: 0x42F81973,
  755: 0x437B2B8F,
  760: 0x439D5A33,
  770: 0x439D5A33,
  772: 0x439D5A33,
  860: 0x4C28B721,
  870: 0x4CFE22C5,
  960: 0x4FFA74CC,
  980: 0x50C70674,
  1098: 0x000042A3
}

export const DAT_FLAG_END_MARK = 0xFF

/**
 * Checks if the given Tibia client version is supported.
 * @param {number} version - Tibia client version to check.
 * @returns {boolean} True if the version is supported, false otherwise.
 */
export function isVersionSupported (version) {
  return Object.keys(DAT_SIGNATURES).includes(version.toString())
}

/**
 * Map of .dat file IDs to their starting ranges by group accordingly OTServer usage
 * @type {Record<string, number>}
 */
const DAT_THINGS_GROUPS = {
  items: 100,
  creatures: 10000,
  effects: 20000,
  missiles: 30000
}

/**
 * Get the starting IDs and groups for all thing types.
 * @typedef {Record<string, { startId: number, group: string }>} ThingsGroups
 * @returns {ThingsGroups}
 */
export const getThingsGroups = () => Object
  .entries(DAT_THINGS_GROUPS)
  .reduce((acc, [key, startId]) => {
    acc[key] = { startId, group: key }
    return acc
  }, /** @type {ThingsGroups} */ ({}))
