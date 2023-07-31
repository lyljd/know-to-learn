<template>
  <div class="a-container">
    <el-container>
      <el-aside class="aside" width="150px">
        <ul>
          <li :class="i.path === activeItemPath ? 'active' : ''" class="aside-item" v-for="i in asideItems"
            @click="toPath(i.path)">{{ i.content }}
          </li>
        </ul>
      </el-aside>

      <div class="placeholder"></div>

      <el-main>
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'

type AsideItem = {
  content: string,
  path: string,
}

const asideItems: AsideItem[] = [
  { content: "首页", path: "home" },
  { content: "课程管理", path: "course" },
]

let activeItemPath = ref(location.href.split("/").pop())

function toPath(path: string) {
  if (path !== activeItemPath.value) {
    router.push(`/org/${path}`)
    activeItemPath.value = path
  }
}
</script>

<style scoped>
.a-container .aside {
  border-right: 1px solid #dcdfe6;
  height: calc(100vh - 57px);
  position: fixed;
}

.a-container .aside .aside-item {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dcdfe6;
  cursor: pointer;
}

.a-container .aside .aside-item:hover {
  color: #409EFF;
}

.a-container .aside .active {
  color: #409EFF;
  cursor: not-allowed;
}

.a-container .placeholder {
  margin-right: 150px;
}
</style>