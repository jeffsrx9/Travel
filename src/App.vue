<template>
  <div class="webLayout">
    <header
      class="webLayout__sideMenu boxShadow doNotPrint"
      :class="{ 'webLayout__sideMenu--show': isSideMenuShow }"
    >
      <Header
        @setSideMenuClose="isSideMenuShow = false"
        @setCity="setCity"
        :city="city"
      />
    </header>
    <div class="webLayout_mainView">
      <div class="backTop f-center fz-xl bdr-xl boxShadow doNotPrint" @click="backTop">
        <i class="ico-rounded-left"></i>
      </div>
      <nav class="topNavBar boxShadow">
        <!--搜索框 伸縮按鈕 PC 不顯示 -->
        <button class="topNavBar__btn" @click="isSideMenuShow = true">
          <i class="ico-settings"></i>
        </button>
        <router-link to="/" class="topNavBar__logo"></router-link>
        <div class="topNavBar__btn"></div>
      </nav>
      <router-view
        :city="city"
        :mode="mode"
        @setMode="setMode"
        :key="$route.fullPath"
      ></router-view>
      <footer class="footer f-around">
        <p><i class="icoTW-main-island footer__twIcon"></i>TAIWAN TRAVEL</p>
        <div>
          <p>
            Front-End：
            <a href="#" target="_blank"> Pin Wei Chen </a>
          </p>
        </div>
        <p>Source: 交通部TDX運輸資料流通服務平臺</p>
        <a href="https://tdx.transportdata.tw/">
          <img
            src="./assets/images/tdx.logo.png"
            alt="交通部TDX運輸資料流通服務平臺"
            class="footer__tdx"
          />
        </a>
      </footer>
    </div>
  </div>
</template>
<script>
import { ref } from "@vue/reactivity";
import { watch, onMounted } from "@vue/runtime-core";
import Header from "./components/Header.vue";
import { modeLib } from "./store/init";
import { useStore } from "vuex";
export default {
  name: "App",
  components: { Header },
  setup() {
    const store = useStore();
    const getTokenApi = () => {
      store.dispatch("data/asyncUpdate");
      setInterval(() => {
        getTokenApi();
      }, 10 * 60 * 1000); //每十分钟刷新
    };
    const isSideMenuShow = ref(false);
    const city = ref("Taiwan");
    const mode = ref("ScenicSpot");
    const backTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const setCity = (c) => (city.value = c);
    const setMode = (m) => (mode.value = m);
    const setModeColor = (color) => {
      document.documentElement.style.setProperty("--c-main", color);
      const themeColor = document.querySelector('meta[name="theme-color"]');
      themeColor.setAttribute("content", color);
    };
    watch(
      () => mode.value,
      () => setModeColor(modeLib[mode.value].color)
    );
    onMounted(() => {
      getTokenApi();
    });
    return {
      isSideMenuShow,
      city,
      setCity,
      backTop,
      mode,
      setMode,
      store,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./assets/scss/variables.scss";
.webLayout {
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: min(1440px, 100vw);
  margin: auto;
  box-sizing: border-box;
  @include pad {
    flex-wrap: wrap;
  }
  &__sideMenu {
    position: sticky;
    top: 0;
    width: 354px;
    height: 100vh;
    padding: 1.5rem;
    background-color: $c_light;
    box-sizing: border-box;
    overflow: auto;
    overscroll-behavior: contain;
    @include pad {
      position: fixed;
      z-index: 10;
      transform: translateX(-150%);
      transition: transform 0.5s;
    }
    @include mobile {
      width: 100vw;
    }
    &--show {
      @include pad {
        transform: translateX(0%);
      }
    }
  }
  &_mainView {
    flex: 1;
    box-sizing: border-box;
  }
}
.backTop {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: none;
  width: 40px;
  height: 40px;
  color: $c_light;
  background-color: $c_main;
  cursor: pointer;
  transform: rotate(90deg);
  z-index: 1;
}
.topNavBar {
  position: sticky;
  top: 0;
  display: none;
  justify-content: space-between;
  align-items: center;
  background-color: $c_light;
  z-index: 5;
  @include pad {
    display: flex;
  }
  &__btn {
    margin: 0 1rem;
    font-size: 1.8rem;
    color: $c_main;
    background-color: $c_secondary-light;
    border: none;
    border-radius: 0.5rem;
    outline: none;
  }
  &__logo {
    display: block;
    width: 100px;
    height: 70px;
    background: url(./assets/images/logo.png) no-repeat center center / contain;
  }
}
.footer {
  padding: 0.5rem;
  font-style: 1.1rem;
  color: $c_light;
  background-color: $c_main;
  @include mobile {
    & > * {
      width: 100%;
      margin-bottom: 0.5rem;
      text-align: center;
    }
    &__twIcon {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }
    &__tdx {
      width: 80px;
    }
  }
}
</style>
