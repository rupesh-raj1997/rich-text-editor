import Toolbar from "@/components/ui/editor/Toolbar.vue";
import { EditorContent } from "@tiptap/vue-3";
import { useJuvlitEditor } from "./composables/useJuvlitEditor";

export default EditorContent;


export {
    Toolbar as JuvlitToolbar,
    useJuvlitEditor,
}
