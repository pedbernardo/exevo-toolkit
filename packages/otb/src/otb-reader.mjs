import { createBinaryReader } from '@exevo/utils'
import { NODE_SPECIAL_BYTE } from './otb-config.mjs'

/**
 * @typedef {import('@exevo/types').OtbReader} OtbReader
 */

/**
 * Enhanced binary reader for OTB format with escape sequence support
 * @param {ArrayBuffer|ArrayBufferLike} buffer - The buffer to read from
 * @returns {OtbReader} Enhanced binary reader with OTB-specific methods
 */
export function createOtbReader (buffer) {
  const baseReader = createBinaryReader(buffer)
  const reader = Object.create(baseReader)

  Object.assign(reader, {
    escByte,
    escBytes,
    escU16,
    escU32,
    escU64,
    peekEscByte,
    peekU8At,
    nextSpecialByte,
  })

  return reader

  /**
   * Read a byte with escape sequence handling
   * @returns {number} The unescaped byte value
   */
  function escByte () {
    const specialBytes = Object.values(NODE_SPECIAL_BYTE)
    const byte = baseReader.u8()

    if (byte === NODE_SPECIAL_BYTE.ESCAPE_CHAR) {
      const nextByte = baseReader.u8()
      if (specialBytes.includes(nextByte)) return nextByte
      // If next byte is not a special byte, put it back by adjusting offset
      baseReader.seek(baseReader.offset - 1)
      return byte
    }

    return byte
  }

  /**
   * Read multiple bytes with escape sequence handling
   * @param {number} amount - Number of bytes to read
   * @returns {Uint8Array} Array of unescaped bytes
   */
  function escBytes (amount) {
    const bytes = new Uint8Array(amount)
    for (let i = 0; i < amount; i++) {
      bytes[i] = escByte()
    }
    return bytes
  }

  /**
   * Read a 16-bit unsigned integer with escape sequence handling
   * @returns {number} The 16-bit value
   */
  function escU16 () {
    const byte1 = escByte()
    const byte2 = escByte()
    return byte1 | (byte2 << 8)
  }

  /**
   * Read a 32-bit unsigned integer with escape sequence handling
   * @returns {number} The 32-bit value
   */
  function escU32 () {
    const byte1 = escByte()
    const byte2 = escByte()
    const byte3 = escByte()
    const byte4 = escByte()
    return ((byte1) | (byte2 << 8) | (byte3 << 16)) + (byte4 * 0x1000000)
  }

  /**
   * Read a 64-bit value with escape sequence handling
   * @returns {number} The 64-bit value (may lose precision for very large numbers)
   */
  function escU64 () {
    let low = 0
    let high = 0

    for (let i = 0; i < 4; i++) {
      low |= escByte() << (8 * i)
    }
    for (let i = 0; i < 4; i++) {
      high |= escByte() << (8 * i)
    }
    return high * 0x100000000 + low
  }

  /**
   * Peek at the next escaped byte without advancing offset
   * @returns {number} The escaped byte value
   */
  function peekEscByte () {
    const pos = baseReader.offset
    const byte = escByte()

    if (baseReader.offset >= baseReader.byteLength) return 0

    baseReader.seek(pos)
    return byte
  }

  /**
   * Get byte at specific position without changing reader offset
   * @param {number} position - Position to read from
   * @returns {number} Byte value at position
   */
  function peekU8At (position) {
    if (position < 0 || position >= baseReader.byteLength) {
      throw new Error(`Position ${position} out of bounds`)
    }
    const currentOffset = baseReader.offset
    baseReader.seek(position)
    const byte = baseReader.peekU8()
    baseReader.seek(currentOffset)
    return byte
  }

  /**
   * Finds the next START or END byte and advances reader position past it
   * @returns {number} Position of next special byte, or -1 if not found
   */
  function nextSpecialByte () {
    let nextSpecialBytePosition = -1

    if (baseReader.offset >= baseReader.byteLength) return nextSpecialBytePosition

    while (baseReader.offset < baseReader.byteLength) {
      const before = baseReader.offset
      const byte = escByte() // advances by 1 or 2 depending on escape
      const hasEscaped = (baseReader.offset - before) > 1
      const hasEspecialStartOrEnd = (byte === NODE_SPECIAL_BYTE.START || byte === NODE_SPECIAL_BYTE.END)

      if (hasEspecialStartOrEnd && !hasEscaped) {
        nextSpecialBytePosition = baseReader.offset - 1
        break
      }
    }

    return nextSpecialBytePosition
  }
}
