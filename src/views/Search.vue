<template>
  <div class="search" v-if="loading === 1">
    <div class="banner boxShadow">
      <img class="banner-img" :src="getUrl()" alt="Travel Guide" title="Travel Guide" />
      <h1 class="banner-text" v-text="getTitle()"></h1>
    </div>
    <div class="mode">
      <router-link
        :to="getLink('ScenicSpot')"
        :class="['mode-btn bdr-sm', { active: mode === 'ScenicSpot' }]"
        replace
      >
        景點
      </router-link>
      <router-link
        :to="getLink('Restaurant')"
        :class="['mode-btn bdr-sm', { active: mode === 'Restaurant' }]"
        replace
      >
        餐飲
      </router-link>
      <router-link
        :to="getLink('Hotel')"
        :class="['mode-btn bdr-sm', { active: mode === 'Hotel' }]"
        replace
      >
        旅宿
      </router-link>
      <router-link
        :to="getLink('Activity')"
        :class="['mode-btn bdr-sm', { active: mode === 'Activity' }]"
        replace
      >
        活動
      </router-link>
    </div>
    <div :class="`card-${mode}`">
      <router-link
        :to="`/D/${item[`${mode}ID`]}/`"
        class="card bdr-sm"
        v-for="item in result"
        :key="item.ID"
      >
        <div class="card-box">
          <img
            class="card-img"
            :src="item.Picture.PictureUrl1"
            :alt="item.Picture.PictureDescription1 || item[`${mode}Name`]"
            onerror="this.style.display='none'"
          />
        </div>
        <div class="card-content">
          <h2 class="card-title" v-text="item[`${mode}Name`]"></h2>
          <p class="card-text" v-if="item.Date">
            <i class="ico-calendar"></i>
            <span v-text="' ' + item.Date"></span>
          </p>
          <p class="card-text" v-if="!item.Date && item.StartTime">
            <i class="ico-calendar"></i>
            <span v-text="' ' + item.StartTime + ' ~ '"></span>
            <span v-text="item.EndTime"></span>
          </p>
          <p class="card-text" v-if="item.OpenTime">
            <i class="ico-clock-time"></i>
            <span v-text="' ' + item.OpenTime.split('；')[0]"></span>
          </p>
          <p class="card-text" v-if="item.TickedInfo">
            <i class="ico-ticket"></i>
            <span v-text="' ' + item.TickedInfo"></span>
          </p>
          <p class="card-text" v-if="item.Address">
            <i class="ico-location-pin"></i>
            <span v-text="' ' + item.Location" v-if="item.Location"></span>
            <span v-text="' ' + item.Address"></span>
          </p>
          <p
            class="card-text"
            v-if="item.Class || item.Class1 || item.Class2 || item.Class3"
          >
            <i class="ico-tags"></i>
            <span class="card-tag bdr-sm" v-text="item.Class" v-if="item.Class"></span>
            <span class="card-tag bdr-sm" v-text="item.Class1" v-if="item.Class1"></span>
            <span class="card-tag bdr-sm" v-text="item.Class2" v-if="item.Class2"></span>
            <span class="card-tag bdr-sm" v-text="item.Class3" v-if="item.Class3"></span>
          </p>
        </div>
      </router-link>
    </div>
    <button :class="['loadBtn fz-md bdr-sm', { hide: loadBtn }]" @click="loadData">
      載入更多
    </button>
  </div>
  <div class="search" v-if="loading === 0">
    <div class="banner boxShadow">
      <img
        class="banner-loading"
        src="../assets/images/banner_Home.png"
        alt="Travel Guide"
        title="Travel Guide"
      />
      <h1 class="banner-text" v-text="getTitle()"></h1>
    </div>
    <div class="mode"></div>
    <Loading :loadMode="mode" :amount="parseInt(6)" />
  </div>
  <div class="search" v-if="loading === -1">
    <div class="banner boxShadow">
      <img class="banner-img" :src="getUrl()" alt="Travel Guide" title="Travel Guide" />
      <h1 class="banner-text" v-text="getTitle()"></h1>
    </div>
    <div class="mode">
      <router-link
        :to="getLink('ScenicSpot')"
        :class="['mode-btn bdr-sm', { active: mode === 'ScenicSpot' }]"
        replace
      >
        景點
      </router-link>
      <router-link
        :to="getLink('Restaurant')"
        :class="['mode-btn bdr-sm', { active: mode === 'Restaurant' }]"
        replace
      >
        餐飲
      </router-link>
      <router-link
        :to="getLink('Hotel')"
        :class="['mode-btn bdr-sm', { active: mode === 'Hotel' }]"
        replace
      >
        旅宿
      </router-link>
      <router-link
        :to="getLink('Activity')"
        :class="['mode-btn bdr-sm', { active: mode === 'Activity' }]"
        replace
      >
        活動
      </router-link>
    </div>
    <Error />
  </div>
</template>

