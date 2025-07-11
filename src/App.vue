<template>
  <template v-if="editor">
    <BubbleMenu :editor="editor" :should-show="shouldShow" class="bg-white border rounded shadow-lg p-4">
      <AttachedLinkUrl :linkInputUrl="linkInputUrl" />
    </BubbleMenu>
    <input class="hidden" ref="fileInputRef" type="file" accept="image/*" @change="handleFileChange" />
    <div class="flex items-center justify-center h-screen  bg-gray-300 p-4">
      <Card class="w-full max-w-2xl">
        <CardHeader class="flex items-center">
          <div v-for="({ icon, click, name }, idx) in headerIcons" :key="idx">
            <component :is="icon" @click="click" class="hover:border mr-2" role="button"
              :class="{ 'bg-gray-200 rounded': editor?.isActive(name) }" />
          </div>

          <!-- text color button -->
          <div class="relative">
            <PaintBucketIcon @click="toggleColorPicker(true)" class="hover:border mr-2" />
            <div ref="colorPickerRef" class="absolute top-8 z-1 ">
              <color-picker v-if="showColorPicker" format="hex" is-widget disable-history disable-alpha
                @update:pureColor="(hexCode: string) => setColor(hexCode, 'color')" />
            </div>
          </div>

          <!-- text highlight button -->
          <div class="relative">
            <Highlighter @click="toggleHighlightPicker(true)" class="hover:border mr-2" />
            <div ref="highlightPickerRef" class="absolute top-8 z-1 ">
              <color-picker v-if="showHighlightPicker" format="hex" is-widget disable-history disable-alpha
                @update:pureColor="(hexCode: string) => setColor(hexCode, 'highlight')" />
            </div>
          </div>

          <!-- emoji button  -->
          <div class="relative">
            <SmileIcon @click="toggleEmojiPicker(true)" class="hover:border mr-2" />
            <div ref="emojiPickerRef" class="absolute top-8 z-1 ">
              <EmojiPicker v-if="showEmojiPicker" :native="true" @select="addEmoji">
              </EmojiPicker>
            </div>
          </div>

        </CardHeader>
        <CardContent>
          <div ref="editorContainer" class="relative">
            <EditorContent class="prose" :editor="editor" />
          </div>
        </CardContent>
        <CardFooter class="flex justify-between items-center">
          <div class="flex items-center">
            <div v-for="({ icon, click, name }, i) in footerIcons" :key="i">
              <component :is="icon" @click="click" class="hover:border mr-2"
                :class="{ 'bg-gray-200 rounded': editor?.isActive(name) }" />
            </div>
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
import { computed, onBeforeUnmount, ref, } from 'vue'
import { onClickOutside } from '@vueuse/core'
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
  Link as LinkIcon, ListOrdered, Image as ImageIcon, SmilePlus as SmileIcon,
  PaintBucketIcon, Strikethrough, CodeXml, Highlighter
} from 'lucide-vue-next'
import { createComment } from './lib/comments.api'
import { CommentType, Visibility } from './lib/comment.types'
import FloatingMenu from '@tiptap/extension-floating-menu'
import AttachedLinkUrl from './AttachedLinkUrl.vue'
import Image from '@tiptap/extension-image'
import EmojiPicker, { EmojiExt } from 'vue3-emoji-picker'
import Emoji from '@tiptap/extension-emoji'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

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
  content: `
  What is up? This is a rich text editor built with Tiptap and Vue 3 🙂
  <img src="https://images.unsplash.com/photo-1723458947447-f2f8dd424446" height="10px" width="10px" />
  `,
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    Emoji,
    Highlight.configure({ multicolor: true }),
    FloatingMenu,
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
    { name: 'strike', icon: Strikethrough, click: () => editor.value?.chain().focus().toggleStrike().run() },
    { name: 'bulletList', icon: List, click: () => editor.value?.chain().focus().toggleBulletList().run() },
    { name: 'orderedList', icon: ListOrdered, click: () => editor.value?.chain().focus().toggleOrderedList().run() },
    { name: 'eraser', icon: Eraser, click: () => editor.value?.chain().focus().unsetAllMarks().clearNodes().run() },
    { name: 'link', icon: LinkIcon, click: () => openLinkInputBubble() },
    { name: 'image', icon: ImageIcon, click: () => triggerImageUpload() },
    { name: 'codeBlock', icon: CodeXml, click: () => editor.value?.chain().focus().toggleCodeBlock().run() },
    // { name: 'table', icon: Sheet, click: () => { } },
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

// Text Color/Highlight vars
const colorPickerRef = ref<HTMLElement | null>(null);
const highlightPickerRef = ref<HTMLElement | null>(null);

onClickOutside(colorPickerRef, () => toggleColorPicker());
onClickOutside(highlightPickerRef, () => toggleHighlightPicker());

const showColorPicker = ref(false);
const showHighlightPicker = ref(false)

const toggleColorPicker = (visible: boolean = false) => {
  showColorPicker.value = visible
}
const toggleHighlightPicker = (visible: boolean = false) => {
  showHighlightPicker.value = visible
}

const setColor = (color: string, type: 'color' | 'highlight') => {
  if (!editor.value) return
  if (type === 'color') editor.value?.chain().focus().setColor(color).run();
  else if (type === 'highlight') editor.value?.chain().focus().setHighlight({ color }).run()

}

// Emoji Picker vars
const emojiPickerRef = ref<HTMLElement | null>(null);
onClickOutside(emojiPickerRef, () =>
  toggleEmojiPicker(false)
);
const showEmojiPicker = ref(false)
const toggleEmojiPicker = (visible: boolean) => {
  showEmojiPicker.value = visible
}
const addEmoji = (emoji: EmojiExt) => {
  if (!editor.value) return
  editor.value.commands.insertContent(emoji.i)
  toggleEmojiPicker(false);
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

mark {
  background-color: #ffeb3b;
  /* yellow */
  padding: 0.1em;
  border-radius: 0.2em;
}
</style>