import { Choice } from '../types/choice';
import { Condition } from '../types/condition';

import { EffectModel } from './effect-model';

export interface SceneModel {
  title: string; // Title of the scene
  text: string; // Story/narrative for this scene
  choices: Choice[]; // List of available choices
  isEnding?: boolean; // Marks if this scene ends the game
  effects?: EffectModel[]; // Optional: stats or inventory changes
  conditions?: Condition[]; // Optional: restrict access based on previous choices or inventory
  // Optional prompt to request text input from the player. When present,
  // the client should render an input box and submit via an 'input' message.
  inputPrompt?: string;
  // Scene id to navigate to after successful input submission.
  inputNextScene?: string;
}
