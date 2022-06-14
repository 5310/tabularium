import { VAL, DSC, DAT, ValueObject, ReifiedTabula, Result } from '../types.ts'
import { toString } from '../utils.ts'
import { dice } from 'deps'

export default (tabula: ReifiedTabula): Result => {
  const result = dice.roll(toString(tabula[DAT]))
  return {
    [VAL]: result.total,
    [DSC]: result.renderedExpression,
    [DAT]: result as unknown as ValueObject,
  }
}
