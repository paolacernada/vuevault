// Importing functions from Vite and the official Vue plugin for Vite
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite configuration
export default defineConfig({
  // Array of plugins used in the Vite build process
  plugins: [
    vue(), // Integrating the Vue plugin which enables Vue 3 support in Vite
  ],
})
