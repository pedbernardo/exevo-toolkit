/**
 * Item attributes in OTB format
 * @enum {number}
 */
export const ITEM_ATTRIBUTE = {
  SERVERID: 16,
  CLIENT_ID: 17,
  NAME: 18,
  DESCRIPTION: 19,
  SPEED: 20,
  SLOT: 21,
  MAXITEMS: 22,
  WEIGHT: 23,
  WEAPON: 24,
  AMMUNITION: 25,
  ARMOR: 26,
  MAGICLEVEL: 27,
  MAGICFIELDTYPE: 28,
  WRITEABLE: 29,
  ROTATETO: 30,
  DECAY: 31,
  SPRITEHASH: 32,
  MINIMAPCOLOR: 33,
  MAX_WRITE_LENGTH: 34,
  MAX_READ_LENGTH: 35,
  LIGHT: 36,
  DECAY2: 37,
  WEAPON2: 38,
  AMMUNITION2: 39,
  ARMOR2: 40,
  WRITEABLE2: 41,
  LIGHT2: 42,
  TOPORDER: 43,
}

/**
 * @typedef {(props: HandlerProps) => void} AttributeHandler
 * @typedef {import('@exevo/types').OtbItem} OtbItem
 * @typedef {import('@exevo/types').OtbReader} OtbReader
 *
 * @typedef HandlerProps
 * @property {OtbItem} item - item being processed
 * @property {OtbReader} reader - reader instance for reading attribute data
 * @property {number} [length] - Number of bytes in the attribute payload
 */

/**
 * Map of attribute ID to parser function
 * Each parser receives { item, reader, length } and must not advance reader beyond length
 * @type {Record<number, AttributeHandler>}
 */
export const ATTRIBUTE_HANDLERS = {
  [ITEM_ATTRIBUTE.SERVERID]: ({ item, reader }) => {
    item.serverId = reader.escU16()
  },

  [ITEM_ATTRIBUTE.CLIENT_ID]: ({ item, reader }) => {
    item.clientId = reader.escU16()
  },

  [ITEM_ATTRIBUTE.NAME]: ({ item, reader, length = 0 }) => {
    item.attributes.name = readString(reader, length)
  },

  [ITEM_ATTRIBUTE.DESCRIPTION]: ({ item, reader, length = 0 }) => {
    item.attributes.description = readString(reader, length)
  },

  [ITEM_ATTRIBUTE.SPEED]: ({ item, reader }) => {
    item.attributes.speed = reader.escU16()
  },

  [ITEM_ATTRIBUTE.SPRITEHASH]: ({ item, reader, length = 0 }) => {
    item.attributes.spriteHash = Array.from(reader.escBytes(length))
  },

  [ITEM_ATTRIBUTE.MINIMAPCOLOR]: ({ item, reader }) => {
    item.attributes.minimapColor = reader.escU16()
  },

  [ITEM_ATTRIBUTE.MAXITEMS]: ({ item, reader }) => {
    item.attributes.maxItems = reader.escU16()
  },

  [ITEM_ATTRIBUTE.WEIGHT]: ({ item, reader }) => {
    item.attributes.weight = reader.escU64()
  },

  [ITEM_ATTRIBUTE.TOPORDER]: ({ item, reader }) => {
    item.attributes.alwaysOnTopOrder = reader.escByte()
  },

  [ITEM_ATTRIBUTE.ROTATETO]: ({ item, reader }) => {
    item.attributes.rotateTo = reader.escU16()
  },

  [ITEM_ATTRIBUTE.MAX_WRITE_LENGTH]: ({ item, reader }) => {
    item.attributes.maxWriteLength = reader.escU16()
  },

  [ITEM_ATTRIBUTE.MAX_READ_LENGTH]: ({ item, reader }) => {
    item.attributes.maxReadLength = reader.escU16()
  },

  [ITEM_ATTRIBUTE.LIGHT]: ({ item, reader }) => lightHandler({ item, reader }),
  [ITEM_ATTRIBUTE.LIGHT2]: ({ item, reader }) => lightHandler({ item, reader })
}

/**
 * Light attribute shared handler
 * @type {AttributeHandler}
 */
function lightHandler ({ item, reader }) {
  item.attributes.lightLevel = reader.escU16()
  item.attributes.lightColor = reader.escU16()
}

/**
 * Read a string from the binary reader
 * @param {any} reader - The binary reader instance
 * @param {number} length - Number of bytes to read
 * @returns {string} The decoded string
 */
function readString (reader, length) {
  return String.fromCharCode(...reader.escBytes(length))
}
