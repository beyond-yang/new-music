<template>
  <div class="rank">
    <scroll class="rankList-wrapper">
      <ul>
        <li @click="select(item)" class="item" v-for="item in rankList" :key="item.id">
          <div class="icon">
            <img v-lazy="item.picUrl" alt="排行榜图片" />
          </div>
          <ul class="songlist">
            <li v-for="(song, index) in item.songList" :key="song.songname+index">
              <p class="info">{{index+1}}、{{song.songname}}-{{song.singername}}</p>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRankList } from "api/rank.js";
import { ERR_OK } from "api/config.js";
import Scroll from "base/scroll/scroll";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      rankList: []
    };
  },
  created() {
    this._getRankList();
  },
  methods: {
    _getRankList() {
      getRankList().then(res => {
        if (res.code === ERR_OK) {
          this.rankList = res.data.topList;
        }
      });
    },
    select(item) {
      this.setRankItem(item);
      this.$router.push({
        path: `/rank/${item.id}`
      });
    },
    ...mapMutations({
      setRankItem: "SET_RANK_ITEM"
    })
  },
  components: {
    Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
@import './../../common/stylus/mixin.styl'

.rank
  position fixed
  top 88px
  left 0
  right 0
  bottom 0
  overflow hidden
  .rankList-wrapper
    height 100%
    ul
      padding 20px 20px 1px 20px
      .item
        display flex
        margin-bottom 20px
        .icon
          flex 0 0 100px
          width 100px
          height 100px
          img
            width 100%
            height 100%
        .songlist
          overflow hidden
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          background-color $color-height-background
          .info
            color $color-text-d
            font-size $font-size-small
            no-wrap()
            line-height 26px
</style>