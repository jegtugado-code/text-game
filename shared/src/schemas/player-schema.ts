import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';

import { ItemSchema } from './item-schema';

export class PlayerSchema extends Schema {
  @type('string') name = '';
  @type('string') currentChapter = 'intro'; // current chapter ID
  @type('string') currentQuest = 'intro'; // current quest ID
  @type('string') currentScene = 'start'; // current scene ID
  @type(['string']) visitedScenes = new ArraySchema<string>(); // history of chosen scene IDs
  @type(['string']) choicesMade = new ArraySchema<string>(); // history of chosen choice IDs
  @type([ItemSchema]) inventory: ArraySchema<ItemSchema> =
    new ArraySchema<ItemSchema>(); // items collected
  @type({ map: 'number' }) stats = new MapSchema<number>(); // stats like health, gold
  @type('number') level = 1;
  @type('number') xp = 0;

  constructor() {
    super();
  }
}
