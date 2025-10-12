import { Effect } from '../schema';
import { Condition } from './condition';

export type Choice = {
  label: string; // Text shown on the button
  nextScene: string; // Scene key this choice leads to
  conditions?: Condition[]; // Optional: only show if condition met
  effects?: Effect[];
};
