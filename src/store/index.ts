import { defineStore } from 'pinia'
import * as common from "../common"

export const useStore = defineStore("know-to-learn", {
  state: () => ({
    isLogin: common.isLogin(),
    curPath: "",

    openLoginWindow: () => { },
  })
})