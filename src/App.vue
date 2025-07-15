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
import { useEditor, EditorContent, VueRenderer } from '@tiptap/vue-3'
import { onBeforeUnmount, ref, } from 'vue'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import FloatingMenu from '@tiptap/extension-floating-menu'
import Image from '@tiptap/extension-image'

import Emoji from '@tiptap/extension-emoji'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import Mention from '@tiptap/extension-mention'
import { mentionSuggest, updatePosition } from './composables/suggestion'
import { MentionList } from './components/ui/mention'
import Toolbar from './components/ui/editor/Toolbar.vue'

const lowlight = createLowlight(all)
lowlight.register('html', xml)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

const editorContainer = ref<HTMLElement | null>(null);

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'p-1 outline-none',
    },
  },
  content: ``,
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    Emoji,
    FloatingMenu,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      defaultProtocol: 'https',
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: 'editor-image'
      }
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'ts'
    }),
    Mention.configure({
      HTMLAttributes: { class: 'mention' },
      deleteTriggerWithBackspace: true,
      suggestion: {
        items: mentionSuggest,
        render: () => {
          let component: any;
          return {
            onStart: props => {
              component = new VueRenderer(MentionList, {
                props,
                editor: props.editor
              })

              if (!props.clientRect) return
              component.element.style.position = 'absolute'
              document.body.appendChild(component.element)
              updatePosition(props.editor as any, component.element)
            },
            onUpdate(props) {
              component.updateProps(props)
              if (!props.clientRect) {
                return
              }
              updatePosition(props.editor as any, component.element)
            },
            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                component.destroy()
                return true
              }
              return component.ref?.onKeyDown(props)
            },
            onExit() {
              component.element.remove()
              component.destroy()
            },
          }
        }
      }
    })
  ],
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

</script>


<style>
.editor-image {
  margin: 0;
}

.editor-image.ProseMirror-selectednode {
  outline: 5px solid #3b82f6;
  border-radius: 0.375rem;
}

mark {
  background-color: #ffeb3b;
  /* yellow */
  padding: 0.1em;
  border-radius: 0.2em;
}
</style>