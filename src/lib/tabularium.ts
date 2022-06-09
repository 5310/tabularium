// deno-lint-ignore-file no-unused-vars
import { KND, NST, VAL, VBL, Value, Tabula, TabulaReference } from '../types.ts'
import * as is from './is.ts'
import * as to from './to.ts'
import * as filter from './filter.ts'
import * as core from './tabula/mod.ts'

/**
 * Prototypally links a nested Tabula to allow upward resolution possible and performs other cleanup as side-effect
 */
export const reify = (context: Tabula): Tabula => {
  if (!is.isTabula(context)) return context
  context[KND] = (context[KND] ?? 'bare').toLowerCase()
  context[NST] = context?.[NST] ?? {}
  ;[
    ...Object.values(context), 
    ...Object.values(context?.[NST] ?? {})
  ].forEach(
    (nested) => {
      if (is.isTabula(nested)) {
        nested[NST] = nested?.[NST] ?? {}
        Object.setPrototypeOf(nested[NST], context?.[NST] as Record<string, Value>)
        reify(nested)
      }
    }
  )
  return context
}



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

export const roll = (tabula: Value, context?: Tabula): Value => {
  //TODO: Implement
  return tabula
}