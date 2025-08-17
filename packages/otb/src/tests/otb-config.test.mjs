import { describe, it, expect } from 'vitest'
import { isOtbVersionSupported } from '../otb-config.mjs'

describe('OTB Config', () => {
  it('should return false when major version is unsupported', () => {
    const unsupportedMajorVersion = 4
    expect(isOtbVersionSupported(unsupportedMajorVersion)).toBe(false)
  })

  it('should return true when major version is supported', () => {
    const supportedMajorVersion = 2
    expect(isOtbVersionSupported(supportedMajorVersion)).toBe(true)
  })
})
