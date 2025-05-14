// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://s-84-anu-capstone-collabnerds-3.onrender.com', // or 3000 or whatever your backend runs on
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
