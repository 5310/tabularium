import { Dice } from 'https://cdn.skypack.dev/@scio/dice-typescript@1.6.2?dts'

const instance = new Dice()

export const roll = (expr: string) => instance.roll(expr)
