# Tabularium

A flexible random-table curation and rolling app for roleplaying games and such.

## Use

WIP

### Build

1. `deno task build`
2. `deno task serve`
3. Open localhost:3000 in the browser
4. Make changes
5. Repeat step 1

### Notes

I wanted to develop this with established web standards and as little tooling as possible. This immediately meant no NPM — because...:gestures expansively: — just modern JavaScript modules all the way, no [Moonwalking](https://2ality.com/2022/05/rfc-9239.html#do-we-have-to-use-the-filename-extension-.mjs-for-modules-now%3F) required!

...Except that I couldn't quite give up TypeScript for sanity checking, and for convenience [decorators](https://github.com/tc39/proposal-decorators) in particular which only just hit [stage 3](https://github.com/tc39/notes/blob/HEAD/meetings/2022-03/mar-28.md#decorators-for-stage-3) while working on this project. Still not ready for prime-time.

[Deno](https://deno.land/) was the natural solution. The module system is just perfect, and you can't really get any more "respectful of the standard web" than that. 

Unfortunately, Deno can't really transpile my TypeScript on a per file basis. It _can_ however make [manually configured bundles](https://deno.land/manual/tools/bundler)...Which in turn only officially support the Deno runtime, but at least it graciously let us try our hand at supporting other [runtimes like the web](https://deno.land/manual/tools/bundler#bundling-for-the-web), which is the only thing I need for this project. 

Turns out, it's not that difficult! I just needed to add the dom libraries to the compiler [configuration]('./deno.json'), and pull in [trusted-types](https://www.npmjs.com/package/@types/trusted-types) to get [Lit](https://lit.dev/) to work. 

(Okay, I lied. I'm still getting my comfy favorites off of NPM. Only because the [officialL it modules](https://lit.dev/docs/getting-started/#use-bundles) [don't support decorators!](https://github.com/lit/lit/issues/2272#issuecomment-954165113)

In a way, having these bundles would save me a lot of headache with off-line support. It is very much a literal single-page-app, after all. But I still wanted to at least split the internal code from external dependencies. While Deno build has no way to externalize or exclude statically imported modules, it will ignored all dynamic imports altogether. This was enough for my use-case! I settled with a single bundle for my internal code (`src/`), and another single bundle for all the dependencies (`deps/`). And ofc, using a separate [import-map](https://deno.land/manual/linking_to_external_code/import_maps) for both bundling and [deploying](https://caniuse.com/import-maps).
 
