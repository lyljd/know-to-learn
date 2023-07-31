import { apiInstance } from "."

const getOrgApplyList = () => apiInstance.get("/api/admin/pending/org").then(res => res.data)

const orgApplyPass = (id: number) => apiInstance.put(`/api/admin/checkPass/org/${id}`).then(res => res.data)

const orgApplyReject = (id: number) => apiInstance.put(`/api/admin/checkRefuse/org/${id}`).then(res => res.data)

export {
  getOrgApplyList,
  orgApplyPass,
  orgApplyReject,
}