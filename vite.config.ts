import react from '@vitejs/plugin-react-swc';
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://api-internhasha.wafflestudio.com',
    },
  },
});
