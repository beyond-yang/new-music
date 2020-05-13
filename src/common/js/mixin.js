import { mapGetters } from "vuex"

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