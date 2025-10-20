import {
  Effect,
  AddItemEffect,
  RemoveItemEffect,
  ModifyStatEffect,
  Stat,
  EffectType,
} from '@text-game/shared';

/**
 * Converts a plain JSON effect object into a proper Effect subclass instance.
 */
export function createEffectFromJson(p: unknown): Effect {
  if (!p || typeof p !== 'object') {
    return new Effect();
  }

  const e = p as Record<string, unknown> & {
    type?: string;
    itemId?: unknown;
    item?: unknown;
    stat?: unknown;
    amount?: unknown;
  };

  switch (e.type) {
    case 'addItem': {
      const eff = new AddItemEffect();
      if (typeof e.itemId === 'string') eff.itemId = e.itemId;
      else if (typeof e.item === 'string') eff.itemId = e.item;
      return eff;
    }
    case 'removeItem': {
      const eff = new RemoveItemEffect();
      if (typeof e.itemId === 'string') eff.itemId = e.itemId;
      else if (typeof e.item === 'string') eff.itemId = e.item;
      return eff;
    }
    case 'modifyStat': {
      const eff = new ModifyStatEffect();
      // Narrow stat to the known Stat union
      eff.stat = typeof e.stat === 'string' ? (e.stat as Stat) : 'health';
      eff.amount =
        typeof e.amount === 'number' ? e.amount : Number(e.amount ?? 0);
      return eff;
    }
    default: {
      // Fallback for unknown types
      const eff = new Effect();
      // Effect.type is a string on the base class; only assign when string
      if (typeof e.type === 'string') eff.type = e.type as EffectType;
      return eff;
    }
  }
}
