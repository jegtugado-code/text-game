import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';

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
      port: Number(process.env.VITE_PORT || 5173),
    },
  };
});
