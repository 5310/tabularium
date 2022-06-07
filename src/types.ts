export const KND = '$'
export const LBL = '.'
export const VAL = ':'
export const NST = '/'

export type Value = null | undefined | boolean | number | string | ValueList | ValueObject
export type ValueList = Value[]
export type ValueObject = { [key: string]: Value } // ValueObject is a superset of Tabula, because TypeScript cannot model subtractive types

export type Tabula = {
    [KND]: TabulaReference
    [LBL]?: string
    [VAL]?: Value
    [NST]?: Record<string, Value>
    [key: string]: Value
}

export type TabulaReference = TabulaKind | TabulaPath
export type TabulaKind = null | string
export type TabulaPath = string

export type TabulaParameter = typeof KND | typeof LBL | typeof VAL | typeof NST