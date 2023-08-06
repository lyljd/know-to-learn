<template>
  <div class="oe-container">
    <div class="header">
      <div class="avatar">
        <Image :url="info.avatar" :w="60" :h="60" circle></Image>
      </div>
      <div class="info">
        <div class="org-name">{{ info.orgName }}</div>
        <div class="org-intro">{{ info.introduction }}</div>
      </div>
    </div>

    <div v-if="info.materials && (info.materials as string[]).length > 0" class="materials">
      <div class="item-title">机构图片</div>
      <div class="imgs-row">
        <div class="img-container" v-for="m in info.materials">
          <Image :url="m" contain="fit" preview border></Image>
        </div>
      </div>
    </div>

    <div>
      <div class="item-title">机构课程</div>
      <div v-if="info.courses.length > 0" class="courses-container">
        <CourseCard v-for="c in info.courses" :data="c" :orgVisible="false">
        </CourseCard>
      </div>
      <el-empty v-else description="暂无课程"></el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import CourseCard from '@/components/CourseCard.vue'
import { useRoute } from "vue-router"
import * as API from '@/api/org'
import * as common from '@/common'

type Info = {
  avatar: string,
  orgName: string,
  introduction: string,
  materials: string | string[],
  courses: Course[],
}

type Course = {
  courseId: number,
  courseName: string,
  coverUrl: string,
  publishTime: number,
}

const route = useRoute()
const orgId = parseInt(route.params.id as string)

let info = ref<Info>({
  avatar: "",
  orgName: "",
  introduction: "",
  materials: [],
  courses: []
})

getOrgExposeInfo()

function getOrgExposeInfo() {
  API.getOrgExposeInfo(orgId)
    .then((res) => {
      if(res.data === null) {
        location.href = `/404`
        return
      }

      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      info.value = res.data
      if (info.value.materials !== "") {
        info.value.materials = (info.value.materials as string).split(";")
      } else {
        info.value.materials = []
      }
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
</script>

<style scoped>
.oe-container {
  width: 1140px;
  margin-inline: auto;
  display: flex;
  margin-top: 77px;
  flex-direction: column;
  margin-bottom: 20px;
}

.oe-container>*:not(:last-child) {
  margin-bottom: 40px;
}

.oe-container .item-title {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}

.oe-container .header {
  display: flex;
  background-color: aliceblue;
  padding: 20px;
  border-radius: 30px;
}

.oe-container .header .avatar {
  margin-right: 10px;
}

.oe-container .header .info .org-name {
  font-size: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.oe-container .header .info .org-intro {
  white-space: pre-line;
  color: #909399;
  font-size: 14px;
}

.oe-container .materials .imgs-row {
  display: flex;
  gap: 20px;
}

.oe-container .materials .imgs-row .img-container {
  width: calc((1140px - 160px) / 9);
  height: calc((1140px - 160px) / 9);
  display: flex;
}

.oe-container .courses-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>