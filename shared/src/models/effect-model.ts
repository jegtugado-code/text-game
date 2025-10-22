import { Stat } from '../types';

export type EffectModel =
  | { type: 'addItem'; itemId: string }
  | { type: 'removeItem'; itemId: string }
  | { type: 'modifyStat'; stat: Stat; amount: number }
  | { type: 'unset' };
