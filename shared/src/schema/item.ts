import { ArraySchema, Schema, type } from '@colyseus/schema';

import { ItemType } from '../types';

import { Effect } from './effect';

export class Item extends Schema {
  @type('string') id = '';
  @type('string') name = '';
  @type('string') description = '';
  @type('string') type: ItemType = 'functional';
  @type([Effect]) effects: ArraySchema<Effect> = new ArraySchema<Effect>();
}
