// vite.config.ts
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { // 기존 resolve 설정이 있다면 유지
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api-internhasha.wafflestudio.com', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});