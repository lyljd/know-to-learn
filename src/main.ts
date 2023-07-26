import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './normalize.css'
import './main.css'
import 'animate.css'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Image from "./components/Image.vue"

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('Image', Image)
app.mount('#app')
