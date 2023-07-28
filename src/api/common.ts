import { apiInstance } from "."

const getChief = () => apiInstance.get("/api/chief/get").then(res => res.data)

export {
  getChief,
}