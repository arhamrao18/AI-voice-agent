import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration
// - Dev server on port 5173
// - Path alias '@' -> src for cleaner imports across the app
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
