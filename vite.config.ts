import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'vue3-emoji-picker/dist/style.css': path.resolve(__dirname, 'node_modules/vue3-emoji-picker/dist/style.css')
    }
  },
})
