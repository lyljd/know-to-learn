<template>
  <div class="uvw-container">
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
      align-center destroy-on-close draggable v-model="windowVisible">

      <div class="body">
        <div>
          <div class="span">视频名</div>
          <el-input :disabled="isUploading" v-model="videoName" maxlength="25" show-word-limit />
        </div>

        <div>
          <div class="span">视频</div>
          <el-button @click="openVideoUpload" v-if="videoUrl === ''">选择</el-button>
          <div v-else>
            <el-button @click="videoUpload?.clearFiles()">取消选择</el-button>
            <el-button @click="openPVW(videoUrl)">预览</el-button>
          </div>
          <div class="tip">
            <div>上传的视频大小上限为500M</div>
            <div>上传视频，即表示您已同意 <span style="color: #409EFF;">知学随学使用协议</span> ，请勿上传色情，反动等违法视频。</div>
          </div>
        </div>

        <el-progress v-if="uploadPercent !== 0" :text-inside="true" :stroke-width="20" :percentage="uploadPercent" />
      </div>

      <el-upload :auto-upload="false" :before-upload="beforeVideoUpload" ref="videoUpload" accept="video/*" v-show="false"
        v-model:file-list="fileList"></el-upload>

      <template #footer>
        <el-button :disabled="isUploading" @click="closeWindow">取消</el-button>
        <el-button :disabled="videoName.trim() === '' || videoUrl === '' || isUploading" @click="upload"
          type="primary">上传</el-button>
      </template>
    </el-dialog>
  </div>

  <PreviewVideoWindow @recOpenPVW="recOpenPVW"></PreviewVideoWindow>
</template>

<script setup lang="ts">
import * as common from '@/common'
import { UploadInstance } from 'element-plus'
import PreviewVideoWindow from '@/components/PreviewVideoWindow.vue'
import * as API from '@/api/course'
import axios from "axios"

const stf = defineEmits<{
  (cen: "recOpenUVW", f: Function): void
}>()
stf("recOpenUVW", openWindow)

const videoUpload = ref<UploadInstance>()

let windowVisible = ref(false)
let title = ref("")
let apiUrl = ref("")
let courseId = ref(0)
let chapterId = ref(0)
let afterSuccDo: Function = () => { }
let videoName = ref("")
let videoUrl = ref("")
let fileList = <any>ref([])
let openPVW: Function
let uploadPercent = ref(0)
let isUploading = ref(false)

watch(fileList, newVal => {
  if (newVal.length === 0) {
    videoUrl.value = ""
  } else {
    videoUrl.value = URL.createObjectURL(newVal[0].raw)
  }
})

function recOpenPVW(f: Function) {
  openPVW = f
}

function openVideoUpload() {
  videoUpload.value?.$el.querySelector('input').click()
}

function openWindow(titleP: string, apiUrlP: string, courseIdP: number, chapterIdP: number, afterSuccDoP?: Function, videoNameP?: string, videoUrlP?: string) {
  title.value = titleP
  apiUrl.value = apiUrlP
  courseId.value = courseIdP
  chapterId.value = chapterIdP

  if (afterSuccDoP) {
    afterSuccDo = afterSuccDoP
  }

  if (videoNameP) {
    videoName.value = videoNameP
  }

  if (videoUrlP) {
    videoUrl.value = videoUrlP
  }

  windowVisible.value = true
}

function closeWindow() {
  windowVisible.value = false
  videoName.value = ""
  videoUrl.value = ""
}

function beforeVideoUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 > 500) {
    common.showError(`上传的视频大小不能超过500M`)
    return false
  }
  return true
}

function upload() {
  if (fileList.value[0] === undefined) {
    API.setChapterVideo(apiUrl.value, courseId.value, chapterId.value, videoName.value, "")
      .then((res) => {
        if (res.code !== 200) {
          common.showError(res.message)
          return
        }
        afterSuccDo(null, videoName.value, "", null)
        closeWindow()
        common.showSuccess("修改成功")
      })
      .catch((error) => {
        common.showError(error.message)
      })
  }

  const fileName = fileList.value[0].name as string
  const fileSuffix = fileName.substring(fileName.lastIndexOf(".") + 1)
  const contentType = fileList.value[0].raw.type
  const file = fileList.value[0].raw

  API.setChapterVideo(apiUrl.value, courseId.value, chapterId.value, videoName.value, fileSuffix)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      let uploadUrl = ""
      let resourceUrl = ""
      let videoId = ""
      let videoStatus = ""

      if (apiUrl.value === '/api/org/course/chapter/media/update') {
        uploadUrl = res.data.requestURL
        resourceUrl = res.data.resourceURL
      } else {
        uploadUrl = res.data.url.requestURL
        resourceUrl = res.data.url.resourceURL
        videoId = res.data.data.id
        videoStatus = res.data.data.status
      }

      isUploading.value = true

      axios({
        method: "put",
        url: uploadUrl,
        data: file,
        headers: { 'Content-Type': `${contentType}` },
        onUploadProgress: (progressEvent) => {
          uploadPercent.value = Math.round((progressEvent.loaded / (progressEvent.total as number)) * 100)
        },
      })
        .then(() => {
          isUploading.value = false
          uploadPercent.value = 0
          afterSuccDo(videoId, videoName.value, resourceUrl, videoStatus)
          closeWindow()
          common.showSuccess("提交成功")
        })
        .catch((error) => {
          isUploading.value = false
          common.showError(error.message)
        })
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
</script>

<style scoped>
.uvw-container .body>*:not(:last-child) {
  margin-bottom: 20px;
}

.uvw-container .body .span {
  margin-bottom: 5px;
}

.uvw-container .body .tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.uvw-container .body .tip>*:not(:last-child) {
  margin-bottom: 2.5px;
}
</style>

<style>
.uvw-container .el-dialog__header,
.uvw-container .el-dialog__footer {
  margin: 0;
  padding: 20px;
}

.uvw-container .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>