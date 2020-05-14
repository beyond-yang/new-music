<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="filter" ref="filter"></div>
      <div class="play-wrapper" v-show="this.songs.length" ref="play">
        <div class="play" @click="randomPlayAll">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll
      :data="songs"
      class="scroll"
      ref="scroll"
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll="scroll"
    >
      <div class="songList-wrapper">
        <song-list :songs="songs" @selectItem="selectItem"></song-list>
      </div>
      <div class="loading-wrapper" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import { prefixStyle } from "common/js/dom.js";
import Loading from "base/loading/loading";
import { mapActions } from "vuex";
import {playlistMixin} from 'common/js/mixin.js'
const TOP_HEIGHT = 40;
const transform = prefixStyle("transform");
const backDrop = prefixStyle("backdrop-filter");
export default {
  mixins: [playlistMixin],
  data() {
    return {
      scrollY: 0
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    }
  },
  created() {
    this.listenScroll = true;
    this.probeType = 3;
  },
  mounted() {
    this.bgImageHeight = this.$refs.bgImage.clientHeight;
    this.$refs.scroll.$el.style.top = `${this.bgImageHeight}px`;
    this.$refs.bgLayer.style.top = `${this.bgImageHeight}px`;
  },
  methods: {
    playListHandler(playList) {
      const bottom = playList.length>0?"60px":""
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem(songs, index) {
      this.setPlay({ songs, index });
    },
    randomPlayAll() {
      this.randomPlay({ songs: this.songs });
    },
    ...mapActions(["setPlay", "randomPlay"])
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  watch: {
    scrollY(newY) {
      let perent = Math.abs(newY / this.bgImageHeight);
      let scale = 1;
      let blur = 0;
      let zIndex = 0;
      let translateDistance = Math.max(newY, -this.bgImageHeight + TOP_HEIGHT);
      this.$refs.bgLayer.style[
        transform
      ] = `translateY(${translateDistance}px)`;
      if (newY < translateDistance) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = "0px";
        this.$refs.bgImage.style.height = `${TOP_HEIGHT}px`;
        this.$refs.play.style.display = "none";
      } else {
        zIndex = 0;
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = "0px";
        this.$refs.play.style.display = "";
      }
      if (newY > 0) {
        scale = 1 + perent;
      } else {
        blur = Math.min(10 * perent, 10);
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.filter.style[backDrop] = `blur(${blur}px)`;
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.music-list
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color $color-background
  .back
    position absolute
    top 0
    left 0
    width 44px
    height 44px
    line-height 44px
    text-align center
    font-size 22px
    z-index 50
  .title
    position absolute
    top 10px
    left 50%
    width 80%
    text-align center
    transform translateX(-50%)
    font-size $font-size-large
    color $color-text
    z-index 50
  .bg-image
    position relative
    width 100%
    height 0
    padding-top 70%
    background-size cover
    transform-origin top
    z-index -1
    .filter
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      background-color $color-background-d
    .play-wrapper
      width 135px
      height 32px
      line-height 32px
      border 1px solid $color-theme
      border-radius 100px
      position absolute
      left 50%
      bottom 20px
      transform translateX(-50%)
      .play
        display flex
        justify-content center
        align-items center
        .icon-play
          font-size $font-size-medium-x
          vertical-align middle
        .text
          font-size $font-size-small
          margin-left 6px
  .bg-layer
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background-color $color-background
  .scroll
    position absolute
    top 0
    bottom 0
    width 100%
    .songList-wrapper
      padding 20px 30px
    .loading-wrapper
      position absolute
      top 30%
      left 50%
      transform translateX(-50%)
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>