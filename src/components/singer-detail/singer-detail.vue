<template>
  <transition appear name="slide">
    <div class="singer-detail">歌手详情页</div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/song.js'
export default {
  data() {
    return {
      songList: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getSingerDetail(this.singer.id)
    console.log(this.singer.id)
  },
  methods: {
    _getSingerDetail(singerId) {
      if(!singerId) {
        this.$router.push('/singer')
      }
      getSingerDetail(singerId).then((res)=>{
        if(res.code === ERR_OK) {
          this.songList = this._normalizeSonglist(res.data.list)
          console.log(this.songList)
        }
      })
    },
    _normalizeSonglist(list) {
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        ret.push(createSong(musicData))
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
  .singer-detail
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background-color $color-background
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
