<template>
  <div v-if="!common.isMobile()">
    <el-backtop :right="50" :bottom="50" />

    <TopMenuBar v-if="$route.path !== '/'"></TopMenuBar>

    <div v-if="$route.path !== '/'" class="placeholder"></div>

    <router-view></router-view>
  </div>

  <div v-else>
    目前未做移动端适配，请用PC端访问（推荐使用Edge浏览器）
  </div>
</template>

<script setup lang="ts">
import * as common from "@/common"
import TopMenuBar from "@/components/TopMenuBar.vue"
</script>

<style scoped>
.placeholder {
  margin-top: 57px;
}
</style>