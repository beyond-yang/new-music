<template>
  <scroll class="listview" :data="listArray" ref="listview">
    <ul>
      <li v-for="item in listArray" :key="item.title" ref="listviewItems">
        <div class="title">{{item.title}}</div>
        <ul>
          <li class="singerItem" v-for="child in item.item" :key="child.id">
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
        >{{item}}</li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import "./../../common/stylus/variable.styl";
import { getData } from "common/js/dom.js";
const SHORT_CUT_ITEM_HEIGHT = 18;
export default {
  props: {
    listArray: {
      type: Array,
      default: null
    }
  },
  created() {
    this.touch = {};
  },
  mounted() {
    // console.log(this.shortcutList)
  },
  computed: {
    shortcutList() {
      return this.listArray.map(item => {
        return item.title.substr(0, 1);
      });
    }
  },
  methods: {
    onshortcutTouchstart(e) {
      // 获取点击元素的索引值
      let index = parseInt(getData(e.target, "index"));
      this.touch.index = index;
      this.touch.y1 = e.touches[0].pageY;
      this._scrollTo(index)
    },
    onshortcutTouchmove(e) {
      this.touch.y2 = e.touches[0].pageY;
      let detla = ((this.touch.y2 - this.touch.y1) / SHORT_CUT_ITEM_HEIGHT) | 0;
      let positionIndex = this.touch.index + detla
      this._scrollTo(positionIndex)
    },
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listviewItems[index], 0);
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
</style>