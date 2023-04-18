import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: "prompt", includeAssets: ['favicon.png', 'github.png', 'google.svg'], manifest: {
      name: 'Car Auction App',
      short_name: 'CAA',
      description: 'App for selling cars',
      icons: [
        {
          src: "/favicon.png",
          sizes: '192x192',
          type: 'image/png'
        }
      ],
      display: 'standalone',
      scope: '/',
      start_url: '/',
      orientation: 'portrait'
    }
  })],
})
