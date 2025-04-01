import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: 10000,
    host: true,
    allowedHosts: ['frontend-seguridad.onrender.com']
  }
})
