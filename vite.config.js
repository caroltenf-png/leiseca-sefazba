import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          'dados': ['./src/data/dados.js'],
          'vendor': ['react', 'react-dom', '@supabase/supabase-js'],
        }
      }
    }
  }
})
