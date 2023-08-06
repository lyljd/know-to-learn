import { apiInstance } from "."

const getCourseInfo = (courseId: number) => apiInstance.get(`/api/user/course/${courseId}/get`).then(res => res.data)

const getCourseChapter = (courseId: number) => apiInstance.get(`/api/user/course/${courseId}/details`).then(res => res.data)

const newCourseChapter = (courseId: number, chapterName: string) => apiInstance.post("/api/org/course/create/chapter", { courseId: courseId, chapterName: chapterName, orderBy: 0 }).then(res => res.data)

const modifyCourseChapter = (chapterId: number, chapterName: string) => apiInstance.post("/api/org/chapter/update", { chapterId: chapterId, chapterName: chapterName }).then(res => res.data)

const delCourseChapter = (chapterId: number) => apiInstance.delete(`/api/org/chapter/${chapterId}/delete`).then(res => res.data)

const setChapterVideo = (url: string, courseId: number, chapterId: number, name: string, suffix: string) => apiInstance.post(url, { courseId: courseId, chapterId: chapterId, name: name, suffix: suffix, orderBy: 0 }).then(res => res.data)

const applyVideo = (videoId: number, status: number) => apiInstance.post("/api/org/course/chapter/media/audit/arraignment", { mediaId: videoId, currentState: status }).then(res => res.data)

const cancelApplyVideo = (videoId: number, status: number) => apiInstance.post("/api/org/course/chapter/media/audit/checkRevoke", { mediaId: videoId, currentState: status }).then(res => res.data)

const publishVideo = (videoId: number, status: number) => apiInstance.post("/api/org/course/chapter/media/audit/publish", { mediaId: videoId, currentState: status }).then(res => res.data)

const cancelPublishVideo = (videoId: number, status: number) => apiInstance.post("/api/org/course/chapter/media/audit/publishRevoke", { mediaId: videoId, currentState: status }).then(res => res.data)

export {
  getCourseInfo,
  getCourseChapter,
  newCourseChapter,
  modifyCourseChapter,
  delCourseChapter,
  setChapterVideo,
  applyVideo,
  cancelApplyVideo,
  publishVideo,
  cancelPublishVideo,
}