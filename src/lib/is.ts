import { KND, VAL, VBL } from '../types.ts'

export const isNull = (x: unknown) => x === null

export const isUndefined = (x: unknown) => x === undefined

export const isBoolean = (x: unknown) => typeof x === 'boolean'

export const isNumber = (x: unknown) => typeof x === 'number' && !isNaN(x)

export const isString = (x: unknown) => typeof x === "string"

export const isArray = (x: unknown) => Array.isArray(x)

export const isObject = (x: unknown) => typeof x === "object" && !isNull(x)

export const isValue = (x: unknown) => isNull(x) || isUndefined(x) || isBoolean(x) || isNumber(x) || isString(x) || isArray(x) || isObject(x)

export const isValueDeep = (x: unknown): boolean => 
  isArray(x) ? (x as Array<unknown>).every(isValueDeep)
  : isObject(x) ? Object.values(x as Record<string, unknown>).every(isValueDeep)
  : isValue(x)

export const isTabula = (x: unknown) => isObject(x) && !isUndefined((x as Record<string, unknown>)[KND])

export const isResult = (x: unknown) => isObject(x) && !isUndefined((x as Record<string, unknown>)[VBL]) && !isUndefined((x as Record<string, unknown>)[VAL])