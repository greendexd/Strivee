import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['strivee.199.83.103.191.sslip.io', '199.83.103.191.sslip.io'],
  },
  preview: {
    allowedHosts: ['strivee.199.83.103.191.sslip.io', '199.83.103.191.sslip.io'],
  },
})
