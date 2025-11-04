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
        
        // 💡 2. PPT 예시는 target URL 끝에 '/api'가 붙어있는데, 
        //    만약 target 주소 자체가 API 루트라면 rewrite가 필요할 수 있습니다.
        //    (우선 target 주소만 바꿔보고, 그래도 404가 뜨면 아래 rewrite를 추가해 보세요.)
        // rewrite: (path) => path.replace(/^\/api/, '') 
      },
    },
  },
});