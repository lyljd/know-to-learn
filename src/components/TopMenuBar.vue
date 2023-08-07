<template>
  <div class="tmb-container">
    <el-menu class="menu" mode="horizontal" :default-active=$route.path :ellipsis="false" router="true">
      <div class="logo">
        <img class="icon" :src="special && isTop ? '../../public/ktl2.png' : '../../public/ktl.png'">
        <span class="site-name">知学随学</span>
      </div>

      <el-menu-item index="/">首页</el-menu-item>
      <el-sub-menu>
        <template #title>分类</template>
        <el-menu-item index="/category/backend">后端开发</el-menu-item>
        <el-menu-item index="/category/frontend">前端开发</el-menu-item>
        <el-menu-item index="/category/mobile">移动开发</el-menu-item>
      </el-sub-menu>

      <div class="flex-grow" />

      <div :style="{ display: store.curPath === '/search' ? 'none' : 'block' }" class="search-bar">
        <el-input class="search" @keyup.enter.native="toSearch" v-model="searchKey" placeholder="搜索" clearable>
          <template #prefix><el-icon @click="toSearch" class="search-icon">
              <search />
            </el-icon></template>
        </el-input>
      </div>

      <div class="flex-grow" />

      <div class="login-btn" @click="openLoginWindow()" v-if="!store.isLogin">登录</div>

      <el-popover @show="onAvatarPopShow" :width="250" ref="avatarPop" :show-arrow=false>
        <template #reference>
          <el-avatar class="avatar" v-if="store.isLogin" :src="store.avatarUrl" @error="true">
            <img src="../../public/default-avatar.png" />
          </el-avatar>
        </template>

        <div class="avatar-hover-window">
          <div class="nickname">
            {{ store.nickname }}
          </div>

          <div class="divider"></div>

          <ul class="option">

            <li @click="common.ToNewPage('/message')"><el-badge :hidden="newMsgNum === 0"
                :value="newMsgNum">消息中心</el-badge></li>
            <li @click="common.ToNewPage('/user')">用户中心</li>
            <li v-if="common.getRole() === 'org'" @click="common.ToNewPage('/org/home')">机构中心</li>
            <li v-if="common.getRole() === 'admin'" @click="common.ToNewPage('/admin/org')">管理中心</li>
            <li @click="logout">退出登录</li>
          </ul>
        </div>
      </el-popover>
    </el-menu>
  </div>

  <LoginWindow ref="loginWindow"></LoginWindow>
</template>

<script setup lang="ts">
import * as common from "@/common"
import { useRoute } from 'vue-router'
import { useStore } from "@/store"
import LoginWindow from "@/components/LoginWindow.vue"
import * as API from '@/api/user'

const data = withDefaults(defineProps<{
  special: boolean,
}>(), {
  special: false,
})

const route = useRoute()
const store = useStore()
store.openLoginWindow = openLoginWindow

const avatarPop = ref()
const loginWindow = ref<InstanceType<typeof LoginWindow>>()
let menu: HTMLElement
let searchInput: HTMLElement
let searchInner: HTMLElement
let searchIcon: HTMLElement
let items: NodeListOf<Element>
let subItems: NodeListOf<Element>
let activeItem: HTMLElement
let searchInnerPlaceholder: HTMLStyleElement

let searchKey = ref("")
let isTop = ref(false)
let newMsgNum = ref(0)

