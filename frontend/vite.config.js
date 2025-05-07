import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
  server: { 
    proxy: { 
      '/api': 'http://localhost:8000' // this proxy will force the frontend server to act like it's being served from the backend server. 
  // So if you do a fetch request in the React frontend like fetch('api/csrf/restore), then GET /api/csrf/restore request will be made to the backend server instead of the frontend server. 
    },
  }
  // To automatically open the app in the browser whenever the server starts,
  // uncomment the following lines:
  // server: {
  //   open: true
  // }
}));
