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
  {
    path: "/",
    component: () => import("../views/Index.vue")
  },

  {
    path: "/:pathMatch(.*)",
    component: () => import("../views/Error.vue")
  },

  {
    path: "/401",
    component: () => import("../views/Error.vue"),
    meta: {
      code: 401,
      msg: "未登录",
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  store.curPath = to.path

  window.scrollTo(0, 0) //设置滚动条位置到顶部
  next()
})

export default router