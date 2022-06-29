import { ValueObject, TabulaEvaluate, TabulaUpdate } from '../types.ts'
import { toString } from '../utils.ts'
import { dice } from 'deps'

export const evaluate: TabulaEvaluate = (tabula) => {
  const result = dice.roll(toString(tabula.$$)) as unknown as ValueObject
  return {
    $value: result.total,
    $prose: result.renderedExpression as string,
    $amend: {
      $$$: result,
    },
    roll: result,
  }
}

export const update: TabulaUpdate = (_tabula, _value) => {}
