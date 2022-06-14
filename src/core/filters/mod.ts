const capitalize = (input: string): string =>
  input[0].toUpperCase() + input.slice(1)

const toLowerCase = (input: string): string => input.toLowerCase()

const toUpperCase = (input: string): string => input.toUpperCase()

export default {
  capitalize,
  toLowerCase,
  toUpperCase,
}
