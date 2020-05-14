import * as types from './mutation-types.js'
const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAY_STATE](state, playState) {
    state.playState = playState
  },
  [types.SET_FULL_SCREEN](state, fullScreen) {
    state.fullScreen = fullScreen
  },
  [types.SET_PLAT_LIST](state, playList) {
    state.playList = playList
  },
  [types.SET_SEQUENCE_LIST](state, sequenceList) {
    state.sequenceList = sequenceList
  },
  [types.SET_CURRENT_INDEX](state, currentIndex) {
    state.currentIndex = currentIndex
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_REC_SONG_INFO](state, recSongInfo) {
    state.recSongInfo = recSongInfo
  },
  [types.SET_RANK_ITEM](state, rankItem) {
    state.rankItem = rankItem
  }
}

export default mutations