import { ArraySchema } from '@colyseus/schema';
import { Choice, Effect } from '@text-game/shared';

import { createEffectFromJson } from './effect-factory';

export function createChoiceFromJson(json: any): Choice {
  const choice: Choice = {
    label: json.label,
    nextScene: json.nextScene,
    conditions: json.conditions,
  };
  choice.effects = new ArraySchema<Effect>();

  for (const e of json.effects ?? []) {
    choice.effects.push(createEffectFromJson(e));
  }

  return choice;
}
