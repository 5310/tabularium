import { VAL, VBL, Tabula, Result } from '../../types.ts'
import { toString } from '../to.ts'
import { dice as dice_ } from 'deps'

export const dice = (tabula: Tabula): Result => {
  const { [VAL]: value, detail } = tabula
  const result = dice_.roll(toString(value))
  return {
    [VAL]: result.total,
    [VBL]: detail ? result : result.renderedExpression,
  }
}
