<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background-image">
          <img :src="currentSong.image" alt="背景图" width="100%" height="100%" />
        </div>
        <div class="top">
          <div class="back" @click="hide">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="imageWrapper">
                <img
                  class="image"
                  :class="rotateState"
                  :src="currentSong.image"
                  alt="歌手唱片"
                  width="80%"
                  ref="image"
                />
              </div>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <p :class="{active: currentLineNum===index}" class="lyric" v-for="(item, index) in currentLyric.lines" :key="item.time">{{item.txt}}</p>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dots-wrapper">
            <span class="dot" :class="{active: currentPage==='cd'}"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{timeFormat(currentTime)}}</span>
            <div class="progress-bar-wrapper" ref="progressBarWrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{timeFormat(currentSong.duration)}}</span>
          </div>
          <div class="control">
            <div class="icon i-left">
              <i :class="playmodeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="show">
        <div class="icon">
          <div class="img-wrapper" ref="miniWrapper">
            <img
              ref="miniImage"
              :class="rotateState"
              :src="currentSong.image"
              alt="mini播放器图片"
              width="40"
              height="40"
            />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="singer" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="playIcon+'-mini'" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "common/js/dom.js";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
const transform = prefixStyle("transform");
export default {
  data() {
    return {
      readyFlag: false,
      currentTime: 0,
      radius: 32,
      currentPage: 'cd',
      currentLyric: '',
      currentLineNum: 0
    };
  },
  computed: {
    rotateState() {
      return this.playState ? "play" : "pause";
    },
    playIcon() {
      return this.playState ? "icon-pause" : "icon-play";
    },
    playmodeIcon() {
      if(this.mode === playMode.sequence) {
        return 'icon-sequence'
      } else if(this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    disableCls() {
      return !this.readyFlag ? "disabled" : "";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      "playList",
      "currentSong",
      "fullScreen",
      "currentSong",
      "playState",
      "currentIndex",
      "mode",
      "sequenceList"
    ])
  },
  watch: {
    playState(newState) {
      if (!newState) {
        if (this.fullScreen) {
          this.syncWrapperTransform("imageWrapper", "image");
        } else {
          this.syncWrapperTransform("miniWrapper", "miniImage");
        }
      }
      if (newState) {
        this.$nextTick(() => {
          this.$refs.audio.play();
        });
      } else {
        this.$refs.audio.pause();
      }
    },
    currentSong(newSong) {
      if (newSong) {
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric()
        });
      }
    }
  },
  methods: {
    getLyric() {
      this.currentSong.getLyric().then((lyric)=>{
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if(this.playState) {
          this.currentLyric.play()
        }
        
      })
    },
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
    },
    hide() {
      this.setfullScreen(false);
    },
    show() {
      this.setfullScreen(true);
    },
    togglePlaying() {
      this.setPlayState(!this.playState);
    },
    prev() {
      if (!this.readyFlag) {
        return;
      }
      let currentIndex = this.currentIndex - 1;
      if (currentIndex === -1) {
        currentIndex = this.playList.length - 1;
      }
      this.setcurrentIndex(currentIndex);
      if (!this.playState) {
        this.togglePlaying();
      }
      this.readyFlag = false;
    },
    next() {
      if (!this.readyFlag) {
        return;
      }
      let currentIndex = this.currentIndex + 1;
      if (currentIndex === this.playList.length) {
        currentIndex = 0;
      }
      this.setcurrentIndex(currentIndex);
      if (!this.playState) {
        this.togglePlaying();
      }
      this.readyFlag = false;
    },
    loop() {
      this.currentTime = 0;
      this.$nextTick(()=>{
        this.$refs.audio.play();
      })
    },
    end() {
      if(this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next();
      }
    },
    ready() {
      this.readyFlag = true;
    },
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
    error() {
      this.readyFlag = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    percentChange(newPercent) {
      if (newPercent && !this.playState) {
        this.togglePlaying();
      }
      this.$refs.audio.currentTime = newPercent * this.currentSong.duration;
    },
    timeFormat(time) {
      let minute = (time / 60) | 0;
      let seconds = time % 60 | 0;
      return `${minute}:${seconds.toString().padStart(2, 0)}`;
    },
    /**
     * 计算内层Image的transform，并同步到外层容器
     * @param wrapper
     * @param inner
     */
    syncWrapperTransform(wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return;
      }
      let imageWrapper = this.$refs[wrapper];
      let image = this.$refs[inner];
      let wTransform = getComputedStyle(imageWrapper)[transform];
      let iTransform = getComputedStyle(image)[transform];
      imageWrapper.style[transform] =
        wTransform === "none" ? iTransform : iTransform.concat(" ", wTransform);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.2)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style.transform = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations({
      setfullScreen: "SET_FULL_SCREEN",
      setPlayState: "SET_PLAY_STATE",
      setcurrentIndex: "SET_CURRENT_INDEX",
      setplayMode: 'SET_PLAY_MODE',
      setplayList: 'SET_PLAT_LIST'
    })
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.player
  .normal-player
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 150
    background-color $color-background
    .background-image
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      filter blur(20px)
      z-index -1
      opacity 0.6
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0px
        left 6px
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          transform rotate(-90deg)
      .title
        line-height 40px
        width 70%
        margin 0 auto
        font-size $font-size-large
        text-align center
        color $color-text
      .subtitle
        text-align center
        line-height 20px
        color $color-text
        font-size $font-size-medium
    .middle
      position fixed
      top 88px
      bottom 160px
      width 100%
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          top 0
          left 10%
          width 80%
          height 100%
          box-sizing border-box
          .cd
            width 100%
            height 100%
            border-radius 50%
            .image
              width 100%
              height 100%
              box-sizing border-box
              border-radius 50%
              border 10px solid rgba(255, 255, 255, 0.1)
              &.play
                animation rotate 20s linear infinite
              &.pause
                animation-play-state paused
      .middle-r
        overflow hidden
        position absolute
        top 0
        left 0
        display inline-block
        width 100%
        height 100%
        .lyric-wrapper
          width 100%
          .lyric
            text-align center
            line-height 32px
            font-size $font-size-medium
            color $color-text-l
            &.active
              color $color-text
    .bottom
      position absolute
      left 0
      bottom 50px
      width 100%
      .dots-wrapper
        position absolute
        bottom 100px
        left 50%
        transform translateX(-50%)
        .dot
          display inline-block
          width 8px
          height 8px
          border-radius 50%
          background-color $color-text-l
          margin 0 4px
          &.active
            width 20px
            border-radius 30%
            background-color $color-text-ll
      .progress-wrapper
        display flex
        position absolute
        bottom 50px
        left 50%
        transform translateX(-50%)
        width 80%
        padding 10px 0
        .time
          flex 0 0 30px
          height 30px
          line-height 30px
          width 100%
          font-size $font-size-small
          color $color-text
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex 1
      .control
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.disabled
            color $color-theme-d
          i
            font-size 30px
        .i-left
          text-align right
        .i-center
          text-align center
          padding 0 20px
          i
            font-size 40px
        .i-right
          text-align left
        .icon-favorite
          $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100%, 0)
      .bottom
        transform translate3d(0, 100%, 0)
  .mini-player
    display flex
    align-items center
    position fixed
    bottom 0
    left 0
    z-index 200
    height 60px
    width 100%
    background-color $color-height-background
    .icon
      flex 0 0 40px
      width 40px
      height 40px
      padding 0 10px 0 20px
      .img-wrapper
        width 100%
        height 100%
        img
          border-radius 50%
          &.play
            animation rotate 10s linear infinite
          &.pause
            animation-play-state paused
    .text
      flex 1
      display flex
      flex-direction column
      line-height 20px
      .name
        font-size $font-size-medium
        color $color-text
      .singer
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color $color-theme-d
      .icon-mini
        font-size 32px
        position absolute
        top 0
        left 0
@keyframes rotate
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)
</style>