import { Schema, type } from '@colyseus/schema';

import { EffectType, Stat } from '../types';

export class EffectSchema extends Schema {
  @type('string') type: EffectType = 'unset';
}

export class AddItemEffectSchema extends EffectSchema {
  @type('string') itemId: string;
  constructor() {
    super();
    this.type = 'addItem';
    this.itemId = '';
  }
}

export class RemoveItemEffectSchema extends EffectSchema {
  @type('string') itemId: string;
  constructor() {
    super();
    this.type = 'removeItem';
    this.itemId = '';
  }
}

export class ModifyStatEffectSchema extends EffectSchema {
  @type('string') stat: Stat;
  @type('number') amount: number;
  constructor() {
    super();
    this.type = 'modifyStat';
    this.stat = 'health';
    this.amount = 0;
  }
}
