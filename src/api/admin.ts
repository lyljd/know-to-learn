import { apiInstance } from "."

const getOrgApplyList = () => apiInstance.get("/api/admin/pending/org").then(res => res.data)

const orgApplyPass = (id: number) => apiInstance.put(`/api/admin/checkPass/org/${id}`).then(res => res.data)

const orgApplyReject = (id: number) => apiInstance.put(`/api/admin/checkRefuse/org/${id}`).then(res => res.data)

const getApplyVideos = () => apiInstance.get("/api/admin/pending/media").then(res => res.data)

const passVideo = (mediaId: number) => apiInstance.post("/api/admin/course/chapter/media/audit/checkPass", { mediaId: mediaId, currentState: 2 }).then(res => res.data)

const rejectVideo = (mediaId: number) => apiInstance.post("/api/admin/course/chapter/media/audit/checkRefuse", { mediaId: mediaId, currentState: 2 }).then(res => res.data)

export {
  getOrgApplyList,
  orgApplyPass,
  orgApplyReject,
  getApplyVideos,
  passVideo,
  rejectVideo,
}