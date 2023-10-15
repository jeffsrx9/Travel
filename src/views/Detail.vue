<template>
  <div class="detail" v-if="loading === 1">
    <!-- 頂部 -->
    <div class="detail-title f-between">
      <!-- 返回 -->
      <div class="f-between" @click="hasHistory() ? $router.go(-1) : $router.push('/')">
        <button class="detail-btn">
          <i class="ico-rounded-left"></i>
        </button>
        <h1 class="fz-xxl" v-text="result[`${mode}Name`]"></h1>
      </div>
      <!-- 列印 -->
      <div>
        <button class="detail-btn" onclick="window.print()">
          <i class="ico-print"></i>
        </button>
      </div>
    </div>
    <SlideShow :pic="result.Picture" :name="result[`${mode}Name`]" />
    <h2 class="fz-md c-main">
      <i class="ico-info-square"></i>
      <span v-text="` ${result.modeName}資訊`"></span>
    </h2>
    <div class="detail-info bdr-sm">
      <p v-if="result.Date">
        <i class="ico-calendar"></i>
        <span> 活動日期：</span>
        <span v-text="result.Date"></span>
      </p>
      <p v-if="!result.Date && result.StartTime">
        <i class="ico-calendar"></i>
        <span> 活動期間：</span>
        <span v-text="result.StartTime + ' ~ '"></span>
        <span v-text="result.EndTime"></span>
      </p>
      <p v-if="result.OpenTime">
        <i class="ico-clock-time"></i>
        <span> 開放時段：</span>
        <span v-text="result.OpenTime"></span>
      </p>
      <p v-if="result.TicketInfo">
        <i class="ico-ticket"></i>
        <span> 門票費用：</span>
        <span v-text="result.TicketInfo"></span>
      </p>
      <p v-if="result.Address">
        <i class="ico-location-pin"></i>
        <span v-text="` ${result.modeName}地點：`"></span>
        <span v-text="`${result.Location} `" v-if="result.Location"></span>
        <span v-text="result.Address"></span>
      </p>
      <p v-if="result.Phone">
        <i class="ico-ui-touch-phone"></i>
        <span> 聯絡電話：</span>
        <a :href="`tel:${result.Phone}`" v-text="result.Phone"></a>
      </p>
      <p v-if="result.WebsiteUrl">
        <i class="ico-earth"></i>
        <span> 官方網站：</span>
        <a :href="result.WebsiteUrl" target="_blank">點我前往</a>
      </p>
      <p v-if="result.Organizer">
        <i class="ico-people"></i>
        <span> 主辦單位：</span>
        <span v-text="result.Organizer"></span>
      </p>
      <p v-if="result.Cycle">
        <i class="ico-ui-text-chat"></i>
        <span> 備註說明：</span>
        <span v-text="result.Cycle"></span>
      </p>
      <p v-if="result.Class || result.Class1 || result.Class2 || result.Class3">
        <i class="ico-tags"></i>
        <span v-text="` ${result.modeName}標籤: `"></span>
        <router-link
          :to="`/${mode}/T/${city}/${result.Class}/`"
          class="detail-tag bdr-sm"
          v-text="result.Class"
          v-if="result.Class"
        ></router-link>
        <router-link
          :to="`/${mode}/T/${city}/${result.Class1}/`"
          class="detail-tag bdr-sm"
          v-text="result.Class1"
          v-if="result.Class1"
        ></router-link>
        <router-link
          :to="`/${mode}/T/${city}/${result.Class2}/`"
          class="detail-tag bdr-sm"
          v-text="result.Class2"
          v-if="result.Class2"
        ></router-link>
        <router-link
          :to="`/${mode}/T/${city}/${result.Class3}/`"
          class="detail-tag bdr-sm"
          v-text="result.Class3"
          v-if="result.Class3"
        ></router-link>
      </p>
    </div>
    <h2 class="fz-md c-main">
      <i class="ico-google-talk"></i>
      <span v-text="` ${result.modeName}介紹`"></span>
    </h2>
    <pre class="detail-pre" v-text="result.DescriptionDetail || result.Description"></pre>
    <h2 class="fz-md c-main"><i class="ico-bus"></i> 交通方式</h2>
    <pre class="detail-pre" v-text="result.TravelInfo"></pre>
    <pre class="detail-pre" v-text="result.ParkingInfo"></pre>
    <div class="bdr-sm doNotPrint">
      <iframe
        width="100%"
        height="200"
        loading="lazy"
        v-if="mode === 'Activity'"
        :src="`https://maps.google.com/maps?q=${result.Position.PositionLat},${result.Position.PositionLon}&hl=zh-TW&z=16&amp;output=embed`"
      >
      </iframe>
      <iframe
        width="100%"
        height="250"
        loading="lazy"
        v-else
        :src="`https://maps.google.com/maps?q=${result[`${mode}Name`]}+${result[
          `${mode}Name`
        ]
          .split('')
          .join('+')}&hl=zh-TW&z=16&amp;output=embed`"
      >
      </iframe>
    </div>
    <div class="space"></div>
    <div class="f-between c-sce">
      <h2 class="fz-md"><i class="ico-beach"></i> 查看鄰近的景點</h2>
      <router-link
        :to="`/ScenicSpot/${result.Position.PositionLat}/${result.Position.PositionLon}/`"
        class="detail-more"
      >
        More
      </router-link>
    </div>
    <Recommend
      recMode="ScenicSpot"
      :lat="result.Position.PositionLat"
      :lon="result.Position.PositionLon"
      :page="parseInt(1)"
      amount="3"
    />
    <div class="f-between c-res">
      <h2 class="fz-md"><i class="ico-restaurant"></i> 查看鄰近的餐飲</h2>
      <router-link
        :to="`/Restaurant/${result.Position.PositionLat}/${result.Position.PositionLon}/`"
        class="detail-more"
      >
        More
      </router-link>
    </div>
    <Recommend
      recMode="Restaurant"
      :lat="result.Position.PositionLat"
      :lon="result.Position.PositionLon"
      :page="parseInt(1)"
      amount="3"
    />
    <div class="f-between c-htl">
      <h2 class="fz-md"><i class="ico-hotel"></i> 查看鄰近的旅宿</h2>
      <router-link
        :to="`/Hotel/${result.Position.PositionLat}/${result.Position.PositionLon}/`"
        class="detail-more"
      >
        More
      </router-link>
    </div>
    <Recommend
      recMode="Hotel"
      :lat="result.Position.PositionLat"
      :lon="result.Position.PositionLon"
      :page="parseInt(1)"
      amount="2"
    />
    <div class="f-between c-act">
      <h2 class="fz-md"><i class="ico-flag-alt-2"></i> 查看鄰近的活動</h2>
      <router-link
        :to="`/Activity/${result.Position.PositionLat}/${result.Position.PositionLon}/`"
        class="detail-more"
      >
        More
      </router-link>
    </div>
    <Recommend
      recMode="Activity"
      :lat="result.Position.PositionLat"
      :lon="result.Position.PositionLon"
      :page="parseInt(1)"
      amount="4"
    />
  </div>
  <div class="detail" v-if="loading <= 0">
    <Error v-if="loading === -1" />
    <div class="loading-title bdr-sm"></div>
    <div class="loading-box bdr-xl"></div>
    <div class="loading-title bdr-sm"></div>
    <div class="loading-text bdr-sm"></div>
    <div class="loading-tetx bdr-sm"></div>
    <div class="loading-text bdr-sm"></div>
    <div class="loading-title bdr-sm"></div>
    <div class="loading-text bdr-sm"></div>
    <div class="loading-text bdr-sm"></div>
    <div class="loading-text bdr-sm"></div>
  </div>
</template>

<script>
import { onMounted, ref } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { getOneDetail } from "@/api/tdx";
import { getMode } from "@/utils/string";
import Error from "@/components/Error.vue";
import Recommend from "@/components/Recommend.vue";
import SlideShow from "@/components/SlideShow.vue";
import { useStore } from "vuex";
export default {
  name: "Detail",
  components: { Recommend, Error, SlideShow },
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
    const hasHistory = () => window.history.length > 2;
    const route = useRoute();
    const router = useRouter();
    const result = ref(null);
    const loadData = async () => {
      if (!route.params.ID) router.replace({ name: "Home" });
      await getOneDetail(`${getMode(route.params.ID, true)}`, store.getters["data/format"], {
        $format: "JSON",
        $filter: `${getMode(route.params.ID, true)}ID eq '${route.params.ID}'`,
      })
        .then((res) => {
          let data = res.data;
          if (data.length == 0) throw new Error();
          data[0].modeName = getMode(data[0][getMode(route.params.ID, true) + "ID"]);
          if (data[0].Description)
            data[0].Description = data[0].Description.split("。").join("。\n\n");
          if (data[0].DescriptionDetail)
            data[0].DescriptionDetail = data[0].DescriptionDetail.split("。").join(
              "。\n\n"
            );
          if (data[0].TravelInfo)
            data[0].TravelInfo = data[0].TravelInfo.split("。").join("。\n\n");
          if (data[0].ParkingInfo) data[0].ParkingInfo = data[0].ParkingInfo + "\n\n";
          if (data[0].StartTime) data[0].StartTime = data[0].StartTime.split("T")[0];
          if (data[0].EndTime) data[0].EndTime = data[0].EndTime.split("T")[0];
          if (data[0].StartTime === data[0].EndTime) data[0].Date = data[0].EndTime;
          data[0].getMode = getMode(route.params.ID, true);
          return data[0];
        })
        .then((data) => {
          emit("setMode", data.getMode);
          return data;
        })
        .then((data) => {
          if (!data[`${props.mode}ID`]) throw new Error();
          result.value = data;
          document.title = result.value[`${props.mode}Name`] + " - Travel Guide";
          setTimeout(() => (loading.value = 1), 500);
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch(() => (loading.value = -1));
    };
    onMounted(() => {
      loadData();
    });
    return {
      loading,
      result,
      hasHistory,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";
.detail {
  padding: min(2rem, 4vw);
  &-title {
    justify-content: flex-end;
    > *:nth-child(1) {
      margin-right: auto;
    }
  }
  &-btn {
    margin: 0 min(0.5rem, 1vw);
    padding: 0.3rem 0.5rem;
    font-size: 1.5rem;
    color: $c_main;
    background-color: transparent;
    border-radius: 0.5rem;
    border: none;
    outline: none;
    cursor: pointer;
    &:hover {
      color: $c_light;
      background-color: $c_main;
    }
  }
  &-info {
    padding: min(1rem, 3vw);
    background: linear-gradient(to right, #ffffffdd, #ffffffdd), $c_main;
    > p {
      margin-left: 6.2rem;
      padding-bottom: 0.5rem;
      text-indent: -6.2rem;
      white-space: break-spaces;
    }
  }
  &-pre {
    padding: 0 min(1rem, 3vw);
    text-align: justify;
    white-space: pre-line;
  }
  &-tag {
    margin: 0 0.3rem;
    padding: 0.2rem 0.5rem 0.3rem;
    line-height: 3rem;
    color: $c_dark;
    background-color: $c_main;
    white-space: nowrap;
    text-decoration: none;
    transition: color 0.5s;
    &:hover {
      color: $c_light;
    }
  }
  &-more {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.space {
  position: relative;
  margin: 3rem auto;
  width: 15px;
  height: 15px;
  background-color: $c_main;
  transform: rotate(45deg);
  &::before,
  &::after {
    position: absolute;
    content: "";
    top: 0;
    width: 15px;
    height: 15px;
    background-color: $c_main;
    transform: translate(-50px, 50px);
  }
  &::after {
    transform: translate(50px, -50px);
  }
}
.loading {
  &-box {
    @include background;
    padding-top: 300px;
  }
  &-title {
    @include background;
    width: 40%;
    max-width: 500px;
    height: 3rem;
    margin: 1rem 0;
    animation-delay: 0.08s;
  }
  &-text {
    @include background;
    min-height: 1.5rem;
    margin-bottom: 0.5rem;
    animation-delay: 0.1s;
  }
}
</style>
