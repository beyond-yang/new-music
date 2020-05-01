<template>
  <div class="recommend">
    <scroll :data="songRecList" ref="scroll" class="recommend-content">
      <div>
        <div class="banner-wrapper">
          <banner v-if="bannerList.length">
            <div v-for="item in bannerList" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl" alt="轮播图图片" />
              </a>
            </div>
          </banner>
        </div>
        <div class="songlist-wrapper">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in songRecList" :key="item.dissid">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="歌单图片" />
              </div>
              <div class="text">
                <p class="name">{{item.creator.name}}</p>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-wrapper" v-show="!songRecList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import { ERR_OK } from "api/config.js";
import { getTopBanner, getSongRecList } from "api/recommend.js";
import Banner from "base/banner/banner";
import Scroll from "base/scroll/scroll";
import Loading from 'base/loading/loading'
export default {
  data() {
    return {
      bannerList: [],
      songRecList: []
    };
  },
  mounted() {
    this._getTopBanner();
    this._getSongRecList();
  },
  methods: {
    _getTopBanner() {
      getTopBanner().then(res => {
        if (res.code === ERR_OK) {
          this.bannerList = res.data;
        }
      });
    },
    _getSongRecList() {
      getSongRecList().then(res => {
        if (res.code === ERR_OK) {
          this.songRecList = res.data.list;
          console.log(this.songRecList);
        }
      });
    },
    loadImage() {
      if(!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  components: {
    Banner,
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.recommend
  position fixed
  top 88px
  width 100%
  bottom 0
  .recommend-content
    overflow hidden
    height 100%
    width 100%
    .songlist-wrapper
      .list-title
        height 65px
        font-size $font-size-medium
        text-align center
        line-height 65px
      li
        display flex
        padding 0 20px 20px
        .icon
          margin-right 20px
          img
            width 60px
            height 60px
        .text
          display flex
          flex-direction column
          justify-content space-around
          font-size $font-size-medium
          .name
            color $color-text
          .desc
            color $color-text-d
    .loading-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>