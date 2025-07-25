
# Juvlit Rich Text Editor Library

## Installation

```sh
npm install juvlit-text-editor
```

## Usage

### Register globally (recommended)

```ts
import { createApp } from 'vue';
import JuvlitEditor from 'juvlit-text-editor';
import 'vue3-emoji-picker/dist/style.css';
import 'vue3-colorpicker/style.css';
import 'tippy.js/dist/tippy.css';

const app = createApp(App);
app.use(JuvlitEditor);
```

### Import individual components/composables

```ts
import { Toolbar, useJuvlitEditor } from 'juvlit-text-editor';
```

---

### Rich text editor new features

## Done

Dropper Icon – Text Color or Highlight Color
Changes the text or background color.

Paintbrush/Formatting Icon – Clear Formatting
Removes any applied formatting like bold, italics, or color.

Numbered List Icon – Numbered List
Creates a numbered list.

Bulleted List Icon – Bullet List
Creates a bulleted list.

Image Icon – Insert Image
Allows you to insert an image into the comment.

Eraser Icon – Remove Formatting or Clear Content
Likely clears all formatting or deletes the current content.

Link Icon – Insert Link
Adds a hyperlink to selected text.



## TODO
10▼ – Font Size Dropdown
Lets you select the font size.

Table Icon – Insert Table Lets you add a table.



## Not Required

~~Aa (small caps) – Text Style or Capitalization
Changes capitalization or applies text styles like headings or code.~~


~~F – Font Style or Font Type
Likely allows you to choose a different font type or style.~~
