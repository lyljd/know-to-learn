<template>
  <div class="user-container">
    <el-card>
      {{ `${getCurTimePeriod()}好，` }}<!--
      --><span class="hello-nickname">{{ `${pi?.nickname}` }}</span>
    </el-card>

    <el-card>
      <template #header>
        <span class="header">账号安全</span>
      </template>

      <div class="security">
        <div>
          <span>
            <svg class="icon-symbol" aria-hidden="true">
              <use :xlink:href="pi?.password ? '#el-icon-success' : '#el-icon-warning'"></use>
            </svg>
            <span class="notice">密码</span>
          </span>
          <span class="content">{{ pi?.password ? "已设置" : "未设置" }}</span>
          <span @click="setPassword" class="btn">{{ pi?.password ? "修改密码" : "设置密码" }}</span>
        </div>

        <el-divider />

        <div>
          <span>
            <svg class="icon-symbol" aria-hidden="true">
              <use :xlink:href="'#el-icon-success'"></use>
            </svg>
            <span class="notice">邮箱</span>
          </span>
          <span class="content">{{ pi?.email }}</span>
          <span class="btn disabled">更换邮箱</span>
        </div>
      </div>
    </el-card>


    <el-card>
      <template #header>
        <span class="header">我的信息</span>
      </template>

      <div class="info">
        <div>
          <span>
            <span>头像</span>
          </span>
          <Image customClass="image-upload" :url="pi?.avatar" :w="40" :h="40" @recOpenUploadFc="recOpenUploadFc"
            @recImgUrl="recImgUrl" uploadMethod="put" preview circle></Image>
          <span @click="setAvatar" class="btn">修改头像</span>
        </div>

        <el-divider />

        <div>
          <span>
            <span>用户名</span>
          </span>
          <span class="content">{{ pi?.username }}</span>
          <span @click="setUsername" class="btn">修改用户名</span>
        </div>

        <el-divider />

        <div>
          <span>
            <span>昵称</span>
          </span>
          <span class="content">{{ pi?.nickname }}</span>
          <span @click="setNickname" class="btn">修改昵称</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import * as API from '@/api/user'
import * as common from '@/common'
import { ElMessageBox } from 'element-plus'
import { useStore } from '@/store'

type PersonalInfo = {
  id: number
  avatar: string,
  email: string,
  username: string,
  nickname: string,
  password: boolean,
  role: "user" | "org" | "admin",
  orgId: number,
  salt: string,
}

const store = useStore()

let pi = ref<PersonalInfo>()
let openUpload: Function

onMounted(() => {
  getPersonalInfo()
})

function recOpenUploadFc(f: Function) {
  openUpload = f
}

function recImgUrl(imgUrl: string) {
  localStorage.setItem("avatarUrl", imgUrl)
  store.avatarUrl = imgUrl
  pi.value!.avatar = imgUrl
}

function getCurTimePeriod(): string {
  let curHour = new Date().getHours()
  if (curHour >= 6 && curHour < 12) {
    return "早上"
  } else if (curHour >= 12 && curHour < 14) {
    return "中午"
  } else if (curHour >= 14 && curHour < 18) {
    return "下午"
  } else {
    return "晚上"
  }
}

function getPersonalInfo() {
  API.getPersonalInfo()
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      pi.value = res.data
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function setPassword() {
  ElMessageBox.prompt('请输入新密码', '修改密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'password',
    inputPattern: /^.{6,16}$/,
    inputErrorMessage: '密码长度为6～16位',
  })
    .then(({ value }) => {
      API.setPassword(value)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          common.showSuccess(res.message)
          pi.value!.password = true
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}

function setUsername() {
  ElMessageBox.prompt('请输入新用户名', '修改用户名', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: pi.value!.username,
    inputPattern: /.+/,
    inputErrorMessage: '用户名长度至少有1位',
  })
    .then(({ value }) => {
      if (value === pi.value!.username) {
        common.showError("新用户名与原用户名相同")
        return
      }
      API.setUsername(value)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          common.showSuccess(res.message)
          pi.value!.username = value
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}

function setNickname() {
  ElMessageBox.prompt('请输入新昵称', '修改昵称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: pi.value!.nickname,
    inputPattern: /.+/,
    inputErrorMessage: '昵称长度至少有1位',
  })
    .then(({ value }) => {
      if (value === pi.value!.nickname) {
        common.showError("新昵称与原昵称相同")
        return
      }
      API.setNickname(value)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          common.showSuccess(res.message)
          pi.value!.nickname = value
          localStorage.setItem("nickname", value)
          store.nickname = value
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}

function setAvatar() {
  openUpload()
}
</script>

<style scoped>
.user-container {
  margin: 20px;
  margin-top: 77px;
}

.user-container>* {
  margin-bottom: 20px;
}

.user-container .security>*,
.user-container .info>* {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.user-container .hello-nickname {
  color: #F56C6C;
}

.user-container .header {
  color: #409EFF;
}

.user-container .notice {
  margin-left: 3px;
}

.user-container .content {
  color: #909399;
}

.user-container .btn {
  color: #409EFF;
  cursor: pointer;
}

.user-container .btn:hover {
  color: #337ecc;
}

.user-container .disabled {
  color: #c8c9cc !important;
  pointer-events: none;
}
</style>