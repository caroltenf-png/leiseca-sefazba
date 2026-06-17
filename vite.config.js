import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Lei Seca · SEFAZ-BA',
        short_name: 'Lei Seca',
        description: 'Plataforma de estudo de legislação para concursos fiscais — Carolina Teixeira',
        theme_color: '#070F1A',
        background_color: '#070F1A',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Cacheia todos os assets do build
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Estratégia: tenta rede, cai pro cache se offline
        runtimeCaching: [
          {
            // Google Fonts — cache-first (raramente muda)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // API Anthropic — NetworkFirst: tenta online, usa cache se offline
            urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-claude',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Textos de leis do Planalto/SEFAZ-BA — StaleWhileRevalidate
            urlPattern: /^https:\/\/(www\.planalto\.gov\.br|mbusca\.sefaz\.ba\.gov\.br|www\.legislabahia\.ba\.gov\.br)\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'leis-planalto',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ]
})
