import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    checker({
      typescript: {
        tsconfigPath: './tsconfig.json',
      },
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        useFlatConfig: true,
      },
      // Disable overlay - doesn't work in Chrome extension context
      overlay: false,
    }),
    react(),
    crx({ manifest }),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: {
      origin: '*',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    alias: {
      '#': '/src/',
    },
  },
});
