import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy football-data.org API calls to avoid CORS issues
      '/api/football': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football/, '/v4'),
        headers: {
          'Origin': 'https://api.football-data.org',
        },
      },
      // Proxy NewsAPI calls – free tier blocks browser requests
      '/api/news': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, '/v2'),
        headers: {
          'Origin': 'https://newsapi.org',
        },
      },
    },
  },
})
