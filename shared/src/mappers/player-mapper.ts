import { ArraySchema, MapSchema } from '@colyseus/schema';

import { PlayerModel } from '../models';
import { PlayerSchema } from '../schemas/player-schema';
import { Stats } from '../types';

import { modelArrayToItemSchemas, itemSchemasToModels } from './item-mapper';

export function modelToPlayerSchema(json: PlayerModel): PlayerSchema {
  const p = new PlayerSchema();
  p.name = json.name ?? '';
  p.currentChapter = json.currentChapter ?? '';
  p.currentScene = String(json.currentScene);
  if (Array.isArray(json.visitedScenes))
    for (const s of json.visitedScenes) p.visitedScenes.push(s);
  p.choicesMade = new ArraySchema<string>();
  if (Array.isArray(json.choicesMade))
    for (const c of json.choicesMade) p.choicesMade.push(c);
  p.inventory = modelArrayToItemSchemas(json.inventory ?? undefined);
  p.stats = new MapSchema<number>();
  if (json.stats && typeof json.stats === 'object') {
    for (const [k, v] of Object.entries(json.stats)) p.stats.set(k, Number(v));
  }
  p.level = json.level;
  p.xp = json.xp;
  return p;
}

export function modelArrayToPlayerSchemas(
  arr?: PlayerModel[] | null
): ArraySchema<PlayerSchema> {
  const out = new ArraySchema<PlayerSchema>();
  if (!Array.isArray(arr)) return out;
  for (const j of arr) out.push(modelToPlayerSchema(j));
  return out;
}

// --- reverse mappings: Player (Colyseus) -> JSON ---
export function playerSchemaToModel(player: PlayerSchema): PlayerModel {
  const statsObj = Object.fromEntries(player.stats) as Stats;

  return {
    name: player.name || undefined,
    currentChapter: player.currentChapter,
    currentScene: player.currentScene,
    visitedScenes: player.visitedScenes.toArray(),
    choicesMade: player.choicesMade.toArray(),
    inventory: itemSchemasToModels(player.inventory),
    stats: statsObj ?? {
      health: 100,
      strength: 5,
      vitality: 5,
      intelligence: 5,
      dexterity: 5,
      agility: 5,
    },
    level: player.level,
    xp: player.xp,
  };
}

export function playerSchemasToModels(
  arr?: ArraySchema<PlayerSchema> | null
): PlayerModel[] {
  if (!arr) return [];
  const out: PlayerModel[] = [];
  for (const p of arr) out.push(playerSchemaToModel(p));
  return out;
}
