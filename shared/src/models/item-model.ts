import { EffectModel } from './effect-model';

export interface ItemModel {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  effects?: EffectModel[] | null;
}
