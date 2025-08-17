export type BinaryReader = {
    /**
     * - Read an 8-bit unsigned integer
     */
    u8: () => number;
    /**
     * - Read a 16-bit unsigned integer (little-endian)
     */
    u16: () => number;
    /**
     * - Read a 32-bit unsigned integer (little-endian)
     */
    u32: () => number;
    /**
     * - Read an array of n 16-bit unsigned integers
     */
    u16arr: (n: number) => number[];
    /**
     * - Skip n bytes
     */
    skip: (n: number) => void;
    /**
     * - Set the current offset position
     */
    seek: (pos: number) => void;
    /**
     * - Find the next occurrence of a byte
     */
    seekByte: (target: number) => number;
    /**
     * - Current offset position
     */
    offset: number;
    /**
     * - current DataView byteLength
     */
    byteLength: number;
    /**
     * - Peek at the next 8-bit unsigned integer without advancing the offset
     */
    peekU8: () => number;
    /**
     * - Peek at the next 16-bit unsigned integer without advancing the offset
     */
    peekU16: () => number;
    /**
     * - Peek at the next 32-bit unsigned integer without advancing the offset
     */
    peekU32: () => number;
};
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
export const BinaryReader: any;
