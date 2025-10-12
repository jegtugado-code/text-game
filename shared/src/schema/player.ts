import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';
import { Item } from './item';

export class Player extends Schema {
  @type('string') name: string = '';
  @type('string') currentScene: string = 'start'; // current scene ID
  @type(['string']) choices: ArraySchema<string> = new ArraySchema(); // history of chosen scene IDs
  @type([Item]) inventory: ArraySchema<Item> = new ArraySchema<Item>(); // items collected
  @type({ map: 'number' }) stats: MapSchema<number> = new MapSchema(); // stats like health, gold

  constructor() {
    super();
    this.stats.set('HP', 100);
    this.stats.set('Luck', 20);
  }
}
