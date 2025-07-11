import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import Test from './Test.vue'
import { plugin as VueTippy } from 'vue-tippy'
import Vue3ColorPicker from "vue3-colorpicker";
import * as lucide from 'lucide-vue-next';
import "vue3-emoji-picker/dist/style.css";
import "vue3-colorpicker/style.css";
// const app = createApp(Test);
const app = createApp(App);

app.use(VueTippy);
app.use(Vue3ColorPicker);

// Register all Lucide icons globally
for (const [key, component] of Object.entries(lucide)) {
    app.component(key, component as any);
}

app.mount('#app');
