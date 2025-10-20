import { ArraySchema } from '@colyseus/schema';
import { Item, Effect, ItemType } from '@text-game/shared';

import { createEffectFromJson } from './effect-factory';

export function createItemFromJson(json: unknown): Item {
  const item = new Item();

  if (!json || typeof json !== 'object') {
    item.id = '';
    item.name = '';
    item.description = '';
    item.type = 'functional';
    item.effects = new ArraySchema<Effect>();
    return item;
  }

  const j = json as Record<string, unknown> & {
    id?: unknown;
    name?: unknown;
    description?: unknown;
    type?: unknown;
    effects?: unknown;
  };

  item.id = typeof j.id === 'string' ? j.id : '';
  item.name = typeof j.name === 'string' ? j.name : '';
  item.description = typeof j.description === 'string' ? j.description : '';
  // Validate type against the known ItemType union
  const allowedTypes = new Set<ItemType>([
    'functional',
    'equippable',
    'material',
    'consumable',
  ]);
  item.type =
    typeof j.type === 'string' && allowedTypes.has(j.type as ItemType)
      ? (j.type as ItemType)
      : 'functional';

  item.effects = new ArraySchema<Effect>();
  if (Array.isArray(j.effects)) {
    for (const e of j.effects) {
      item.effects.push(createEffectFromJson(e));
    }
  }

  return item;
}
