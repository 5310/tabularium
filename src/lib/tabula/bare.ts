import { isResult } from '../is.ts'
import { VAL, VBL, Value, Tabula, Result } from '../../types.ts'

export const bare = (tabula: Tabula): Value | Result => {
  if (isResult(tabula)) return { [VAL]: tabula[VAL], [VBL]: tabula[VBL] }
  else return tabula[VAL]
}
