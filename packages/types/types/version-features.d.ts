export type VersionFeatures = {
    /**
     * - add support for pattern Z dimension - introduced in 7.55
     */
    patternZ: boolean;
    /**
     * - add support for RGBA transparency (4 bytes per pixel) - introduced in 7.55
     */
    transparency: boolean;
    /**
     * - U32 sprite IDs (vs U16) - introduced in 9.60
     */
    extendedSprites: boolean;
    /**
     * - enhanced animation system - introduced in 10.10
     */
    animations: boolean;
    /**
     * - idle animation frame groups - introduced in 10.20
     */
    idleAnimations: boolean;
    /**
     * - custom frame durations - introduced in 10.30
     */
    frameDurations: boolean;
    /**
     * - frame group support - introduced in 10.90
     */
    frameGroups: boolean;
};
/**
 * @typedef {object} VersionFeatures
 * @property {boolean} patternZ - add support for pattern Z dimension - introduced in 7.55
 * @property {boolean} transparency - add support for RGBA transparency (4 bytes per pixel) - introduced in 7.55
 * @property {boolean} extendedSprites - U32 sprite IDs (vs U16) - introduced in 9.60
 * @property {boolean} animations - enhanced animation system - introduced in 10.10
 * @property {boolean} idleAnimations - idle animation frame groups - introduced in 10.20
 * @property {boolean} frameDurations - custom frame durations - introduced in 10.30
 * @property {boolean} frameGroups - frame group support - introduced in 10.90
 */
export const VersionFeatures: any;
