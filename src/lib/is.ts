import { KND, VAL, VBL, Value, Tabula, Result } from '../types.ts'

export const isNull = (x: unknown): x is null => x === null

export const isUndefined = (x: unknown): x is undefined => x === undefined

export const isBoolean = (x: unknown): x is boolean => typeof x === 'boolean'

export const isNumber = (x: unknown): x is number => typeof x === 'number' && !isNaN(x)

export const isString = (x: unknown): x is string => typeof x === "string"

export const isArray = (x: unknown): x is Array<unknown> => Array.isArray(x)

export const isObject = (x: unknown): x is Record<string, unknown> => typeof x === "object" && !isNull(x)

export const isValue = (x: unknown): x is Value => isNull(x) || isUndefined(x) || isBoolean(x) || isNumber(x) || isString(x) || isArray(x) || isObject(x)

export const isValueDeep = (x: unknown): x is Value => 
  isArray(x) ? (x as Array<unknown>).every(isValueDeep)
  : isObject(x) ? Object.values(x as Record<string, unknown>).every(isValueDeep)
  : isValue(x)

export const isTabula = (x: unknown): x is Tabula => isObject(x) && !isUndefined((x as Record<string, unknown>)[KND])

export const isResult = (x: unknown): x is Result => isObject(x) && !isUndefined((x as Record<string, unknown>)[VBL]) && !isUndefined((x as Record<string, unknown>)[VAL])