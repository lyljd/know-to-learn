<template>
  <div class="lw-container">
    <el-dialog @close="clearInput" v-model="dialogVisible" :width="480" :close-on-press-escape=false
      :close-on-click-modal=false :align-center=true destroy-on-close>
      <el-tabs @tab-change="tabChange" v-model="option">
        <el-tab-pane label="邮箱登录/注册" name="email">
          <div class="input-box">
            <div class="row">
              <span class="tag">邮箱</span>
              <el-input style="width: calc(100% - 57px - 135px);" v-model="email" placeholder="请输入邮箱" />
              <el-button :disabled="!checkEmailValid()" @click="openCaptchaWindow" id="get-captcha-btn"
                class="get-captcha-btn">获取验证码</el-button>
            </div>
            <div class="row">
              <span class="tag">验证码</span>
              <el-input @keyup.enter.native="login" class="input" maxlength="4" v-model="vcode" placeholder="请输入验证码" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="密码登录" name="password">
          <div class="input-box">
            <div class="row">
              <span class="tag">用户名</span>
              <el-input class="input" v-model="username" placeholder="请输入用户名（默认为邮箱）" />
            </div>
            <div class="row">
              <span class="tag">密码</span>
              <el-input @keyup.enter.native="login" class="input" maxlength="16" type="password" show-password
                v-model="password" placeholder="请输入密码" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="login" :disabled="!loginBtnCheck()" id="login-btn" class="btn" type="primary">{{
          btnText }}</el-button>
      </template>
    </el-dialog>
  </div>

  <CaptchaWindow ref="captchaWindow"></CaptchaWindow>
</template>

<script setup lang="ts">
import * as common from "@/common"
import * as API from '@/api/user'
import CaptchaWindow from "@/components/CaptchaWindow.vue"
import { useStore } from "@/store"
import { useRouter } from "vue-router"
import { ElNotification } from 'element-plus'

type LoginInfo = {
  nickname: string,
  avatarUrl: string,
  token: string,
}

type LoginAPIPara = {
  type: string,
  username: string,
  code?: string,
  password?: string,
}

defineExpose({
  show
})

const store = useStore()
const router = useRouter()

const captchaWindow = ref<InstanceType<typeof CaptchaWindow>>()

let dialogVisible = ref(false)
let afterSuccDo: Function
let option = ref("email")
let btnText = ref("登录/注册")
let email = ref("")
let vcode = ref("")
let username = ref("")
let password = ref("")
let hasVerify = ref(false)

function show(afterSuccDoP: Function) {
  dialogVisible.value = true
  afterSuccDo = afterSuccDoP
}

function tabChange(newTabName: string) {
  switch (newTabName) {
    case "vcode": {
      btnText.value = "登录/注册"
      break
    }
    case "password": {
      btnText.value = "登录"
      break
    }
  }
}

function openCaptchaWindow() {
  captchaWindow.value?.show((payload: string) => {
    getVcode(payload)
  })
}

function getVcode(payload: string) {
  API.getVcode(email.value, payload)
    .then((res) => {
      let btn = document.getElementById("get-captcha-btn") as HTMLButtonElement
      common.btnCD(btn, res.data.ttl)

      if (res.code !== 200) {
        common.showError(res.message)
        if (res.code === 400) {
          hasVerify.value = true
        }
        return
      }

      hasVerify.value = true
      common.showSuccess(res.message)
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function clearInput() {
  vcode.value = ""
  password.value = ""
}

function checkEmailValid(): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.value)
}

function checkVcodeValid(): boolean {
  const vcodeRegex = /^[0-9a-zA-Z]{4}$/
  return vcodeRegex.test(vcode.value)
}

function checkUsernameValid(): boolean {
  return username.value.length >= 1
}

function checkPasswordValid(): boolean {
  return password.value.length >= 6 && password.value.length <= 16
}

function loginBtnCheck(): boolean {
  switch (option.value) {
    case "email": {
      if (hasVerify.value && checkVcodeValid()) {
        return true
      }
      break
    }
    case "password": {
      if (checkUsernameValid() && checkPasswordValid()) {
        return true
      }
      break
    }
  }
  return false
}

function login() {
  if (!loginBtnCheck()) {
    return
  }

  let loginBtn = document.getElementById("login-btn") as HTMLButtonElement
  if (loginBtn.disabled) {
    return
  }

  common.btnCD(loginBtn, 3)

  switch (option.value) {
    case "email": {
      loginAPI({
        type: "email",
        username: email.value,
        code: vcode.value,
      })
      break
    }
    case "password": {
      loginAPI({
        type: "password",
        username: username.value,
        password: password.value,
      })
      break
    }
  }
}

function loginAPI(para: LoginAPIPara) {
  API.login(para)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      let li: LoginInfo = {
        nickname: res.data.userInfo.nickname,
        avatarUrl: res.data.userInfo.avatar,
        token: res.data.token,
      }

      saveLoginInfo(li)
      afterSuccDo(li.avatarUrl, li.nickname)

      dialogVisible.value = false
      store.isLogin = true

      email.value = ""
      username.value = ""
      hasVerify.value = false

      let index = location.href.lastIndexOf("from=")
      if (index !== -1) {
        router.replace(location.href.slice(index + 5))
      }

      showLoginSuccess(li.nickname)
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function saveLoginInfo(li: LoginInfo) {
  localStorage.setItem("nickname", li.nickname)
  localStorage.setItem("avatarUrl", li.avatarUrl)
  localStorage.setItem("token", "Bearer "+li.token)
}

function showLoginSuccess(nickname: string) {
  ElNotification.success({
    title: "登录成功",
    message: `欢迎你，${nickname}`,
    showClose: false,
    offset: 57,
    duration: 2000,
  })
}
</script>

<style scoped>
.lw-container .input-box {
  border: 1px solid #c8c9cc;
  border-radius: 5px;
}

.lw-container .input-box .row {
  padding: 15px;
  display: flex;
  align-items: center;
  height: 14px;
}

.lw-container .input-box .row .tag {
  width: 42px;
  color: black;
  margin-right: 15px;
  text-align: right;
}

.lw-container .input-box .row .input {
  width: calc(100% - 57px);
}

.lw-container .input-box .row .get-captcha-btn {
  width: 120px;
  margin-left: 15px;
}

.lw-container .input-box .row:not(:last-child) {
  border-bottom: 1px solid #c8c9cc;
}

.lw-container .btn {
  width: 100%;
  height: 37px;
}
</style>

<style>
.lw-container .el-dialog.is-align-center {
  border-radius: 10px;
}

.lw-container .el-dialog__header,
.lw-container .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.lw-container .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.lw-container .el-tabs__nav-wrap::after,
.lw-container .el-tabs__active-bar {
  display: none;
}

.lw-container .el-tabs__item {
  padding: 0;
  font-size: 18px;
}

.lw-container .el-tabs__item:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  /* right: .el-tabs__nav gap的一半 */
  right: -20px;
  width: 1px;
  background-color: #c8c9cc;
}

.lw-container .el-tabs__nav {
  float: unset;
  gap: 40px;
  justify-content: center;
  align-items: center;
  height: 18px;
}

.lw-container .el-tabs__header {
  margin: 0 0 20px;
}

.lw-container .el-input__wrapper {
  box-shadow: unset !important;
  padding: 0;
}
</style>