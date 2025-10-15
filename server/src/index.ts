import { createServer } from 'http';

import { WebSocketTransport } from '@colyseus/ws-transport';
import { Server } from 'colyseus';
import dotenv from 'dotenv';

import { GameRoom } from './rooms';

dotenv.config();
const port = Number(process.env.PORT ?? 2567);

// Create a regular Node HTTP server
const httpServer = createServer();

// Create a Colyseus server using WebSocket transport
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
  }),
});

// Define your room
gameServer.define('game_room', GameRoom);

// Start listening
httpServer.listen(port, () => {
  console.log(`🚀 Colyseus server is running at ws://localhost:${port}`);
});
