/* Value */

export type Value = ValueLiteral | ValueArray | ValueObject
export type ValueLiteral = null | undefined | boolean | number | string
export type ValueArray = Value[]
export type ValueObject = { [key: string]: Value }

/* Tabula */

export type Tabula = {
  // Tag
  $: TabulaTag
  // Initializer
  $$?: Value
  // State
  $$$?: Value
  // Any additional parameters or nested tabula
  [key: string]: Value
}
export type TabulaTag = string
export type TabulaPath = string

export type TabulaModule = {
  evaluate: TabulaEvaluate
  update: TabulaUpdate
  [key: string]: unknown
}
export type TabulaEvaluate = (tabula: TabulatedTabula) => {
  result: Result
  update: { [key: string]: Value }
}
export type TabulaUpdate = (tabula: ReifiedTabula, value: Value) => void
export type ReifiedTabula = Tabula
export type TabulatedTabula = Tabula

/* Result */

export type Result = {
  value: Value
  brief?: string
  prose?: string
  // Any additional properties
  [key: string]: Value
}

/* Etc. */

export type StringFilter = (input: string) => string
