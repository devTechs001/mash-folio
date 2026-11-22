import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Where the Express backend listens during development.
const API_TARGET = process.env.API_TARGET || 'http://127.0.0.1:4000';
const proxy = {
  '/api': { target: API_TARGET, changeOrigin: false },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Allow preview/proxy hosts (e.g. *.e2b.app) to reach the dev server.
    allowedHosts: true,
    proxy,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
    proxy,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
