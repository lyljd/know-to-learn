<template>
  <div class="video-container">
    <div class="left">
      <div class="title">{{ info.name }}</div>
      <div class="time"><span class="iconfont el-icon-clock"></span>{{ common.timestampFormatterStandard(info.publishTime)
      }}</div>
      <div><video class="video" :src="info.url" volume="0.5" controls></video></div>
    </div>

    <div class="right">
      <div class="author">
        <Image :url="info.avatar" :w="40" :h="40" circle></Image>
        <div @click="common.ToOrg(info.orgId)" class="org-name">{{ info.orgName }}</div>
      </div>

      <div class="info">
        <div class="header">
          <div @click="common.ToCourse(info.courseId)" class="course-name">{{ info.courseName }}</div>
          <div class="ctl">
            <span>{{ `共${videoNum}个视频` }}</span>
            <span style="display: flex;align-items: center;">播完跳转下一视频<el-switch v-model="autoPlay" /></span>
          </div>
        </div>

        <div class="body">
          <el-collapse v-model="activeChapterId" accordion>
            <el-collapse-item v-for="(c, idx) in info.chapters" :title="`${idx + 1}.${c.name}`" :name="c.id">
              <ul>
                <li @click="toVideo(v.id)" :class="v.id === videoId ? 'is-active' : ''" v-for="(v, iidx) in c.videos">{{
                  `${idx + 1}.${iidx + 1}.${v.name}` }}</li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import * as common from '@/common'
import * as API from '@/api/video'

type Info = {
  name: string,
  publishTime: number,
  url: string,
  avatar: string,
  orgId: number
  orgName: string,
  courseId: number
  courseName: string,
  id: number,
  chapters: Chapter[]
}

type Chapter = {
  name: string,
  id: number,
  videos: Video[]
}

type Video = {
  name: string,
  id: number,
}

const route = useRoute()
const videoId = parseInt(route.params.id as string)

let info = ref<Info>({
  name: "null",
  publishTime: -1,
  url: "",
  avatar: "",
  orgId: -1,
  orgName: "null",
  courseId: -1,
  courseName: "null",
  id: -1,
  chapters: []
})
let videoNum = ref(0)

let autoPlay = ref(true)
let activeChapterId = ref(-1)
let videoIdList: number[] = []
let vilIdx = -1

onMounted(() => {
  getVideoInfo()

  const videoEle = document.querySelector(".video-container .left .video") as HTMLVideoElement
  videoEle.addEventListener("ended", () => {
    if (autoPlay.value) {
      if (vilIdx < videoIdList.length - 1) {
        location.href = `/video/${videoIdList[vilIdx + 1]}`
      }
    }
  })
})

function toVideo(id: number) {
  if (videoId === id) {
    return
  }
  location.href = `/video/${id}`
}

function getVideoInfo() {
  API.getVideoInfo(videoId)
    .then((res) => {
      if (res.data === null) {
        location.href = `/404`
        return
      }

      if (res.code !== 200) {
        if (res.code === 400) {
          location.href = `/404`
          return
        }

        common.showError(res.message)
        return
      }

      info.value = res.data
      info.value.chapters.forEach(c => {
        if (c.videos) {
          videoNum.value += c.videos.length
          c.videos.forEach(v => {
            videoIdList.push(v.id)
            if (v.id === videoId) {
              vilIdx = videoIdList.length - 1
            }
          });
        }
      })

      activeChapterId.value = info.value.id

      const activeVideo = document.querySelector(".video-container .right .info .body ul .is-active") as HTMLLIElement
      if (activeVideo) {
        activeVideo.scrollIntoView({
          behavior: 'smooth',
        })
      }
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
</script>

<style scoped>
.video-container {
  width: 1140px;
  margin-inline: auto;
  display: flex;
  margin-top: 77px;
  margin-bottom: 20px;
  gap: 20px;
}

.video .left {
  width: 800px;
}

.video-container .left .title {
  font-size: 25px;
  width: 800px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-container .left .time {
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.video-container .left .video {
  width: 800px;
  height: 450px;
}

.video-container .right {
  width: 320px;
}

.video-container .right .author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.video-container .right .author .org-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.video-container .right .author .org-name:hover {
  color: #409EFF;
}

.video-container .right .info {
  margin-top: 37px;
  border: 1px solid #dedfe0;
  background-color: #f4f4f5;
  height: 450px;
}

.video-container .right .info .header {
  padding: 10px;
  border-bottom: 1px solid #dedfe0;
}

.video-container .right .info .header .course-name {
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.video-container .right .info .header .course-name:hover {
  color: #409EFF;
}

.video-container .right .info .header .ctl {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #909399;
  font-size: 14px;
}

.video-container .right .info .body {
  height: 375px;
  overflow: scroll;
}

.video-container .right .info .body ul li {
  background-color: white;
  padding: 10px;
  cursor: pointer;
}

.video-container .right .info .body ul li:hover {
  color: #409EFF;
}

.video-container .right .info .body ul .is-active {
  color: #409EFF;
  cursor: not-allowed;
}

.video-container .right .info .body ul li:not(:last-child) {
  margin-bottom: 1px;
}
</style>

<style>
.video-container .el-collapse-item__header {
  background-color: #f4f4f5;
  border-bottom: 1px solid #e9e9eb;
  padding-left: 10px;
  white-space: nowrap;
}

.video-container .el-collapse-item__content {
  background-color: #f4f4f5;
  padding-bottom: 0;
}

.video-container .el-collapse-item__header.is-active {
  color: #409EFF;
}
</style>