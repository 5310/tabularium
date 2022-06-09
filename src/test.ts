import { Tabula, NST } from './types.ts'
import * as to from './lib/to.ts'
import { tabularium } from './lib/mod.ts'

const root = tabularium.reify(to.parseYAML(`
  $:
  /: 
    name:
      $:
      :: \${first name|toUpperCase} \${last name}
      /:
        first name: John
        last name:
          $:
          :: Deere
    age: 42
`) as Tabula)

console.log({
  root,
  resolve: {
    ['/, name']: tabularium.resolve(root, 'name'),
    ['/, name/first name']: tabularium.resolve(root, 'name/first name'),
    ['/name, name']: tabularium.resolve(root?.[NST]?.name as Tabula, 'name'),
    ['/name, first name']: tabularium.resolve(root?.[NST]?.name as Tabula, 'first name'),
    ['/name, age']: tabularium.resolve(root?.[NST]?.name as Tabula, 'age'),
  },
  interpolate: {
    ['name, ${first name} ${last name}']: tabularium.interpolate(tabularium.resolve(root, 'name') as Tabula, '${first name} ${last name|toUpperCase}'),
  },
  roll: {
    ['/']: tabularium.roll(root),
    ['/name']: tabularium.roll(tabularium.resolve(root, 'name') as Tabula),
  }
})
