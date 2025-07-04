import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as lucide from 'lucide-vue-next';


const app = createApp(App);

// Register all Lucide icons globally
for (const [key, component] of Object.entries(lucide)) {
    app.component(key, component as any);
}

app.mount('#app');
