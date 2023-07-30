import { apiInstance } from "."

const getChief = () => apiInstance.get("/api/chief/get").then(res => res.data)

const getRecommendation = () => apiInstance.get("/api/course/recommendation").then(res => res.data)

export {
  getChief,
  getRecommendation,
}