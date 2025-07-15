import { onBeforeUnmount } from 'vue'
import { Extensions, useEditor, VueRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import FloatingMenu from '@tiptap/extension-floating-menu'
import Image from '@tiptap/extension-image'
import Emoji from '@tiptap/extension-emoji'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, all } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import Mention from '@tiptap/extension-mention'
import { updatePosition } from './suggestion'
import { MentionList } from '@/components/ui/mention'
import { EditorProps } from '@tiptap/pm/view'

const lowlight = createLowlight(all)
lowlight.register('html', xml)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

interface JuvlitEditorOptions {
    editorProps?: EditorProps,
    extensions?: Extensions
    content?: string,
    suggest?: ({ query }: { query: string }) => string[]
}

export function useJuvlitEditor(options: JuvlitEditorOptions) {
    const editor = useEditor({
        editorProps: options.editorProps ?? {
            attributes: {
                class: 'p-1 outline-none',
            },
        },
        content: options.content ?? ``,
        extensions: options.extensions ?? [
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
                    class: 'editor-image',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'ts',
            }),
            Mention.configure({
                HTMLAttributes: { class: 'mention' },
                deleteTriggerWithBackspace: true,
                suggestion: {
                    items: options.suggest ? options.suggest : () => [],
                    render: () => {
                        let component: any
                        return {
                            onStart: props => {
                                component = new VueRenderer(MentionList, {
                                    props,
                                    editor: props.editor,
                                })

                                if (!props.clientRect) return

                                component.element.style.position = 'absolute'
                                document.body.appendChild(component.element)
                                updatePosition(props.editor as any, component.element)
                            },
                            onUpdate(props) {
                                component.updateProps(props)
                                if (!props.clientRect) return
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
                    },
                },
            }),

        ],
    })

    onBeforeUnmount(() => {
        editor.value?.destroy()
    })

    return { editor }
}
