/**
 * @typedef {import('@exevo/types').VersionFeatures} VersionFeatures
 */

/**
 * Get the version features for a given Tibia client version
 * @param {number} version - Tibia client version
 * @returns {VersionFeatures}
 */
export function getVersionFeatures (version) {
  return {
    patternZ: version >= 755,
    transparency: version >= 755,
    extendedSprites: version >= 960,
    animations: version >= 1010,
    idleAnimations: version >= 1020,
    frameDurations: version >= 1030,
    frameGroups: version >= 1090,
  }
}
