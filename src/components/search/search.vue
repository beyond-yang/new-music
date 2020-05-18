<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="listenQuery" :searchkey="query" :placeholder="placeholder"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="hot-keys" v-show="!query">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li @click="selectKey(key.k)" class="key" v-for="key in hotkey" :key="key.n">
            <span>{{key.k}}</span>
          </li>
        </ul>
      </div>
      <div class="search-history"></div>
    </div>
    <suggest :query="query" v-show="query"></suggest>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from "base/search-box/search-box";
import { getHotKey } from "api/search.js";
import Suggest from "components/suggest/suggest.vue";
import { ERR_OK } from "api/config.js";
export default {
  data() {
    return {
      placeholder: "搜索歌曲、歌词",
      hotkey: [],
      query: ""
    };
  },
  created() {
    this._getHotKey();
  },
  methods: {
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    selectKey(key) {
      this.query = key;
    },
    listenQuery(query) {
      this.query = query;
    }
  },
  components: {
    SearchBox,
    Suggest
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.search
  position fixed
  top 88px
  bottom 0
  left 0
  right 0
  .search-box-wrapper
    padding 20px
  .shortcut-wrapper
    margin-top 10px
    .hot-keys
      padding 0 20px 20px
      .title
        font-size $font-size-medium
        color $color-text-l
        margin 0 0 20px
      .key
        display inline-block
        padding 5px 10px
        margin 0 20px 10px 0
        border-radius 6px
        background-color $color-height-background
        font-size $font-size-medium
        color $color-text-d
</style>