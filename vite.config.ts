import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), tailwindcss(), dts({ include: ['src/types'] })],
  build: {
    lib: {
      name: 'JuvlitEditor',
      entry: path.resolve(__dirname, 'src/library/main.ts'),
      formats: ['es'],
      fileName: (format) => `juvlit-editor.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue',
      ],
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'vue3-emoji-picker/dist/style.css': path.resolve(__dirname, 'node_modules/vue3-emoji-picker/dist/style.css'),
      'tippy.js/dist/tippy.css': path.resolve(__dirname, 'node_modules/tippy.js/dist/tippy.css')
    }
  },
})
