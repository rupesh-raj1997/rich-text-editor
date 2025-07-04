<template>
  <div class="flex items-center justify-center h-screen bg-gray-300">
    <Card class="w-full max-w-2xl">
      <CardHeader class="flex items-center">
        <template v-for="({ icon, click, name }, i) in headerIcons" :key="i">
          <component :is="icon" @click="click" class="hover:border mr-2"
            :class="{ 'bg-gray-200 rounded': editor?.isActive(name) }" />
        </template>
      </CardHeader>
      <CardContent>
        <EditorContent :editor="editor" />
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

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import {
  Bell, Underline as UnderlineIcon, Bold, Italic, Pipette, PaintBucket, ALargeSmall, Sheet, List, Image, Eraser, Link, Paperclip,
  Tag
} from 'lucide-vue-next'
import { computed } from 'vue'
import { createComment } from './lib/comments.api'
import { CommentType, Visibility } from './lib/comment.types'

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'p-1 outline-none',
    },
  },
  content: "",
  extensions: [StarterKit, Underline],
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
    { name: 'underline', icon: UnderlineIcon, click: () => editor.value?.commands?.toggleUnderline() },
    { name: 'color', icon: Pipette, click: () => { } },
    { name: 'background', icon: PaintBucket, click: () => { } },
    { name: 'font-size', icon: ALargeSmall, click: () => { } },
    { name: 'bullet-list', icon: List, click: () => { } },
    { name: 'image', icon: Image, click: () => { } },
    { name: 'eraser', icon: Eraser, click: () => { } },
    { name: 'link', icon: Link, click: () => { } },
    { name: 'table', icon: Sheet, click: () => { } },
  ]
})

const footerIcons = [
  { name: 'attachment', icon: Paperclip, click: () => { } },
  { name: 'notification', icon: Bell, click: () => { } },
  { name: 'tag', icon: Tag, click: () => { } },
];


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
