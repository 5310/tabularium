import { TAG, NST, VAL, Value, Tabula, Result } from './types.ts'
import { yaml } from 'deps'

/* Validators */

export const isNull = (x: unknown): x is null => x === null

export const isUndefined = (x: unknown): x is undefined => x === undefined

export const isBoolean = (x: unknown): x is boolean => typeof x === 'boolean'

export const isNumber = (x: unknown): x is number =>
  typeof x === 'number' && !isNaN(x)

export const isString = (x: unknown): x is string => typeof x === 'string'

export const isArray = (x: unknown): x is Array<unknown> => Array.isArray(x)

export const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && !isNull(x)

export const hasProperty = (x: Record<string, unknown>, property: string) =>
  property in x
export const hasOwnProperty = (x: Record<string, unknown>, property: string) =>
  Object.hasOwn(x, property)

export const isValue = (x: unknown): x is Value =>
  isNull(x) ||
  isUndefined(x) ||
  isBoolean(x) ||
  isNumber(x) ||
  isString(x) ||
  isArray(x) ||
  isObject(x)
export const isValueDeep = (x: unknown): x is Value =>
  isArray(x)
    ? (x as Array<unknown>).every(isValueDeep)
    : isObject(x)
    ? Object.values(x as Record<string, unknown>).every(isValueDeep)
    : isValue(x)

export const isTabula = (x: unknown): x is Tabula => {
  if (isObject(x)) return hasProperty(x as Record<string, unknown>, TAG)
  return false
}
export const isReifiedTabula = (tabula: Tabula) /*: tabula is ReifiedTabula*/ =>
  hasOwnProperty(tabula, NST) &&
  Object.getPrototypeOf(tabula[NST]) !== Object.getPrototypeOf({})

export const isResult = (x: unknown): x is Result => {
  if (isObject(x)) return hasProperty(x as Record<string, unknown>, VAL)
  return false
}

/* Converters */

export const toString = (x: unknown) => String(x)

export const toNumber = (x: unknown) =>
  parseFloat(toString(x).replace(/^[^0-9.]+/, ''))

export const toInteger = (x: unknown) =>
  parseInt(toString(x).replace(/^[^0-9.]+/, ''))

export const toYAML = (x: unknown) => yaml.stringify(x)
export const parseYAML = (x: string) => yaml.parse(x)

export const toJSON = (x: unknown) => JSON.stringify(x)
export const parseJSON = (x: string) => JSON.parse(x)

export const packResult = (x: Value): Result => {
  if (isResult(x)) return x
  else return { [VAL]: x }
}
export const unpackResult = (x: Value): Value => {
  if (isResult(x)) return x[VAL]
  return x
}
