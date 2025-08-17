import { DAT_FLAG_END_MARK, DAT_SIGNATURES, getThingsGroups } from './dat-config.mjs'
import { createBinaryReader, rangeReduce, getVersionFeatures } from '@exevo/utils'
import { getDatFlags } from './dat-flags.mjs'
import { createFlagsParser } from './dat-flags-parser.mjs'
import { pipe } from 'ramda'

/**
 * A factory function to create a .dat file reader instance.
 * @param {ArrayBuffer|ArrayBufferLike} buffer - ArrayBuffer containing the .dat file data
 * @param {number} version - version number to specify the .dat file version
 * @returns {DatManager} DatManager instance
 */
export function DatManager (buffer, version) {
  const reader = createBinaryReader(buffer)

  /** @type {DatProps} */
  const props = {
    isLoaded: false,
    version,
    signature: reader.u32(),
    features: getVersionFeatures(version),
    flags: getDatFlags(version),
    counts: { items: 0, creatures: 0, effects: 0, missiles: 0 },
    things: new Map()
  }

  const flagsParser = createFlagsParser(props.flags)

  init()

  return {
    load,
    getThing: id => props.things?.get(id),
    get signature () { return props.signature },
    get signatureHex () { return props.signature.toString(16).padStart(8, '0').toUpperCase() },
    get counts () { return props.counts },
    get version () { return props.version },
    get isLoaded () { return props.isLoaded },
    get things () { return props.things },
  }

  /**
   * Initializes the DatManager instance by validating the input buffer and version.
   * @private
   */
  function init () {
    const isBuffer = buffer instanceof ArrayBuffer
    const signatureVersion = DAT_SIGNATURES[version]

    if (!isBuffer) {
      throw new TypeError('Expected an ArrayBuffer as input')
    }

    if (!version) {
      throw new Error('Version must be specified for the .dat file')
    }

    if (!signatureVersion) {
      throw new Error(`Unsupported version: ${version}. Supported versions are: ${Object.keys(DAT_SIGNATURES).join(', ')}`)
    }

    if (signatureVersion !== props.signature) {
      throw new Error(`Version ${version} signature mismatch: expected ${signatureVersion}, got ${props.signature}`)
    }
  }

  /**
   * Load the .dat file data.
   * @public
   * @returns {boolean} true if loaded successfully, false otherwise
   */
  function load () {
    try {
      if (props.isLoaded) return true

      parseHeader()
      parseThings()

      props.isLoaded = true
    } catch (error) {
      console.error('Error loading DAT file:', error)
    }

    return props.isLoaded
  }

  function parseHeader () {
    props.counts = {
      items: reader.u16(),
      creatures: reader.u16(),
      effects: reader.u16(),
      missiles: reader.u16()
    }
  }

  function parseThings () {
    const { items, creatures, effects, missiles } = getThingsGroups()
    const { counts } = props
    const itemsCount = counts.items - items.startId + 1

    props.things = pipe(
      createThingParser(items.startId, itemsCount, items.group),
      createThingParser(creatures.startId, counts.creatures, creatures.group),
      createThingParser(effects.startId, counts.effects, effects.group),
      createThingParser(missiles.startId, counts.missiles, missiles.group)
    )(new Map())
  }

  /**
   * Creates a parser function for a specific range of thing ids.
   * @param {number} startId - starting id of the things to parse
   * @param {number} count - number of things to parse
   * @param {string} groupName - name of the group the things belong to
   * @returns {(things: ThingsMap) => ThingsMap} parser function
   */
  function createThingParser (startId, count, groupName) {
    /**
     * Parses a range of thing ids and adds them to the provided things map.
     * @param {Map<number, Thing>} things - map to add parsed things to
     * @returns {ThingsMap} things with parsed items
     */
    return things => rangeReduce({
      start: startId,
      end: startId + count,
      initial: things,
      step: (map, id) => {
        const thing = parseThing(groupName, id)
        if (thing) map.set(id, thing)
        return map
      }
    })
  }

  /**
   * Parses a single thing (item, creature, effect, or missile) from the .dat file.
   * @param {string} group - group name of the thing being parsed
   * @param {number} id - id of the thing being parsed
   * @returns {Thing|null} parsed thing object, or null if parsing failed
   */
  function parseThing (group, id) {
    try {
      const thing = {}

      thing.cid = id
      thing.group = group

      // thing order props matters!
      // we are reading from binary buffer
      thing.flags = parseThingFlags(id)
      thing.layout = parseThingLayout()
      thing.spriteIds = parseThingSprites(thing.layout)

      // partial parse it's accepted
      // but layout is a minimal requirement
      if (!thing.layout) return null

      return /** @type {Thing} */ (thing)
    } catch (error) {
      console.error(`Could not parse .dat thing ${id} in group ${group}, error:`, error)
      if (error instanceof RangeError) return null
      throw error
    }
  }

  /**
   * Parses the flags/attributes for a thing.
   * @param {number} id - client id of the thing being parsed
   * @returns {ThingFlags} parsed flags object
   */
  function parseThingFlags (id) {
    /** @type {ThingFlags} */
    let flags = {}
    let currentFlag = reader.u8()

    while (currentFlag < DAT_FLAG_END_MARK) {
      const flag = flagsParser.parse(currentFlag, reader)

      if (!flag) {
        console.warn(`Failed to parse attribute ${currentFlag} from thing id ${id}`)
      } else {
        flags = { ...flags, ...flag }
      }

      currentFlag = reader.u8()
    }

    return flags
  }

  /**
   * Parses the layout, dimensions and frames of a thing.
   * @returns {ThingLayout|undefined} layout object, or undefined if parsing failed
   */
  function parseThingLayout () {
    const layout = {
      width: reader.u8(),
      height: reader.u8(),
      layers: 0,
      patternX: 0,
      patternY: 0,
      patternZ: 1,
      frames: 0,
      realSize: 32,
      exactSize: 0,
    }

    // read exact size byte for composed items
    if (layout.width > 1 || layout.height > 1) {
      layout.realSize = reader.u8()
    }

    layout.exactSize = Math.min(layout.realSize, Math.max(layout.width * 32, layout.height * 32))
    layout.layers = reader.u8()
    layout.patternX = reader.u8()
    layout.patternY = reader.u8()

    // patternZ was introduced in version 7.55
    if (props.features.patternZ) {
      layout.patternZ = reader.u8()
    }

    layout.frames = reader.u8()

    return layout
  }

  /**
   * Parses the sprite ids for a thing based on its layout.
   * Deals with sprite facing directions (North, East, South, West)
   * @param {ThingLayout} [layout] - layout object containing dimensions
   * @returns {number[]} array of sprite ids
   */
  function parseThingSprites (layout) {
    if (!layout) return []

    const { width, height, layers, patternX, patternY, patternZ, frames } = layout
    const numSprites = width * height * layers * patternX * patternY * patternZ * frames
    const idByteSize = props.features.extendedSprites ? 4 : 2
    const spriteIds = new Array(numSprites)

    for (let i = 0; i < numSprites; i++) {
      const spriteId = idByteSize === 4 ? reader.u32() : reader.u16()
      // optimizes memory by reducing GC pressure
      spriteIds[i] = spriteId
    }

    return spriteIds
  }
}