<script>
import { onMounted, ref } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import Loading from "@/components/Loading.vue";
import Error from "@/components/Error.vue";
import { cityLib, modeLib } from "@/store/init";
import {  getTravelInfo, getNearbyInfo } from "@/api/tdx";
import { dataRegular } from "@/utils/array";
import { useStore } from "vuex";
export default {
  name: "Search",
  components: { Error, Loading },
  emits: ["setMode"],
  props: {
    mode: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(0);
    const route = useRoute();
    const router = useRouter();
    const parm = route.params;
    let pageIndex = 1;
    const result = ref([]);
    const loadBtn = ref(true);
    const verify = () => {
      if (parm.strict && parm.strict !== "T" && parm.strict !== "F") {
        return true;
      }
      if (Object.keys(modeLib).indexOf(parm.mode) < 0) {
        return true;
      }
      if (parm.city && !cityLib[parm.city]) {
        return true;
      }
      return false;
    };

    const loadData = async () => {
      if (verify()) {
        router.replace({ name: "Home" });
      }
      loadBtn.value = true;
      emit("setMode", parm.mode);
      const strict = parm.strict === "T";
      const mode = parm.mode;
      const perPage = 18;
      let str = `${mode}ID,${mode}Name,Address,Picture`;
      if (mode === "ScenicSpot") str += ",Class1,Class2,Class3,OpenTime,TicketInfo";
      if (mode === "Restaurant") str += ",Class,OpenTime";
      if (mode === "Hotel") str += ",Class";
      if (mode === "Activity") str += ",Class1,Class2";
      const req = {
        $top: perPage,
        $skip: (pageIndex - 1) * perPage,
        $format: "JSON",
        $select: str,
        $filter: `Picture/PictureUrl1 ne null`,
      };
      const reqT = Object.assign({}, req);
      // 如果有關鍵字
      if (parm.keyword) {
        let filter = "";
        parm.keyword.split(",").forEach((k) => {
          filter += ` or contains(${mode}Name,'${k}')`;
          if (!strict) {
            filter += ` or contains(Description,'${k}')`;
            filter += ` or contains(Address,'${k}')`;
          }
          if (mode === "Restaurant" || mode === "Hotel") {
            filter += ` or contains(Class,'${k}')`;
          }
          if (mode === "ScenicSpot" || mode === "Activity") {
            filter += ` or contains(Class1,'${k}') or contains(Class2,'${k}')`;
          }
          if (mode === "ScenicSpot") {
            filter += ` or contains(Class3,'${k}')`;
          }
        });
        filter = filter.replace(" or ", "");
        reqT.$filter += ` and (${filter})`;
      }
      let city = parm.city === "Taiwan" ? "" : `/${parm.city}`;
      const load = parm.city
        ? getTravelInfo(mode, city, store.getters["data/format"], reqT)
        : getNearbyInfo(mode,  store.getters["data/format"],{
            ...req,
            $spatialFilter: `nearby(${parm.lat},${parm.lon},50000)`,
          });
      await load
        .then((res) => {
          if (res.data.length === 0) throw new Error();
          if (res.data.length === 18) loadBtn.value = false;
          return dataRegular(res.data);
        })
        .then((data) => {
          result.value.push(...data);
          pageIndex += 1;
          setTimeout(() => (loading.value = 1), 500);
          if (pageIndex === 2) window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch(() => (loading.value = -1));
    };
    const getTitle = () => {
      if (parm.keyword) return parm.keyword.split(",").join(" ");
      else if (parm.city) return parm.city.replace(/[A-Z]/g, " $&");
      else return parm.mode;
    };
    const getUrl = () => require(`@/assets/images/banner_${props.mode}.png`);
    const getLink = (mode) => {
      return parm.city
        ? `/${mode}/${parm.strict}/${parm.city}/${parm.keywoed || ""}`
        : `/${mode}/${parm.lat}/${parm.lon}`;
    };
    onMounted(async () => {
      await loadData();
    });
    return {
      loading,
      loadBtn,
      result,
      loadData,
      getUrl,
      getTitle,
      getLink,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.search {
  padding: min(2rem, 4vw);
}
.banner {
  position: relative;
  width: 100%;
  height: min(300px, 40vw);
  background-color: $c_light;
  border-radius: 1rem;
  overflow: hidden;
  &-img {
    width: 100%;
    height: 100%;
    object-position: center left;
    object-fit: cover;
  }
  &-loading {
    width: 100%;
    height: 100%;
    object-position: center right;
    object-fit: contain;
  }
  &-text {
    position: absolute;
    top: 70%;
    left: 1em;
    color: $c_light;
    font-size: min(4rem, 5vw);
    font-weight: bold;
    text-shadow: 0 0 1rem #00000099;
    transform: translateY(-50%);
  }
}
.mode {
  margin: 1.5rem 0;
  @include pad {
    text-align: center;
  }
  &-btn {
    display: inline-block;
    margin: 0 min(0.5rem, 1.5vw);
    padding: 0.3rem 0.8rem;
    color: $c_main;
    border: 1px solid $c_main;
    text-decoration: none;
    cursor: pointer;
    &.active {
      color: $c_light;
      background-color: $c_main;
    }
  }
}
.loadBtn {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 0.4rem;
  color: $c_main;
  border: none;
  outline: none;
  transition: color 0.5s, background-color 0.5s;
  cursor: pointer;
  &.hide {
    opacity: 0;
  }
  &:hover {
    color: $c_light;
    background-color: $c_main;
  }
}
</style>
