import fs from 'fs';
import path from 'path';

import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

// Define the absolute path to the certificates from the server project's location
const certPath = path.resolve(__dirname, '../.ssh/localhost.pem');
const keyPath = path.resolve(__dirname, '../.ssh/localhost-key.pem');

// Read the certificate and key files and convert them to strings
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [reactRouter(), tailwindcss()],
    resolve: {
      alias: {
        '@text-game/shared': path.resolve(__dirname, '../shared/src'),
      },
    },
    server: {
      port: Number(process.env.VITE_PORT ?? 5173),
      https: options,
    },
  };
});
