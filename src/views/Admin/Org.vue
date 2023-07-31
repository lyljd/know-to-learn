<template>
  <div class="org-container">
    <el-card v-for="(i, idx) in items">
      <template #header>
        <div class="header">
          <div>
            <span class="sec-text">申请人：</span>
            {{ `${i.nickname}(${i.username})` }}
          </div>
          <div>
            <span class="sec-text">申请时间：</span>
            {{ common.timestampFormatterStandard(i.createTime) }}
          </div>
          <div>
            <el-button @click="pass(idx)" type="success">通过</el-button>
            <el-button @click="reject(idx)" type="danger">驳回</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <div>
          <span class="sec-text">机构名：</span>
          {{ i.orgName }}
        </div>
        <div>
          <span class="sec-text">机构信息：</span>
          <div class="intro">{{ i.introduction }}</div>
        </div>
        <div v-if="(i.materials as string[]).length > 0" class="img-row">
          <span class="sec-text">相关图片：</span>
          <div class="img-container">
            <Image v-for="url in (i.materials as string[])" :url="url" :w="80" :h="80" contain="fit" preview border>
            </Image>
          </div>
        </div>
      </div>
    </el-card>

    <el-empty v-show="items.length === 0" description="暂无需处理的机构审核"></el-empty>
  </div>
</template>

<script setup lang="ts">
import * as common from '@/common'
import * as API from '@/api/admin'

type Item = {
  id: number,
  nickname: string,
  username: string,
  orgName: string,
  introduction: string,
  materials: string | string[],
  createTime: number,
}

let items = ref<Item[]>([])

getData()

function pass(idx: number) {
  API.orgApplyPass(items.value[idx].id)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      items.value.splice(idx, 1)
      common.showSuccess("已通过")
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function reject(idx: number) {
  API.orgApplyReject(items.value[idx].id)
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      items.value.splice(idx, 1)
      common.showSuccess("已驳回")
    })
    .catch((error) => {
      common.showError(error.message)
    })
}

function getData() {
  API.getOrgApplyList()
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }

      items.value = res.data ? res.data : []
      items.value.forEach(e => {
        e.materials = e.materials !== "" ? (e.materials as string).split(";") : []
      });
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
</script>

<style scoped>
.org-container>*:not(:last-child) {
  margin-bottom: 20px;
}

.org-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.org-container .body>*:not(:last-child) {
  margin-bottom: 10px;
  line-height: 20px;
}

.org-container .body .intro {
  white-space: pre-line;
  margin-left: 5em;
  margin-top: -20px;
}

.org-container .img-row {
  display: flex;
}

.org-container .img-row .img-container {
  display: flex;
  gap: 10px;
}

.org-container .sec-text {
  color: #909399;
}
</style>