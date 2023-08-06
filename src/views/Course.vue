<template>
  <div class="course-container">
    <div class="background"></div>
    <div class="header">
      <div class="row">
        <div>
          <Image :url="info.pic" :w="270" :h="151.88"></Image>
        </div>

        <div class="course-info">
          <div style="color: #337ecc;" class="course-name">{{ info.name }}</div>

          <div>{{ info.introduction }}</div>

          <div>
            <span class="span">类别：</span>
            <span>{{ common.categoryConvert(info.category) }}</span>
          </div>

          <div v-if="(info.tags as string[]).length > 0" class="tags">
            <span class="span">标签：</span>
            <Tag class="tags" :tags="(info.tags as string[])"></Tag>
          </div>
        </div>
      </div>


      <div class="row">
        <div class="avatar">
          <Image :url="info.avatar" :w="40" :h="40" circle></Image>
          <div @click="common.ToOrg(info.orgId)" class="org-name">{{ info.orgName }}</div>
        </div>

        <div v-if="(info.teachers as string[]).length > 0" class="teachers">
          <span class="span">讲师：</span>
          <Tag class="tags" :tags="(info.teachers as string[])"></Tag>
        </div>
      </div>
    </div>

    <el-card class="bar-container">
      <ul class="bar">
        <li v-for="i in items" @click="toPath(i.path)" :class="activeItemPath === i.path ? 'active-item' : ''"
          class="item">{{
            i.content }}</li>
      </ul>
    </el-card>

    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import Tag from '@/components/Tag.vue'
import * as common from '@/common'
import * as API from '@/api/course'

type Info = {
  pic: string,
  name: string,
  introduction: string,
  category: string,
  teachers: string | string[],
  tags: string | string[],
  avatar: string,
  orgId: number,
  orgName: string,
  author: boolean,
}

type Item = {
  content: string,
  path: string,
}

const route = useRoute()
const router = useRouter()

const basePath = `/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}`
const courseId: number = parseInt(route.params.id as string)

let activeItemPath = ref("")
let info: Info = reactive({
  pic: "",
  name: "",
  introduction: "",
  category: "",
  teachers: [],
  tags: [],
  avatar: "",
  orgName: "",
  orgId: -1,
  author: false,
})
let items: Item[] = [
  { content: "章节", path: "" },
]

onMounted(() => {
  getCourseInfo()

  //动态设置背景高度
  const header = document.querySelector(".course-container .header") as HTMLElement
  const background = document.querySelector(".course-container .background") as HTMLElement
  background.style.height = header.clientHeight + 40 + "px"
})

function getCourseInfo() {
  API.getCourseInfo(courseId)
    .then((res) => {
      if(res.data === null) {
        location.href = `/404`
        return
      }

      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      info.pic = res.data.pic
      info.name = res.data.name
      info.introduction = res.data.introduction
      info.category = res.data.category

      if (res.data.tags !== "") {
        info.tags = (res.data.tags as string).split(";")
      } else {
        info.tags = []
      }

      if (res.data.teachers !== "") {
        info.teachers = (res.data.teachers as string).split(";")
      } else {
        info.teachers = []
      }

      info.orgName = res.data.orgName
      info.orgId = res.data.orgId
      info.avatar = res.data.avatar
      info.author = res.data.author

      document.title = info.name + " - " + document.title
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function toPath(path: string) {
  if (path === activeItemPath.value) {
    return
  }
  router.push(`${basePath}${path}`)
  activeItemPath.value = path
}
</script>

<style scoped>
.course-container {
  color: white;
}

.course-container .background {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(../../public/cv.jpg);
  filter: blur(5px);
  width: 100%;
  position: absolute;
  z-index: -1;
  margin-top: -20px;
}

.course-container .background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.course-container .header {
  width: 1140px;
  margin-inline: auto;
  margin-top: 77px;
}

.course-container .header .row {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
}

.course-container .header .row .span {
  color: #909399;
}

.course-container .header .row .course-name {
  font-size: 30px;
}

.course-container .header .row .tags,
.course-container .header .row .avatar,
.course-container .header .row .teachers {
  display: flex;
  align-items: center;
}

.course-container .header .row .avatar {
  width: 273px;
}

.course-container .header .row .avatar .org-name {
  margin-left: 5px;
  cursor: pointer;
}

.course-container .header .row .course-info,
.course-container .header .row .teachers {
  width: calc(100% - 270px);
  margin-left: 10px;
}

.course-container .header .row .course-info>*:not(:last-child) {
  margin-bottom: 10px;
}

.course-container .header .row .tags .tags,
.course-container .header .row .teachers .tags {
  width: calc(100% - 48px);
}

.course-container .bar-container .bar {
  width: 1140px;
  margin-inline: auto;
  display: flex;
  gap: 60px;
  height: 60px;
  align-items: center;
}

.course-container .bar-container .bar .item {
  cursor: pointer;
  font-weight: bold;
  height: 25px;
  margin-top: 5px;
}

.course-container .bar-container .bar .item:hover {
  color: #F56C6C;
}

.course-container .bar-container .bar .active-item {
  color: #F56C6C;
  border-bottom: 2px solid #F56C6C;
  cursor: not-allowed;
}
</style>

<style>
.course-container .bar-container .el-card__body {
  padding: 0;
}
</style>