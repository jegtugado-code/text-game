import { Schema, type } from '@colyseus/schema';

import { Player } from './player';

export class GameState extends Schema {
  @type(Player) player: Player = new Player();
}
