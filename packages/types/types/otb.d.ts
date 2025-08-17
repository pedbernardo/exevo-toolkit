export type OtbManager = {
    /**
     * - Load and parse the OTB file data
     */
    load: () => boolean;
    /**
     * - Get an item by server ID
     */
    getItem: (serverId: number) => OtbItem | undefined;
    /**
     * - Get an item by client ID
     */
    getItemByClientId: (clientId: number) => OtbItem | undefined;
    /**
     * - Get the OTB version as a string
     */
    version: string;
    /**
     * - Get the total number of loaded items
     */
    count: number;
    /**
     * - Check if the OTB data has been loaded
     */
    isLoaded: boolean;
    /**
     * - Get all items as a Map
     */
    items: Map<number, OtbItem>;
};
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
export const OtbManager: any;
export type OtbProps = {
    /**
     * - Whether the OTB data has been loaded
     */
    isLoaded: boolean;
    /**
     * - Length of the OTB data
     */
    dataLength: number;
    /**
     * - OTB version information
     */
    version: {
        major: number;
        minor: number;
        build: number;
    };
    /**
     * - Map of item server ID to item data
     */
    items: Map<number, OtbItem>;
    /**
     * - Total number of items loaded
     */
    itemCount: number;
};
export type OtbItem = {
    /**
     * - Server ID of the item
     */
    serverId: number;
    /**
     * - Client ID of the item (sprite ID)
     */
    clientId: number;
    /**
     * - Item type
     */
    type: number;
    /**
     * - Item group
     */
    group: number;
    /**
     * - Item flags as boolean properties
     */
    flags: OtbItemFlags;
    /**
     * - Item attributes
     */
    attributes: OtbItemAttributes;
};
export type OtbItemFlags = {
    /**
     * - Cannot be walked through
     */
    unpassable?: boolean;
    /**
     * - Blocks projectiles
     */
    blockMissiles?: boolean;
    /**
     * - Blocks pathfinding
     */
    blockPathfinder?: boolean;
    /**
     * - Has elevation
     */
    hasElevation?: boolean;
    /**
     * - Can be used
     */
    useable?: boolean;
    /**
     * - Can be picked up
     */
    pickupable?: boolean;
    /**
     * - Can be moved
     */
    moveable?: boolean;
    /**
     * - Can be stacked
     */
    stackable?: boolean;
    /**
     * - Floor change down
     */
    floorChangeDown?: boolean;
    /**
     * - Floor change north
     */
    floorChangeNorth?: boolean;
    /**
     * - Floor change east
     */
    floorChangeEast?: boolean;
    /**
     * - Floor change south
     */
    floorChangeSouth?: boolean;
    /**
     * - Floor change west
     */
    floorChangeWest?: boolean;
    /**
     * - Always on top
     */
    alwaysOnTop?: boolean;
    /**
     * - Can be hung
     */
    hangable?: boolean;
    /**
     * - Hook east
     */
    hookEast?: boolean;
    /**
     * - Hook south
     */
    hookSouth?: boolean;
    /**
     * - Allow distance reading
     */
    allowDistRead?: boolean;
    /**
     * - Can be rotated
     */
    rotable?: boolean;
    /**
     * - Can be read
     */
    readable?: boolean;
    /**
     * - Has client charges
     */
    clientCharges?: boolean;
    /**
     * - Ignore look
     */
    ignoreLook?: boolean;
    /**
     * - Is animation
     */
    isAnimation?: boolean;
    /**
     * - Cannot decay
     */
    cannotDecay?: boolean;
    /**
     * - Full ground
     */
    fullGround?: boolean;
    /**
     * - Force use
     */
    forceUse?: boolean;
};
export type OtbItemAttributes = {
    /**
     * - Item name
     */
    name?: string;
    /**
     * - Item description
     */
    description?: string;
    /**
     * - Item speed attribute
     */
    speed?: number;
    /**
     * - Sprite hash as array of bytes
     */
    spriteHash?: number[];
    /**
     * - Minimap color
     */
    minimapColor?: number;
    /**
     * - Maximum items (for containers)
     */
    maxItems?: number;
    /**
     * - Item weight
     */
    weight?: number;
    /**
     * - Light level
     */
    lightLevel?: number;
    /**
     * - Light color
     */
    lightColor?: number;
    /**
     * - Top order
     */
    topOrder?: number;
    /**
     * - Rotate to direction
     */
    rotateTo?: number;
    /**
     * - Maximum write length
     */
    maxWriteLength?: number;
    /**
     * - Maximum read length
     */
    maxReadLength?: number;
    /**
     * - Always on top order
     */
    alwaysOnTopOrder?: number;
};
export type OtbItemFlow = {
    /**
     * - The item being parsed
     */
    item: OtbItem;
    /**
     * - Integer containing bitwise flags
     */
    flagsInt: number;
    /**
     * - End position of the item node
     */
    endPos: number;
};
/**
 * Enhanced binary reader with OTB-specific escape sequence methods
 */
export type OtbReader = import("./binary-reader").BinaryReader & {
    escByte: () => number;
    escBytes: (amount: number) => Uint8Array;
    escU16: () => number;
    escU32: () => number;
    escU64: () => number;
    peekEscByte: () => number;
    peekU8At: (position: number) => number;
    nextSpecialByte: () => number;
};
