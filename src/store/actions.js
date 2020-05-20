import { shuffle } from 'common/js/util.js'
import { playMode } from 'common/js/config.js'
import * as types from './mutation-types'
import {saveSearch, deleteOneSearch, clearSearch, savePlay} from 'common/js/cache.js'

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

export const saveSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteOneSearchHistory = ({commit}, item) => {
  commit(types.SET_SEARCH_HISTORY, deleteOneSearch(item))
}

export const clearSearchHistory = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = ({commit, state}, song) => {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let fIndex = findIndex(song, playList)
  playList.splice(fIndex, 1)
  let fSIndex = findIndex(song, sequenceList)
  sequenceList.splice(fSIndex, 1)
  if(currentIndex>fIndex || currentIndex===playList.length-1) {
    currentIndex --
  }
  commit(types.SET_PLAT_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if(!playList.length) {
    commit(types.SET_PLAY_STATE, false)
  } else {
    commit(types.SET_PLAY_STATE, true)
  }
}

export const playSong = ({commit, state}, song) => {
  const playList = state.playList.slice()
  const index = findIndex(song, playList)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAY_STATE, true)
}

export const clearSongList = ({commit}) => {
  commit(types.SET_PLAT_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAY_STATE, false)
  commit(types.SET_CURRENT_INDEX, -1)
}

export const savePlayHistory = ({commit}, song) => {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}