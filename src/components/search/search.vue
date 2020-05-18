<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="listenQuery" :searchkey="query" :placeholder="placeholder"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWra">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-keys" v-show="!query">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="selectKey(key.k)" class="key" v-for="key in hotkey" :key="key.n">
                <span>{{key.k}}</span>
              </li>
            </ul>
          </div>
          <div
            class="search-history"
            ref="searchHistory"
            v-show="searchHistory.length>0&&!this.query"
          >
            <div class="clear">
              <span class="text">搜索历史</span>
              <span class="icon" @click="clearAll">
                <i class="icon-clear"></i>
              </span>
            </div>
            <search-list :searchList="searchHistory" @deleteOne="deleteOne" @select="selectKey"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" @confirm="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from "base/search-box/search-box";
import { getHotKey } from "api/search.js";
import Suggest from "components/suggest/suggest.vue";
import { ERR_OK } from "api/config.js";
import { mapActions, mapGetters } from "vuex";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
import { playlistMixin } from "common/js/mixin.js";
import Scroll from "base/scroll/scroll";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      placeholder: "搜索歌曲、歌词",
      hotkey: [],
      query: ""
    };
  },
  computed: {
    shortcut() {
      return this.hotkey.concat(this.searchHistory);
    },
    ...mapGetters(["searchHistory"])
  },
  created() {
    this._getHotKey();
  },
  methods: {
    playListHandler(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.shortcutWra.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
      // this.$refs.suggest.refresh()
    },
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
    },
    saveSearch(item) {
      this.saveSearchHistory(this.query);
    },
    deleteOne(item) {
      this.deleteOneSearchHistory(item);
    },
    clearAll() {
      this.$refs.confirm.show();
    },
    confirm() {
      this.clearSearchHistory();
      this.$refs.confirm.hide();
    },
    ...mapActions([
      "saveSearchHistory",
      "deleteOneSearchHistory",
      "clearSearchHistory"
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
@import './../../common/stylus/mixin.styl'

.search
  position fixed
  top 88px
  bottom 0
  left 0
  right 0
  .search-box-wrapper
    padding 20px
  .shortcut-wrapper
    overflow hidden
    position absolute
    top 90px
    bottom 0
    width 100%
    .shortcut
      width 100%
      height 100%
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
    .search-history
      padding 0 20px
      .clear
        display flex
        align-items center
        justify-content space-between
        font-size $font-size-medium
        height 40px
        .text
          color $color-text-l
        .icon
          extend-click()
          color $color-text-d
  .search-result
    position fixed
    top 175px
    left 0
    right 0
    bottom 0
    overflow hidden
</style>