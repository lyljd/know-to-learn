<template>
  <div class="cw-container">
    <el-dialog @close="clearInput" v-model="dialogVisible" title="人机验证" :width="360" :close-on-press-escape=false
      :close-on-click-modal=false :align-center=true>
      <div style="display: flex;">
        <el-input @keyup.enter.native="verify" maxlength="4" placeholder="请输入验证码（区分大小写）" v-model="input" />
        <Image :url="captchaUrl" :w="100" :h="30" loadFailInfo="加载中" border :round="false"></Image>
      </div>
      <template #footer>
        <el-button @click="refreshCaptcha" id="refresh-btn">刷新</el-button>
        <el-button @click="verify" :disabled="input.length !== 4" id="verify-btn" type="primary">验证</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import * as common from "@/common"
import * as API from '@/api/user'

defineExpose({
  show
})

let dialogVisible = ref(false)
let afterSuccDo: Function
let input = ref("")
let captchaUrl = ref("")
let captchaKey = ref("")

function show(afterSuccDoP: Function) {
  getCaptcha()
  dialogVisible.value = true
  afterSuccDo = afterSuccDoP
}

function clearInput() {
  input.value = ""
  captchaUrl.value = ""
}

function checkCaptchaInput(): boolean {
  const vcodeRegex = /^[0-9a-zA-Z]{4}$/
  return vcodeRegex.test(input.value)
}

function getCaptcha() {
  API.getCaptcha()
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      captchaUrl.value = res.data.aliasing
      captchaKey.value = res.data.key
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function verifyCaptcha() {
  API.verifyCaptcha(captchaKey.value, input.value)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      afterSuccDo(res.data)
      dialogVisible.value = false
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function refreshCaptcha() {
  let refreshBtn = document.getElementById("refresh-btn") as HTMLButtonElement
  if (refreshBtn.disabled) {
    return
  }

  common.btnCD(refreshBtn, 3)

  getCaptcha()
}

function verify() {
  if (input.value.length !== 4) {
    return
  }

  let verifyBtn = document.getElementById("verify-btn") as HTMLButtonElement
  if (verifyBtn.disabled) {
    return
  }

  common.btnCD(verifyBtn, 3)

  if (!checkCaptchaInput()) {
    common.showError("请输入4位数字或字母")
    return
  }

  verifyCaptcha()
}
</script>

<style scoped></style>

<style>
.cw-container .el-dialog.is-align-center {
  border-radius: 5px;
}

.cw-container .el-dialog__header,
.cw-container .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.cw-container .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>