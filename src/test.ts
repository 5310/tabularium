import * as to from './lib/to.ts'

const root = to.parseYAML(`
  $:
  /: 
    name:
      $:
      :: \${first name} \${last name}
      /:
        first name: John
        last name: Doe          
`)

console.log({root})