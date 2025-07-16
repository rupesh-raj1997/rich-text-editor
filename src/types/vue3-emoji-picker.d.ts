declare module 'vue3-emoji-picker' {
    import { DefineComponent } from 'vue';

    const EmojiPicker: DefineComponent<{}, {}, any>;

    // Add this based on the usage pattern. This is a loose type, update as needed.
    export interface EmojiExt {
        i: string;      // the emoji character
        n: string[];    // names
        id: string;     // shortcode or ID
        v: string;      // version
        u: string;      // unicode
    }

    export default EmojiPicker;
}