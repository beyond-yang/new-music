import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import * as getters from './getters.js'
import mutations from './mutations.js'
import * as actions from './actions.js'
import createLogger from 'vuex/dist/logger.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  plugins: [createLogger()]
})
