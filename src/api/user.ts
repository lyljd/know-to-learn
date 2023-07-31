import { apiInstance } from "."

const getCaptcha = () => apiInstance.post("/api/captcha/generate", { type: "pic" }).then(res => res.data)

const verifyCaptcha = (key: string, code: string) => apiInstance.post("/api/captcha/verify", { key: key, code: code }).then(res => res.data)

const getVcode = (email: string, verify: string) => apiInstance.post("/api/captcha/generate", { type: "email", email: email, verify: verify }).then(res => res.data)

const login = (para: { type: string, username: string, code?: string, password?: string }) => apiInstance.post("/api/user/login", para).then(res => res.data)

const getPersonalInfo = () => apiInstance.get("/api/user/personal").then(res => res.data)

const setPassword = (password: string) => apiInstance.post("/api/user/update/password", { password: password }).then(res => res.data)

const setUsername = (username: string) => apiInstance.post("/api/user/update/username", { username: username }).then(res => res.data)

const setNickname = (nickname: string) => apiInstance.post("/api/user/update/nickname", { nickname: nickname }).then(res => res.data)

const getAvatarUploadAndResourceUrl = (suffix: string) => apiInstance.post("/api/user/upload/avatar", { suffix: suffix }).then(res => res.data)

const getNewMsgNum = () => apiInstance.get("/api/user/stationMessage/count").then(res => res.data)

export {
  getCaptcha,
  verifyCaptcha,
  getVcode,
  login,
  getPersonalInfo,
  setPassword,
  setUsername,
  setNickname,
  getAvatarUploadAndResourceUrl,
  getNewMsgNum,
}