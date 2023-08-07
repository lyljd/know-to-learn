<template>
  <div class="chapter-container">
    <div v-if="data.isAuthor">
      <el-button @click="addChapter" type="success">添加章节</el-button>
    </div>

    <el-card v-for="(c, idx) in data.data" class="card">
      <template #header>
        <div class="header">
          <strong>{{ `第${idx + 1}章 ${c.name}` }}</strong>
          <div v-if="data.isAuthor">
            <el-button @click="delChapter(idx)" type="danger">删除章节</el-button>
            <el-button @click="modifyChapter(idx)" type="warning">修改章节</el-button>
            <el-button @click="addVideo(idx)" type="success">添加视频</el-button>
          </div>
        </div>
      </template>

      <ul v-if="c.child && c.child.length > 0">
        <li :style="{ cursor: v.status === 5 ? 'pointer' : 'default' }" @click="v.status === 5 ? common.ToVideo(v.id) : null"
          v-for="(v, iidx) in c.child">
          <strong class="iconfont el-icon-play icon"></strong>
          <strong>视频：</strong>
          <span class="title">{{ `${idx + 1}-${iidx + 1} ${v.name}` }}</span>
          <el-button :class="v.status === 5 ? 'is-pub' : ''" class="study-btn" size="small" type="danger">开始学习</el-button>

          <div v-if="data.isAuthor" class="status-container">
            <div class="btns">
              <el-button @click="delVideo($event, idx, iidx)" size="small">删除</el-button>
              <el-button @click="modifyVideo($event, idx, iidx)"
                v-show="v.status === 1 || v.status === 3 || v.status === 4" size="small">修改</el-button>
              <el-button @click="apply($event, idx, iidx)" v-show="v.status === 1" size="small">提审</el-button>
              <el-button @click="cancelApply($event, idx, iidx)" v-show="v.status === 2" size="small">撤审</el-button>
              <el-button @click="publish($event, idx, iidx)" v-show="v.status === 3" size="small">发布</el-button>
              <el-button @click="cancelPublish($event, idx, iidx)" v-show="v.status === 5" size="small">取消发布</el-button>
            </div>
            <span class="status">
              <svg class="icon-symbol" aria-hidden="true">
                <use :xlink:href="`#el-icon-${getStatusIcon(v.status)}`"></use>
              </svg>
              {{ getStatusText(v.status) }}
            </span>
          </div>
        </li>
      </ul>

      <div class="empty-video" v-else>暂无视频</div>
    </el-card>

    <el-empty v-show="data.data.length === 0" description="暂无章节"></el-empty>
  </div>

  <UploadVideoWindow @recOpenUVW="recOpenUVW"></UploadVideoWindow>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import * as common from '@/common'
import { ElMessageBox } from 'element-plus'
import UploadVideoWindow from '@/components/UploadVideoWindow.vue'
import * as API from '@/api/course'

type Data = {
  isAuthor: boolean,
  data: Chapter[],
}

type Chapter = {
  id: number,
  name: string,
  child: Video[],
}

type Video = {
  id: number,
  name: string,
  videoUrl: string,
  status: number,
}

const route = useRoute()
const courseId = parseInt(route.params.id as string)

let data = ref<Data>({
  isAuthor: false,
  data: [],
})
let openUVW: Function

getCourseChapter()

