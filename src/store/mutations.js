import * as type from './mutation-types.js'
const mutations = {
  [type.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default mutations