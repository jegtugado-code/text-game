import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

import { attachColyseus } from './colyseus';
import container from './container';
import { createApp } from './server';

// Define the absolute path to the certificates from the server project's location
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certPath = path.resolve(__dirname, '../../.ssh/localhost.pem');
const keyPath = path.resolve(__dirname, '../../.ssh/localhost-key.pem');

// Read the certificate and key files and convert them to strings
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

dotenv.config();
const port = Number(process.env.PORT ?? 2567);

// Create an Express app and Node HTTP server
const app = createApp(container);
const httpServer = https.createServer(options, app);

// Attach Colyseus to the HTTP server
attachColyseus(httpServer, container);

// Start listening

httpServer.listen(port, () => {
  console.log(`🚀 Server is running at https://localhost:${port}`);
});
