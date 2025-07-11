<template>
  <template v-if="editor">
    <BubbleMenu :editor="editor" :should-show="shouldShow" class="bg-white border rounded shadow-lg p-4">
      <AttachedLinkUrl :linkInputUrl="linkInputUrl" />
    </BubbleMenu>
    <input class="hidden" ref="fileInputRef" type="file" accept="image/*" @change="handleFileChange" />
    <div class="flex items-center justify-center h-screen  bg-gray-300 p-4">
      <Card class="w-full max-w-2xl">
        <CardHeader class="flex items-center">
          <template v-for="({ icon, click, name }, i) in headerIcons" :key="i">
            <component :is="icon" @click="click" class="hover:border mr-2"
              :class="{ 'bg-gray-200 rounded': editor?.isActive(name) }" />
          </template>
        </CardHeader>
        <CardContent>
          <div ref="editorContainer" class="relative">
            <EditorContent class="prose" :editor="editor" />
          </div>
        </CardContent>
        <CardFooter class="flex justify-between items-center">
          <div class="flex items-center">
            <template v-for="({ icon, click, name }, i) in footerIcons" :key="i">
              <component :is="icon" @click="click" class="hover:border mr-2"
                :class="{ 'bg-gray-200 rounded': editor?.isActive(name) }" />
            </template>
          </div>
          <div>
            <Button class="mr-2" variant="default" @click="handleSave">Comment </Button>
            <Button variant="outline" @click="emit('cancel')">Cancel</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import {
  Bell, Underline as UnderlineIcon, Bold, Italic, List, Eraser, Paperclip, Tag,
  Link as LinkIcon, ListOrdered, Image as ImageIcon
} from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref } from 'vue'
import { createComment } from './lib/comments.api'
import { CommentType, Visibility } from './lib/comment.types'
import FloatingMenu from '@tiptap/extension-floating-menu'
import AttachedLinkUrl from './AttachedLinkUrl.vue'
import Image from '@tiptap/extension-image'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

const editorContainer = ref<HTMLElement | null>(null);

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'p-1 outline-none',
    },
  },
  content: `
  What is up? This is a <a href="https://tiptap.dev" target="_blank">rich text editor</a> built with Tiptap and Vue 3.
  <img src="https://images.unsplash.com/photo-1723458947447-f2f8dd424446?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" height="10px" width="10px" />

  `,
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    Highlight,
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      defaultProtocol: 'https',
    }),
    FloatingMenu,
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: 'editor-image'
      }
    })
  ],
  onSelectionUpdate({ editor }) {
    if (editor.isActive('link')) {
      const url = editor.getAttributes('link').href
      linkInputUrl.value = url;
    }
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const emit = defineEmits<{
  (event: 'cancel'): void
  (event: 'save'): void;
}>();

const headerIcons = computed(() => {
  if (!editor.value) return [];
  return [
    { name: 'bold', icon: Bold, click: () => editor.value?.chain().focus().toggleBold().run() },
    { name: 'italic', icon: Italic, click: () => editor.value?.chain().focus().toggleItalic().run() },
    { name: 'underline', icon: UnderlineIcon, click: () => editor.value?.chain().focus().toggleUnderline().run() },
    { name: 'bulletList', icon: List, click: () => editor.value?.chain().focus().toggleBulletList().run() },
    { name: 'orderedList', icon: ListOrdered, click: () => editor.value?.chain().focus().toggleOrderedList().run() },
    { name: 'eraser', icon: Eraser, click: () => editor.value?.chain().focus().unsetAllMarks().clearNodes().run() },
    { name: 'link', icon: LinkIcon, click: () => openLinkInputBubble() },
    { name: 'image', icon: ImageIcon, click: () => triggerImageUpload() },
    // { name: 'table', icon: Sheet, click: () => { } },
    // { name: 'color', icon: Pipette, click: () => { } }, // Placeholder for color picker
    // { name: 'highlight', icon: PaintBucket, click: () => { } }, // Placeholder for highlight
  ]
})


const footerIcons = [
  { name: 'attachment', icon: Paperclip, click: () => { } },
  { name: 'notification', icon: Bell, click: () => { } },
  { name: 'tag', icon: Tag, click: () => { } },
];


// LINK UPLOAD VARS
const linkInputUrl = ref('');

const shouldShow = (props: any) => {
  return props.editor.isActive('link')
}
const openLinkInputBubble = () => {
  if (!editor.value) return null;
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: '' }).run()

}

// Image ADD VARS
const fileInputRef = ref<HTMLElement | null>(null);

const triggerImageUpload = () => {
  if (fileInputRef.value) fileInputRef.value.click()
}

const handleFileChange = (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const url = reader.result as string
    if (editor.value)
      editor.value.chain().focus().setImage({ src: url }).run()
  }
  reader.readAsDataURL(file)
}



const handleSave = async () => {
  if (editor.value) {
    const content = editor.value.getHTML();
    const resp = await createComment({
      text: content,
      pinned: false,
      visibility: Visibility.PUBLIC,
      commentType: CommentType.NOTE,
      attachments: [],
    });
    console.log('Comment created:', resp);
    editor.value.commands.clearContent();
    emit('save');
  }
}
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