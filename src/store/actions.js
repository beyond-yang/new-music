import { shuffle } from 'common/js/util.js'
import { playMode } from 'common/js/config.js'
import * as types from './mutation-types'

function findIndex(song, list) {
  return list.findIndex((item)=>{
    return song.id === item.id
  })
}
export const setPlay = ({ commit, state }, { songs, index }) => {
  if(state.mode === playMode.random) {
    let randomList = shuffle(songs)
    index = findIndex(songs[index], randomList)
    commit(types.SET_PLAT_LIST, randomList)
  } else {
    commit(types.SET_PLAT_LIST, songs)
  }
  commit(types.SET_PLAY_STATE, true),
  commit(types.SET_FULL_SCREEN, true),
  commit(types.SET_SEQUENCE_LIST, songs),
  commit(types.SET_CURRENT_INDEX, index)
}
export const randomPlay = ({commit}, { songs }) => {
  let randomList = shuffle(songs)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_PLAY_STATE, true),
  commit(types.SET_FULL_SCREEN, true),
  commit(types.SET_PLAT_LIST, randomList),
  commit(types.SET_SEQUENCE_LIST, songs),
  commit(types.SET_CURRENT_INDEX, 0)
}