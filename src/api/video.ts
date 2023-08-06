import { apiInstance } from "."

const getVideoInfo = (videoId: number) => apiInstance.get(`/api/user/course/chapter/${videoId}/details`).then(res => res.data)

export {
  getVideoInfo,
}