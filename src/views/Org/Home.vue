<template>
  <div class="org-container">
    <el-card>
      {{ `${getCurTimePeriod()}好，` }}<!--
      --><span class="hello-nickname">{{ `${common.getNickname()}` }}</span>
    </el-card>

    <el-card>
      <template #header>
        <span class="header">机构信息</span>
      </template>

      <div class="info">
        <div>
          <span>
            <span>机构名</span>
          </span>
          <span class="content">{{ oi.name }}</span>
          <span @click="setOrgName" class="btn">修改机构名</span>
        </div>

        <el-divider />

        <div>
          <span>
            <span>机构信息</span>
          </span>
          <span class="content">{{ oi.introduction }}</span>
          <span @click="setIntroduction" class="btn">修改机构信息</span>
        </div>

        <el-divider />

        <div style="justify-content: flex-start;">
          <span>
            <span>相关图片</span>
          </span>
          <div class="img-container">
            <Image v-for="url in (oi.materials as string[])" :url="url" :w="80" :h="80" contain="fit" preview border>
            </Image>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import * as common from '@/common'
import { ElMessageBox } from 'element-plus'
import * as API from '@/api/org'

type OrgInfo = {
  id: number
  name: string,
  introduction: string,
  materials: string | string[],
}

let oi = ref<OrgInfo>({
  id: -1,
  name: "",
  introduction: "",
  materials: [],
})

getOrgInfo()

function getOrgInfo() {
  API.getOrgInfo()
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      oi.value = res.data
      oi.value.materials = (oi.value.materials as string).split(";")
    })
    .catch((error) => {
      common.showError(error.message)
    })
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

function setOrgName() {
  common.showInfo("请联系管理员进行修改")
}

function setIntroduction() {
  ElMessageBox.prompt('请输入新机构信息', '修改机构信息', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    inputType: "textarea",
    inputValue: oi.value.introduction
  })
    .then(({ value }) => {
      value = value.trim()
      API.setOrgIntro(value)
        .then((res) => {
          if (res.code !== 200) {
            common.showError(res.message)
            return
          }

          oi.value.introduction = value.trim()
          common.showSuccess("修改成功")
        })
        .catch((error) => {
          common.showError(error.message)
        })
    })
    .catch(() => { })
}
</script>

<style scoped>
.org-container>* {
  margin-bottom: 20px;
}

.org-container .info>* {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.org-container .hello-nickname {
  color: #F56C6C;
}

.org-container .header {
  color: #409EFF;
}

.org-container .content {
  color: #909399;
  white-space: pre-line;
  max-width: 800px;
}

.org-container .btn {
  color: #409EFF;
  cursor: pointer;
}

.org-container .btn:hover {
  color: #337ecc;
}

.org-container .img-container {
  width: calc(100% - 56px);
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>