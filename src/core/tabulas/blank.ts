import { TabulaEvaluate, TabulaUpdate } from '../types.ts'
import { packResult } from '../utils.ts'

export const evaluate: TabulaEvaluate = (tabula) => {
  return packResult(tabula.$$, { $$$: tabula.$$ })
}

export const update: TabulaUpdate = (_tabula, _amend) => {}
