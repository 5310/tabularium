// deno-lint-ignore-file no-unused-vars
import { KND, NST, VAL, VBL, Value, Tabula, TabulaReference } from '../types.ts'
import * as is from './is.ts'
import * as to from './to.ts'
import * as filter from './filter.ts'
import * as core from './tabula/mod.ts'

/**
 * Prototypally links a nested Tabula to allow upward resolution possible and performs other cleanup as side-effect
 */
export const reify = (root: Tabula): Tabula => {
  root[KND] = root[KND] ?? 'bare'
  root[NST] = root?.[NST] ?? {}
  ;[
    ...Object.values(root), 
    ...Object.values(root?.[NST] ?? {})
  ].forEach(
    (nested) => {
      if (is.isTabula(nested)) {
        nested[NST] = nested?.[NST] ?? {}
        Object.setPrototypeOf(nested[NST], root)
        reify(nested)
      }
    }
  )
  return root
}

export const resolve = (context: Tabula, path: TabulaReference): Tabula => {
  //TODO: Implement
  return { [KND]: null }
}

export const interpolate = (context: Tabula, value: Value): Value =>  {
  //TODO: Implement
  return
}

export const roll = (tabula: Tabula, context?: Tabula): Value => {
  //TODO: Implement
  return
}