import { Server as HttpServer } from 'http';

import { WebSocketTransport } from '@colyseus/ws-transport';
import { AwilixContainer } from 'awilix';
import { Server } from 'colyseus';

import { roomWithContainer } from './factories/room-factory';
import { GameRoom } from './rooms';

/**
 * Attach Colyseus to an existing Node HTTP server and return the Colyseus Server instance.
 */
export function attachColyseus(
  server: HttpServer,
  container: AwilixContainer
): Server {
  const gameServer = new Server({
    transport: new WebSocketTransport({
      server,
    }),
  });

  // Register rooms here (add more as you create them)
  gameServer.define('game_room', roomWithContainer(GameRoom, container));

  return gameServer;
}
