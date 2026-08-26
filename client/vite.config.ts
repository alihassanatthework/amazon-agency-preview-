import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Honour a harness-assigned port when one is provided.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    // The contact form posts to the Express API in development.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
