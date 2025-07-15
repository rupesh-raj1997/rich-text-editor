import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'JuvlitEditor',
      fileName: (format) => `juvlit-editor-lib.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        '@tiptap/vue-3',
        '@tiptap/starter-kit',
        'vue3-emoji-picker',
        'vue3-colorpicker',
        'lucide-vue-next',
        'highlight.js',
        '@vueuse/core',
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
