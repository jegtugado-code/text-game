import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [react(), tailwindcss()],
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
