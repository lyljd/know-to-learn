<template>
  <TopMenuBar :special="true"></TopMenuBar>

  <div class="i-container">
    <div style="display: flex; flex-direction: column;">
      <el-carousel :interval="5000" :pause-on-hover="false" arrow="never" indicator-position="none"
        style="height: 100vh;">
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

    <div class="recommendation">
      <div class="header">推荐课程</div>
      <div class="body">
        <CourseCard v-for="r in recommendations" :data="r"></CourseCard>
        <CourseRefreshBtn @click="refreshCourse" id="rc-btn"></CourseRefreshBtn>
      </div>
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

    <IndexFooter></IndexFooter>
  </div>
</template>

<script setup lang="ts">
import * as API from '@/api/common'
import TopMenuBar from '@/components/TopMenuBar.vue'
import CourseCard from '@/components/CourseCard.vue'
import CourseRefreshBtn from '@/components/CourseRefreshBtn.vue'
import * as common from '@/common'
import IndexFooter from '@/components/IndexFooter.vue'

type HomePage = {
  firstSlogan: string
  secondSlogan: string
  imgUrl: string
}

type Chief = {
  name: string,
  avatar: string,
}

type Course = {
  coverUrl: string,
  courseId: number,
  courseName: string,
  orgId: number,
  orgName: string,
  publishTime: number,
}

const homePages = ref<HomePage[]>([
  { firstSlogan: "知学随学", secondSlogan: "智慧之舟展翅", imgUrl: "https://know-to-learn-1314261683.cos.ap-chengdu.myqcloud.com/public/bg1.jpg" },
  { firstSlogan: "智行并进", secondSlogan: "探索学海壮阔", imgUrl: "https://know-to-learn-1314261683.cos.ap-chengdu.myqcloud.com/public/bg2.jpg" },
  { firstSlogan: "知识荟萃", secondSlogan: "智慧光芒绽放", imgUrl: "https://know-to-learn-1314261683.cos.ap-chengdu.myqcloud.com/public/bg3.jpg" },
  // { firstSlogan: "知学随学", secondSlogan: "智慧之舟展翅", imgUrl: "/bg1.jpg" },
  // { firstSlogan: "智行并进", secondSlogan: "探索学海壮阔", imgUrl: "/bg2.jpg" },
  // { firstSlogan: "知识荟萃", secondSlogan: "智慧光芒绽放", imgUrl: "/bg3.jpg" },
])

let chiefs = ref<Chief[]>([{ avatar: "", name: "null" }])
let moreShow = ref(true)
let recommendations = ref<Course[]>([{ coverUrl: "", courseId: -1, courseName: "null", orgId: -1, orgName: "null", publishTime: -1 }])

onMounted(() => {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 57) {
      moreShow.value = false
    } else {
      moreShow.value = true
    }
  })

  getRecommendation()
  getChiefs()
})

function getRecommendation() {
  API.getRecommendation()
    .then((res) => {
      if (res.code !== 200) {
        common.showError("获取推荐课程失败")
        console.log(res.message)
        return
      }

      recommendations.value = res.data
    })
    .catch((error) => {
      common.showError("获取推荐课程失败")
      console.log(error.message)
    })
}

function getChiefs() {
  API.getChief()
    .then((res) => {
      if (res.code !== 200) {
        common.showError("获取主创成员失败")
        console.log(res.message)
        return
      }

      chiefs.value = res.data
    })
    .catch((error) => {
      common.showError("获取主创成员失败")
      console.log(error.message)
    })
}

function refreshCourse() {
  const rcBtn = document.getElementById("rc-btn") as HTMLButtonElement
  common.btnCD(rcBtn, 1, true)
  getRecommendation()
}
</script>

<style scoped>
.i-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.i-container>*:not(:last-child) {
  margin-bottom: 40px;
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

.i-container .recommendation {
  width: 1140px;
  align-self: center;
}

.i-container .recommendation .header {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}

.i-container .recommendation .body {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
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