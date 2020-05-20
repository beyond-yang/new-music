import { mapGetters, mapMutations } from "vuex"
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.playListHandler(this.playList)
  },
  activated() {
    this.playListHandler(this.playList)
  },
  watch: {
    playList(newplayList) {
      this.playListHandler(newplayList)
    }
  },
  methods: {
    playListHandler() {
      throw new Error('component must implement handlePlaylist method')
    }
  },
}

export const playerMixin = {
  computed: {
    playmodeIcon() {
      if(this.mode === playMode.sequence) {
        return 'icon-sequence'
      } else if(this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    ...mapGetters([
      'mode',
      "playList"
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode+1)%3
      this.setplayMode(mode)
      if(this.mode === playMode.random) {
        const randomPlayList = shuffle(this.playList)
        const index = this.findIndex(randomPlayList)
        this.setplayList(randomPlayList)
        this.setcurrentIndex(index)  
      } else {
        const sequenceList = this.sequenceList
        const index = this.findIndex(sequenceList)
        this.setplayList(sequenceList)
        this.setcurrentIndex(index)
      }
    },
    findIndex(list) {
      return list.findIndex((item)=>{
        return item.id === this.currentSong.id
      })
    },
    ...mapMutations({
      setplayMode: 'SET_PLAY_MODE',
      setplayList: 'SET_PLAT_LIST',
      setcurrentIndex: "SET_CURRENT_INDEX"
    })
  }
}