import { ArraySchema, MapSchema } from '@colyseus/schema';

import { Stats } from '../../types';
import { PlayerSchema } from '../player-schema';

import { ItemJSON, jsonArrayToItems, itemsToJSONArray } from './item-mapper';

export interface PlayerJSON {
  name?: string;
  currentChapter?: string | null;
  currentScene?: string | null;
  visitedScenes: string[];
  choicesMade: string[];
  inventory: ItemJSON[];
  stats: Stats;
  level: number;
  xp: number;
}

export function jsonToPlayer(json: PlayerJSON): PlayerSchema {
  const p = new PlayerSchema();
  p.name = json.name ?? '';
  p.currentChapter = json.currentChapter ?? '';
  p.currentScene = String(json.currentScene);
  if (Array.isArray(json.visitedScenes))
    for (const s of json.visitedScenes) p.visitedScenes.push(s);
  p.choicesMade = new ArraySchema<string>();
  if (Array.isArray(json.choicesMade))
    for (const c of json.choicesMade) p.choicesMade.push(c);
  p.inventory = jsonArrayToItems(json.inventory ?? undefined);
  p.stats = new MapSchema<number>();
  if (json.stats && typeof json.stats === 'object') {
    for (const [k, v] of Object.entries(json.stats)) p.stats.set(k, Number(v));
  }
  p.level = json.level;
  p.xp = json.xp;
  return p;
}

export function jsonArrayToPlayers(
  arr?: PlayerJSON[] | null
): ArraySchema<PlayerSchema> {
  const out = new ArraySchema<PlayerSchema>();
  if (!Array.isArray(arr)) return out;
  for (const j of arr) out.push(jsonToPlayer(j));
  return out;
}

// --- reverse mappings: Player (Colyseus) -> JSON ---
export function playerToJSON(player: PlayerSchema): PlayerJSON {
  const statsObj = Object.fromEntries(player.stats) as Stats;

  return {
    name: player.name || undefined,
    currentChapter: player.currentChapter || undefined,
    currentScene: player.currentScene || undefined,
    visitedScenes: player.visitedScenes.toArray(),
    choicesMade: player.choicesMade.toArray(),
    inventory: itemsToJSONArray(player.inventory),
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

export function playersToJSONArray(
  arr?: ArraySchema<PlayerSchema> | null
): PlayerJSON[] {
  if (!arr) return [];
  const out: PlayerJSON[] = [];
  for (const p of arr) out.push(playerToJSON(p));
  return out;
}
