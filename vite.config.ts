import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: env.HOST || '0.0.0.0',
      port: parseInt(env.PORT || '3000'),
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
      },
    },
  };
});
