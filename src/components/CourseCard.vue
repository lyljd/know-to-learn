<template>
  <div class="cc-container">
    <div @click="common.ToCourse(data.courseId)" class="cover">
      <Image :url="data.coverUrl" :h="151.88" customClass="cc-image"></Image>
    </div>
    <div @click="common.ToCourse(data.courseId)" class="course-name">
      <span class="name-content">{{ data.courseName }}</span>
    </div>
    <div @click="common.ToOrg(data.orgId)" class="info">
      <span class="info-content">{{ `${data.orgName} · ${common.timestampFormatterRichExcludeHM(data.publishTime)}` }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as common from '@/common'

defineProps<{
  data: {
    coverUrl: string,
    courseId: number,
    courseName: string,
    orgId: number,
    orgName: string,
    publishTime: number,
  },
}>()
</script>

<style scoped>
.cc-container {
  width: 270px;
  height: 193.88px;
}

.cc-container .cover {
  width: 100%;
  height: 151.88px;
}

.cc-container .course-name {
  height: 18px;
  font-size: 16px;
  line-height: 18px;
  margin-top: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cc-container .course-name .name-content {
  cursor: pointer;
}

.cc-container .course-name .name-content:hover {
  color: #909399;
}

.cc-container .info {
  height: 14px;
  font-size: 12px;
  line-height: 14px;
  margin-top: 5px;
  color: #909399;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cc-container .info .info-content {
  cursor: pointer;
}

.cc-container .info .info-content:hover {
  color: #b1b3b8;
}
</style>

<style>
.cc-image {
  cursor: pointer !important;
}
</style>