<template>
  <div class="cc-container">
    <div @click="common.ToCourse(data.courseId)" class="cover">
      <Image :url="data.coverUrl" :w="270 * scale" :h="151.88 * scale" customClass="cc-image"></Image>
    </div>
    <div @click="common.ToCourse(data.courseId)" class="course-name">
      <span class="name-content">{{ data.courseName }}</span>
    </div>
    <div @click="orgVisible ? common.ToOrg(data.orgId as number) : null" class="info">
      <span :class="orgVisible ? 'info-content' : 'info-content-no'">
        <span v-if="orgVisible">{{ data.orgName }} · </span>
        <span>{{ common.timestampFormatterRichExcludeHM(data.publishTime) }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as common from '@/common'

withDefaults(defineProps<{
  data: {
    coverUrl: string,
    courseId: number,
    courseName: string,
    orgId?: number,
    orgName?: string,
    publishTime: number,
  },
  orgVisible: boolean,
  scale: number
}>(), {
  orgVisible: true,
  scale: 1,
})
</script>

<style scoped>
.cc-container .cover {
  border: 1px solid #CDD0D6;
  border-radius: 5px;
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

.cc-container .info .info-content-no {
  cursor: default;
}
</style>

<style>
.cc-image {
  cursor: pointer !important;
}
</style>