export type DatManager = {
    /**
     * - Load and parse the DAT file data
     */
    load: () => boolean;
    /**
     * - Get a thing (item/creature/effect/missile) by ID
     */
    getThing: (id: number) => Thing | undefined;
    /**
     * - Get the DAT file signature
     */
    signature: number;
    /**
     * - Get the DAT file signature as a hexadecimal string
     */
    signatureHex: string;
    /**
     * - Get the counts of items, creatures, effects, and missiles
     */
    counts: DatCounts;
    /**
     * - Get the Tibia client version number
     */
    version: number;
    /**
     * - Check if the DAT data has been loaded
     */
    isLoaded: boolean;
    /**
     * - Get all things as a Map
     */
    things: ThingsMap;
};
/**
 * @typedef {object} DatManager
 * @property {() => boolean} load - Load and parse the DAT file data
 * @property {(id: number) => Thing|undefined} getThing - Get a thing (item/creature/effect/missile) by ID
 * @property {number} signature - Get the DAT file signature
 * @property {string} signatureHex - Get the DAT file signature as a hexadecimal string
 * @property {DatCounts} counts - Get the counts of items, creatures, effects, and missiles
 * @property {number} version - Get the Tibia client version number
 * @property {boolean} isLoaded - Check if the DAT data has been loaded
 * @property {ThingsMap} things - Get all things as a Map
 */
/**
 * @typedef {object} DatProps
 * @property {boolean} isLoaded - Whether the .dat file has been loaded and parsed
 * @property {number} version - The Tibia client version for which the .dat file is intended
 * @property {number} signature - The .dat file signature (version identifier)
 * @property {import('./version-features').VersionFeatures} features - object containing version-specific information
 * @property {Record<string, number>} flags - object containing flag constants for the .dat file version
 * @property {DatCounts} counts - object containing counts of different item types
 * @property {ThingsMap} things - Map containing the parsed items/things from the .dat file
 */
/**
 * @typedef {object} DatCounts
 * @property {number} items - Number of items in the DAT file
 * @property {number} creatures - Number of creatures in the DAT file
 * @property {number} effects - Number of effects in the DAT file
 * @property {number} missiles - Number of missiles in the DAT file
 */
/**
 * @typedef {Map<number, Thing>} ThingsMap
 */
/**
 * A parsed DAT thing (item, creature, effect, or missile) with all its properties.
 * @typedef {object} Thing
 * @property {number} cid - unique client id (cid) of the thing
 * @property {string} group - The group type of the thing (e.g., 'items', 'creatures', etc.)
 * @property {ThingFlags} flags - object containing thing properties and behaviors
 * @property {ThingLayout} layout - Thing layout information
 * @property {number[]} spriteIds - Array of sprite IDs for rendering
 */
/**
 * Thing layout that defines the visual representation of a thing.
 * @typedef {object} ThingLayout
 * @property {number} width - Thing width in tiles
 * @property {number} height - Thing height in tiles
 * @property {number} layers - Number of layers (blend modes)
 * @property {number} patternX - Number of X patterns (addons/variations)
 * @property {number} patternY - Number of Y patterns (directions)
 * @property {number} patternZ - Number of Z patterns (mounts/outfits)
 * @property {number} frames - Number of animation frames
 * @property {number} realSize - Real size of the thing in pixels
 * @property {number} exactSize - Exact size of the thing in pixels
 */
