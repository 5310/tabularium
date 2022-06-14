import {
  TAG,
  NST,
  DAT,
  Value,
  Tabula,
  TabulaReference,
  ReifiedTabula,
  Result,
} from './types.ts'
import {
  isUndefined,
  isString,
  isArray,
  isObject,
  isTabula,
  isReifiedTabula,
  hasOwnProperty,
  toString,
  unpackResult,
} from './utils.ts'
import filters from './filters/mod.ts'
import tabulas from './tabulas/mod.ts'

// TODO: Make pure
/**
 * Evaluate a given value as a tabula, or return it as-is.
 *
 * @param target  Value to evaluate
 * @param verbose Whether to return a Result object or just the main value
 * @returns       The evaluated value
 */
export const tabulate = (target: Value, verbose?: boolean): Value => {
  if (isTabula(target)) {
    // Make sure the tabula is reified
    const target_ = reify(target)

    // Interpolate the default targets
    target_[DAT] = interpolate(target_, target_[DAT])

    // Recurse all local parameters
    Object.entries(target)
      .filter(([k]) => ![TAG, DAT, NST].includes(k))
      .forEach(([k, v]) => {
        target_[k] = tabulate(v)
      })

    // Try to evaluate core tabula
    const result_ = tabulate(
      (
        tabulas as Record<string, (tabula: Tabula, context?: Tabula) => Result>
      )?.[target_[TAG]](target_),
    )

    console.log({ target_, result_ })

    // If extra result is asked, reshape return
    if (!verbose) return unpackResult(result_)
  }

  return target
}

/**
 * Prepare a tabula definition to be used by the tabularium engine.
 *
 * @param definition The tabula definition object
 * @returns          A reified tabula
 */
export const reify = (definition: Tabula): ReifiedTabula => {
  if (isReifiedTabula(definition)) return definition
  definition[TAG] = (definition[TAG] ?? 'bare').toLowerCase()
  definition[NST] = definition?.[NST] ?? {}
  ;[
    ...Object.values(definition),
    ...Object.values(definition?.[NST] ?? {}),
  ].forEach((nested) => {
    if (isTabula(nested)) reify(nested)
  })
  return definition
}

/**
 * Return the value within a tabula given a reference, if any.
 *
 * All references are resolved bottom-up, depth-first.
 * This means deeply nested references are all fully resolved locally,
 * and then up the chain.
 *
 * @param context   The context to resolve the reference in
 * @param reference A tabula by nested name or path
 * @returns         The value at the reference, or undefined if not found
 */
export const resolve = (
  context: ReifiedTabula,
  reference: TabulaReference,
): Value => {
  if (reference.includes('/')) return resolveDeep(context, reference)
  return resolveShallow(context, reference)
}

/**
 * Normalize and split paths into segments
 */
const pathToSegments = (path: TabulaReference) =>
  path
    .toLowerCase()
    .split(NST)
    .map((segment) => segment.trim())
    .filter((segment) => !!segment)

/**
 * Resolve a deep path to a value in a Tabula
 *
 * First try to resolve the full path with ownProperties, and if it doesn't resolve, check up the prototype chain as reified.
 */
const resolveDeep = (
  context: ReifiedTabula,
  reference: TabulaReference,
): Value => {
  const segments = pathToSegments(reference)

  // Try to resolve ownProperties
  const result = segments.reduce((context: Value, segment, i, segments) => {
    if (isTabula(context) && hasOwnProperty(context[NST] as Tabula, segment)) {
      const result = context[NST]?.[segment]
      if (i === segments.length - 1) return result
      if (isTabula(result)) return result
    }
    return undefined
  }, context)

  // If there's no result, try to recurse up the chain
  const chain = Object.getPrototypeOf(context[NST])
  if (isUndefined(result) && isTabula(chain))
    return resolveDeep(chain, reference)

  return result
}

/**
 * Resolve a shallow path to a value in a Tabula
 *
 * Just assume the whole path is shallow and use indiomatic access.
 */
const resolveShallow = (
  context: ReifiedTabula,
  reference: TabulaReference,
): Value => context?.[NST]?.[reference.toLowerCase().trim()]

// TODO: Make pure
/**
 * Interpolate strings within the template value referencing the tabula context
 *
 * @param context  The context to resolve template tokens in
 * @param template The template value to interpolate
 * @returns        The interpolated template
 */
export const interpolate = (context: ReifiedTabula, template: Value): Value => {
  // If value to interpolate is actually a string, actually interpolate it
  if (isString(template)) {
    // Analyze the tokens to interpolate
    const pattern = /\$\{(.+?)\}/g
    const tokens = Array.from(template.matchAll(pattern))

    let result = template
    tokens.forEach(([token, interpolant]) => {
      // Parse the actual reference, and separate out any filters
      const [reference, ...fs] = interpolant.split('|').map((v) => v.trim())
      // Roll the template
      let template = toString(tabulate(resolve(context, reference)))
      // If there are any valid filters, apply them
      fs.map((f) => (filters as Record<string, (input: string) => string>)[f])
        .filter((filter) => !!filter)
        .forEach((f) => (template = f(template)))
      // replace all interpolated tokens in the result
      result = result.replaceAll(token, template)
    })
    return result
  }

  // If it's an array, recurse
  if (isArray(template)) return template.map((v) => interpolate(context, v))

  // If it's a tabuka, return it as is
  if (isTabula(template)) return template

  // If it's an object, recurse
  if (isObject(template)) {
    const result = { ...template }
    let changed = false
    Object.entries(template).forEach(([k, v]) => {
      const v_ = interpolate(context, v)
      if (v !== v_) {
        result[k] = v_
        changed = true
      }
    })
    return changed ? result : template
  }

  return template
}
