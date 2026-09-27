import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome110',
    rollupOptions: {
      output: {
        // Match on resolved module paths — an exact-name map misses deep
        // entrypoints like `react-dom/client`, which then land in the main
        // chunk and inflate first load.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](gsap|lenis)[\\/]/.test(id)) return 'motion'
          if (/[\\/]node_modules[\\/]react-router/.test(id)) return 'router'
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          // Anything else falls through to Rollup's own grouping.
          return undefined
        },
      },
    },
  },
})
