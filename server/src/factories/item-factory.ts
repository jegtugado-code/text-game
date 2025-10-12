import { Item, Effect } from '@text-game/shared';
import { ArraySchema } from '@colyseus/schema';
import { createEffectFromJson } from './effect-factory';

export function createItemFromJson(json: any): Item {
  const item = new Item();
  item.id = json.id;
  item.name = json.name;
  item.description = json.description;
  item.type = json.type;
  item.effects = new ArraySchema<Effect>();

  for (const e of json.effects || []) {
    item.effects.push(createEffectFromJson(e));
  }

  return item;
}
