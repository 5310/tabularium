import init, {
  parse as parse_,
} from 'https://deno.land/x/yaml_wasm@0.1.9/index.js'

await init()

export { stringify } from 'https://deno.land/x/yaml_wasm@0.1.9/index.js'

export const parse = (input: string) => parse_(input)[0] ?? undefined
