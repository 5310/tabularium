// deno-lint-ignore-file no-unused-vars
import { KND, NST, VAL, VBL, Value, ValueObject, Tabula, TabulaReference, Result } from '../types.ts'
import * as is from './is.ts'
import * as to from './to.ts'
import * as filter from './filter.ts'
import * as core from './tabula/mod.ts'

/**
 * Prototypally links a nested Tabula to allow upward resolution possible and performs other cleanup as side-effect
 */
export const reify = (tabula: Tabula, context?: Tabula): Tabula => {
  if (is.isReified(tabula)) return tabula
  tabula[KND] = (tabula[KND] ?? 'bare').toLowerCase()
  tabula[NST] = tabula?.[NST] ?? {}
  if (!is.isUndefined(context) && context?.[NST]) Object.setPrototypeOf(tabula[NST], context?.[NST] ?? {})
  ;[
    ...Object.values(tabula), 
    ...Object.values(tabula?.[NST] ?? {})
  ].forEach(
    (nested) => {
      if (is.isTabula(nested)) reify(nested, tabula)
    }
  )
  return tabula
}



/**
 * Normalize and split paths into segments
 */
const pathToSegments = (path: TabulaReference) => path.toLowerCase().split(NST).map((segment) => segment.trim()).filter((segment) => !!segment)

/**
 * Resolve a path to a value in a Tabula
 * 
 * If the path given is deeply nested, use resolveDeep, else resolveShallow.
 */
export const resolve = (context: Tabula, path: TabulaReference): Value => {
  if (path.includes('/')) return resolveDeep(context, path)
  return resolveShallow(context, path)
}

/**
 * Resolve a deep path to a value in a Tabula
 * 
 * First try to resolve the full path with ownProperties, and if it doesn't resolve, check up the prototype chain as reified.
 */
const resolveDeep = (context: Tabula, path: TabulaReference): Value => {
  const segments = pathToSegments(path)

  // Try to resolve ownProperties
  const result = segments.reduce(
    (context: Value, segment, i, segments) => {
      if (is.isTabula(context)) {
        const result = context[NST]?.[segment]
        if (i === segments.length - 1) return result
        if (is.isTabula(result)) return result
      }
      return undefined
    }, 
    context
  )

  // If there's no result, try to recurse up the chain
  const chain = Object.getPrototypeOf(context[NST])
  if (is.isUndefined(result) && is.isTabula(chain)) return resolveDeep(chain, path)

  return result
}

/**
 * Resolve a shallow path to a value in a Tabula
 * 
 * Just assume the whole path is shallow and use indiomatic access.
 */
const resolveShallow = (context: Tabula, path: TabulaReference): Value => context?.[NST]?.[path.toLowerCase().trim()]



/**
 * Interpolate template value with the given context tabula
 */
export const interpolate = (context: Tabula, value: Value): Value =>  {
  // If value to interpolate is actually a string, actually interpolate it
  if (is.isString(value)) {
    // Analyze the tokens to interpolate
    const pattern = /\$\{(.+?)\}/g;
    const tokens = Array.from(value.matchAll(pattern))

    let result = value
    tokens.forEach(([token, interpolant]) => {
      // Parse the actual reference, and separate out any filters
      const [reference, ...filters] = interpolant.split('|').map(v => v.trim())
      // Roll the value
      let value = to.toString(roll(resolve(context, reference), context))
      // If there are any valid filters, apply them
      filters.map(f => (filter as Record<string, (input: string) => string>)[f]).filter(filter => !!filter).forEach(f => value = f(value))
      // replace all interpolated tokens in the result
      result = result.replaceAll(token, value)
    });
    return result
  }

  // If it's an array, recurse
  if (is.isArray(value)) return value.map((v) => interpolate(context, v))

  // If it's a tabuka, return it as is
  if (is.isTabula(value)) return value

  // If it's an object, recurse
  if (is.isObject(value)) {
    const result = { ...value }
    let changed = false
    Object.entries(value).forEach(([k, v]) => {
      const v_ = interpolate(context, v)
      if (v !== v_) {
        result[k] = v_
        changed = true
      }
    })
    return changed ? result : value
  }

  return value
}



export const roll = (value: Value, context?: Tabula): Value => {

  if (is.isTabula(value)) {
    // Make sure the tabula is reified and make a local clone
    const value_ = reify(value, context)

    // Interpolate the default value
    value_[VAL] = interpolate(value_, value_[VAL])

    // Recurse all local parameters
    Object.entries(value)
      .filter(([k]) => ![KND, VAL, VBL, NST].includes(k))
      .forEach(([k, v]) => {
        value_[k] = roll(v, value_)
      })

    // Try to evaluate core tabula
    const result = roll(
      (core as Record<string, (tabula: Tabula, context?: Tabula) => Value | Result>)?.[value_[KND]](value_), 
      value_
    )

    // If this is a contextual roll, return only the VAL
    if (is.isResult(result) && context) return result[VAL]
    else return result
  }

  return value
  }