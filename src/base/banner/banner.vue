<template>
  <div class="banner" ref="banner">
    <div class="banner-group" ref="bannerGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <ul>
        <li
          v-for="(item, index) in dots"
          :key="index"
          class="dot"
          :class="{active: currentPage===index}"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { addClass } from "common/js/dom.js";
import BScroll from "better-scroll";
export default {
  data() {
    return {
      dots: [],
      currentPage: 0
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interal: {
      type: Number,
      default: 3000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setBannerWidth();
      this._initDots();
      this._initBanner();
      if (this.autoPlay) {
        this._play();
      }
      window.addEventListener("resize", () => {
        this._setBannerWidth(true);
      });
    }, 20);
  },
  methods: {
    _setBannerWidth(isResize) {
      let width = 0;
      let bannerWidth = this.$refs.banner.clientWidth;
      let bannerGroup = this.$refs.bannerGroup;
      this.bannerItems = bannerGroup.children;
      for (var i = 0; i < this.bannerItems.length; i++) {
        width += bannerWidth;
        this.bannerItems[i].style.width = bannerWidth + "px";
        addClass(this.bannerItems[i], "banner-item");
      }
      if (this.loop && !isResize) {
        width += 2 * bannerWidth;
      }
      bannerGroup.style.width = width + "px";
    },
    _initDots() {
      this.dots = new Array(this.bannerItems.length);
    },
    _initBanner() {
      this.banner = new BScroll(this.$refs.banner, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });
      this.banner.on("scrollEnd", () => {
        let pageIndex = this.banner.getCurrentPage().pageX;
        this.currentPage = pageIndex;
        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.banner.next();
      }, this.interal);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.banner
  position relative
  min-height 1px
  overflow hidden
  .banner-group
    overflow hidden
    white-space nowrap
    .banner-item
      float left
      box-sizing border-box
      overflow hidden
      text-align center
      a
        display block
        width 100%
        overflow hidden
        text-decoration none
        img
          display block
          width 100%
  .dots
    position absolute
    left 0
    bottom 10px
    display flex
    justify-content center
    width 100%
    .dot
      float left
      width 8px
      height 8px
      background $color-text-l
      border-radius 50%
      margin 0 4px
    .active
      width 20px
      background-color $color-text-ll
      border-radius 30%
</style>