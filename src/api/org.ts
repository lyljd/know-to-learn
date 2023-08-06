import { apiInstance } from "."

type NewCourseForm = {
  pic: string,
  name: string,
  introduction: string,
  category: string,
  teachers: string,
  tags: string,
}

const getOrgInfo = () => apiInstance.get("/api/org/info").then(res => res.data)

const setOrgIntro = (intro: string) => apiInstance.post("/api/org/info/update/orgIntro", { orgIntro: intro }).then(res => res.data)

const getOrgCourse = () => apiInstance.get("/api/org/course/all").then(res => res.data)

const setCourse = (ncf: NewCourseForm, url: string) => apiInstance.post(url, ncf).then(res => res.data)

const delCourse = (courseId: number) => apiInstance.delete(`/api/org/course/${courseId}/delete`).then(res => res.data)

const getOrgExposeInfo = (orgId: number) => apiInstance.get(`/api/user/org/${orgId}/home`).then(res => res.data)

const getCourseInfo = (courseId: number) => apiInstance.get(`/api/user/course/${courseId}/get`).then(res => res.data)

export {
  getOrgInfo,
  setOrgIntro,
  getOrgCourse,
  setCourse,
  delCourse,
  getOrgExposeInfo,
  getCourseInfo,
}