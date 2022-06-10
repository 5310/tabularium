import { VAL, VBL, Tabula, Result } from '../../types.ts'

export const bare = (tabula: Tabula): Result => ({
  [VAL]: tabula[VAL],
  [VBL]: tabula[VBL],
})
