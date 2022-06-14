import { DAT, ReifiedTabula, Result } from '../types.ts'
import { packResult } from '../utils.ts'

export default (tabula: ReifiedTabula): Result => packResult(tabula[DAT])
