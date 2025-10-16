import cors, { CorsOptions } from 'cors';
import express from 'express';

import { registerRouter } from './api/routes';

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

  // Health
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // API routes
  app.use('/api/auth', registerRouter);

  return app;
}
