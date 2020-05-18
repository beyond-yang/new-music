import state from "./state"

export const singer = state => state.singer

export const playState = state => state.playState

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const currentIndex = state => state.currentIndex

export const mode = state => state.mode

export const currentSong = state => {
  return state.playList[state.currentIndex]||{}
}

export const recSongInfo = state => state.recSongInfo

export const rankItem = state => state.rankItem

export const searchHistory = state => state.searchHistory