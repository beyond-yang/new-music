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

export const insertSong = ({commit, state}, song) => {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playList[currentIndex]
  let fIndex = findIndex(song, playList)
  currentIndex++
  playList.splice(currentIndex, 0, song)
  if(fIndex>-1) {
    if(fIndex<currentIndex) {
      playList.splice(fIndex, 1)
      currentIndex--
    } else {
      playList.splice(fIndex+1, 1)
    }
  }
  let currentSIndex = findIndex(currentSong, sequenceList) + 1
  let fSIndex = findIndex(song, sequenceList)
  sequenceList.splice(currentSIndex, 0, song)
  if(fSIndex>-1) {
    if(fSIndex<currentSIndex) {
      sequenceList.splice(fSIndex, 1)
    } else {
      sequenceList.splice(fSIndex+1, 1)
    }
  }
  console.log(currentIndex) //  1
  commit(types.SET_PLAT_LIST, playList),
  commit(types.SET_SEQUENCE_LIST, sequenceList),
  commit(types.SET_CURRENT_INDEX, currentIndex),
  commit(types.SET_FULL_SCREEN, true),
  commit(types.SET_PLAY_STATE, true)
}