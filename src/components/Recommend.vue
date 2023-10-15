<template>
  <!-- 根據mode 切換 class -->
  <div :class="`card-${recMode}`" v-if="loading === 1">
    <router-link
      class="card bdr-sm"
      v-for="item in result"
      :key="item[`${recMode}ID`]"
      :to="`/D/${item[`${recMode}ID`]}/`"
    >
      <div class="card-box">
        <img
          class="card-img"
          :src="item.Picture.PictureUrl1"
          :alt="item.Picture.PictureDescription1 || item[`${recMode}Name`]"
          onerror="this.style.display='none'"
        />
      </div>
      <div class="card-content">
        <h2 class="card-title" v-text="item[`${recMode}Name`]"></h2>
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
  <div v-if="loading === 0">
    <Loading :loadMode="recMode" :amount="parseInt(amount)" />
  </div>
  <div v-if="loading === -1">
    <Error />
  </div>
</template>
<script>
import Error from "@/components/Error.vue";
import Loading from "@/components/Loading.vue";
import { onMounted, ref } from "@vue/runtime-core";
import { dataFilter, dataRegular } from "@/utils/array";
import { getTravelInfo, getNearbyInfo } from "@/api/tdx";
import { useStore } from "vuex";
export default {
  name: "Recommend",
  components: { Error, Loading },
  props: {
    recMode: {
      type: String,
      default: "",
    },
    lat: {
      type: Number,
      default: 0,
    },
    lon: {
      type: Number,
      default: 0,
    },
    page: {
      type: Number,
      default: 1,
    },
    amount: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const store = useStore();
    const loading = ref(0);
    const result = ref(null);
    const loadData = async () => {
      const mode = props.recMode;
      const perPage = 18;
      let str = `${mode}ID,${mode}Name,Address,Picture`;
      if (mode === "ScenicSpot") str += ",Class1,Class2,Class3,OpenTime,TicketInfo";
      if (mode === "Restaurant") str += ",Class,OpenTime";
      if (mode === "Hotel") str += ",Class";
      if (mode === "Activity") str += ",Class1,Class2";
      const req = {
        $top: perPage,
        $skip: (props.page - 1) * perPage,
        $format: "JSON",
        $select: str,
        $filter: `Picture/PictureUrl1 ne null`,
      };
      const load = props.lat
        ? getNearbyInfo(mode, store.getters["data/format"], {
            ...req,
            $spatialFilter: `nearby(${props.lat},${props.lon},50000)`,
          })
        : getTravelInfo(mode, "", store.getters["data/format"], req);
      await load
        .then((res) => {
          if (res.data.length < 1) throw new Error();
          return dataFilter(res.data, props.amount);
        })
        .then((res) => dataRegular(res))
        .then((data) => {
          result.value = data;
          loading.value = 1;
        })
        .catch(() => {
          loading.value = -1;
        });
    };
    onMounted(() => {
      setTimeout(() => {
        if (!store.state.data.token) {
          store.dispatch("data/asyncUpdate").then(() => loadData());
        } else {
          loadData();
        }
      }, 200);
    });
    return {
      loading,
      result,
    };
  },
};
</script>
