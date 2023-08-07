<template>
  <div class="search-container">
    <div class="search-bar-container">
      <el-input ref="searchInput" v-model="searchKey" @keyup.enter.native="toSearch" :prefix-icon="Search"
        placeholder="输入关键字搜索" clearable />
      <el-button @click="toSearch" type="primary">搜索</el-button>
    </div>

    <el-tabs v-model="activeTabName" class="demo-tabs">
      <el-tab-pane name="course">
        <template #label>
          <div>课程</div>
          <el-badge :value="result.courses.length" type="info"></el-badge>
        </template>

        <div v-if="result.courses.length > 0" class="s-cc-container">
          <CourseCard v-for="c in result.courses" :data="c"></CourseCard>
        </div>

        <el-empty v-else description="无课程搜索结果"></el-empty>
      </el-tab-pane>

      <el-tab-pane name="org">
        <template #label>
          <div>机构</div>
          <el-badge :value="result.orgs.length" type="info"></el-badge>
        </template>

        <div v-if="result.orgs.length > 0" class="s-o-container">
          <el-card @click="common.ToOrg(o.id)" class="card" v-for="o in result.orgs" shadow="never">
            <div class="item">
              <Image :url="o.avatar" :w="40" :h="40" circle></Image>
              <div class="info">
                <div class="name">{{ o.name }}</div>
                <div class="intro">{{ o.intro }}</div>
              </div>
            </div>
          </el-card>
        </div>

        <el-empty v-else description="无机构搜索结果"></el-empty>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ElInput } from 'element-plus'
import { useRouter } from "vue-router"
import * as common from '@/common'
import CourseCard from '@/components/CourseCard.vue'
import * as API from '@/api/common'

type Result = {
  courses: Course[],
  orgs: Org[],
}

type Course = {
  coverUrl: string,
  courseId: number,
  courseName: string,
  orgId?: number,
  orgName?: string,
  publishTime: number,
}

type Org = {
  avatar: string,
  id: number,
  name: string,
  intro: string,
}

const router = useRouter()
const searchInput = ref<InstanceType<typeof ElInput>>()

let searchKey = ref("")
let activeTabName = ref("course")
let result = ref<Result>({
  courses: [],
  orgs: [],
})

function toSearch() {
  searchKey.value = searchKey.value.trim()
  if (searchKey.value === '') {
    common.showError("关键字不能为空")
    return
  }
  router.replace(`/search?key=${searchKey.value}`)
  searchInput.value!.blur()

  getResult()
}

function getResult() {
  API.search(searchKey.value)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      result.value = res.data
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

getResult()

onMounted(() => {
  let index = location.href.lastIndexOf("key=")
  let key = ""
  if (index === -1) {
    location.href = "/404"
    return
  }
  key = decodeURIComponent(location.href.slice(index + 4))
  if (key === "") {
    location.href = "/404"
    return
  }
  searchKey.value = key
})
</script>

<style scoped>
.search-container {
  width: 1140px;
  margin-inline: auto;
  display: flex;
  margin-top: 77px;
  flex-direction: column;
  margin-bottom: 20px;
}

.search-container>*:not(:last-child) {
  margin-bottom: 20px;
}

.search-container .search-bar-container {
  display: flex;
  width: 50%;
  margin-left: 25%;
}

.search-container .s-cc-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.search-container .s-o-container>*:not(:last-child) {
  margin-bottom: 20px;
}

.search-container .s-o-container .card {
  cursor: pointer;
  border-radius: 20px;
}

.search-container .s-o-container .card:hover {
  border: 1px solid #409EFF;
}

.search-container .s-o-container .item {
  display: flex;
  gap: 10px;
}

.search-container .s-o-container .item .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.search-container .s-o-container .item .info .name {
  font-size: 18px;
}

.search-container .s-o-container .item .info .intro {
  font-size: 14px;
  color: #909399;
}
</style>

<style>
.search-container .el-badge__content {
  top: 0;
  margin-left: 1px;
}
</style>