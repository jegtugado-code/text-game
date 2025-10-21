import { ArraySchema, MapSchema } from '@colyseus/schema';

import { Stats } from '../../types';
import { Player } from '../player';

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

export function jsonToPlayer(json: PlayerJSON): Player {
  const p = new Player();
  p.name = json.name ?? '';
  p.currentChapter = json.currentChapter ?? '';
  p.currentScene = String(json.currentScene);
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
): ArraySchema<Player> {
  const out = new ArraySchema<Player>();
  if (!Array.isArray(arr)) return out;
  for (const j of arr) out.push(jsonToPlayer(j));
  return out;
}

// --- reverse mappings: Player (Colyseus) -> JSON ---
export function playerToJSON(player: Player): PlayerJSON {
  const statsObj = player.stats
    ? (Object.fromEntries(
        Array.from(player.stats.entries())
      ) as unknown as Stats)
    : undefined;

  return {
    name: player.name || undefined,
    currentChapter: player.currentChapter || undefined,
    currentScene: player.currentScene || undefined,
    visitedScenes: Array.isArray(player.visitedScenes)
      ? [...player.visitedScenes]
      : [],
    choicesMade: Array.isArray(player.choicesMade)
      ? [...player.choicesMade]
      : [],
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
  arr?: ArraySchema<Player> | null
): PlayerJSON[] {
  if (!arr) return [];
  const out: PlayerJSON[] = [];
  for (const p of arr) out.push(playerToJSON(p));
  return out;
}
