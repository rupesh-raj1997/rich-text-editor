<template>
  <div>
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :should-show="shouldShow"
      class="bubble-menu"
    >
      <input
        v-model="linkUrl"
        placeholder="Enter URL"
        class="input"
        @keydown.enter="updateLink"
      />
      <button @click="updateLink">Update</button>
      <button @click="removeLink">Remove</button>
    </BubbleMenu>

    <EditorContent :editor="editor" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

const linkUrl = ref('')

const editor = new Editor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
    }),
  ],
  content: `<p>This is a <a href="https://example.com">link</a>.</p>`,
  onSelectionUpdate({ editor }) {
    if (editor.isActive('link')) {
      const href = editor.getAttributes('link').href
      linkUrl.value = href
    }
  },
})

const shouldShow = ({ editor }) => {
  return editor.isActive('link')
}

const updateLink = () => {
  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: linkUrl.value })
    .run()
}

const removeLink = () => {
  editor.chain().focus().extendMarkRange('link').unsetLink().run()
}

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style>
.bubble-menu {
  background: white;
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 4px;
  align-items: center;
}
.input {
  border: 1px solid #ddd;
  padding: 4px;
  border-radius: 4px;
  width: 200px;
}
</style>
