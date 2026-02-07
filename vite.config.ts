
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/google': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/google/, ''),
        followRedirects: true,
      }
    }
  },
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.VITE_GEMINI_API_KEY)
    }
  }
});