function getCourseChapter() {
  API.getCourseChapter(courseId)
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

function recOpenUVW(f: Function) {
  openUVW = f
}

function getStatusText(status: number): string {
  let text = "未知状态"
  switch (status) {
    case 1: {
      text = "待提审"
      break;
    }
    case 2: {
      text = "审核中"
      break;
    }
    case 3: {
      text = "已通过"
      break;
    }
    case 4: {
      text = "已驳回"
      break;
    }
    case 5: {
      text = "已发布"
      break;
    }
  }
  return text
}

function getStatusIcon(status: number): string {
  let text = ""
  switch (status) {
    case 1: {
      text = "info"
      break;
    }
    case 2: {
      text = "info-blue"
      break;
    }
    case 3: {
      text = "success"
      break;
    }
    case 4: {
      text = "error"
      break;
    }
    case 5: {
      text = "success-blue"
      break;
    }
  }
  return text
}

function addChapter() {
  ElMessageBox.prompt('请输入新章节名', '添加章节', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '章节名长度至少有1位',
  })
    .then(({ value }) => {
      value = value.trim()
      if (value.length <= 0) {
        common.showError("章节名不能为空")
        return
      }

      API.newCourseChapter(courseId, value)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          data.value.data.push({
            id: res.data,
            name: value,
            child: [],
          })

          setTimeout(() => {
            common.scrollToBottomSmoothly()
          }, 200);
          common.showSuccess("添加成功")
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}

function modifyChapter(idx: number) {
  ElMessageBox.prompt('请输入新章节名', '修改章节', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: data.value.data[idx].name,
    inputPattern: /.+/,
    inputErrorMessage: '章节名长度至少有1位',
  })
    .then(({ value }) => {
      value = value.trim()
      if (value.length <= 0) {
        common.showError("章节名不能为空")
        return
      }
      if (value === data.value.data[idx].name) {
        common.showError("新章节名与原章节名相同")
        return
      }

      API.modifyCourseChapter(data.value.data[idx].id, value)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          data.value.data[idx].name = value
          common.showSuccess("修改成功")
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}

function delChapter(idx: number) {
  ElMessageBox.confirm(
    '你确定要删除该章节吗?',
    '删除确定',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: false,
    }
  )
    .then(() => {
      API.delCourseChapter(data.value.data[idx].id)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          data.value.data.splice(idx, 1)
          common.showSuccess("删除成功")
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}

function addVideo(idx: number) {
  openUVW("添加视频", "/api/org/course/create/chapter/media", courseId, data.value.data[idx].id, (id: number, name: string, videoUrl: string, status: number) => {
    if (data.value.data[idx].child === null) {
      data.value.data[idx].child = []
    }
    data.value.data[idx].child.push({
      id: id,
      name: name,
      videoUrl: videoUrl,
      status: status,
    })
  })
}

function delVideo(event: any, idx: number, iidx: number) {
  event.stopPropagation()

  ElMessageBox.confirm(
    '你确定要删除该视频吗?',
    '删除确定',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: false,
    }
  )
    .then(() => {
      API.delCourseChapter(data.value.data[idx].child[iidx].id)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          data.value.data[idx].child.splice(iidx, 1)
          common.showSuccess("删除成功")
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}

function modifyVideo(event: any, idx: number, iidx: number) {
  event.stopPropagation()

  openUVW("修改视频", "/api/org/course/chapter/media/update", courseId, data.value.data[idx].child[iidx].id, (_: any, name: string, videoUrl: string, status: any) => {
    data.value.data[idx].child[iidx].name = name
    if (videoUrl !== "") {
      data.value.data[idx].child[iidx].videoUrl = videoUrl
    }
    data.value.data[idx].child[iidx].status = status
  }, data.value.data[idx].child[iidx].name, data.value.data[idx].child[iidx].videoUrl)
}

function apply(event: any, idx: number, iidx: number) {
  event.stopPropagation()

  API.applyVideo(data.value.data[idx].child[iidx].id, data.value.data[idx].child[iidx].status)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      data.value.data[idx].child[iidx].status = 2
      common.showSuccess("提审成功")
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function cancelApply(event: any, idx: number, iidx: number) {
  event.stopPropagation()

  API.cancelApplyVideo(data.value.data[idx].child[iidx].id, data.value.data[idx].child[iidx].status)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      data.value.data[idx].child[iidx].status = 1
      common.showSuccess("撤审成功")
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function publish(event: any, idx: number, iidx: number) {
  event.stopPropagation()

  API.publishVideo(data.value.data[idx].child[iidx].id, data.value.data[idx].child[iidx].status)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      data.value.data[idx].child[iidx].status = 5
      common.showSuccess("发布成功")
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function cancelPublish(event: any, idx: number, iidx: number) {
  event.stopPropagation()

  API.cancelPublishVideo(data.value.data[idx].child[iidx].id, data.value.data[idx].child[iidx].status)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      data.value.data[idx].child[iidx].status = 3
      common.showSuccess("取消发布成功")
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
</script>

<style scoped>
.chapter-container {
  width: 1140px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
}

.chapter-container>*:not(:last-child) {
  margin-bottom: 20px;
}

.chapter-container .card {
  border-radius: 15px;
}

.chapter-container .card .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chapter-container .card .empty-video {
  color: #909399;
  text-align: center;
}

.chapter-container .card ul li {
  border-radius: 5px;
  display: flex;
  align-items: center;
  min-height: 44px;
  padding-left: 10px;
  padding-right: 10px;
}

.chapter-container .card ul li:hover {
  background-color: #fef0f0;
  color: #F56C6C;
}

.chapter-container .card ul li:hover .is-pub {
  display: unset;
}

.chapter-container .card ul li:hover .status-container .btns {
  display: unset;
}

.chapter-container .card ul li .icon {
  margin-right: 5px;
}

.chapter-container .card ul li .title {
  max-width: calc(100% - 156px);
}

.chapter-container .card ul li .study-btn {
  border-radius: 15px;
  margin-left: 15px;
  display: none;
  pointer-events: none;
}

.chapter-container .card ul li .status-container {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.chapter-container .card ul li .status-container .btns {
  display: none;
}

.chapter-container .card ul li .status-container .status {
  font-size: 14px;
  margin-left: 12px;
  color: #303133;
}
</style>