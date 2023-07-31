<template>
  <el-dialog v-model="mainWindowVisible" :title="data.title" custom-class="fsw-container" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center>

    <div class="body">
      <el-input v-model="topic" ref="topicEle" :placeholder="data.topicPlaceholder" maxlength="50" show-word-limit />

      <el-input v-model="content" ref="contentEle" :placeholder="data.contentPlaceholder" resize="none" rows="5"
        maxlength="500" show-word-limit type="textarea" />

      <div>
        <el-upload v-model:file-list="fileList" :on-preview="(file: any) => { openPreviewWindow(file.url) }"
          :on-exceed="onExceed" :on-change="onChange" ref="uploadRef" accept="image/*" :limit="9" class="upload"
          :auto-upload="false" multiple list-type="picture-card">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <div class="tip">上传的图片大小上限为10M，最多上传9张图片。</div>
      </div>
    </div>

    <template #footer>
      <el-button id="fsw-cancel" @click="closeMainWindow">{{ data.cancelButtonText }}</el-button>
      <el-button id="fsw-submit" @click="submit" type="primary">{{ data.confirmButtonText }}</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="previewWindowVisible" custom-class="preview" align-center>
    <Image :url="previewImgUrl"></Image>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadInstance, ElInput } from 'element-plus'
import { useStore } from "../store"
import * as common from "../common"
import * as API from '@/api/common'
import axios from "axios"

type Data = {
  title: string,
  bzUrl: string,
  getUploadUrl: string,
  topicAlias: string,
  contentAlias: string,
  fileListStrAlias: string,
  topicPlaceholder: string,
  contentPlaceholder: string,
  cancelButtonText: string,
  confirmButtonText: string,
  topicCheckFailMsg: string,
  contentCheckFailMsg: string,
  succMsg: string,
  afterSuccDo: Function,
}

type Para = {
  title: string,
  bzUrl: string,
  getUploadUrl: string,
  topicAlias: string,
  contentAlias: string,
  fileListStrAlias: string,
  topicPlaceholder?: string,
  contentPlaceholder?: string,
  cancelButtonText?: string,
  confirmButtonText?: string,
  topicCheckFailMsg?: string,
  contentCheckFailMsg?: string,
  succMsg?: string,
  afterSuccDo?: Function,
}

const store = useStore()
store.openFSWindow = openMainWindow

const uploadRef = ref<UploadInstance>()
const topicEle = ref<InstanceType<typeof ElInput>>()
const contentEle = ref<InstanceType<typeof ElInput>>()

let mainWindowVisible = ref(false)
let previewWindowVisible = ref(false)
let topic = ref("")
let content = ref("")
let fileList = ref([])
let previewImgUrl = ref("")
let data: Data = reactive({
  title: "",
  bzUrl: "",
  getUploadUrl: "",
  topicAlias: "",
  contentAlias: "",
  fileListStrAlias: "",
  topicPlaceholder: "",
  contentPlaceholder: "",
  cancelButtonText: "取消",
  confirmButtonText: "提交",
  topicCheckFailMsg: "输入内容不能为空",
  contentCheckFailMsg: "输入内容不能为空",
  succMsg: "提交成功",
  afterSuccDo: () => { },
})

function openMainWindow(p: Para) {
  data.title = p.title
  data.bzUrl = p.bzUrl
  data.getUploadUrl = p.getUploadUrl
  data.topicAlias = p.topicAlias
  data.contentAlias = p.contentAlias
  data.fileListStrAlias = p.fileListStrAlias

  if (p.topicPlaceholder) {
    data.topicPlaceholder = p.topicPlaceholder
  }
  if (p.contentPlaceholder) {
    data.contentPlaceholder = p.contentPlaceholder
  }
  if (p.cancelButtonText) {
    data.cancelButtonText = p.cancelButtonText
  }
  if (p.confirmButtonText) {
    data.confirmButtonText = p.confirmButtonText
  }
  if (p.topicCheckFailMsg) {
    data.topicCheckFailMsg = p.topicCheckFailMsg
  }
  if (p.contentCheckFailMsg) {
    data.contentCheckFailMsg = p.contentCheckFailMsg
  }
  if (p.succMsg) {
    data.succMsg = p.succMsg
  }
  if (p.afterSuccDo) {
    data.afterSuccDo = p.afterSuccDo
  }

  mainWindowVisible.value = true
}

