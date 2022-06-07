// deno-lint-ignore-file no-unused-vars
import { KND, NST, VAL, VBL, Value, Tabula, TabulaReference } from '../types.ts'
import * as is from './is.ts'
import * as to from './to.ts'
import * as filters from './filters.ts'
import * as core from './tabula/mod.ts'

export const reify = (root: Tabula): Tabula => {
  //TODO: Implement
  return { [KND]: null }
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