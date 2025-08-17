/**
 * Get the appropriate flag constants for a given version
 * @param {number} version - The Tibia client version
 * @returns {Record<string, number>} The flag constants for that version
 * @throws {Error} If the version is unsupported
 */
export function getDatFlags (version) {
  const group = VERSION_GROUPS.find(group => group.versions.includes(version))
  if (group) return group.flags
  throw new Error(`Unsupported version: ${version}. Supported versions are: ${supported.join(', ')}`)
}

/**
 * Increment the values of the flags by a certain amount, respecting a minimum value.
 * @param {Record<string, number>} flags - The flags to increment
 * @param {number} increment - The amount to increment each flag by
 * @param {number} minimum - The minimum value a flag can have to be incremented
 * @returns {Record<string, number>}
 */
function incrementFlags (flags, increment, minimum = 0) {
  return Object.entries(flags).reduce((acc, [key, value]) => {
    const remapedValue = minimum >= value
      ? value
      : value + increment

    return { ...acc, [key]: remapedValue }
  }, {})
}

/**
 * DAT flags for versions 7.1x
 * @type {Record<string, number>}
 */
const DAT_FLAGS_710 = {
  // Always was "GROUND" attribute
  GROUND: 0,

  // In 7.1-7.5 attribute "GROUND_BORDER" did not exist
  ON_BOTTOM: 1,
  ON_TOP: 2,
  CONTAINER: 3,
  STACKABLE: 4,
  MULTI_USE: 5,
  FORCE_USE: 6,
  WRITABLE: 7,
  WRITABLE_ONCE: 8,
  FLUID_CONTAINER: 9,
  FLUID: 10,
  UNPASSABLE: 11,
  UNMOVABLE: 12,
  BLOCK_MISSILES: 13,

  // In 7.1 attribute "BLOCK_PATHFINDER" did not exist
  PICKUPABLE: 14,

  // Always end of flags
  END_OF_FLAGS: 255
}

/**
 * DAT flags for versions 7.4x - 7.5x
 * @type {Record<string, number>}
 */
const DAT_FLAGS_740_750 = {
  ...DAT_FLAGS_710,

  // Attribute introduced in 7.4
  BLOCK_PATHFINDER: 14,

  // Shifted attribute
  PICKUPABLE: 15,

  // Attributes introduced in 7.4
  LIGHT_INFO: 16,
  FLOOR_CHANGE: 17,
  FULL_GROUND: 18,
  HAS_ELEVATION: 19,
  HAS_OFFSET: 20,
  DONT_HIDE: 21, // was "UNKNOWN" and afterwards became "DONT_HIDE"
  MINIMAP: 22,
  ROTATABLE: 23,
  LYING_OBJECT: 24,
  HANGABLE: 25,
  VERTICAL: 26,
  HORIZONTAL: 27,
  ALWAYS_ANIMATE: 28,
  LENS_HELP: 29
}

/**
 * DAT flags for versions 7.55 - 7.72
 * @type {Record<string, number>}
 */
const DAT_FLAGS_755_772 = {
  ...DAT_FLAGS_740_750,
  // Attribute introduced in 7.55
  GROUND_BORDER: 1,

  // Due to "GROUND_BORDER" introduction 1-15 attributes are shifted +1
  ON_BOTTOM: 2,
  ON_TOP: 3,
  CONTAINER: 4,
  STACKABLE: 5,
  FORCE_USE: 6, // swapped with "MULTI_USE"
  MULTI_USE: 7, // swapped with "FORCE_USE"
  WRITABLE: 8,
  WRITABLE_ONCE: 9,
  FLUID_CONTAINER: 10,
  FLUID: 11,
  UNPASSABLE: 12,
  UNMOVABLE: 13,
  BLOCK_MISSILES: 14,
  BLOCK_PATHFINDER: 15,
  PICKUPABLE: 16,

  // Remapped attributes from 7.55 onwards
  HANGABLE: 17,
  VERTICAL: 18,
  HORIZONTAL: 19,
  ROTATABLE: 20,
  LIGHT_INFO: 21,
  DONT_HIDE: 22,
  FLOOR_CHANGE: 23,
  HAS_OFFSET: 24,
  HAS_ELEVATION: 25,
  LYING_OBJECT: 26,
  ALWAYS_ANIMATE: 27,
  MINIMAP: 28,
  LENS_HELP: 29,
  FULL_GROUND: 30
}

/**
 * DAT flags for versions 8.60 - 9.60
 * @type {Record<string, number>}
 */
const DAT_FLAGS_860_980 = {
  ...DAT_FLAGS_755_772,
  // Remmaped from "FLOOR_CHANGE"
  // @todo check if isn't specific to OTCv8
  TRANSLUCENT: 23,

  // Introduced in ~8.6
  IGNORE_LOOK: 31,
  CLOTH: 32,
  MARKET: 33,
  USABLE: 34,
  WRAPPABLE: 35,
  UNWRAPPABLE: 36,
  TOP_EFFECT: 37,
  BONES: 38, // OTCv8 specific feature

  // Repositioned "FLOOR_CHANGE"
  FLOOR_CHANGE: 252,
}

/**
 * DAT flags for versions 10.x+
 * @type {Record<string, number>}
 */
const DAT_FLAGS_1000_PLUS = {
  ...incrementFlags(DAT_FLAGS_860_980, 1, DAT_FLAGS_860_980.PICKUPABLE),
  // In 10.10+ all attributes are shifted +1 to make
  // room for "NO_MOVE_ANIMATION" attribute
  NO_MOVE_ANIMATION: 16,

  // Additional flags for versions 10.x+
  // @todo check if they need to be shifted +1
  OPACITY: 100,
  PRE_WALKABLE: 101,
  CHARGEABLE: 254,
}

/**
 * Version groups for determining which flag format to use
 * @type {Array<{ flags: Record<string, number>, versions: number[] }>}
 */
const VERSION_GROUPS = [
  {
    flags: DAT_FLAGS_710,
    versions: [710]
  },
  {
    flags: DAT_FLAGS_740_750,
    versions: [740, 750]
  },
  {
    flags: DAT_FLAGS_755_772,
    versions: [755, 760, 770, 772]
  },
  {
    flags: DAT_FLAGS_860_980,
    versions: [860, 870, 960, 980]
  },
  {
    flags: DAT_FLAGS_1000_PLUS,
    versions: [1000, 1098]
  }
]

const supported = VERSION_GROUPS.map(group => group.versions).flat()
