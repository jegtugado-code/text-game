import { Schema, type, MapSchema } from '@colyseus/schema';

import { Player } from './player';

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type('string') storyStep = 'start';

  // Add a player
  createPlayer(sessionId: string, name: string) {
    const player = new Player();
    player.name = name;
    player.currentScene = '';
    this.players.set(sessionId, player);
  }

  // Remove a player
  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }
}
