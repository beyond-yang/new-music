import {playMode} from 'common/js/config.js'
const state = {
  singer: [],
  playState: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  recSongInfo: {},
  rankItem: {}
}

export default state