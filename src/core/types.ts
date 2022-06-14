export const TAG = '$'
export const NST = '/'
export const DAT = ':'
export const VAL = '='
export const LBL = '+'
export const DSC = '-'

export type Value = ValueLiteral | ValueArray | ValueObject
export type ValueLiteral = null | undefined | boolean | number | string
export type ValueArray = Value[]
export type ValueObject = { [key: string]: Value }

export type Tabula = {
  [TAG]: TabulaReference
  [DAT]?: Value
  [NST]?: Record<string, Value>
  [key: string]: Value
}
export type TabulaReference = string
export type ReifiedTabula = Tabula

export type Result = {
  [VAL]: Value
  [LBL]?: string
  [DSC]?: string
  [key: string]: Value
}
