import type { Item, Stats } from '@text-game/shared';

export interface PlayerInterface {
  name: string;
  currentScene: string;
  choices: string[];
  inventory: Item[];
  stats: Stats;
}
