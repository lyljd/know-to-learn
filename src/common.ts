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

function btnCD(btn: HTMLButtonElement, cdTime: number, noModify?: boolean) {
  let text = btn.innerText

  btn.disabled = true
  btn.classList.add('is-disabled')
  if (!noModify) {
    btn.innerText = text + "(" + cdTime + ")"
  }

  let dec = setInterval(() => {
    cdTime--

    if (!noModify) {
      btn.innerText = text + "(" + cdTime + ")"
    }

    if (cdTime === 0) {
      clearInterval(dec);
      if (!noModify) {
        btn.innerText = text
      }
      btn.classList.remove('is-disabled')
      btn.disabled = false
    }
  }, 1000)
}

function add0(num: number): string {
  return num < 10 ? "0" + num.toString() : num.toString()
}

type date = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}
function timestampFormatter(timestamp: number): date {
  let date = new Date(timestamp)
  let y = date.getFullYear()
  let mon = date.getMonth() + 1 //注意月份从 0 开始，所以要加 1
  let d = date.getDate()
  let h = date.getHours()
  let min = date.getMinutes()
  let s = date.getSeconds()

  return {
    year: y,
    month: mon,
    day: d,
    hour: h,
    minute: min,
    second: s,
  }
}

function timestampFormatterStandard(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  return `${d.year}-${add0(d.month)}-${add0(d.day)} ${add0(d.hour)}:${add0(d.minute)}:${add0(d.second)}`
} //返回日期格式：年-月-日 时:分:秒

function timestampFormatterStandardExcludeSecondOrAndYear(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  let dn = timestampFormatter(Date.now())

  let ret = `${add0(d.month)}-${add0(d.day)} ${add0(d.hour)}:${add0(d.minute)}`

  if (d.year < dn.year) {
    ret = `${d.year}-` + ret
  }

  return ret
} //返回日期格式：月-日 时:分；若时间戳不为今年，则为：年-月-日 时:分

function timestampFormatterYMD(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  return `${d.year}-${add0(d.month)}-${add0(d.day)}`
} //返回日期格式：年-月-日

function timestampFormatterAgo(timestamp: number): string {
  let dts = timestamp
  let dnts = Date.now()

  let diff = Math.floor((dnts - dts) / 1000) //时间戳相减后再除以1000，可得到时间相差多少秒

  let hAgo = Math.floor(diff / 3600)
  if (hAgo >= 1) {
    return hAgo + "小时前"
  }

  let mAgo = Math.floor(diff / 60)
  if (mAgo >= 1) {
    return mAgo + "分钟前"
  }

  if (diff === 0) {
    return "刚刚"
  }

  return diff + "秒前"
} //使用此函数时需确保时间戳在今日内；返回x（小时、分钟、秒）前 或 刚刚

function timestampFormatterRich(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  let dn = timestampFormatter(Date.now())

  if (d.year < dn.year || d.month < dn.month || d.day < dn.day) {
    return timestampFormatterStandardExcludeSecondOrAndYear(timestamp)
  }

  return timestampFormatterAgo(timestamp)
} //返回日期格式：若时间戳不为今天，为：StandardExcludeSecondOrAndYear；反之则为Ago

function timestampFormatterRichExcludeHM(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  let dn = timestampFormatter(Date.now())

  if (d.year < dn.year || d.month < dn.month || d.day < d.day) {
    let d = timestampFormatter(timestamp)
    let dn = timestampFormatter(Date.now())

    let ret = `${add0(d.month)}-${add0(d.day)}`

    if (d.year < dn.year) {
      ret = `${d.year}-` + ret
    }

    return ret
  }

  return timestampFormatterAgo(timestamp)
} //返回日期格式：不包含小时和分钟的Rich

function getLocalToken(): string {
  const token = localStorage.getItem("token")
  return token ? token : ""
}

function setTokenToLocal(token: string) {
  localStorage.setItem("token", token)
}

function ToCourse(id: number) {
  window.open(`/course/${id}`, "_blank")
}

function ToOrg(id: number) {
  window.open(`/org/${id}`, "_blank")
}

function ToNewPage(url: string) {
  window.open(url, "_blank")
}

function clearLoginStorage() {
  localStorage.removeItem("nickname")
  localStorage.removeItem("avatarUrl")
  localStorage.removeItem("token")
}

export {
  isMobile,
  isLogin,
  showSuccess,
  showError,
  showInfo,
  btnCD,
  add0,
  timestampFormatter,
  timestampFormatterStandard,
  timestampFormatterStandardExcludeSecondOrAndYear,
  timestampFormatterYMD,
  timestampFormatterAgo,
  timestampFormatterRich,
  timestampFormatterRichExcludeHM,
  getLocalToken,
  setTokenToLocal,
  ToCourse,
  ToOrg,
  ToNewPage,
  clearLoginStorage,
}