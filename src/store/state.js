import {playMode} from 'common/js/config.js'
import {getSearch, getPlay} from 'common/js/cache.js'
const state = {
  singer: [],
  playState: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  recSongInfo: {},
  rankItem: {},
  searchHistory: getSearch(),
  palyHistory: getPlay()
}

export default state