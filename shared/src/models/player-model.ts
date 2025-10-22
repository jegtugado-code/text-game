import { Stats } from '../types';

import { ItemModel } from './item-model';

export interface PlayerModel {
  name?: string;
  currentChapter: string;
  currentScene: string;
  visitedScenes: string[];
  choicesMade: string[];
  inventory: ItemModel[];
  stats: Stats;
  level: number;
  xp: number;
}
