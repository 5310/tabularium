import { TabulaEvaluate, TabulaUpdate } from '../types.ts'
import { packResult } from '../utils.ts'

export const evaluate: TabulaEvaluate = (tabula) => {
  const result = packResult(tabula.$$)
  return {
    result,
    update: {
      $$$: result,
    },
  }
}

export const update: TabulaUpdate = (_) => {}
