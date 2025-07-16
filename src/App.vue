<template>
  <template v-if="editor">
    <div class="flex items-center justify-center h-screen  bg-gray-300 p-4">
      <Card class="w-full max-w-2xl">
        <CardHeader class="flex items-center">
          <Toolbar :editor="editor"></Toolbar>
        </CardHeader>
        <CardContent>
          <div ref="editorContainer" class="relative">
            <EditorContent class="prose" :editor="editor" />
          </div>
        </CardContent>
      </Card>
    </div>
  </template>
</template>

<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import { ref, } from 'vue'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { mentionSuggest } from './composables/suggestion'
import Toolbar from './components/ui/editor/Toolbar.vue'
import { useJuvlitEditor } from './composables/useJuvlitEditor'

const editorContainer = ref<HTMLElement | null>(null);

const { editor } = useJuvlitEditor({
  suggest: mentionSuggest,
})

// const editor = computed(() => juvlitEditor)
</script>


<style>
.editor-image {
  margin: 0;
}

.editor-image.ProseMirror-selectednode {
  outline: 5px solid #3b82f6;
  border-radius: 0.375rem;
}
</style>