function closeMainWindow() {
  mainWindowVisible.value = false
  topic.value = ""
  content.value = ""
  fileList.value = []
}

function openPreviewWindow(imgUrl: string) {
  previewImgUrl.value = imgUrl

  previewWindowVisible.value = true
}

async function submit() {
  topic.value = topic.value.trim()
  if (topic.value === "") {
    topicEle.value?.focus()
    common.showError(data.topicCheckFailMsg)
    return
  }

  content.value = content.value.trim()
  if (content.value === "") {
    contentEle.value?.focus()
    common.showError(data.contentCheckFailMsg)
    return
  }

  const cancelBtn = document.getElementById("fsw-cancel") as HTMLButtonElement
  const submitBtn = document.getElementById("fsw-submit") as HTMLButtonElement

  cancelBtn.disabled = true
  cancelBtn.classList.add('is-disabled')
  submitBtn.disabled = true
  submitBtn.classList.add('is-disabled')

  const rss = await uploadImages(fileList.value)
  API.fsbusiness(data.bzUrl, {
    [data.topicAlias]: topic.value,
    [data.contentAlias]: content.value,
    [data.fileListStrAlias]: rss.join(";")
  })
    .then((res) => {
      if (res.code !== 200) {
        console.log(res.message)
        common.showError("提交失败")
        return
      }

      data.afterSuccDo()
      closeMainWindow()
      common.showSuccess(data.succMsg)
    })
    .catch((error) => {
      console.log(error.message)
      common.showError("提交失败")
    })

  cancelBtn.disabled = false
  cancelBtn.classList.remove('is-disabled')
  submitBtn.disabled = false
  submitBtn.classList.remove('is-disabled')
}

function onExceed() {
  common.showError("最多上传9张图片")
}

function onChange(file: any) {
  if (file.status === "ready" && file.size / 1024 / 1024 > 10) {
    uploadRef.value!.handleRemove(file)
    common.showError("上传的图片大小不能超过10M")
  }
}

async function uploadImages(fileList: any[]): Promise<string[]> {
  let resourceUrlArray: string[] = [];

  for (const f of fileList) {
    const fileName = f.name;

    try {
      const res = await API.getUploadAndResourceUrl(data.getUploadUrl, fileName.substring(fileName.lastIndexOf(".") + 1));

      if (res.code !== 200) {
        console.log(res.message);
        common.showError(`图片"${fileName}"上传失败`);
        continue;
      }

      const resourceUrl = res.data.resourceURL;

      await axios({
        method: "put",
        url: res.data.requestURL,
        data: f.raw,
        headers: { 'Content-Type': `${f.raw.type}` },
      });

      resourceUrlArray.push(resourceUrl);
    } catch (error: any) {
      console.log(error.message);
      common.showError(`图片"${fileName}"上传失败`);
    }
  }

  return resourceUrlArray;
}
</script>

<style scoped>
.fsw-container .body>*:not(:last-child) {
  margin-bottom: 20px;
}

.fsw-container .tip {
  margin-top: 3px;
  font-size: 12px;
}
</style>

<style>
.fsw-container .el-dialog__header,
.fsw-container .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.fsw-container .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.fsw-container .upload .el-upload-list {
  display: flex;
  gap: 5px;
}

.fsw-container .upload .el-upload-list__item,
.fsw-container .upload .el-upload--picture-card {
  margin: 0 !important;
  width: calc((50vw - 40px) / 5 - 4px) !important;
  height: calc((50vw - 40px) / 5 - 4px) !important;
}

.fsw-preview .el-dialog__header {
  display: none;
}

.fsw-preview .el-dialog__body {
  padding: 0;
}
</style>