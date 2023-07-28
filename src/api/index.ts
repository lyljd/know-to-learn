import axios from "axios"

const apiInstance = axios.create({
  timeout: 5000,
})

apiInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export {
  apiInstance,
}