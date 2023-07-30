<template>
  <div
    :style="{ width: w ? `${w}px` : '', height: h ? `${h}px` : '', border: border ? '1px solid #dcdfe6' : '', borderRadius: (round || circle) ? (circle ? '50%' : '5px') : '' }"
    class="Image-container" @click="!preview && uploadUrl !== '' ? openImgUpload() : null">
    <el-image :src="url" :preview-src-list="preview && uploadUrl === '' ? [url] : []" :fit="contain ? 'contain' : ''"
      :style="{ width: w ? `${w}px` : '', height: h ? `${h}px` : '', borderRadius: (round || circle) ? (circle ? '50%' : '5px') : '', cursor: uploadUrl !== '' ? 'pointer' : 'default' }"
      :class="customClass" class="img">
      <template #error>
        <div :style="{ borderRadius: round ? '5px' : '' }" class="default">{{ loadFailInfo }}</div>
      </template>
    </el-image>
  </div>

  <el-upload :http-request="httpRequest" :before-upload="beforeImgUpload" ref="imgUpload" :method="uploadMethod"
    :action="uploadUrl" accept="image/*" v-show="false"></el-upload>
</template>

<script setup lang="ts">
import { UploadInstance } from 'element-plus'
import * as common from "../common"
import * as API from '@/api/user'
import axios from 'axios'

const stf = defineEmits<{
  (cen: "recImgUrl", imgUrl: string): void
  (cen: "recOpenUploadFc", f: Function): void
}>()
stf("recOpenUploadFc", openImgUpload)

const data = withDefaults(defineProps<{
  url: string,
  w: number,
  h: number,
  preview: boolean,
  contain: boolean,
  border: boolean,
  round: boolean,
  circle: boolean,
  customClass: string,
  uploadUrl: string,
  uploadMethod: string,
  uploadMaxSize: number, //单位：MB
  loadFailInfo: string,
}>(), {
  w: undefined,
  h: undefined,
  preview: false,
  contain: false,
  border: false,
  round: true,
  circle: false,
  customClass: "",
  uploadUrl: "",
  uploadMethod: "post",
  uploadMaxSize: 1,
  loadFailInfo: "加载失败",
})

const imgUpload = ref<UploadInstance>()

function openImgUpload() {
  imgUpload.value?.$el.querySelector('input').click()
}

function beforeImgUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 > data.uploadMaxSize) {
    common.showError(`上传的图片大小不能超过${data.uploadMaxSize}M`)
    return false
  }
  return true
}

function httpRequest(option: any) {
  const fileName: string = option.file.name
  const fileSuffix = fileName.substring(fileName.lastIndexOf("."))
  const contentType = option.file.type
  let uploadUrl: string
  let resourceUrl: string
  API.getAvatarUploadAndResourceUrl(fileSuffix)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      uploadUrl = res.data.requestURL
      resourceUrl = res.data.resourceURL

      axios({
        method: option.method,
        url: uploadUrl,
        data: option.file,
        headers: { 'Content-Type': `${contentType}` },
      })
        .then(() => {
          stf("recImgUrl", resourceUrl)
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
</script>

<style scoped>
.Image-container .img {
  width: 100%;
  height: 100%;
  vertical-align: top;
}

.Image-container .default {
  width: 100%;
  height: 100%;
  background-color: #909399;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
}
</style>