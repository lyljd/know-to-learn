import { apiInstance } from "."

const getCaptcha = () => apiInstance.post("/api/captcha/generate", { type: "pic" }).then(res => res.data)

const verifyCaptcha = (key: string, code: string) => apiInstance.post("/api/captcha/verify", { key: key, code: code }).then(res => res.data)

const getVcode = (email: string, verify: string) => apiInstance.post("/api/captcha/generate", { type: "email", email: email, verify: verify }).then(res => res.data)

const login = (para: { type: string, username: string, code?: string, password?: string }) => apiInstance.post("/api/user/login", para).then(res => res.data)

export {
  getCaptcha,
  verifyCaptcha,
  getVcode,
  login,
}