import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  build: {
    outDir: 'build',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    manifest: true, // read by scripts/prerender-maintenance.mjs, then deleted
  },
  server: { port: 3000 },
  test: { environment: 'node', include: ['src/**/*.test.{js,jsx}'] },
});
