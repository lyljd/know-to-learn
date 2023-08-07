import { apiInstance } from "."

const getChief = () => apiInstance.get("/api/chief/get").then(res => res.data)

const getRecommendation = () => apiInstance.get("/api/course/recommendation").then(res => res.data)

const getUploadAndResourceUrl = (url: string, suffix: string) => apiInstance.post(url, { suffix: suffix }).then(res => res.data)

const fsbusiness = (url: string, para: Object) => apiInstance.post(url, para).then(res => res.data)

const search = (key: string) => apiInstance.get(`/api/search?key=${key}`).then(res => res.data)

export {
  getChief,
  getRecommendation,
  getUploadAndResourceUrl,
  fsbusiness,
  search,
}