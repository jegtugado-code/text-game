import { EffectJSON } from '../schemas';

import { Choice } from './choice';
import { Condition } from './condition';

export interface Scene {
  title: string; // Title of the scene
  text: string; // Story/narrative for this scene
  choices: Choice[]; // List of available choices
  isEnding?: boolean; // Marks if this scene ends the game
  effects?: EffectJSON[]; // Optional: stats or inventory changes
  conditions?: Condition[]; // Optional: restrict access based on previous choices or inventory
  // Optional prompt to request text input from the player. When present,
  // the client should render an input box and submit via an 'input' message.
  inputPrompt?: string;
  // Scene id to navigate to after successful input submission.
  inputNextScene?: string;
}
