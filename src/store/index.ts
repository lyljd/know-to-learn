import { defineStore } from 'pinia'
import * as common from "../common"

type Para = {
  title: string,
  bzUrl: string,
  getUploadUrl: string,
  topicAlias: string,
  contentAlias: string,
  fileListStrAlias: string,
  topicPlaceholder?: string,
  contentPlaceholder?: string,
  cancelButtonText?: string,
  confirmButtonText?: string,
  topicCheckFailMsg?: string,
  contentCheckFailMsg?: string,
  succMsg?: string,
  afterSuccDo?: Function,
}

export const useStore = defineStore("know-to-learn", {
  state: () => ({
    isLogin: common.isLogin(),
    curPath: "",
    nickname: localStorage.getItem("nickname"),
    avatarUrl: localStorage.getItem("avatarUrl"),
    role: "",

    openLoginWindow: () => { },
    openFSWindow: (para: Para) => { },
  })
})