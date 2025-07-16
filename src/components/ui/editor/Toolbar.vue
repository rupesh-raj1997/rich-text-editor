<template>
    <input class="hidden" ref="fileInputRef" type="file" accept="image/*" @change="handleFileChange" />

    <div v-for="({ icon, click, name }, idx) in headerIcons" :key="idx">
        <component :is="icon" @click="click" class="hover:border mr-2" role="button"
            :class="{ 'bg-gray-200 rounded': editor?.isActive(name) }" />
    </div>

    <!-- text link button -->
    <div class="relative">
        <LinkIcon @click="toggleLinkInput(true)" class="hover:border mr-2"
            :class="{ 'bg-gray-200 rounded': editor?.isActive('link') }" />
        <div ref="linkInputRef" class="absolute top-8 z-1 w-max">
            <AttachedLinkUrl v-if="showLinkInput" :link-input-url="linkInputUrl" @save="setLinkInputUrl" />
        </div>
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
    Underline as UnderlineIcon, Bold, Italic, List, Eraser,
    Link as LinkIcon, ListOrdered, Image as ImageIcon, SmilePlus as SmileIcon,
    PaintBucketIcon, Strikethrough, CodeXml, Highlighter
} from 'lucide-vue-next'
import { Editor } from '@tiptap/vue-3';
import AttachedLinkUrl from '@/AttachedLinkUrl.vue';
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue';
import EmojiPicker, { EmojiExt } from 'vue3-emoji-picker'
import { ColorPicker } from "vue3-colorpicker";


const props = defineProps<{ editor: Editor }>()

const headerIcons = computed(() => {
    if (!props.editor) return [];
    return [
        { name: 'bold', icon: Bold, click: () => props.editor?.chain().focus().toggleBold().run() },
        { name: 'italic', icon: Italic, click: () => props.editor?.chain().focus().toggleItalic().run() },
        { name: 'underline', icon: UnderlineIcon, click: () => props.editor?.chain().focus().toggleUnderline().run() },
        { name: 'strike', icon: Strikethrough, click: () => props.editor?.chain().focus().toggleStrike().run() },
        { name: 'bulletList', icon: List, click: () => props.editor?.chain().focus().toggleBulletList().run() },
        { name: 'orderedList', icon: ListOrdered, click: () => props.editor?.chain().focus().toggleOrderedList().run() },
        { name: 'eraser', icon: Eraser, click: () => props.editor?.chain().focus().unsetAllMarks().clearNodes().run() },
        { name: 'image', icon: ImageIcon, click: () => triggerImageUpload() },
        { name: 'codeBlock', icon: CodeXml, click: () => props.editor?.chain().focus().toggleCodeBlock().run() },
    ]
})


// LINK UPLOAD VARS
const linkInputRef = ref<HTMLElement | null>(null)
const showLinkInput = ref(false)
const linkInputUrl = ref('');

const toggleLinkInput = (visible: boolean = false) => {
    showLinkInput.value = visible;
}

const setLinkInputUrl = (url: string) => {
    if (url) {
        props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    } else {
        props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    showLinkInput.value = false;
    linkInputUrl.value = '';
}

onClickOutside(linkInputRef, () => toggleLinkInput(false))

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
        if (props.editor) props.editor?.chain().focus().setImage({ src: url }).run()
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
    if (!props.editor) return
    if (type === 'color') props.editor.chain().focus().setColor(color).run();
    else if (type === 'highlight') props.editor.chain().focus().setHighlight({ color }).run()
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
    if (!props.editor) return
    props.editor.commands.insertContent(emoji.i)
    toggleEmojiPicker(false);
}
</script>