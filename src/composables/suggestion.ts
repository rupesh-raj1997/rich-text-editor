import { VueRenderer } from '@tiptap/vue-3'
import tippy, { Instance, Props as TippyProps } from 'tippy.js'

import { MentionList } from '@/components/ui/mention'
import type { SuggestionProps } from '@tiptap/suggestion'

interface ItemProps {
    query: string
}

export default {
    items: ({ query }: ItemProps): string[] => {
        return [
            'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder',
            'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry',
            'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio',
            'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick',
            'Justine Bateman', 'Lisa Bonet',
        ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
    },

    render: () => {
        let component: VueRenderer | null = null
        let popup: Instance[] = []

        return {
            onStart: (props: SuggestionProps) => {
                component = new VueRenderer(MentionList, {
                    props,
                    editor: props.editor,
                })

                if (!props.clientRect) {
                    return
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props: SuggestionProps) {
                component?.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0]?.setProps({
                    getReferenceClientRect: props.clientRect,
                } as Partial<TippyProps>)
            },

            onKeyDown(props: SuggestionProps) {
                if (props.event.key === 'Escape') {
                    popup[0]?.hide()
                    return true
                }

                return component?.ref?.onKeyDown?.(props)
            },

            onExit() {
                popup[0]?.destroy()
                component?.destroy()
            },
        }
    },
}
