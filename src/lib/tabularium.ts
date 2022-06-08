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
  context[KND] = context[KND] ?? 'bare'
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

export const resolve = (context: Tabula, path: TabulaReference): Value => {
  const segments = path.toLowerCase().split(NST).map((segment) => segment.trim()).filter((segment) => !!segment)

  return segments.reduce(
    (context: Value, segment: string) => {
      console.log(context)
      if (is.isUndefined(context)) return undefined
      if (!is.isTabula(context)) return context
      const nested = context?.[NST]?.[segment]
      if (!is.isUndefined(nested)) return nested
      return undefined
    }, 
    context
  )
}

export const interpolate = (context: Tabula, value: Value): Value =>  {
  //TODO: Implement
  return
}

export const roll = (tabula: Tabula, context?: Tabula): Value => {
  //TODO: Implement
  return
}