import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { useStore } from "../store"
import * as common from '@/common'

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
    path: "/403",
    component: () => import("../views/Error.vue"),
    meta: {
      code: 403,
      msg: "未授权",
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
    path: "/org/home",
    component: () => import("../views/Org.vue"),
    children: [
      { path: "/org/home", component: () => import("../views/Org/Home.vue") },
      { path: "/org/course", component: () => import("../views/Org/Course.vue") },
    ],
    meta: {
      title: "机构中心",
      needLogin: true,
      role: "org",
    }
  },

  {
    path: "/admin/org",
    component: () => import("../views/Admin.vue"),
    children: [
      { path: "/admin/org", component: () => import("../views/Admin/Org.vue") },
      { path: "/admin/course", component: () => import("../views/Admin/Course.vue") },
    ],
    meta: {
      title: "管理中心",
      needLogin: true,
      role: "admin",
    }
  },

  {
    path: "/course/:id",
    component: () => import("../views/Course.vue"),
    children: [
      { path: "/course/:id", component: () => import("../views/Course/Chapter.vue") },
    ]
  },

  {
    path: "/org/:id",
    component: () => import("../views/OrgExpose.vue"),
  },

  {
    path: "/video/:id",
    component: () => import("../views/Video.vue"),
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

  if (to.meta.role && common.getRole() !== to.meta.role) {
    next(`/403?from=${to.href}`)
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