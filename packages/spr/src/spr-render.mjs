import { writeFileSync } from 'node:fs'
import { PNG } from 'pngjs'

/**
 * @typedef {import('@exevo/types').Sprite} Sprite
 */

/**
 * @typedef {Object} ImageOptions
 * @property {string} [format='png'] - Output format ('png' or 'bmp')
 * @property {boolean} [transparency=true] - Whether to preserve transparency
 * @property {string} [backgroundColor='#000000'] - Background color for non-transparent images
 * @property {string} [filepath] - Optional output file path
 */

/**
 * @typedef {object} SpriteRender
 * @property {(sprite: Sprite, width?: number, height?: number) => string|null} ascii - Function to convert sprite to ASCII representation
 * @property {(sprite: Sprite, options?: ImageOptions) => PNG|null} png - Function to convert sprite to PNG image
 */

/**
 * Creates a new SpriteRender instance
 * @returns {SpriteRender} - The created SpriteRender instance
 */
export function createSpriteRender () {
  return {
    ascii: toAscii,
    png: toPng
  }

  /**
   * Convert Sprite RGBA data to a simple ASCII representation for debugging
   * @param {Sprite} sprite - sprite object containing RGBA data
   * @param {number} [width=32] - width of the sprite
   * @param {number} [height=32] - height of the sprite
   * @returns {string|null} sprite ASCII representation, or null if RGBA data is missing
   */
  function toAscii (sprite, width = 32, height = 32) {
    const { rgba } = sprite
    let ascii = ''

    if (!rgba) return null

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const a = rgba[index + 3]

        if (a === 0) {
          ascii += ' ' // Transparent
        } else {
          const r = rgba[index]
          const g = rgba[index + 1]
          const b = rgba[index + 2]
          const brightness = (r + g + b) / 3

          if (brightness > 200) ascii += '█' // Bright
          else if (brightness > 150) ascii += '▓' // Medium-bright
          else if (brightness > 100) ascii += '▒' // Medium
          else if (brightness > 50) ascii += '░' // Dark
          else ascii += '▪' // Very dark
        }
      }
      ascii += '\n'
    }

    return ascii
  }

  /**
   * Creates a PNG image from Sprite RGBA data
   * @param {Sprite} sprite - Sprite object with RGBA data
   * @param {ImageOptions} [options={}] - Image rendering options
   * @returns {PNG|null} PNG instance ready for output, or null if RGBA data is missing
   */
  function toPng (sprite, options = {}) {
    const { transparency = true, backgroundColor = '#000000', filepath } = options
    const { rgba, width = 32, height = 32 } = sprite

    if (!rgba) return null

    const png = new PNG({ width, height })

    if (transparency) {
      png.data = Buffer.from(rgba)
    } else {
      const bgColor = hexToRgb(backgroundColor)

      for (let i = 0; i < rgba.length; i += 4) {
        const alpha = rgba[i + 3]

        if (alpha === 0) {
          // Transparent pixel - replace with background
          png.data[i] = bgColor.r
          png.data[i + 1] = bgColor.g
          png.data[i + 2] = bgColor.b
          png.data[i + 3] = 255
        } else {
          // Opaque pixel - copy as is
          png.data[i] = rgba[i]
          png.data[i + 1] = rgba[i + 1]
          png.data[i + 2] = rgba[i + 2]
          png.data[i + 3] = 255
        }
      }
    }

    if (filepath) {
      const buffer = PNG.sync.write(png)
      writeFileSync(filepath, buffer)
    }

    return png
  }

  /**
   * Converts hex color to RGB object
   * @param {string} hex - Hex color string (e.g., '#FF0000' or 'FF0000')
   * @returns {{r: number, g: number, b: number}} RGB color object
   */
  function hexToRgb (hex) {
    const cleanHex = hex.replace('#', '')

    if (cleanHex.length !== 6) {
      throw new Error('Invalid hex color format. Expected format: #RRGGBB')
    }

    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16)
    }
  }
}
