import { ArraySchema } from '@colyseus/schema';

import { ItemModel } from '../models';
import { ItemSchema } from '../schemas/item-schema';
import { ItemType } from '../types';

import {
  modelArrayToEffectSchemas,
  effectSchemasToModels,
} from './effect-mapper';

export function modelToItemSchema(model: ItemModel): ItemSchema {
  const it = new ItemSchema();
  it.id = model.id ?? '';
  it.name = model.name ?? '';
  it.description = model.description ?? '';
  it.type =
    typeof model.type === 'string' ? (model.type as ItemType) : 'functional';
  it.effects = modelArrayToEffectSchemas(model.effects ?? undefined);
  return it;
}

export function modelArrayToItemSchemas(
  arr?: ItemModel[] | null
): ArraySchema<ItemSchema> {
  const out = new ArraySchema<ItemSchema>();
  if (!Array.isArray(arr)) return out;
  for (const j of arr) out.push(modelToItemSchema(j));
  return out;
}

export function itemSchemaToModel(item: ItemSchema): ItemModel {
  return {
    id: item.id,
    name: item.name || undefined,
    description: item.description || undefined,
    type: item.type || undefined,
    effects: effectSchemasToModels(item.effects),
  };
}

export function itemSchemasToModels(
  arr?: ArraySchema<ItemSchema> | null
): ItemModel[] {
  if (!arr) return [];
  const out: ItemModel[] = [];
  for (const i of arr) out.push(itemSchemaToModel(i));
  return out;
}
