<template>
  <div class="course-container">
    <div class="header">
      <div class="stat">共<span class="num">{{ courses.length }}</span>个课程</div>
      <div>
        <el-button @click="newCourse" type="primary" size="small">新建课程</el-button>
      </div>
    </div>

    <div v-if="courses.length > 0" class="body">
      <div class="card" v-for="(c, idx) in courses">
        <CourseCard :data="c" :orgVisible="false" :scale="0.95"></CourseCard>
        <el-button @click="modifyCourse(idx)" class="modify-btn" type="warning" size="small">修改课程</el-button>
        <el-button @click="delCourse(idx)" class="del-btn" type="danger" size="small">删除课程</el-button>
      </div>
    </div>

    <el-empty v-else description="暂无课程"></el-empty>
  </div>

  <el-dialog class="nc-container" v-model="newCourseWindowVisible" :title="!modifyMode ? '新建课程' : '修改课程'"
    :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" align-center destroy-on-close
    draggable>

    <div>
      <div class="span">封面</div>
      <Image :url="form.pic" :w="160" :h="90" uploadUrl="/api/org/course/pic" @recImgUrl="recImgUrl" uploadMethod="put"
        loadFailInfo="点击上传"></Image>
    </div>

    <div>
      <div class="span">课程名</div>
      <el-input v-model="form.name" maxlength="25" show-word-limit />
    </div>

    <div>
      <div class="span">简介</div>
      <el-input v-model="form.introduction" type="textarea" resize="none" maxlength="250" show-word-limit />
    </div>

    <div>
      <div class="span">分类</div>
      <div>
        <el-radio-group v-model="form.category">
          <el-radio-button label="backend">后端开发</el-radio-button>
          <el-radio-button label="frontend">前端开发</el-radio-button>
          <el-radio-button label="mobile">移动开发</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div>
      <div class="span">讲师</div>
      <Tag :tags="teachers" :limit="9" :modifiable="true"></Tag>
    </div>

    <div>
      <div class="span">标签</div>
      <Tag :tags="tags" :limit="9" :modifiable="true"></Tag>
    </div>

    <template #footer>
      <el-button @click="closeWindow">取消</el-button>
      <el-button :disabled="!submitCheck()" @click="submit" type="primary">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import CourseCard from '@/components/CourseCard.vue'
import Tag from '@/components/Tag.vue'
import * as common from '@/common'
import { ElMessageBox } from 'element-plus'
import * as API from '@/api/org'

type Course = {
  coverUrl: string,
  courseId: number,
  courseName: string,
  publishTime: number,
}

type Form = {
  pic: string,
  name: string,
  introduction: string,
  category: string,
  teachers: string,
  tags: string,
}

let courses = ref<Course[]>([])
let newCourseWindowVisible = ref(false)
let form: Form = reactive({
  pic: "",
  name: "",
  introduction: "",
  category: "",
  teachers: "",
  tags: ""
})
let teachers = ref<string[]>([])
let tags = ref<string[]>([])
let modifyMode = ref(false)
let modifyId = ref(-1)

getOrgCourse()

function getOrgCourse() {
  API.getOrgCourse()
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      courses.value = res.data
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function recImgUrl(imgUrl: string) {
  form.pic = imgUrl
}

function newCourse() {
  modifyMode.value = false
  clearForm()
  openCourseWindow()
}

function modifyCourse(idx: number) {
  modifyMode.value = true
  modifyId.value = courses.value[idx].courseId
  clearForm()
  getCourseInfo(modifyId.value)
  openCourseWindow()
}

function openCourseWindow() {
  newCourseWindowVisible.value = true
}

function clearForm() {
  form = reactive({
    pic: "",
    name: "",
    introduction: "",
    category: "",
    teachers: "",
    tags: ""
  })
}

function getCourseInfo(courseId: number) {
  API.getCourseInfo(courseId)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      form = reactive(res.data)
      if (form.teachers !== "") {
        teachers.value = form.teachers.split(";")
      } else {
        teachers.value = []
      }

      if (form.tags !== "") {
        tags.value = form.tags.split(";")
      } else {
        tags.value = []
      }
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function delCourse(idx: number) {
  ElMessageBox.confirm(
    '你确定要删除该课程吗?该课程下所有章节和视频都将被一并删除！',
    '删除确定',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: false,
    }
  )
    .then(() => {
      API.delCourse(courses.value[idx].courseId)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          courses.value.splice(idx, 1)
          common.showSuccess("删除成功")
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}

function closeWindow() {
  newCourseWindowVisible.value = false
  form = reactive({
    pic: "",
    name: "",
    introduction: "",
    category: "",
    teachers: "",
    tags: ""
  })
  teachers.value = []
  tags.value = []
}

function submitCheck(): boolean {
  return form.pic !== '' && form.name !== '' && form.introduction !== '' && form.category !== ''
}

function submit() {
  form.teachers = teachers.value.join(";")
  form.tags = tags.value.join(";")

  const url = !modifyMode.value ? "/api/org/course/create" : `/api/org/course/${modifyId.value}/update`

  API.setCourse(form, url)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      if (!modifyMode.value) {
        courses.value.unshift({
          coverUrl: form.pic,
          courseId: res.data.courseId,
          courseName: form.name,
          publishTime: res.data.publishTime,
        })
      }

      common.showSuccess("提交成功")
      closeWindow()
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

</script>

<style scoped>
.course-container .header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.course-container .header .stat {
  color: #909399;
}

.course-container .header .stat .num {
  color: #303133;
}

.course-container .body {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.course-container .body .card:hover .del-btn,
.course-container .body .card:hover .modify-btn {
  display: unset;
}

.course-container .body .card .del-btn {
  position: absolute;
  margin-top: -66px;
  margin-left: 184.5px;
  display: none;
}

.course-container .body .card .modify-btn {
  position: absolute;
  margin-top: -66px;
  margin-left: 102.5px;
  display: none;
}
</style>

<style>
.nc-container .el-dialog__header,
.nc-container .el-dialog__footer {
  margin: 0;
  padding: 20px;
}

.nc-container .el-dialog__body {
  padding: 0px 20px;
}

.nc-container .el-dialog__body>*:not(:last-child) {
  margin-bottom: 20px;
}

.nc-container .el-dialog__body .span {
  margin-bottom: 5px;
}
</style>