onMounted(() => {
  menu = document.querySelector(".tmb-container .menu") as HTMLElement

  if (data.special) {
    isTop.value = true
    searchInput = document.querySelector(".tmb-container .search-bar .el-input__wrapper") as HTMLElement
    searchInner = document.querySelector(".tmb-container .search-bar .el-input__wrapper .el-input__inner") as HTMLElement
    searchIcon = document.querySelector(".tmb-container .search .search-icon") as HTMLElement
    items = document.querySelectorAll(".tmb-container .el-menu-item")
    subItems = document.querySelectorAll(".tmb-container .el-sub-menu__title")
    activeItem = document.querySelector(".tmb-container .el-menu-item.is-active") as HTMLElement
    searchInnerPlaceholder = document.createElement("style")
    searchInnerPlaceholder.textContent = `.tmb-container .search-bar .el-input__wrapper .el-input__inner::placeholder {color: white;}`
    menu.style.background = "none"
    menu.style.borderBottom = "none"
    menu.style.color = "white"
    searchInput.style.boxShadow = "none"
    searchInput.style.background = "rgba(255, 255, 255, 0.25)"
    searchInner.style.color = "white"
    searchIcon.style.color = "white"
    items.forEach(ele => {
      ele.setAttribute("style", "color: white !important; border-bottom: none !important;")
    })
    setTimeout(() => {
      subItems.forEach(ele => {
        ele.setAttribute("style", "color: white !important; border-bottom: none !important;")
      })
    }, 0);
    activeItem.setAttribute("style", "color: white !important; border-bottom: 2px solid white !important;")
    document.head.appendChild(searchInnerPlaceholder)

    window.addEventListener("scroll", windowScroll)
  }

  window.addEventListener("scroll", topMenuBarScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", windowScroll)
  if (searchInnerPlaceholder) {
    searchInnerPlaceholder.remove()
  }

  window.removeEventListener("scroll", topMenuBarScroll)
})

function windowScroll() {
  if (scrollY > 57) {
    isTop.value = false
    menu.style.background = "white"
    menu.style.borderBottom = "1px solid #c8c9cc"
    menu.style.color = "#303133"
    searchInput.style.boxShadow = "0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset"
    searchInput.style.backgroundColor = "white"
    searchInner.style.color = "#303133"
    searchIcon.style.color = "#909399"
    items.forEach(ele => {
      ele.setAttribute("style", "color: #303133 !important; border-bottom: none !important;")
    })
    setTimeout(() => {
      subItems.forEach(ele => {
        ele.setAttribute("style", "color: #303133 !important; border-bottom: none !important;")
      })
    }, 0);
    activeItem.setAttribute("style", "color: #409EFF !important; border-bottom: 2px solid #409EFF !important;")
    searchInnerPlaceholder.remove()
    return
  }

  isTop.value = true
  menu.style.background = "none"
  menu.style.borderBottom = "none"
  menu.style.color = "white"
  searchInput.style.boxShadow = "none"
  searchInput.style.background = "rgba(255, 255, 255, 0.25)"
  searchInner.style.color = "white"
  searchIcon.style.color = "white"
  items.forEach(ele => {
    ele.setAttribute("style", "color: white !important; border-bottom: none !important;")
  })
  setTimeout(() => {
    subItems.forEach(ele => {
      ele.setAttribute("style", "color: white !important; border-bottom: none !important;")
    })
  }, 0);
  activeItem.setAttribute("style", "color: white !important; border-bottom: 2px solid white !important;")
  document.head.appendChild(searchInnerPlaceholder)
}

function topMenuBarScroll() {
  menu.style.marginLeft = -document.documentElement.scrollLeft.toString() + "px"
}

function toSearch() {
  if (searchKey.value.trim() === '') {
    common.showError("关键字不能为空")
    return
  }
  common.ToNewPage(`/search?key=${searchKey.value}`)
}

function openLoginWindow() {
  loginWindow.value?.show((au: string, nn: string) => {
    store.avatarUrl = au
    store.nickname = nn
  })
}

function logout() {
  avatarPop.value.hide()
  common.clearLoginStorage()
  store.isLogin = false
  if (route.meta.needLogin) {
    location.href = `/401?from=${location.pathname}`
  }
}

function onAvatarPopShow() {
  API.getNewMsgNum()
    .then((res) => {
      if (res.code !== 200) {
        console.log(res.message)
        common.showError("获取未读消息失败")
        return
      }

      newMsgNum.value = res.data
    })
    .catch((error) => {
      console.log(error.message)
      common.showError("获取未读消息失败")
    })
}
</script>

<style scoped>
.avatar-hover-window .nickname {
  font-size: 20px;
  text-align: center;
}

.avatar-hover-window .divider {
  margin-top: 5px;
}

.avatar-hover-window .option li {
  text-align: center;
  padding: 10px;
  cursor: pointer;
}

.avatar-hover-window .option li:hover {
  background-color: #e9e9eb;
}

.tmb-container .menu {
  width: 100%;
  min-width: 1280px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 2000;
}

.tmb-container .logo {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.tmb-container .logo .icon {
  width: 37.5px;
  margin-right: 5px;
  vertical-align: top;
}

.tmb-container .logo .site-name {
  font-size: 30px;
  cursor: default;
}

.tmb-container .search-bar .search {
  width: 300px;
}

.tmb-container .search .search-icon {
  cursor: pointer;
}

.tmb-container .login-btn {
  width: 40px;
  height: 40px;
  background-color: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}

.tmb-container .login-btn:hover {
  background-color: #79bbff;
}

.tmb-container .avatar {
  cursor: pointer;
}
</style>

<style>
.el-menu-item:hover {
  background-color: unset !important;
}

.el-menu--popup {
  min-width: auto !important;
  display: flex;
  flex-direction: column;
  margin-bottom: -1px !important;
}

.el-popover {
  padding: 5px !important;
}

.avatar-hover-window .option .el-badge__content {
  right: 5px !important;
}

.tmb-container .el-menu-item:focus {
  background-color: unset !important;
  color: inherit !important;
}

.tmb-container .el-menu-item:focus {
  background-color: unset !important;
  color: inherit !important;
}

.tmb-container .el-menu-item,
.tmb-container .el-sub-menu__title {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.tmb-container .el-sub-menu__title {
  margin-right: 15px !important;
  background: unset !important;
  color: inherit !important;
}

.tmb-container .el-sub-menu__icon-arrow {
  right: -3px !important;
}

.tmb-container .search-bar .el-input__wrapper {
  border-radius: 10px !important;
}
</style>