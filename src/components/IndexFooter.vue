<template>
  <div class="index-footer">
    <span>Copyright © 2023 <a href="" target="__blank">know-to-learn</a></span>
    <div class="repo">
      <span>Github Repositories</span>
      <a href="https://github.com/lyljd/know-to-learn" target="__blank">Front-end</a>
      <a href="https://github.com/L-XRay/know-to-learn" target="__blank">Back-end</a>
    </div>
    <span @click="orgApply" class="org">机构入驻</span>
  </div>

  <FeedbackSubmissionWindow></FeedbackSubmissionWindow>
</template>

<script setup lang="ts">
import FeedbackSubmissionWindow from '@/components/FeedbackSubmissionWindow.vue'
import { useStore } from '@/store'
import * as common from '@/common'

const store = useStore()

const fsPara = {
  title: "机构入驻",
  bzUrl: "/api/user/org/apply",
  getUploadUrl: "/api/user/org/submit/materials",
  topicAlias: "orgName",
  contentAlias: "introduction",
  fileListStrAlias: "materials",
  topicPlaceholder: "请输入机构名",
  contentPlaceholder: "请输入机构信息，并上传机构相关图片（可选）",
  topicCheckFailMsg: "机构名不能为空",
  contentCheckFailMsg: "机构信息不能为空",
  succMsg: "提交成功，申请结果将通过系统消息发送～",
  afterSuccDo: () => { },
}

function orgApply() {
  if (!store.isLogin) {
    common.showInfo("请登录")
    store.openLoginWindow()
    return
  }
  store.openFSWindow(fsPara)
}
</script>

<style scoped>
.index-footer {
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.index-footer .repo {
  display: flex;
  gap: 10px;
}

.index-footer a {
  color: #409EFF;
}

.index-footer a:hover {
  color: #337ecc;
}

.index-footer .org {
  cursor: pointer;
  color: #FF6699;
}

.index-footer .org:hover {
  color: #E84B85;
}
</style>