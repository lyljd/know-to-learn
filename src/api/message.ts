import { apiInstance } from "."

const getAllMessage = () => apiInstance.get("/api/user/stationMessage/all").then(res => res.data)

export {
  getAllMessage,
}