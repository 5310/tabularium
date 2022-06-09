import { Tabula, NST } from './types.ts'
import * as to from './lib/to.ts'
import { tabularium } from './lib/mod.ts'

const root = tabularium.reify(to.parseYAML(`
  $:
  /: 
    name:
      $:
      :: \${first name} \${last name}
      /:
        first name: John
        last name: Doe       
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
    ['name, ${first name} ${last name}']: tabularium.interpolate(root?.[NST]?.name as Tabula, '${first name} ${last name}'),
  }
})
