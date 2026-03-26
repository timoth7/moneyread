import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('react-router-dom')) return 'react'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('recharts')) return 'charts'
          if (id.includes('uuid') || id.includes('html2canvas') || id.includes('canvas-confetti'))
            return 'utils'
          return undefined
        },
      },
    },
  },
})
