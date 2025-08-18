export type SprManager = {
    /**
     * - load and parse the .spr file data
     */
    load: () => boolean;
    /**
     * - get the file address of a sprite by id
     */
    address: (id: number) => number;
    /**
     * - get a sprite by id with RGBA data
     */
    getSprite: (id: number) => Sprite | null;
    /**
     * - get multiple sprites by their ids
     */
    getSprites: (ids: number[]) => Sprite[];
    /**
     * - render all sprites with optional progress callback
     */
    parse: (callback?: (id: number, total: number, percent: number) => void, useCache?: boolean) => SpritesMap;
    /**
     * - clear the internal sprite cache
     */
    clearCache: () => void;
    /**
     * - get the total number of sprites in the file
     */
    count: number;
    /**
     * - get all sprite addresses as a Map
     */
    addresses: Map<number, number>;
    /**
     * - get all sprites as a Map
     */
    sprites: Map<number, Sprite>;
    /**
     * - get the signature of the .spr file
     */
    signature: number;
    /**
     * - get the Tibia client version used for this .spr file
     */
    version: number;
    /**
     * - get the loading state of the .spr file
     */
    isLoaded: boolean;
};
/**
 * @typedef {object} SprManager
 * @property {() => boolean} load - load and parse the .spr file data
 * @property {(id: number) => number} address - get the file address of a sprite by id
 * @property {(id: number) => Sprite|null} getSprite - get a sprite by id with RGBA data
 * @property {(ids: number[]) => Sprite[]} getSprites - get multiple sprites by their ids
 * @property {(callback?: (id: number, total: number, percent: number) => void, useCache?: boolean) => SpritesMap} parse - render all sprites with optional progress callback
 * @property {() => void} clearCache - clear the internal sprite cache
 * @property {number} count - get the total number of sprites in the file
 * @property {Map<number, number>} addresses - get all sprite addresses as a Map
 * @property {Map<number, Sprite>} sprites - get all sprites as a Map
 * @property {number} signature - get the signature of the .spr file
 * @property {number} version - get the Tibia client version used for this .spr file
 * @property {boolean} isLoaded - get the loading state of the .spr file
 */
/**
 * @typedef {object} SprProps
 * @property {boolean} isLoaded - whether the .spr file has been loaded
 * @property {number} version - Tibia client version
 * @property {number} signature - .spr file signature
 * @property {number} count - number of sprites in the file
 * @property {Map<number, number>} addresses - map of sprite id to address (1-based indexing)
 */
/**
 * @typedef {object} Sprite
 * @property {number} id - sprite id
 * @property {Uint8Array|Uint8ClampedArray} rgba - RGBA pixel data (32x32x4 = 4096 bytes)
 * @property {number} width - sprite width (always 32)
 * @property {number} height - sprite height (always 32)
 */
/**
 * @typedef {Map<number, Sprite>} SpritesMap
 */
export const SprManager: any;
export type SprProps = {
    /**
     * - whether the .spr file has been loaded
     */
    isLoaded: boolean;
    /**
     * - Tibia client version
     */
    version: number;
    /**
     * - .spr file signature
     */
    signature: number;
    /**
     * - number of sprites in the file
     */
    count: number;
    /**
     * - map of sprite id to address (1-based indexing)
     */
    addresses: Map<number, number>;
};
export const SprProps: any;
export type Sprite = {
    /**
     * - sprite id
     */
    id: number;
    /**
     * - RGBA pixel data (32x32x4 = 4096 bytes)
     */
    rgba: Uint8Array | Uint8ClampedArray;
    /**
     * - sprite width (always 32)
     */
    width: number;
    /**
     * - sprite height (always 32)
     */
    height: number;
};
export const Sprite: any;
export type SpritesMap = Map<number, Sprite>;
export const SpritesMap: any;
