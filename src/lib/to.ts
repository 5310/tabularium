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
