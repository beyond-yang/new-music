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
    </div>
  </div>
</template>

<script>
import { ERR_OK } from "api/config.js";
import { getTopBanner } from "api/recommend.js";
import Banner from "base/banner/banner";
export default {
  data() {
    return {
      bannerList: []
    };
  },
  mounted() {
    this._getTopBanner();
  },
  methods: {
    _getTopBanner() {
      getTopBanner().then(res => {
        if (res.code === ERR_OK) {
          this.bannerList = res.data;
          console.log(res.data);
        }
      });
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
</style>