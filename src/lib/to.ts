import { VAL, VBL, Value, Result } from '../types.ts'
import { isResult } from './is.ts'
import { yaml } from 'deps'

export const toString = (x: unknown) => String(x)

export const toNumber = (x: unknown) =>
  parseFloat(toString(x).replace(/^[^0-9.]+/, ''))

export const toInteger = (x: unknown) =>
  parseInt(toString(x).replace(/^[^0-9.]+/, ''))

export const toYAML = (x: unknown) => yaml.stringify(x)

export const toJSON = (x: unknown) => JSON.stringify(x)

export const parseYAML = (x: string) => yaml.parse(x)

export const parseJSON = (x: string) => JSON.parse(x)

export const toResult = (x: Value): Result => {
  if (isResult(x)) {
    return {
      [VAL]: x[VAL],
      [VBL]: x?.[VBL],
    }
  } else {
    return {
      [VAL]: x,
      [VBL]: undefined,
    }
  }
}

export const unpackResult = (x: Value): Value => {
  if (isResult(x)) return x[VAL]
  return x
}