/**
 * Thing flags that define properties and behaviors of DAT objects.
 * @typedef {object} ThingFlags
 * @property {{ speed: number }} [ground] - Ground speed in milliseconds
 * @property {boolean} [groundBorder] - Item is a ground border
 * @property {boolean} [onBottom] - Item appears on bottom of stack
 * @property {boolean} [onTop] - Item appears on top of stack
 * @property {boolean} [container] - Item is a container
 * @property {boolean} [stackable] - Item can be stacked
 * @property {boolean} [forceUse] - Item forces use action
 * @property {boolean} [multiUse] - Item supports multi-use
 * @property {{ length: number }} [writable] - Item is writable with max length
 * @property {{ length: number }} [writableOnce] - Item is writable once with max length
 * @property {boolean} [fluidContainer] - Item is a fluid container
 * @property {boolean} [fluid] - Item is a fluid
 * @property {boolean} [unpassable] - Item blocks movement
 * @property {boolean} [unmovable] - Item cannot be moved
 * @property {boolean} [blockMissiles] - Item blocks missiles/projectiles
 * @property {boolean} [blockPathfinder] - Item blocks pathfinding
 * @property {boolean} [pickupable] - Item can be picked up
 * @property {boolean} [hangable] - Item can be hung on walls
 * @property {boolean} [vertical] - Item has vertical orientation
 * @property {boolean} [horizontal] - Item has horizontal orientation
 * @property {boolean} [rotatable] - Item can be rotated
 * @property {{ level: number, color: number }} [lightInfo] - Light information
 * @property {boolean} [dontHide] - Item doesn't hide other items
 * @property {boolean} [floorChange] - Item changes floor level
 * @property {{ offsetX: number, offsetY: number }} [hasOffset] - Item drawing offset
 * @property {{ height: number }} [hasElevation] - Item elevation height
 * @property {boolean} [lyingobject] - Item lies on ground
 * @property {boolean} [alwaysAnimate] - Item always animates
 * @property {{ color: number }} [minimap] - Minimap color
 * @property {{ value: number }} [lensHelp] - Lens help value
 * @property {boolean} [fullGround] - Item covers full ground tile
 */
/**
 * @typedef {Record<string, boolean>} BooleanMap
 * @typedef {Record<string, boolean | BooleanMap>} FlagValue - { [attributeName]: boolean | BooleanMap }
 * @typedef {(reader: import('./binary-reader').BinaryReader) => number} ReaderFn
 * @typedef {(displayName: string, reader: any) => FlagValue} ParserFn
 * @typedef {Map<number, RuleEntry>} RulesMap
 */
/**
 * @typedef {object} RuleEntry
 * @property {string} displayName - flag's display name (camelCase)
 * @property {ParserFn} parser - parsing function for the flag
 */
/**
 * @typedef {[string, ReaderFn]} SingleRule
 * A tuple with one property name and one reader function.
 */
/**
 * @typedef {[string[], ReaderFn[]]} MultiRule
 * A tuple with multiple property names and corresponding reader functions.
 */
/**
 * @typedef {SingleRule | MultiRule} AdvancedRule
 * Either a single or multi-value reading rule.
 */
export const DatManager: any;
export type DatProps = {
    /**
     * - Whether the .dat file has been loaded and parsed
     */
    isLoaded: boolean;
    /**
     * - The Tibia client version for which the .dat file is intended
     */
    version: number;
    /**
     * - The .dat file signature (version identifier)
     */
    signature: number;
    /**
     * - object containing version-specific information
     */
    features: import("./version-features").VersionFeatures;
    /**
     * - object containing flag constants for the .dat file version
     */
    flags: Record<string, number>;
    /**
     * - object containing counts of different item types
     */
    counts: DatCounts;
    /**
     * - Map containing the parsed items/things from the .dat file
     */
    things: ThingsMap;
};
export const DatProps: any;
export type DatCounts = {
    /**
     * - Number of items in the DAT file
     */
    items: number;
    /**
     * - Number of creatures in the DAT file
     */
    creatures: number;
    /**
     * - Number of effects in the DAT file
     */
    effects: number;
    /**
     * - Number of missiles in the DAT file
     */
    missiles: number;
};
export const DatCounts: any;
export type ThingsMap = Map<number, Thing>;
export const ThingsMap: any;
/**
 * A parsed DAT thing (item, creature, effect, or missile) with all its properties.
 */
export type Thing = {
    /**
     * - unique client id (cid) of the thing
     */
    cid: number;
    /**
     * - The group type of the thing (e.g., 'items', 'creatures', etc.)
     */
    group: string;
    /**
     * - object containing thing properties and behaviors
     */
    flags: ThingFlags;
    /**
     * - Thing layout information
     */
    layout: ThingLayout;
    /**
     * - Array of sprite IDs for rendering
     */
    spriteIds: number[];
};
export const Thing: any;
/**
 * Thing layout that defines the visual representation of a thing.
 */
