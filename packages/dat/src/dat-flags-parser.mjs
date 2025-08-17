import { snakeCaseToCamelCase } from '@exevo/utils'

/**
 * Parses a file buffer from .dat file to extract readable in-game flag attributes.
 *
 * The `.dat` file defines the properties of game entities ("things") - such as
 * items, grounds, creatures, and more. It contains:
 *  - Sprite references that compose each entity
 *  - Layout properties
 *  - Flags representing in-game attributes (e.g., stackable, ground, fluid, container)
 *
 * This parser translates a binary *flagint* value into a human-readable format.
 * Using a flag map (`{ <FLAG_NAME>: <FLAG_INT_VALUE> }`), attributes are converted into:
 *  1. **Simple objects** — `{ <flagName>: true }`
 *  2. **Complex structures** — defined in the `ADVANCED_RULES` tuples, where attributes
 *     are expanded into objects like `{ <flagName>: { propA: valueInt, propB: valueInt } }`.
 *     Integer values are read from the following 4 bytes (`u16`).
 *
 * @example
 * // Example flag map. See the full flags at ./dat-flags.mjs
 * const FLAG_MAP = { ..., LIGHT_INFO: 16, CONTAINER: 3 }
 *
 * // Example binary flagint value
 * const flagInt = 3
 *
 * // Parse result from a simple object
 * createBinaryReader(FLAG_MAP).parse(flagInt)
 * // → { container: true }
 *
 * // Parse result from a complex object
 * createBinaryReader(FLAG_MAP).parse(flagInt, <ArrayBuffer>)
 * // → { lightInfo: { level: 3, color: 215 } }
 */

/**
 * @typedef {import('@exevo/types').BinaryReader} BinaryReader
 * @typedef {import('@exevo/types').FlagValue} FlagValue
 * @typedef {import('@exevo/types').RulesMap} RulesMap
 * @typedef {import('@exevo/types').MultiRule} MultiRule
 * @typedef {import('@exevo/types').AdvancedRule} AdvancedRule
 */

/**
 * Creates a parser for .dat attribute flags
 * @param {Record<string, number>} flags - map of flag names to their values
 * @return {{ parse: (flag: number, reader?: BinaryReader) => FlagValue | false, rules: RulesMap }} - parser API
 */
export function createFlagsParser (flags) {
  /** @type {RulesMap} */
  const rules = new Map()

  Object.entries(flags).forEach(([flagName, flagValue]) => {
    const displayName = snakeCaseToCamelCase(flagName)
    const advancedRule = ADVANCED_RULES[flagName]

    if (!advancedRule) {
      rules.set(flagValue, {
        displayName,
        parser: defaultRule
      })
      return
    }

    const rule = normalizeRule(advancedRule)

    rules.set(flagValue, {
      displayName,
      parser: buildRule(rule)
    })
  })

  return {
    get rules () { return rules },
    parse
  }

  /**
   * Parses a flag attribute from the binary stream
   * @param {number} flag - flag value to parse
   * @param {BinaryReader} [reader] - binary reader instance
   * @returns {FlagValue|false} - parsed flag definition or false if not found
   */
  function parse (flag, reader) {
    const rule = rules.get(flag)
    if (!rule) return false
    return rule.parser(rule.displayName, reader)
  }

  /**
   * Normalizes an advanced rule definition.
   * @param {any} rule - rule to parse
   * @returns {MultiRule} - normalized rule
   */
  function normalizeRule (rule) {
    const [attr, parser] = rule
    const isMultiple = Array.isArray(attr)

    if (!isMultiple) return [[attr], [parser]]

    return rule
  }

  /**
   * Gets the default rule parser for flag attributes.
   * Only used for simple boolean flags
   * @example { fluid: true }
   * @param {string} displayName - flag's display name
   * @returns {FlagValue} - parsed flag value
   */
  function defaultRule (displayName) {
    return { [displayName]: true }
  }

  /**
   * Builds a advanced rule function from a normalized rule.
   * @example rule() >> { lightInfo: { level: 0, color: 0 } }
   * @param {MultiRule} rule - normalized rule
   * @return {(displayName: string, reader: BinaryReader) => NestedFlagValue}
   * @typedef {Record<string, Record<string, any>>} NestedFlagValue
   */
  function buildRule (rule) {
    const [attrs, parsers] = rule
    return (displayName, reader) =>
      /**
       * @param {FlagValue} acc
       * @param {string} attr
       * @param {number} index
       */
      attrs.reduce((acc, attr, index) => {
        acc[displayName][attr] = parsers[index](reader)
        return acc
      },
      /** @type {NestedFlagValue} */ ({ [displayName]: {} }))
  }
}

/**
 * Creates reader function to read flag attributes values
 * @param {BinaryReader} reader - binary reader instance
 * @returns {number} - reads and advances 16-bit unsigned integer from the binary stream
 */
const flagReader = reader => reader.u16()

/**
 * @type {Record<string, AdvancedRule>}
 */
const ADVANCED_RULES = {
  GROUND: ['speed', flagReader],
  WRITABLE: ['length', flagReader],
  WRITABLE_ONCE: ['length', flagReader],
  LIGHT_INFO: [['level', 'color'], [flagReader, flagReader]],
  HAS_OFFSET: [['offsetX', 'offsetY'], [flagReader, flagReader]],
  HAS_ELEVATION: ['height', flagReader],
  MINIMAP: ['color', flagReader],
  LENS_HELP: ['value', flagReader]
}
