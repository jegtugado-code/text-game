import path from 'path';
import { fileURLToPath } from 'url';

import { loadControllers, scopePerRequest } from 'awilix-express';
import cors, { CorsOptions } from 'cors';
import express from 'express';

import container from './container';

const allowedOrigins = ['https://localhost:5009'];

// ⭐️ Use the CorsOptions type for strong typing
const corsOptions: CorsOptions = {
  // The 'origin' property is automatically typed correctly by CorsOptions
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      // ⭐️ callback(error: Error | null, success: boolean)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // ✅ This is the crucial line:
      // The linter is happy because it knows the callback expects an Error object here.
      callback(new Error('Not allowed by CORS')); // cors expects the error object
    }
  },
  credentials: true,
};

export function createApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add a scoped container to each request
  app.use(scopePerRequest(container));

  // Define the path to your controllers.
  // `__dirname` is `server/src`, so we need to add the rest of the path.
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const controllersPath = path.join(__dirname, 'api', 'controllers', '*.ts');
  // Load controllers from the specified directory.
  app.use(loadControllers(controllersPath));

  // Health
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
