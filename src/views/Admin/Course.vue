<template>
  <div v-if="data.length > 0" class="ac-container">
    <el-card v-for="(d, idx) in data">
      <template #header>
        <div class="header">
          <div style="display: flex; align-items: center;">提审机构：<div class="org-name" @click="common.ToOrg(d.orgId)">{{
            d.orgName }}</div>
          </div>
          <div>视频上传时间：{{ common.timestampFormatterStandard(d.createTime) }}</div>
          <div>
            <el-button @click="passVideo(idx)" type="success">通过</el-button>
            <el-button @click="rejectVideo(idx)" type="danger">驳回</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <div>课程：<span @click="common.ToCourse(d.courseId)" class="course-name">{{ d.courseName }}</span></div>
        <div>视频名：{{ d.name }}</div>
        <div style="display: flex; align-items: center;">视频：<el-button @click="openPVW(d.url)">预览</el-button></div>
      </div>
    </el-card>

    <PreviewVideoWindow @recOpenPVW="recOpenPVW"></PreviewVideoWindow>
  </div>

  <el-empty v-else description="暂无需处理的课程审核"></el-empty>
</template>

<script setup lang="ts">
import * as common from '@/common'
import PreviewVideoWindow from '@/components/PreviewVideoWindow.vue'
import * as API from '@/api/admin'

type Data = {
  orgId: number,
  orgName: string,
  courseId: number,
  courseName: string,
  name: string,
  url: string,
  mediaId: number,
  createTime: number,
}

let data = ref<Data[]>([])
let openPVW: Function

getApplyVideos()

function recOpenPVW(f: Function) {
  openPVW = f
}

function getApplyVideos() {
  API.getApplyVideos()
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      data.value = res.data
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function passVideo(idx: number) {
  API.passVideo(data.value[idx].mediaId)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      data.value.splice(idx, 1)
      common.showSuccess("已通过")
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function rejectVideo(idx: number) {
  API.rejectVideo(data.value[idx].mediaId)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      data.value.splice(idx, 1)
      common.showSuccess("已驳回")
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
</script>

<style scoped>
.ac-container>*:not(:last-child) {
  margin-bottom: 20px;
}

.ac-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ac-container .header .org-name {
  cursor: pointer;
  color: #409EFF;
  text-decoration: underline;
  max-width: 500px;
}

.ac-container .body>*:not(:last-child) {
  margin-bottom: 10px;
}

.ac-container .body .course-name {
  cursor: pointer;
  color: #409EFF;
  text-decoration: underline;
}
</style>