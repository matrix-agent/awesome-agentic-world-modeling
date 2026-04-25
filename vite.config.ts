import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    modulePreload: { polyfill: true },
  },
  plugins: [tailwindcss()],
})
