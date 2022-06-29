import { reify, tabulate, resolve } from './tabularium.ts'
import { parseYAML } from './utils.ts'

const root = parseYAML(`
  $:
  value: Bond
  tabula:
    $:
    $$: James Bond
  interpolation:
    $:
    $$: $(last name), $[first name] $\{last name\}
    first name: James
    last name: Bond
  interpolation, complex:
    $:
    $$: 
      $value: \${interpolation/last $[name]} $[interpolation/first $(name)]
      $brief: Introduction
    name: name
  dice:
    $: expr
    $$: 2d6 + 2
`)

reify(root)

const tests = Object.fromEntries(
  [
    'value', // { $value: Bond }
    'tabula', // { $value: James Bond }
    'interpolation', // { $value: Bond, James Bond }
    'interpolation, complex', // { $value: Bond, James Bond, $brief: Introduciton }
    'dice', // { $value: 4..14, ... }
  ].map((reference) => [reference, tabulate(resolve(root, reference))]),
)

export { root, tests }
