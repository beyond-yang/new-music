<template>
  <div class="recommend">
    <div class="banner-wrapper">
      <banner v-if="bannerList.length">
        <div v-for="item in bannerList" :key="item.id">
          <a :href="item.linkUrl">
            <img :src="item.picUrl" alt="轮播图图片" />
          </a>
        </div>
      </banner>
    </div>
    <div class="songlist-wrapper">
      <h1 class="list-title">热门歌单推荐</h1>
      <ul>
        <li v-for="item in songRecList" :key="item.dissid" @click="goToSongDetail(item)">
          <div class="icon">
            <img v-lazy="item.imgurl" alt="歌单图片">
          </div>
          <div class="text">
            <p class="name">{{item.creator.name}}</p>
            <p class="desc">{{item.dissname}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ERR_OK } from "api/config.js";
import { getTopBanner, getSongRecList } from "api/recommend.js";
import Banner from "base/banner/banner";
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
      getSongRecList().then((res)=>{
        if(res.code === ERR_OK) {
          this.songRecList = res.data.list
          console.log(this.songRecList)
        }
      })
    },
    goToSongDetail(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
    }
  },
  components: {
    Banner
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.recommend
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


</style>