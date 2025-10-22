import { ArraySchema } from '@colyseus/schema';

import { ItemType } from '../../types';
import { ItemSchema } from '../item-schema';

import {
  EffectJSON,
  jsonArrayToEffects,
  effectsToJSONArray,
} from './effect-mapper';

export interface ItemJSON {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  effects?: EffectJSON[] | null;
}

export function jsonToItem(json: ItemJSON): ItemSchema {
  const it = new ItemSchema();
  it.id = json.id ?? '';
  it.name = json.name ?? '';
  it.description = json.description ?? '';
  it.type =
    typeof json.type === 'string' ? (json.type as ItemType) : 'functional';
  it.effects = jsonArrayToEffects(json.effects ?? undefined);
  return it;
}

export function jsonArrayToItems(
  arr?: ItemJSON[] | null
): ArraySchema<ItemSchema> {
  const out = new ArraySchema<ItemSchema>();
  if (!Array.isArray(arr)) return out;
  for (const j of arr) out.push(jsonToItem(j));
  return out;
}

export function itemToJSON(item: ItemSchema): ItemJSON {
  return {
    id: item.id,
    name: item.name || undefined,
    description: item.description || undefined,
    type: item.type || undefined,
    effects: effectsToJSONArray(item.effects),
  };
}

export function itemsToJSONArray(
  arr?: ArraySchema<ItemSchema> | null
): ItemJSON[] {
  if (!arr) return [];
  const out: ItemJSON[] = [];
  for (const i of arr) out.push(itemToJSON(i));
  return out;
}
