import axios from "axios"
import * as common from '@/common'
import { useStore } from '@/store'
import router from "@/router"

const apiInstance = axios.create({
  timeout: 5000,
})

apiInstance.interceptors.request.use(function (config) {
  let token = common.getLocalToken()
  if (token !== "") {
    config.headers.Authorization = token
  }

  return config

}, function (error) {
  return Promise.reject(error)
});

apiInstance.interceptors.response.use(function (response) {
  const store = useStore()
  const token = response.headers.authorization
  if (token) {
    common.setTokenToLocal(token)
  }

  if (response.data.code === 666) {
    store.isLogin = false
    common.clearLoginStorage()
    if (router.currentRoute.value.meta.needLogin) {
      router.replace(`/401?from=${location.pathname}`)
      store.openLoginWindow()
    }
  }

  return response

}, function (error) {
  return Promise.reject(error)
});

export {
  apiInstance,
}