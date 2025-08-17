export type BinaryReader = {
    /**
     * - read an 8-bit unsigned integer
     */
    u8: () => number;
    /**
     * - read a 16-bit unsigned integer (little-endian)
     */
    u16: () => number;
    /**
     * - read a 32-bit unsigned integer (little-endian)
     */
    u32: () => number;
    /**
     * - read an array of n 16-bit unsigned integers
     */
    u16arr: (n: number) => number[];
    /**
     * - skip n bytes
     */
    skip: (n: number) => void;
    /**
     * - set the current offset position
     */
    seek: (pos: number) => void;
    /**
     * - find the next occurrence of a byte
     */
    seekByte: (target: number) => number;
    /**
     * - current offset position
     */
    offset: number;
    /**
     * - current DataView byteLength
     */
    byteLength: number;
    /**
     * - peek at the next 8-bit unsigned integer without advancing the offset
     */
    peekU8: () => number;
    /**
     * - peek at the next 16-bit unsigned integer without advancing the offset
     */
    peekU16: () => number;
    /**
     * - peek at the next 32-bit unsigned integer without advancing the offset
     */
    peekU32: () => number;
};
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
export const BinaryReader: any;
