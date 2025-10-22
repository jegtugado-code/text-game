import { ArraySchema } from '@colyseus/schema';

import { EffectType, Stat } from '../../types';
import {
  EffectSchema,
  AddItemEffectSchema,
  RemoveItemEffectSchema,
  ModifyStatEffectSchema,
} from '../effect-schema';

// JSON shapes that come from DB / Prisma / external sources
export type EffectJSON =
  | { type: 'addItem'; itemId: string }
  | { type: 'removeItem'; itemId: string }
  | { type: 'modifyStat'; stat: Stat; amount: number }
  | { type: EffectType; [k: string]: unknown };

// Convert EffectJSON -> Colyseus Effect instance
export function jsonToEffect(json: EffectJSON): EffectSchema {
  switch (json.type) {
    case 'addItem': {
      const e = new AddItemEffectSchema();
      const itemId = (json as { itemId?: unknown }).itemId;
      e.itemId = typeof itemId === 'string' ? itemId : '';
      return e;
    }
    case 'removeItem': {
      const e = new RemoveItemEffectSchema();
      const itemId = (json as { itemId?: unknown }).itemId;
      e.itemId = typeof itemId === 'string' ? itemId : '';
      return e;
    }
    case 'modifyStat': {
      const e = new ModifyStatEffectSchema();
      const stat = (json as { stat?: unknown }).stat;
      const amount = (json as { amount?: unknown }).amount;
      e.stat = typeof stat === 'string' ? (stat as Stat) : 'health';
      e.amount = typeof amount === 'number' ? amount : Number(amount ?? 0);
      return e;
    }
    default: {
      // fallback to base Effect with the provided type
      const e = new EffectSchema();
      e.type =
        typeof (json as { type?: unknown }).type === 'string'
          ? ((json as { type: unknown }).type as EffectType)
          : 'unset';
      return e;
    }
  }
}

// Convert array of JSON effects -> ArraySchema<Effect>
export function jsonArrayToEffects(
  arr?: EffectJSON[]
): ArraySchema<EffectSchema> {
  const out = new ArraySchema<EffectSchema>();
  if (!Array.isArray(arr)) return out;
  for (const j of arr) out.push(jsonToEffect(j));
  return out;
}

// --- reverse mappings: Colyseus Effect -> JSON ---
export function effectToJSON(effect: EffectSchema): EffectJSON {
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
      return { type: effect.type as EffectType };
  }
}

export function effectsToJSONArray(
  arr?: ArraySchema<EffectSchema> | null
): EffectJSON[] {
  if (!arr) return [];
  const out: EffectJSON[] = [];
  for (const e of arr) out.push(effectToJSON(e));
  return out;
}
