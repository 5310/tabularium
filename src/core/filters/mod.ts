import { StringFilter } from '../types.ts'

const capitalize: StringFilter = (input) =>
  input[0].toUpperCase() + input.slice(1)

const toLowerCase: StringFilter = (input) => input.toLowerCase()

const toUpperCase: StringFilter = (input) => input.toUpperCase()

export default {
  capitalize,
  toLowerCase,
  toUpperCase,
}
