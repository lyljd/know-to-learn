<template>
  <div class="org-container">
    <el-card>
      {{ `${getCurTimePeriod()}好，` }}<!--
      --><span class="hello-nickname">{{ `${common.getNickname()}` }}</span>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import * as common from '@/common'

type OrgInfo = {
  id: number
  orgName: string,
  introduction: string,
  materials: string | string[],
}

let oi = ref<OrgInfo>({
  id: 1,
  orgName: "黑马程序员",
  introduction: "月薪过万\n就来黑马程序员",
  materials: [],
})

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
</script>

<style scoped>
.org-container .hello-nickname {
  color: #F56C6C;
}
</style>