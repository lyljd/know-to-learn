import { ElMessage } from 'element-plus'

function isMobile(): boolean {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) !== null
}

function isLogin(): boolean {
  return localStorage.getItem("token") !== null && localStorage.getItem("token") !== ""
}

function showSuccess(msg: string) {
  ElMessage({
    type: "success",
    offset: 77,
    message: msg,
  })
}

function showError(msg: string) {
  ElMessage({
    type: "error",
    offset: 77,
    message: msg,
  })
}

function showInfo(msg: string) {
  ElMessage({
    offset: 77,
    message: msg,
  })
}

function btnCD(btn: HTMLButtonElement, cdTime: number) {
  let text = btn.innerText

  btn.disabled = true
  btn.classList.add('is-disabled')
  btn.innerText = text + "(" + cdTime + ")"

  let dec = setInterval(() => {
    cdTime--
    btn.innerText = text + "(" + cdTime + ")"
    if (cdTime === 0) {
      clearInterval(dec);
      btn.innerText = text
      btn.classList.remove('is-disabled')
      btn.disabled = false
    }
  }, 1000)
}

export {
  isMobile,
  isLogin,
  showSuccess,
  showError,
  showInfo,
  btnCD,
}