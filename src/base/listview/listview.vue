<template>
  <scroll
    class="listview"
    :data="listArray"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul class="listContainer">
      <li v-for="item in listArray" :key="item.title" ref="listviewItems">
        <div class="title">{{item.title}}</div>
        <ul>
          <li
            class="singerItem"
            v-for="child in item.item"
            :key="child.id"
            @click="selectItem(child)"
          >
            <img width="50" height="50" v-lazy="child.avatar" alt="歌手图片" />
            <span class="name">{{child.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut" @touchstart="onshortcutTouchstart" @touchmove="onshortcutTouchmove">
      <ul>
        <li
          class="short-item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{active: currentIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTilte" ref="fixedTitle">
      <div>{{fixedTilte}}</div>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import "./../../common/stylus/variable.styl";
import { getData } from "common/js/dom.js";
import {playlistMixin} from 'common/js/mixin.js'
const SHORT_CUT_ITEM_HEIGHT = 18;
const FIXED_TITLE_HEIGHT = 30;
export default {
  mixins: [playlistMixin],
  data() {
    return {
      scrollY: -1,
      scrollHeight: [],
      currentIndex: 0,
      diff: -1
    };
  },
  props: {
    listArray: {
      type: Array,
      default: null
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.probeType = 3;
  },
  mounted() {
    // console.log(this.shortcutList)
  },
  computed: {
    shortcutList() {
      return this.listArray.map(item => {
        return item.title.substr(0, 1);
      });
    },
    fixedTilte() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.listArray[this.currentIndex]
        ? this.listArray[this.currentIndex].title
        : "";
    }
  },
  methods: {
    playListHandler(playList) {
      const bottom = playList.length>0?"60px": ""
      this.$refs.listview.$el.style.bottom = bottom
      this.$refs.listview.refresh()
    },
    onshortcutTouchstart(e) {
      // 获取点击元素的索引值
      let index = parseInt(getData(e.target, "index"));
      this.touch.index = index;
      this.touch.y1 = e.touches[0].pageY;
      this._scrollTo(index);
    },
    onshortcutTouchmove(e) {
      this.touch.y2 = e.touches[0].pageY;
      let detla = ((this.touch.y2 - this.touch.y1) / SHORT_CUT_ITEM_HEIGHT) | 0;
      let positionIndex = this.touch.index + detla;
      this._scrollTo(positionIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.scrollHeight.length - 2) {
        index = this.scrollHeight.length - 2;
      }
      this.scrollY = -this.scrollHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listviewItems[index], 0);
    },
    _caculateHeight() {
      // 先计算出左侧各个部分显示需要滑动的高度
      this.scrollHeight[0] = 0;
      let listviewItems = this.$refs.listviewItems;
      for (let i = 0; i < listviewItems.length; i++) {
        this.scrollHeight.push(
          this.scrollHeight[i] + listviewItems[i].clientHeight
        );
      }
    },
    selectItem(item) {
      this.$emit("select", item);
    }
  },
  watch: {
    listArray() {
      setTimeout(() => {
        this._caculateHeight();
      }, 20);
    },
    scrollY(newY) {
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < this.scrollHeight.length - 2; i++) {
        let height1 = this.scrollHeight[i];
        let height2 = this.scrollHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      this.currentIndex = this.scrollHeight.length - 2;
    },
    diff(newDiff) {
      let fixedTop =
        newDiff > 0 && newDiff < FIXED_TITLE_HEIGHT
          ? newDiff - FIXED_TITLE_HEIGHT
          : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  components: {
    Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.listview
  position fixed
  top 88px
  bottom 0
  width 100%
  overflow hidden
  z-index -1
  .listContainer
    padding-bottom 30px
    .title
      height 30px
      color $color-text-l
      font-size $font-size-small
      padding-left 20px
      line-height 30px
      background-color $color-height-background
    .singerItem
      padding 20px 0 0 30px
      img
        border-radius 50%
        vertical-align middle
      .name
        color $color-text-l
        font-size $font-size-medium
        margin-left 20px
  .shortcut
    position fixed
    top 50%
    transform translateY(-40%)
    right 0
    width 20px
    font-size $font-size-small
    color $color-text-l
    background-color $color-background-d
    padding 20px 0 20px 0
    border-radius 10px
    .short-item
      height 18px
      text-align center
      line-height $font-size-small
      &.active
        color $color-theme
  .list-fixed
    position fixed
    left 0
    top 88px
    height 30px
    color $color-text-l
    font-size $font-size-small
    padding-left 20px
    line-height 30px
    background-color $color-height-background
    width 100%
</style>