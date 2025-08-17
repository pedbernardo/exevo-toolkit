/** Default root node attribute for OTB format */
export const ROOT_NODE_ATTR = 1

/** Known OTB version */
export const OTB_VERSIONS = [1, 2, 3]

/** Node special bytes for OTB format */
export const NODE_SPECIAL_BYTE = {
  START: 0xFE,
  END: 0xFF,
  ESCAPE_CHAR: 0xFD
}

/** Item groups in OTB format */
export const ITEM_GROUP = {
  NONE: 0,
  GROUND: 1,
  CONTAINER: 2,
  WEAPON: 3,
  AMMUNITION: 4,
  ARMOR: 5,
  RUNE: 6,
  TELEPORT: 7,
  MAGICFIELD: 8,
  WRITABLE: 9,
  KEY: 10,
  SPLASH: 11,
  FLUID: 12,
  DOOR: 13,
  DEPRECATED: 14,
  LAST: 15
}

export const ITEM_TYPE_MAP = {
  [ITEM_GROUP.CONTAINER]: 4,
  [ITEM_GROUP.DOOR]: 5,
  [ITEM_GROUP.TELEPORT]: 7,
  [ITEM_GROUP.MAGICFIELD]: 6,
}

/**
 * @param {number} majorVersion - OTB major version
 * @returns {boolean} Whether version is supported
 */
export function isOtbVersionSupported (majorVersion) {
  return OTB_VERSIONS.includes(majorVersion)
}
