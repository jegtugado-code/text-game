import { createServer } from 'http';

import dotenv from 'dotenv';

import { attachColyseus } from './colyseus';

dotenv.config();
const port = Number(process.env.PORT ?? 2567);

// Create a regular Node HTTP server
const httpServer = createServer();

// Attach Colyseus to the HTTP server (returns the Colyseus server instance)
attachColyseus(httpServer);

// Start listening
httpServer.listen(port, () => {
  console.log(`🚀 Server is running at ws://localhost:${port}`);
});
