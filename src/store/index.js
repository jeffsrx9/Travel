import { createStore } from 'vuex'

import global from './modules/global.js'
import data from './modules/data.js'

export default createStore({
  ...global,
  modules: {
    data,
  }
})