export type ThingLayout = {
    /**
     * - Thing width in tiles
     */
    width: number;
    /**
     * - Thing height in tiles
     */
    height: number;
    /**
     * - Number of layers (blend modes)
     */
    layers: number;
    /**
     * - Number of X patterns (addons/variations)
     */
    patternX: number;
    /**
     * - Number of Y patterns (directions)
     */
    patternY: number;
    /**
     * - Number of Z patterns (mounts/outfits)
     */
    patternZ: number;
    /**
     * - Number of animation frames
     */
    frames: number;
    /**
     * - Real size of the thing in pixels
     */
    realSize: number;
    /**
     * - Exact size of the thing in pixels
     */
    exactSize: number;
};
export const ThingLayout: any;
/**
 * Thing flags that define properties and behaviors of DAT objects.
 */
export type ThingFlags = {
    /**
     * - Ground speed in milliseconds
     */
    ground?: {
        speed: number;
    };
    /**
     * - Item is a ground border
     */
    groundBorder?: boolean;
    /**
     * - Item appears on bottom of stack
     */
    onBottom?: boolean;
    /**
     * - Item appears on top of stack
     */
    onTop?: boolean;
    /**
     * - Item is a container
     */
    container?: boolean;
    /**
     * - Item can be stacked
     */
    stackable?: boolean;
    /**
     * - Item forces use action
     */
    forceUse?: boolean;
    /**
     * - Item supports multi-use
     */
    multiUse?: boolean;
    /**
     * - Item is writable with max length
     */
    writable?: {
        length: number;
    };
    /**
     * - Item is writable once with max length
     */
    writableOnce?: {
        length: number;
    };
    /**
     * - Item is a fluid container
     */
    fluidContainer?: boolean;
    /**
     * - Item is a fluid
     */
    fluid?: boolean;
    /**
     * - Item blocks movement
     */
    unpassable?: boolean;
    /**
     * - Item cannot be moved
     */
    unmovable?: boolean;
    /**
     * - Item blocks missiles/projectiles
     */
    blockMissiles?: boolean;
    /**
     * - Item blocks pathfinding
     */
    blockPathfinder?: boolean;
    /**
     * - Item can be picked up
     */
    pickupable?: boolean;
    /**
     * - Item can be hung on walls
     */
    hangable?: boolean;
    /**
     * - Item has vertical orientation
     */
    vertical?: boolean;
    /**
     * - Item has horizontal orientation
     */
    horizontal?: boolean;
    /**
     * - Item can be rotated
     */
    rotatable?: boolean;
    /**
     * - Light information
     */
    lightInfo?: {
        level: number;
        color: number;
    };
    /**
     * - Item doesn't hide other items
     */
    dontHide?: boolean;
    /**
     * - Item changes floor level
     */
    floorChange?: boolean;
    /**
     * - Item drawing offset
     */
    hasOffset?: {
        offsetX: number;
        offsetY: number;
    };
    /**
     * - Item elevation height
     */
    hasElevation?: {
        height: number;
    };
    /**
     * - Item lies on ground
     */
    lyingobject?: boolean;
    /**
     * - Item always animates
     */
    alwaysAnimate?: boolean;
    /**
     * - Minimap color
     */
    minimap?: {
        color: number;
    };
    /**
     * - Lens help value
     */
    lensHelp?: {
        value: number;
    };
    /**
     * - Item covers full ground tile
     */
    fullGround?: boolean;
};
export const ThingFlags: any;
export type RuleEntry = {
    /**
     * - flag's display name (camelCase)
     */
    displayName: string;
    /**
     * - parsing function for the flag
     */
    parser: ParserFn;
};
export const RuleEntry: any;
/**
 * A tuple with one property name and one reader function.
 */
export type SingleRule = [string, ReaderFn];
export const SingleRule: any;
/**
 * A tuple with multiple property names and corresponding reader functions.
 */
export type MultiRule = [string[], ReaderFn[]];
export const MultiRule: any;
/**
 * Either a single or multi-value reading rule.
 */
export type AdvancedRule = SingleRule | MultiRule;
export const AdvancedRule: any;
export type BooleanMap = Record<string, boolean>;
/**
 * - { [attributeName]: boolean | BooleanMap }
 */
export type FlagValue = Record<string, boolean | BooleanMap>;
export type ReaderFn = (reader: import("./binary-reader").BinaryReader) => number;
export type ParserFn = (displayName: string, reader: any) => FlagValue;
export type RulesMap = Map<number, RuleEntry>;
