export const KND = '$'
export const NST = '/'
export const VAL = ':'
export const VBL = '::'

export type Value = ValueSimple | ValueList | ValueObject
export type ValueSimple = null | undefined | boolean | number | string
export type ValueList = Value[]
export type ValueObject = { [key: string]: Value }

export type Tabula = {
  [KND]: TabulaReference
  [VAL]?: Value
  [NST]?: Record<string, Value>
  [key: string]: Value
}

export type TabulaReference = TabulaKind | TabulaPath
export type TabulaKind = null | string
export type TabulaPath = string

export type TabulaParameter = typeof KND | typeof NST | typeof VAL | typeof VBL

export type Result = {
  [VAL]: Value
  [VBL]: Value
}