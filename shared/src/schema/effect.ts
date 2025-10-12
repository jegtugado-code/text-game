import { Schema, type } from '@colyseus/schema';
import { EffectType, Stat } from '../types';

export class Effect extends Schema {
  @type('string') type: EffectType = 'unset';
}

export class AddItemEffect extends Effect {
  @type('string') itemId: string;
  constructor() {
    super();
    this.type = 'addItem';
    this.itemId = '';
  }
}

export class RemoveItemEffect extends Effect {
  @type('string') itemId: string;
  constructor() {
    super();
    this.type = 'removeItem';
    this.itemId = '';
  }
}

export class ModifyStatEffect extends Effect {
  @type('string') stat: Stat;
  @type('number') amount: number;
  constructor() {
    super();
    this.type = 'modifyStat';
    this.stat = 'health';
    this.amount = 0;
  }
}
