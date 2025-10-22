import { ItemType } from '../types';

import { EffectModel } from './effect-model';

export interface ItemModel {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  effects?: EffectModel[] | null;
}
