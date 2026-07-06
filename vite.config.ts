import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // No source maps in production — prevents reverse engineering
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Obfuscate chunk names so they are not readable
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      }
    }
  }
  // Note: console.* silencing is handled at runtime by securityGuard.ts
  // Vite's esbuild option uses TransformOptions which does not include 'drop' or 'legalComments'
})
