/**
 * Iterate over a numeric range with an accumulator and optional early exit.
 * @template T
 * @param {object} params
 * @param {number} params.start - Starting ID (inclusive)
 * @param {number} params.end - Ending ID (exclusive)
 * @param {T} params.initial - Initial accumulator value
 * @param {(acc: T, id: number) => T | false} params.step - Callback, return false to stop early
 * @returns {T}
 */
export function rangeReduce ({ start, end, initial, step }) {
  let acc = initial
  for (let id = start; id < end; id++) {
    const result = step(acc, id)
    if (result === false) break
    acc = result
  }
  return acc
}

/**
 * A higher-order function that composes a sequence of functions into a single pipeline.
 * @template T
 * @param {...(state: T) => T | null | false} steps - sequence of functions to execute
 * @returns {(context: T) => T | null} a new function that takes an initial state and runs the pipeline
 */
export const flow = (...steps) => context => {
  let state = context
  for (const step of steps) {
    const result = step(state)
    if (!result) return null
    state = result
  }
  return state
}
