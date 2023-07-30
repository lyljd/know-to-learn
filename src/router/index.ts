import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { useStore } from "../store"

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

  {
    path: "/user",
    component: () => import("../views/User.vue"),
    meta: {
      title: "用户中心",
      needLogin: true,
    }
  },

  {
    path: "/message",
    component: () => import("../views/Message.vue"),
    meta: {
      title: "消息中心",
      needLogin: true,
    }
  },

  {
    path: "/org",
    component: () => import("../views/Org.vue"),
    meta: {
      title: "机构中心",
      needLogin: true,
    }
  },

  {
    path: "/admin",
    component: () => import("../views/Admin.vue"),
    meta: {
      title: "后台管理",
      needLogin: true,
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to: any, from: any, next: Function) => {
  const store = useStore()
  if (to.meta.needLogin && !store.isLogin) {
    next(`/401?from=${to.href}`)
    return
  }

  if (to.meta.title) {
    document.title = to.meta.title + " - 知学随学"
  } else {
    document.title = "知学随学"
  }

  store.curPath = to.path

  window.scrollTo(0, 0) //设置滚动条位置到顶部
  next()
})

export default router