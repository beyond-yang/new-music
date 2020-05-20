<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="close">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box @query="getQuery" :searchkey="query"></search-box>
      </div>
      <div class="switches-wrapper" v-show="!query">
        <switches :switches="switches" @change="change"></switches>
      </div>
      <div class="songlist-wrapper" v-show="!query">
        <scroll :data="palyHistory" class="recent" v-show="currentIndex===0">
          <song-list :songs="palyHistory"></song-list>
        </scroll>
        <scroll :data="searchHistory" class="history" v-show="currentIndex===1">
          <search-list :searchList="searchHistory" @deleteOne="deleteOne" @select="select"></search-list>
        </scroll>
      </div>
      <div class="suggest-wrapper" v-show="query">
        <suggest @select="saveSearch" :query="query"></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Scroll from 'base/scroll/scroll'
import {mapGetters, mapActions} from 'vuex'
export default {
  data() {
    return {
      showFlag: false,
      query: '',
      currentIndex: 0,
      switches: ['最近播放', '搜索历史']
    }
  },
  computed: {
    ...mapGetters([
      'palyHistory',
      'searchHistory'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    close() {
      this.hide()
    },
    getQuery(newQuery) {
      this.query = newQuery
    },
    change(index) {
      this.currentIndex = index
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    deleteOne(item) {
      this.deleteOneSearchHistory(item)
    },
    select(item) {
      this.query = item
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteOneSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Switches,
    SongList,
    Suggest,
    SearchList,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
.add-song
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 66
  background-color $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .header
    height 44px
    line-height 44px
    .title  
      text-align center
      font-size $font-size-large 
      color $color-text
    .close
      position absolute
      top 0
      right 5px
      width 44px
      height 44px
      font-size 20px
      text-align center  
  .search-box-wrapper
    margin 20px
  .songlist-wrapper
    position fixed
    top 164px
    left 0
    right 0
    bottom 0
    padding 20px 30px
    overflow hidden
    .recent
      height 100%
      width 100%
  .suggest-wrapper
    position fixed
    top 124px
    left 0
    bottom 0
    right 0
    overflow hidden
</style>