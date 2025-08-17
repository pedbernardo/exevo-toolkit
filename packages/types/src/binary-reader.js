/**
 * @typedef {object} BinaryReader
 * @property {() => number} u8 - Read an 8-bit unsigned integer
 * @property {() => number} u16 - Read a 16-bit unsigned integer (little-endian)
 * @property {() => number} u32 - Read a 32-bit unsigned integer (little-endian)
 * @property {(n: number) => number[]} u16arr - Read an array of n 16-bit unsigned integers
 * @property {(n: number) => void} skip - Skip n bytes
 * @property {(pos: number) => void} seek - Set the current offset position
 * @property {(target: number) => number} seekByte - Find the next occurrence of a byte
 * @property {number} offset - Current offset position
 * @property {number} byteLength - current DataView byteLength
 * @property {() => number} peekU8 - Peek at the next 8-bit unsigned integer without advancing the offset
 * @property {() => number} peekU16 - Peek at the next 16-bit unsigned integer without advancing the offset
 * @property {() => number} peekU32 - Peek at the next 32-bit unsigned integer without advancing the offset
 */

// Export the type for TypeScript
export const BinaryReader = undefined
