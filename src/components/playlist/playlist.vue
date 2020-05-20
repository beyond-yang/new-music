<template>
  <transition name="slide">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper">
        <div class="list-header">
          <span class="mode">
            <i :class="playmodeIcon" @click.stop="changeMode"></i>
          </span>
          <span class="text">{{iconText}}</span>
          <span class="icon" @click.stop="showConfirm">
            <i class="icon-clear"></i>
          </span>
        </div>
        <scroll class="list-content" ref="list">
          <transition-group tag="ul" name="list">
            <li ref="item" class="item" v-for="(item, index) in sequenceList" :key="item.id">
              <span class="play"><i class="icon" :class="getCurrentIcon(item)"></i></span>
              <span class="text" @click.stop="selectItem(item, index)">{{item.name}}</span>
              <span class="like"><i class="icon icon-not-favorite"></i></span>
              <span class="delete" @click.stop="deleteOne(item)"><i class="icon icon-delete"></i></span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="operate">
            <span>
              <i class="icon-add"></i>
            </span>
            <span class="text" @click.stop="addSong">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span class="close">关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" @confirm="confirm"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import {playerMixin} from 'common/js/mixin.js'
import {playMode} from 'common/js/config.js'
import AddSong from 'components/add-song/add-song'
export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    iconText() {
      return this.mode === playMode.sequence?'顺序播放':this.mode === playMode.loop?'单曲循环':'随机播放'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      this.$refs.list.scrollToElement(0)
    },
    hide() {
      this.showFlag = false
    },
    deleteOne(item) {
      this.deleteSong(item)
    },
    selectItem(item, index) {
      if(this.currentSong.id === item.id) {
        return
      }
      this.playSong(item)
      this.$refs.list.scrollToElement(this.$refs.item[index], 1000)
    },
    getCurrentIcon(item) {
      if(this.currentSong.id === item.id) {
        return 'icon-play'
      } else {
        return ''
      }
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirm() {
      this.clearSongList()
      this.showFlag = false
    },
    addSong() {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'deleteSong',
      'playSong',
      'clearSongList'
    ])
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
@import './../../common/stylus/mixin.styl'
.playlist
  position fixed
  bottom 0
  left 0
  right 0
  top 0
  z-index 999
  background-color $color-background-d
  &.slide-enter-active, &.slide-leave-active
    transition opacity 0.3s
    .list-wrapper
      transition all 0.3s
  &.slide-enter, &.slide-leave-to
    opacity 0
    .list-wrapper
      transform translate3d(0, 100%, 0)
  .list-wrapper
    position absolute
    left 0
    right 0
    bottom 0
    background-color $color-height-background
    .list-header
      display flex
      align-items center
      height 30px
      padding 20px 30px 10px 20px
      color $color-text-l
      .mode
        flex 0 0 30px
        font-size 30px
        color $color-theme-d
        padding-right 10px
      .text
        flex 1
        font-size $font-size-medium
      .icon
        extend-click()
        flex 0 0 16px
        font-size $font-size-medium
    .list-content
      overflow hidden
      padding 0 30px 0 20px
      max-height 200px
      .item
        display flex
        align-items center
        height 40px
        font-size $font-size-medium
        &.list-enter-active, &.list-leave-active
          transition all 0.1s
        &.list-enter, &.list-leave-to
          height 0
        .play
          width 25px
          color $color-theme-d 
        .like
          extend-click()
          margin-right 15px
        .delete
          extend-click()
          .icon
            flex 0 0 12px
        .text
          flex 1
          color $color-text-d
    .list-operate
      .operate
        width 140px
        height 30px
        line-height 30px
        border 1px solid $color-text-l
        border-radius 15px
        margin 30px auto
        font-size $font-size-small
        text-align center
        color $color-text-l
        .text
          margin-left 6px
    .list-close
      width 100%
      height 50px
      line-height 50px
      text-align center
      background-color $color-background
      .close  
        font-size $font-size-medium-x
        color $color-text-l
</style>