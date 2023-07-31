<template>
  <div class="msg-container">
    <el-card v-for="i in items">
      <template #header>
        <div class="header">
          <div v-if="i.status === 0" class="new"></div>
          <div class="title">{{ i.title }}</div>
          <div class="time">{{ common.timestampFormatterStandard(i.createTime) }}</div>
        </div>
      </template>

      <div class="body">{{ i.content }}</div>
    </el-card>

    <el-empty v-show="items.length === 0" description="暂无消息"></el-empty>
  </div>
</template>

<script setup lang="ts">
import * as common from '@/common'
import * as API from '@/api/message'

type Item = {
  title: string,
  content: string,
  createTime: number,
  status: number,
}

const items = ref<Item[]>([])

getAllMessage()

function getAllMessage() {
  API.getAllMessage()
    .then((res) => {
      if (res.code !== 200) {
        common.showError(res.message)
        return
      }
      
      items.value = res.data
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
</script>

<style scoped>
.msg-container {
  margin: 20px;
  margin-top: 77px;
}

.msg-container>*:not(:last-child) {
  margin-bottom: 20px;
}

.msg-container .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.msg-container .header .title {
  color: #409EFF;
  font-size: 18px;
}

.msg-container .header .time {
  color: #909399;
  font-size: 14px;
}

.msg-container .body {
  white-space: pre-line;
}

.new {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0px 0px 30px 30px;
  border-color: transparent transparent transparent #409EFF;
  position: absolute;
  margin-left: -20px;
  margin-top: -27px;
}

.new::after {
  content: "新";
  color: white;
  margin-left: -30px;
}
</style>