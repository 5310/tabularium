import {
  Value,
  Tabula,
  TabulaModule,
  TabulaTag,
  TabulaPath,
  ReifiedTabula,
  TabulatedTabula,
  Result,
} from './types.ts'
import {
  isNull,
  isUndefined,
  isString,
  isArray,
  isObject,
  isTabula,
  isReifiedTabula,
  hasOwnProperty,
  toString,
  packResult,
} from './utils.ts'
import filters from './filters/mod.ts'
import tabulas from './tabulas/mod.ts'

export const tabulate = (target: Value, update = false): Result => {
  if (isTabula(target)) {
    // recurse & interpolate
    const target_ = Object.fromEntries(
      Object.entries(target)
        .filter(([key, _]) => key.startsWith('$'))
        .map(([key, value]) => {
          const value_ = isTabula(value)
            ? tabulate(target).value
            : interpolate(value, target)
          return [key, value_]
        }),
    ) as TabulatedTabula

    // evaluate
    const tabulas_ = tabulas as Record<TabulaTag, TabulaModule>
    const evaluation = tabulas_?.[target.$].evaluate(target_)

    // update
    if (update)
      Object.entries(evaluation.$amend ?? {}).forEach(([key, value]) => {
        const nest = target[key]
        if (isTabula(nest)) {
          tabulas_?.[nest.$].update(nest, value)
        } else {
          target[key] = value
        }
      })

    // return
    if (isTabula(evaluation)) return tabulate(evaluation)
    else return evaluation
  }
  return packResult(target)
}

export const interpolate = (target: Value, context: ReifiedTabula): Value => {
  // If it's a string, do the thing
  if (isString(target)) {
    return ['()', '[]', '{}'] // Generate patterns for each bracket type /\$\((.+?)\)/g
      .map(
        (brackets) =>
          new RegExp(`\\$\\${brackets[0]}(.+?)\\${brackets[1]}`, 'g'),
      )
      .reduce((target, pattern) => {
        // Analyze the tokens to interpolate
        const tokens = Array.from(target.matchAll(pattern))

        tokens.forEach(([token, interpolant]) => {
          // Parse the actual reference, and separate out any filters
          const [reference, ...fs] = interpolant.split('|').map((v) => v.trim())
          // Get the template
          let template = toString(tabulate(resolve(context, reference)).$value)
          // If there are any valid filters, apply them
          fs.map(
            (f) => (filters as Record<string, (input: string) => string>)[f],
          )
            .filter((filter) => !!filter)
            .forEach((f) => (template = f(template)))
          // replace all interpolated tokens
          target = target.replaceAll(token, template)
        })

        return target
      }, target)
  }

  // If it's an array, recurse
  if (isArray(target)) return target.map((v) => interpolate(v, context))

  // If it's a tabula, return it as is
  if (isTabula(target)) return target

  // If it's an object, recurse
  if (isObject(target)) {
    const result = { ...target }
    let changed = false
    Object.entries(target).forEach(([k, v]) => {
      const v_ = interpolate(v, context)
      if (v !== v_) {
        result[k] = v_
        changed = true
      }
    })
    return changed ? result : target
  }

  return target
}

export const resolve = (
  context: ReifiedTabula,
  reference: TabulaPath,
): Value => {
  if (reference.includes('/')) return resolveDeep(context, reference)
  return resolveShallow(context, reference)
}

const pathToSegments = (path: TabulaPath) =>
  path
    .toLowerCase()
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => !!segment)

const resolveDeep = (context: ReifiedTabula, reference: TabulaPath): Value => {
  const segments = pathToSegments(reference)

  // Try to resolve ownProperties
  const result = segments.reduce((context: Value, segment, i) => {
    if (isTabula(context) && hasOwnProperty(context as Tabula, segment)) {
      const result = context?.[segment]
      if (i === segments.length - 1) return result
      if (isTabula(result)) return result
    }
    return undefined
  }, context)

  // If there's no result, try to recurse up the chain
  const chain = Object.getPrototypeOf(context)
  if (isUndefined(result) && isTabula(chain))
    return resolveDeep(chain, reference)

  return result
}

const resolveShallow = (context: ReifiedTabula, reference: TabulaPath): Value =>
  context?.[reference.toLowerCase().trim()]

export const reify = (target: Tabula): void => {
  if (isNull(target.$)) target.$ = 'blank'
  if (!isReifiedTabula(target)) Object.setPrototypeOf(target, null)
  Object.values(target).forEach((v) => {
    if (isTabula(v)) {
      Object.setPrototypeOf(v, target)
      reify(v)
    }
  })
}
