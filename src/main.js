import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
// import store from './store/index';
import store from './store'
import "@/assets/scss/_reset.scss"
import "@/assets/scss/_icons.scss"
import "@/assets/scss/_global.scss"
import "@/assets/scss/_print.scss"

createApp(App).use(router).use(store).mount('#app')
