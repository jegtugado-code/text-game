import { ArraySchema } from '@colyseus/schema';
import { Choice, Effect, Condition } from '@text-game/shared';

import { createEffectFromJson } from './effect-factory';

// Internal type for scene JSON choice objects. Avoid `any` by using unknown
// for arrays we don't fully type here.
interface ChoiceJSON {
  id: string;
  label: string;
  nextScene: string;
  conditions?: unknown[];
  effects?: unknown[];
}

export function createChoiceFromJson(json: unknown): Choice {
  const data = json as ChoiceJSON;
  const label = data.label ?? '';
  const choice: Choice = {
    id: data.id,
    label,
    nextScene: data.nextScene ?? '',
    conditions: data.conditions as Condition[] | undefined,
  };
  choice.effects = new ArraySchema<Effect>();

  for (const e of data.effects ?? []) {
    choice.effects.push(createEffectFromJson(e));
  }

  return choice;
}
