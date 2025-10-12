import { ArraySchema, Schema, type } from '@colyseus/schema';
import { Effect } from './effect';
import { ItemType } from '../types';

export class Item extends Schema {
  @type('string') id: string = '';
  @type('string') name: string = '';
  @type('string') description: string = '';
  @type('string') type: ItemType = 'functional';
  @type([Effect]) effects: ArraySchema<Effect> = new ArraySchema<Effect>();
}
