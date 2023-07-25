import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { createApp } from 'vue'
import App from '../App.vue'
import { createPinia } from 'pinia'
import { useStore } from "../store"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const store = useStore()

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "",
  //   component: () => import("")
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router