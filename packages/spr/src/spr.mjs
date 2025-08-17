import { createBinaryReader, getVersionFeatures } from '@exevo/utils'
import { SPR_SIGNATURES } from './spr-config.mjs'

/**
 * @typedef {import('@exevo/types').SprManager} SprManager
 * @typedef {import('@exevo/types').SpritesMap} SpritesMap
 * @typedef {import('@exevo/types').SprProps} SprProps
 * @typedef {import('@exevo/types').Sprite} Sprite
 */

/**
 * A factory function to create a .spr file reader instance.
 * @param {ArrayBuffer|ArrayBufferLike} buffer ArrayBuffer containing the .spr file data
 * @param {number} version version number to specify the .spr file version
 * @returns {SprManager} SprManager instance
 */
export function SprManager (buffer, version) {
  const reader = createBinaryReader(buffer)

  /** @type {SpritesMap} */
  const sprites = new Map()

  /** @type {SprProps} */
  const props = {
    isLoaded: false,
    version,
    signature: reader.u32(),
    count: 0,
    addresses: new Map()
  }

  init()

  return {
    load,
    address: id => props.addresses.get(id) ?? 0,
    getSprite: id => getSprite(id),
    getSprites: ids => ids.map(id => getSprite(id)).filter(sprite => !!sprite),
    parse: (callback, useCache = true) => parseAllSprites(callback, useCache),
    clearCache: () => sprites.clear(),
    get count () { return props.count },
    get addresses () { return props.addresses },
    get signature () { return props.signature },
    get version () { return version },
    get isLoaded () { return props.isLoaded },
  }

  /**
   * Initializes the SprManager instance by validating the input buffer and version.
   * @public
   */
  function init () {
    const isBuffer = buffer instanceof ArrayBuffer
    const signatureVersion = SPR_SIGNATURES[version]

    if (!isBuffer) {
      throw new TypeError('Expected an ArrayBuffer as input')
    }

    if (!version) {
      throw new Error('Version must be specified for the .spr file')
    }

    if (!signatureVersion) {
      throw new Error(`Unsupported version: ${version}. Supported versions are: ${Object.keys(SPR_SIGNATURES).join(', ')}`)
    }

    if (signatureVersion !== props.signature) {
      throw new Error(`Version ${version} signature mismatch: expected ${signatureVersion}, got ${props.signature}`)
    }
  }

  /**
   * Load the .spr file adresses.
   * @public
   * @returns {boolean} true if loaded successfully, false otherwise
   */
  function load () {
    if (props.isLoaded) return true

    parseHeader()
    parseSpriteAddresses()

    props.isLoaded = true

    return props.isLoaded
  }

  /**
   * Parses the .spr file header accordingly to the specified version.
   */
  function parseHeader () {
    const { extendedSprites } = getVersionFeatures(version)

    props.count = extendedSprites ? reader.u32() : reader.u16()

    // validate header by checking sizes
    const headerSize = extendedSprites ? 8 : 6
    const addressTableSize = props.count * 4
    const expectedDataStart = headerSize + addressTableSize
    const overflowed = expectedDataStart > reader.byteLength

    if (overflowed) throw new Error('Address table exceeds file size')
  }

  /**
   * Parses all sprite addresses from the .spr file.
   */
  function parseSpriteAddresses () {
    // start at sprite id 1
    for (let id = 1; id <= props.count; id++) {
      const address = reader.u32()
      props.addresses.set(id, address)
    }
  }

  /**
   * Get a sprite by its sprite id.
   * @public
   * @param {number} id - sprite id (1-based)
   * @returns {Sprite|null} sprite data with RGBA pixels, or null if not found
   */
  function getSprite (id) {
    if (!props.isLoaded) {
      console.error('SprManager is not loaded. Call load() first.')
      return null
    }
    if (id <= 0 || id > props.count) return null
    if (sprites.has(id)) return sprites.get(id) ?? null

    const sprite = parseSprite(id)

    if (sprite) sprites.set(id, sprite)

    return sprite
  }

  /**
   * Parse a single sprite by ID and decompress RLE to RGBA data
   * @param {number} id - Sprite ID (1-based)
   * @returns {Sprite|null} Sprite data with RGBA pixels, or null if not found
   */
  function parseSprite (id) {
    const address = props.addresses.get(id)

    if (!address) return null

    // use Uint8ClampedArray for better Canvas compatibility
    // initializes a 32x32x4 RGBA sprite map
    const sprite = new Uint8ClampedArray(4096).fill(0, 0, 4096)

    // empty sprite (transparent)
    if (address === 0) {
      return {
        id,
        rgba: sprite,
        width: 32,
        height: 32
      }
    }

    try {
      reader.seek(address)
      reader.skip(3) // skip 3 bytes (SPR format header: 0xFF, 0x00, 0xFF)

      const spriteSize = reader.u16()
      const endPosition = reader.offset + spriteSize
      const size = 32

      let currentPixel = 0

      while (reader.offset < endPosition) {
        const transparentPixels = reader.u16()
        const coloredPixels = reader.u16()

        currentPixel += transparentPixels

        // read colored pixels
        for (let i = 0; i < coloredPixels; i++) {
          const x = currentPixel % size
          const y = Math.floor(currentPixel / size)
          const r = reader.u8()
          const g = reader.u8()
          const b = reader.u8()
          const a = 255 // alpha is always 255 for colored pixels
          const index = (x + size * y) * 4

          sprite[index] = r
          sprite[index + 1] = g
          sprite[index + 2] = b
          sprite[index + 3] = a
          currentPixel++
        }
      }

      return {
        id,
        rgba: sprite,
        width: 32,
        height: 32
      }
    } catch (error) {
      console.error(`Failed to parse sprite id ${id}:`, error)
      return null
    }
  }

  /**
   * Parse all sprites with optional progress callback and caching control
   * @param {function} [callback] - Optional progress callback (current, total, percent)
   * @param {boolean} [useCache=true] - Whether to cache sprites during bulk loading
   * @returns {SpritesMap} Map of all sprites
   */
  function parseAllSprites (callback, useCache = true) {
    const total = props.count

    for (let id = 1; id <= total; id++) {
      const sprite = useCache ? getSprite(id) : parseSprite(id)

      if (sprite) sprites.set(id, sprite)

      if (callback && typeof callback === 'function') {
        const percent = Math.round((id / total) * 100)
        callback(id, total, percent)
      }
    }

    return sprites
  }
}
