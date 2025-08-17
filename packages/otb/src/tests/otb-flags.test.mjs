import { describe, it, expect } from 'vitest'
import { getItemFlags, ITEM_FLAG } from '../otb-flags.mjs'
import { snakeCaseToCamelCase } from '@exevo/utils'

const defaultFlags = Object
  .keys(ITEM_FLAG)
  .map(snakeCaseToCamelCase)
  .reduce((acc, flag) => ({ [flag]: false, ...acc }), {})

describe('OTB Flags', () => {
  describe('getItemFlags', () => {
    it('should return all false flags to 0 flagsInt', () => {
      const flags = getItemFlags(0)
      expect(flags).toStrictEqual(defaultFlags)
    })

    it('should parse single flag correctly', () => {
      const flags = getItemFlags(1)
      const firstFlag = Object.values(flags)[0]
      expect(firstFlag).toBeTruthy()
    })

    it('should parse multiple flags correctly', () => {
      const flags = getItemFlags(0xFF) // Multiple flags set
      const trueFlags = Object.values(flags).filter(Boolean)

      expect(trueFlags.length).toBeGreaterThan(1)
    })
  })
})
