import { Schema, type } from '@colyseus/schema';

import { PlayerSchema } from './player-schema';

export class GameState extends Schema {
  @type(PlayerSchema) player: PlayerSchema = new PlayerSchema();
}
