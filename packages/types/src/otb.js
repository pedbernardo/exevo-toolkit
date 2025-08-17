/**
 * @typedef {object} OtbManager
 * @property {() => boolean} load - Load and parse the OTB file data
 * @property {(serverId: number) => OtbItem|undefined} getItem - Get an item by server ID
 * @property {(clientId: number) => OtbItem|undefined} getItemByClientId - Get an item by client ID
 * @property {string} version - Get the OTB version as a string
 * @property {number} count - Get the total number of loaded items
 * @property {boolean} isLoaded - Check if the OTB data has been loaded
 * @property {Map<number, OtbItem>} items - Get all items as a Map
 */

/**
 * @typedef {object} OtbProps
 * @property {boolean} isLoaded - Whether the OTB data has been loaded
 * @property {number} dataLength - Length of the OTB data
 * @property {object} version - OTB version information
 * @property {number} version.major - OTB major version number
 * @property {number} version.minor - OTB minor version number
 * @property {number} version.build - OTB build number
 * @property {Map<number, OtbItem>} items - Map of item server ID to item data
 * @property {number} itemCount - Total number of items loaded
 */

/**
 * @typedef {object} OtbItem
 * @property {number} serverId - Server ID of the item
 * @property {number} clientId - Client ID of the item (sprite ID)
 * @property {number} type - Item type
 * @property {number} group - Item group
 * @property {OtbItemFlags} flags - Item flags as boolean properties
 * @property {OtbItemAttributes} attributes - Item attributes
 */

/**
 * @typedef {object} OtbItemFlags
 * @property {boolean} [unpassable] - Cannot be walked through
 * @property {boolean} [blockMissiles] - Blocks projectiles
 * @property {boolean} [blockPathfinder] - Blocks pathfinding
 * @property {boolean} [hasElevation] - Has elevation
 * @property {boolean} [useable] - Can be used
 * @property {boolean} [pickupable] - Can be picked up
 * @property {boolean} [moveable] - Can be moved
 * @property {boolean} [stackable] - Can be stacked
 * @property {boolean} [floorChangeDown] - Floor change down
 * @property {boolean} [floorChangeNorth] - Floor change north
 * @property {boolean} [floorChangeEast] - Floor change east
 * @property {boolean} [floorChangeSouth] - Floor change south
 * @property {boolean} [floorChangeWest] - Floor change west
 * @property {boolean} [alwaysOnTop] - Always on top
 * @property {boolean} [hangable] - Can be hung
 * @property {boolean} [hookEast] - Hook east
 * @property {boolean} [hookSouth] - Hook south
 * @property {boolean} [allowDistRead] - Allow distance reading
 * @property {boolean} [rotable] - Can be rotated
 * @property {boolean} [readable] - Can be read
 * @property {boolean} [clientCharges] - Has client charges
 * @property {boolean} [ignoreLook] - Ignore look
 * @property {boolean} [isAnimation] - Is animation
 * @property {boolean} [cannotDecay] - Cannot decay
 * @property {boolean} [fullGround] - Full ground
 * @property {boolean} [forceUse] - Force use
 */

/**
 * @typedef {object} OtbItemAttributes
 * @property {string} [name] - Item name
 * @property {string} [description] - Item description
 * @property {number} [speed] - Item speed attribute
 * @property {number[]} [spriteHash] - Sprite hash as array of bytes
 * @property {number} [minimapColor] - Minimap color
 * @property {number} [maxItems] - Maximum items (for containers)
 * @property {number} [weight] - Item weight
 * @property {number} [lightLevel] - Light level
 * @property {number} [lightColor] - Light color
 * @property {number} [topOrder] - Top order
 * @property {number} [rotateTo] - Rotate to direction
 * @property {number} [maxWriteLength] - Maximum write length
 * @property {number} [maxReadLength] - Maximum read length
 * @property {number} [alwaysOnTopOrder] - Always on top order
 */

/**
 * @typedef {object} OtbItemFlow
 * @property {OtbItem} item - The item being parsed
 * @property {number} flagsInt - Integer containing bitwise flags
 * @property {number} endPos - End position of the item node
 */

/**
 * Enhanced binary reader with OTB-specific escape sequence methods
 * @typedef {import('./binary-reader').BinaryReader & {
 *   escByte: () => number,
 *   escBytes: (amount: number) => Uint8Array,
 *   escU16: () => number,
 *   escU32: () => number,
 *   escU64: () => number,
 *   peekEscByte: () => number,
 *   peekU8At: (position: number) => number
 *   nextSpecialByte: () => number,
 * }} OtbReader
 */

// Export the type for TypeScript
export const OtbManager = undefined
export const OtbProps = undefined
export const OtbItem = undefined
export const OtbItemFlags = undefined
export const OtbItemAttributes = undefined
export const OtbItemFlow = undefined
export const OtbReader = undefined
