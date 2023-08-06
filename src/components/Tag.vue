<template>
  <div class="t-container">
    <el-tag v-for="t in tags" :closable="modifiable" @close="delTag(t)">{{ t }}</el-tag>

    <div v-if="modifiable">
      <el-input class="new-input" v-if="inputVisible" ref="inputRef" v-model="inputValue" size="small"
        @keyup.enter="newTag" @blur="newTag" />

      <el-button class="new-btn" v-else size="small" @click="showInput">+ 新增</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElInput } from 'element-plus'
import * as common from '@/common'

const data = withDefaults(defineProps<{
  tags: string[],
  modifiable: boolean,
  limit: number,
  repeatable: boolean,
}>(), {
  modifiable: false,
  limit: -1,
  repeatable: false,
})

const inputRef = ref<InstanceType<typeof ElInput>>()

let inputVisible = ref(false)
let inputValue = ref('')

function showInput() {
  if (data.limit > -1 && data.tags.length >= data.limit) {
    common.showInfo(`数量已达上限：${data.limit}`)
    return
  }
  inputVisible.value = true
  nextTick(() => {
    inputRef.value!.input!.focus()
  })
}

function newTag() {
  inputValue.value = inputValue.value.trim()
  if (inputValue.value) {
    if (!data.repeatable && data.tags.indexOf(inputValue.value) !== -1) {
      common.showError("新增内容重复")
    } else {
      data.tags.push(inputValue.value)
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

function delTag(tagValue: string) {
  data.tags.splice(data.tags.indexOf(tagValue), 1)
}
</script>

<style scoped>
.t-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.t-container .new-input {
  width: 120px;
}

.t-container .new-btn {
  width: 60px;
}
</style>
