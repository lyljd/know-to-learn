<template>
  <TopMenuBar :special="true"></TopMenuBar>

  <div class="i-container">
    <div style="display: flex; flex-direction: column;">
      <el-carousel :interval="5000" :pause-on-hover="false" arrow="never" indicator-position="none" style="height: 100vh;">
        <el-carousel-item v-for="p in homePages" style="height: 100vh;">
          <div :style="{ backgroundImage: `url(${p.imgUrl})` }" class="homePage">
            <div class="slogan">
              <div class="animate__animated animate__fadeInLeft" style="margin-top:-100px;">{{ p.firstSlogan }}</div>
              <div class="animate__animated animate__fadeInRight" style="margin-top: 100px;">{{ p.secondSlogan }}</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <transition enterActiveClass="animate__fadeInDown" leaveActiveClass="animate__fadeOutUp">
        <div v-show="moreShow" class="more animate__animated">下滑查看更多↓</div>
      </transition>
    </div>

    <div style="height: 170px;" class="carousel">
      <div class="header">主创成员</div>
      <div id="body1" class="body">
        <div v-for="c in chiefs">
          <Image :url="c.avatar" :w="100" :h="100" circle></Image>
          <div style="text-align: center;">{{ c.name }}</div>
        </div>
      </div>
      <div id="body2" class="body">
        <div v-for="c in chiefs">
          <Image :url="c.avatar" :w="100" :h="100" circle></Image>
          <div style="text-align: center;">{{ c.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as API from '@/api/common'
import * as common from '@/common'
import TopMenuBar from '@/components/TopMenuBar.vue'

type HomePage = {
  firstSlogan: string
  secondSlogan: string
  imgUrl: string
}

type Chief = {
  name: string,
  avatar: string,
}

const homePages = ref<HomePage[]>([
  { firstSlogan: "知学随学", secondSlogan: "智慧之舟展翅", imgUrl: "../../public/bg1.jpg" },
  { firstSlogan: "智行并进", secondSlogan: "探索学海壮阔", imgUrl: "../../public/bg2.jpg" },
  { firstSlogan: "知识荟萃", secondSlogan: "智慧光芒绽放", imgUrl: "../../public/bg3.jpg" },
])

let chiefs = ref<Chief[]>([{ avatar: "", name: "null" }])
let moreShow = ref(true)

onMounted(() => {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 57) {
      moreShow.value = false
    } else {
      moreShow.value = true
    }
  })
})

function getChiefs() {
  API.getChief()
    .then((res) => {
      if (res.code !== 200) {
        return
      }

      chiefs.value = res.data
    })
    .catch((error) => {
      common.showError(error.message)
    })
}
getChiefs()
</script>

<style scoped>
.i-container>* {
  margin-bottom: 20px;
}

.i-container .homePage {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
}

.i-container .homePage .slogan {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  font-size: 75px;
  font-family: STHeiti;
  cursor: default;
  font-weight: bold;
  color: white;
}

.i-container .more {
  position: absolute;
  bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: white;
  cursor: default;
  align-self: center;
}

.i-container .carousel .header {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}

.i-container .carousel .body {
  display: flex;
  gap: 75px;

  position: absolute;
  animation-duration: 10s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.i-container .carousel #body1 {
  animation-name: moveBody1;
}

.i-container .carousel #body2 {
  animation-name: moveBody2;
}

@keyframes moveBody1 {
  0% {
    left: 0;
  }

  100% {
    left: -100%;
  }
}

@keyframes moveBody2 {
  0% {
    left: 100%;
  }

  100% {
    left: 0;
  }
}
</style>