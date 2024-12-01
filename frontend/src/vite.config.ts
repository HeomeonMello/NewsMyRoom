import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 개발 서버 포트
    open: true, // 개발 서버 시작 시 브라우저 자동 열기
  },
  build: {
    outDir: 'dist', // 빌드 결과물 폴더
    sourcemap: true, // 디버깅을 위한 소스맵 생성
  },
  resolve: {
    alias: {
      '@': '/src', // 경로 별칭 설정 (src 폴더를 '@'로 접근 가능)
    },
  },
});
