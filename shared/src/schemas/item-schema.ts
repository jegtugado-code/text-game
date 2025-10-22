import { ArraySchema, Schema, type } from '@colyseus/schema';

import { ItemType } from '../types';

import { EffectSchema } from './effect-schema';

export class ItemSchema extends Schema {
  @type('string') id = '';
  @type('string') name = '';
  @type('string') description = '';
  @type('string') type: ItemType = 'functional';
  @type([EffectSchema]) effects: ArraySchema<EffectSchema> =
    new ArraySchema<EffectSchema>();
}
