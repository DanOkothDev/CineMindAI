import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CineMindAI frontend dev server.
// API calls are made to relative "/api/..." paths (see src/api/api.js),
// and this proxy forwards them to the Flask backend during local development
// so you don't run into CORS issues. Point VITE_BACKEND_URL at your Flask
// server if it's not running on the default port.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
