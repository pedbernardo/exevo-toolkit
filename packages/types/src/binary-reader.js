/**
 * @typedef {object} BinaryReader
 * @property {() => number} u8 - read an 8-bit unsigned integer
 * @property {() => number} u16 - read a 16-bit unsigned integer (little-endian)
 * @property {() => number} u32 - read a 32-bit unsigned integer (little-endian)
 * @property {(n: number) => number[]} u16arr - read an array of n 16-bit unsigned integers
 * @property {(n: number) => void} skip - skip n bytes
 * @property {(pos: number) => void} seek - set the current offset position
 * @property {(target: number) => number} seekByte - find the next occurrence of a byte
 * @property {number} offset - current offset position
 * @property {number} byteLength - current DataView byteLength
 * @property {() => number} peekU8 - peek at the next 8-bit unsigned integer without advancing the offset
 * @property {() => number} peekU16 - peek at the next 16-bit unsigned integer without advancing the offset
 * @property {() => number} peekU32 - peek at the next 32-bit unsigned integer without advancing the offset
 */

// Export the type for TypeScript
export const BinaryReader = undefined
