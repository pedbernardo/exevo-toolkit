import { describe, it, expect } from 'vitest'
import { getDatFlags } from '../dat-flags.mjs'
import { createFlagsParser } from '../dat-flags-parser.mjs'
import { createBinaryReader } from '@exevo/utils'

describe('DAT Flags Reader', () => {
  it('should create a RuleEntry for each flag', () => {
    const flags = getDatFlags(710)
    const flagsSize = Object.keys(flags).length
    const flagsParser = createFlagsParser(flags)
    const rules = flagsParser.rules

    expect(rules.size).toBe(flagsSize)
  })

  it('should create a "simple" RuleEntry for flags without advanced rules', () => {
    const flags = getDatFlags(710)
    const flagsParser = createFlagsParser(flags)
    const containerAttr = flags.CONTAINER
    const attr = flagsParser.parse(containerAttr)
    const expected = { container: true }

    expect(attr).toEqual(expected)
  })

  it('should create a "advanced" RuleEntry for flags with advanced rules with one prop', () => {
    const reader = createBinaryReader(new ArrayBuffer(4))
    const flags = getDatFlags(710)
    const flagsParser = createFlagsParser(flags)
    const groundAttr = flags.GROUND
    const attr = flagsParser.parse(groundAttr, reader)
    const expected = { ground: { speed: 0 } }

    expect(attr).toEqual(expected)
  })

  it('should create a "advanced" RuleEntry for flags with advanced rules with many props', () => {
    const reader = createBinaryReader(new ArrayBuffer(8))
    const flags = getDatFlags(772)
    const flagsParser = createFlagsParser(flags)
    const lightAttr = flags.LIGHT_INFO
    const attr = flagsParser.parse(lightAttr, reader)
    const expected = { lightInfo: { level: 0, color: 0 } }

    expect(attr).toEqual(expected)
  })

  it('should return false for unsupported flags', () => {
    const flags = getDatFlags(772)
    const flagsParser = createFlagsParser(flags)
    const attr = flagsParser.parse(999)

    expect(attr).toEqual(false)
  })
})
