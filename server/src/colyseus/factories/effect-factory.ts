import {
  Effect,
  AddItemEffect,
  RemoveItemEffect,
  ModifyStatEffect,
} from '@text-game/shared';

/**
 * Converts a plain JSON effect object into a proper Effect subclass instance.
 */
export function createEffectFromJson(e: any): Effect {
  switch (e.type) {
    case 'addItem': {
      const eff = new AddItemEffect();
      eff.itemId = e.itemId ?? e.item; // support both itemId or item
      return eff;
    }
    case 'removeItem': {
      const eff = new RemoveItemEffect();
      eff.itemId = e.itemId ?? e.item;
      return eff;
    }
    case 'modifyStat': {
      const eff = new ModifyStatEffect();
      eff.stat = e.stat;
      eff.amount = e.amount;
      return eff;
    }
    default: {
      // Fallback for unknown types
      const eff = new Effect();
      Object.assign(eff, e);
      return eff;
    }
  }
}
