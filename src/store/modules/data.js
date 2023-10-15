import { getToken } from '@/api/tdx'
export default {
  namespaced: true,
  state: {
    token: null,
    num: 0,
  },
  mutations: {
    updateToken(state, val) {
      state.token = val.data.access_token
    },
    updateNum(state, val) {
      state.num = val
    },
  },
  actions: {
    asyncUpdate(store) {
      return new Promise((resolve, reject) => {
        getToken().then((res) => {
          if (res) {
            store.commit('updateToken', res)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    format(state) {
      return "Bearer " + state.token
    }
  }
}