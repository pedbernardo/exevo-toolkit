/**
 * @typedef {import('@exevo/types').BinaryReader} BinaryReader
 */

/**
 * @param {ArrayBuffer|ArrayBufferLike} buffer
 * @returns {BinaryReader}
 */
export function createBinaryReader (buffer) {
  const dv = new DataView(buffer)
  let offset = 0

  return {
    get offset () {
      return offset
    },

    get byteLength () {
      return dv.byteLength
    },

    u8: () => {
      if (offset + 1 > buffer.byteLength) {
        throw new RangeError(`u8() overflow at offset=${offset}`)
      }
      return dv.getUint8(offset++)
    },

    u16: () => {
      if (offset + 2 > buffer.byteLength) {
        throw new RangeError(`u16() overflow at offset=${offset}`)
      }
      const val = dv.getUint16(offset, true)
      offset += 2
      return val
    },

    u32: () => {
      if (offset + 4 > buffer.byteLength) {
        throw new RangeError(`u32() overflow at offset=${offset}`)
      }
      const val = dv.getUint32(offset, true)
      offset += 4
      return val
    },

    u16arr: (n) => {
      const bytesNeeded = n * 2
      if (offset + bytesNeeded > buffer.byteLength) {
        throw new RangeError(`u16arr(${n}) overflow at offset=${offset}, needs ${bytesNeeded} bytes, available: ${buffer.byteLength - offset}`)
      }
      const out = Array(n)
      for (let i = 0; i < n; i++) {
        out[i] = dv.getUint16(offset, true)
        offset += 2
      }
      return out
    },

    skip: (n) => {
      if (offset + n > buffer.byteLength) {
        throw new RangeError(`skip(${n}) overflow at offset=${offset}`)
      }
      offset += n
    },

    seekByte: (target) => {
      if (target < 0 || target > 0xFF) {
        throw new RangeError(`seekByte(${target}) must be between 0 and 255`)
      }
      while (offset < dv.byteLength) {
        if (dv.getUint8(offset) === target) return offset
        offset++
      }
      return -1 // not found
    },

    seek: (pos) => {
      if (pos < 0 || pos > buffer.byteLength) {
        throw new RangeError(`setOffset(${pos}) out of bounds, buffer size: ${buffer.byteLength}`)
      }
      offset = pos
    },

    peekU8: () => {
      if (offset + 1 > buffer.byteLength) {
        throw new RangeError(`peekU8() overflow at offset=${offset}`)
      }
      return dv.getUint8(offset)
    },

    peekU16: () => {
      if (offset + 2 > buffer.byteLength) {
        throw new RangeError(`peekU16() overflow at offset=${offset}`)
      }
      return dv.getUint16(offset, true)
    },

    peekU32: () => {
      if (offset + 4 > buffer.byteLength) {
        throw new RangeError(`peekU32() overflow at offset=${offset}`)
      }
      return dv.getUint32(offset, true)
    }
  }
}
