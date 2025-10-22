import { ArraySchema } from '@colyseus/schema';

import { EffectModel } from '../models';
import {
  EffectSchema,
  AddItemEffectSchema,
  RemoveItemEffectSchema,
  ModifyStatEffectSchema,
} from '../schemas/effect-schema';
import { EffectType, Stat } from '../types';

// Convert EffectModel -> Colyseus Effect instance
export function modelToEffectSchema(model: EffectModel): EffectSchema {
  switch (model.type) {
    case 'addItem': {
      const e = new AddItemEffectSchema();
      const itemId = (model as { itemId?: unknown }).itemId;
      e.itemId = typeof itemId === 'string' ? itemId : '';
      return e;
    }
    case 'removeItem': {
      const e = new RemoveItemEffectSchema();
      const itemId = (model as { itemId?: unknown }).itemId;
      e.itemId = typeof itemId === 'string' ? itemId : '';
      return e;
    }
    case 'modifyStat': {
      const e = new ModifyStatEffectSchema();
      const stat = (model as { stat?: unknown }).stat;
      const amount = (model as { amount?: unknown }).amount;
      e.stat = typeof stat === 'string' ? (stat as Stat) : 'health';
      e.amount = typeof amount === 'number' ? amount : Number(amount ?? 0);
      return e;
    }
    default: {
      // fallback to base Effect with the provided type
      const e = new EffectSchema();
      e.type =
        typeof (model as { type?: unknown }).type === 'string'
          ? ((model as { type: unknown }).type as EffectType)
          : 'unset';
      return e;
    }
  }
}

// Convert array of Model effects -> ArraySchema<Effect>
export function modelArrayToEffectSchemas(
  arr?: EffectModel[]
): ArraySchema<EffectSchema> {
  const out = new ArraySchema<EffectSchema>();
  if (!Array.isArray(arr)) return out;
  for (const j of arr) out.push(modelToEffectSchema(j));
  return out;
}

// --- reverse mappings: Colyseus Effect -> Model ---
export function effectSchemaToModel(effect: EffectSchema): EffectModel {
  switch (effect.type) {
    case 'addItem':
      return {
        type: 'addItem',
        itemId: (effect as AddItemEffectSchema).itemId,
      };
    case 'removeItem':
      return {
        type: 'removeItem',
        itemId: (effect as RemoveItemEffectSchema).itemId,
      };
    case 'modifyStat':
      return {
        type: 'modifyStat',
        stat: (effect as ModifyStatEffectSchema).stat,
        amount: (effect as ModifyStatEffectSchema).amount,
      };
    default:
      return { type: 'unset' };
  }
}

export function effectSchemasToModels(
  arr?: ArraySchema<EffectSchema> | null
): EffectModel[] {
  if (!arr) return [];
  const out: EffectModel[] = [];
  for (const e of arr) out.push(effectSchemaToModel(e));
  return out;
}
