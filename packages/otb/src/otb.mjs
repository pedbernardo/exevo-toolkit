import { createOtbReader } from './otb-reader.mjs'
import { NODE_SPECIAL_BYTE, ROOT_NODE_ATTR, ITEM_GROUP, ITEM_TYPE_MAP, isOtbVersionSupported } from './otb-config.mjs'
import { getItemFlags } from './otb-flags.mjs'
import { ATTRIBUTE_HANDLERS } from './otb-attributes.mjs'

/**
 * @typedef {import('@exevo/types').OtbManager} OtbManager
 * @typedef {import('@exevo/types').OtbProps} OtbProps
 * @typedef {import('@exevo/types').OtbItem} OtbItem
 */

/**
 * A factory function to create an .otb file reader instance
 * @param {ArrayBuffer|ArrayBufferLike} buffer ArrayBuffer containing the .otb file data
 * @returns {OtbManager} OtbManager instance
 */
export function OtbManager (buffer) {
  const reader = createOtbReader(buffer)

  /** @type {OtbProps} */
  const props = {
    isLoaded: false,
    dataLength: 0,
    version: { major: 0, minor: 0, build: 0 },
    items: new Map(),
    itemCount: 0
  }

  init()

  return {
    load,
    getItem: serverId => props.items.get(serverId),
    getItemByClientId: clientId => {
      for (const item of props.items.values()) {
        if (item.clientId === clientId) return item
      }
      return undefined
    },
    get version () { return `${props.version.major}.${props.version.minor}.${props.version.build}` },
    get count () { return props.itemCount },
    get isLoaded () { return props.isLoaded },
    get items () { return props.items },
  }

  /**
   * Initialize the OTB manager checking the validity of the input buffer
   */
  function init () {
    const isBuffer = buffer instanceof ArrayBuffer

    if (!isBuffer) throw new Error('Invalid buffer: expected ArrayBuffer')
    if (buffer.byteLength < 20) throw new Error('Buffer too small for OTB file')
  }

  /**
   * Load the OTB file data
   * @public
   * @returns {boolean} true if loaded successfully, false otherwise
   */
  function load () {
    try {
      if (props.isLoaded) return true

      parseHeader()
      parseItems()

      props.isLoaded = true
    } catch (error) {
      props.isLoaded = false
      console.error('Error loading OTB file:', error)
    }

    return props.isLoaded
  }

  /**
   * Parse the OTB file header grabbing the root node and version information
   */
  function parseHeader () {
    reader.seekByte(NODE_SPECIAL_BYTE.START)

    if (reader.offset === -1) {
      throw new Error('No START byte found in OTB file')
    }

    const startByte = reader.u8()

    if (startByte !== NODE_SPECIAL_BYTE.START) {
      throw new Error(`Expected START byte (0xFE), got 0x${startByte.toString(16)}`)
    }

    reader.skip(5) // Skip 5 bytes after START byte

    const attribute = reader.u8() // Root Node Attribute

    if (attribute !== ROOT_NODE_ATTR) {
      throw new Error(`Unexpected root node attribute: ${attribute}, expected ${ROOT_NODE_ATTR}.`)
    }

    const { version } = props

    props.dataLength = reader.escU16()

    version.major = reader.escU32()
    version.minor = reader.escU32()
    version.build = reader.escU32()

    if (!isOtbVersionSupported(version.major)) {
      throw new Error(`Unsupported OTB version: ${version.major}.${version.minor}.${version.build}`)
    }

    // Skip remaining root node data (128 bytes total - what we already read)
    // We read 12 bytes of version info, so skip the remaining 116 bytes
    reader.skip(116)
  }

  /**
   * Read and parse all item nodes from the OTB file
   */
  function parseItems () {
    const MAX_ITEMS = 50_000
    let nextServerId = 100
    let itemCount = 0

    for (const item of itemNodes()) {
      if (!item) continue

      if (item.serverId === 0) {
        item.serverId = nextServerId++
      } else {
        nextServerId = Math.max(nextServerId, item.serverId + 1)
      }

      props.items.set(item.serverId, item)
      itemCount++

      if (itemCount > MAX_ITEMS) {
        console.log(`Stopping at ${MAX_ITEMS} items for safety`)
        break
      }
    }

    props.itemCount = itemCount
  }

  /**
   * Generate item nodes from the OTB file
   */
  function * itemNodes () {
    while (reader.offset < reader.byteLength) {
      const startPos = reader.nextSpecialByte()

      if (startPos === -1) break
      if (startPos >= reader.byteLength - 1) break

      const endPos = reader.nextSpecialByte()

      if (endPos === -1) {
        console.warn('No corresponding END byte found when parsing item nodes from .otb')
        break
      }

      if (
        reader.peekU8At(startPos) !== NODE_SPECIAL_BYTE.START ||
        reader.peekU8At(endPos) !== NODE_SPECIAL_BYTE.END
      ) {
        if (reader.offset >= reader.byteLength) break
        console.warn(`Invalid node bounds: start=${reader.peekU8At(startPos).toString(16)}, end=${reader.peekU8At(endPos).toString(16)}`)
        continue
      }

      reader.seek(startPos + 1)
      yield parseItemNode(endPos)
      reader.seek(endPos + 1)
    }
  }

  /**
   * Parse a single item node until END position
   * @param {number} endPos - Position of END byte
   * @returns {OtbItem|null} Parsed item or null if failed/deprecated
   */
  function parseItemNode (endPos) {
    const group = reader.u8()

    // Skip deprecated items
    if (group === ITEM_GROUP.DEPRECATED) return null

    /** @type {OtbItem} */
    const item = {
      serverId: 0,
      clientId: 0,
      group,
      type: 0,
      flags: {},
      attributes: {}
    }

    const flagsInt = reader.escU32()

    parseItemFlags(item, flagsInt)
    parseItemType(item)
    parseItemAttributes(item, endPos)

    return item
  }

  /**
   * Parse item flags from flagsInt and set them on the item
   * @param {OtbItem} item - The item to update
   * @param {number} flagsInt - integer containing bitwise flags
   */
  function parseItemFlags (item, flagsInt) {
    item.flags = getItemFlags(flagsInt)
  }

  /**
   * Determine and set the item type based on its group
   * @param {OtbItem} item - The item to update
   */
  function parseItemType (item) {
    item.type = ITEM_TYPE_MAP[item.group] ?? 0

    if (item.group === ITEM_GROUP.RUNE) {
      item.flags.clientCharges = true
    }
  }

  /**
   * Parse item attributes from the current reader position until endPos
   * @param {OtbItem} item - The item to update
   * @param {number} endPos - Position of END byte
   */
  function parseItemAttributes (item, endPos) {
    while (reader.offset < endPos - 1) {
      const remainingBytes = endPos - reader.offset

      // Not enough space for attribute (1 byte) + dataLength (2 bytes)
      if (remainingBytes < 3) break

      const attribute = reader.u8()
      const length = reader.escU16()

      // Validate data length is reasonable and fits within node bounds
      if (length > 1000 || reader.offset + length > endPos) {
        console.warn(`Attribute ${attribute}: invalid data length ${length}, remaining space: ${endPos - reader.offset}`)
        break
      }

      const handler = ATTRIBUTE_HANDLERS[attribute]

      if (handler) {
        handler({ item, reader, length })
      } else {
        reader.skip(length) // unknown attribute
      }

      // Safety check - ensure we don't go past END position
      if (reader.offset >= endPos) break
    }
  }
}
