import { Effect } from '../schema';

import { Choice } from './choice';
import { Condition } from './condition';

export interface Scene {
  title: string; // Title of the scene
  text: string; // Story/narrative for this scene
  choices: Choice[]; // List of available choices
  isEnding?: boolean; // Marks if this scene ends the game
  effects?: Effect[]; // Optional: stats or inventory changes
  conditions?: Condition[]; // Optional: restrict access based on previous choices or inventory
}
