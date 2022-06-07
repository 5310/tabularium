import { Tabula } from './types.ts'
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
`) as Tabula)

console.log({root})