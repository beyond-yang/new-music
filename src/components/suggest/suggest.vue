<template>
  <scroll class="suggest" :pullup="pullup" @scrollToEnd="searchMore">
    <ul class="search-list-wrapper">
      <li v-for="(item, index) in searchList" class="search-item" @click="selectItem(item, index)">
        <i :class="index===0?searchIcon:''" class="icon-music icon"></i>
        <span class="text">{{item.name}}{{index===0?'':'-'}}{{item.singer}}</span>
      </li>
    </ul>
    <loading v-show="hasMore"></loading>
  </scroll>
</template>

<script>
import { search } from "api/search.js";
import { ERR_OK } from "api/config.js";
import { createSong, processSongsUrl } from "common/js/song.js";
import { Singer } from "common/js/singer.js";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { mapMutations, mapActions } from "vuex";
const EXIST_SINGER = 2;
const perpage = 20;
export default {
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      searchList: [],
      page: 1,
      zhida: true,
      perpage: 20,
      singerFlag: 0,
      pullup: true,
      hasMore: true
    };
  },
  computed: {
    searchIcon() {
      if (this.singerFlag === EXIST_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    }
  },
  watch: {
    query(newQuery) {
      this.page = 1;
      this._search(newQuery, this.page, this.zhida, this.perpage);
    }
  },
  methods: {
    _search(query, page, zhida, perpage) {
      this.hasMore = true;
      search(query, page, zhida, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._normalize(res.data).then(response => {
            if (this.page === 1) {
              this.searchList = response;
            } else {
              this.searchList = this.searchList.concat(response);
            }
            this._checkMore(res.data);
          });
        }
      });
    },
    _normalize(data) {
      let ret = [];
      let song = [];
      let zhida = data.zhida;
      this.singerFlag = zhida.type;
      let songs = data.song.list;
      if (zhida.type === EXIST_SINGER) {
        if (zhida.singermid) {
          ret.push(new Singer({ id: zhida.singermid, name: zhida.singername }));
        }
      }
      songs.forEach(musicData => {
        if (musicData.albumid && musicData.songid) {
          song.push(createSong(musicData));
        }
      });
      return processSongsUrl(song).then(res => {
        return ret.concat(res);
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      this._search(this.query, this.page, this.zhida, this.perpage);
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + (song.curpage - 1) * perpage >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    selectItem(item, index) {
      if (index === 0 && this.singerFlag === EXIST_SINGER) {
        this.$router.push({
          path: `/search/${item.id}`
        });
        this.setSinger(item);
      } else {
        this.insertSong(item);
      }
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.suggest
  position fixed
  top 175px
  left 0
  right 0
  bottom 0
  overflow hidden
  .search-list-wrapper
    padding 0 30px
    font-size $font-size-medium
    color $color-text-d
    .search-item
      display flex
      align-items center
      height 16px
      padding-bottom 20px
      .icon
        flex 0 0 30px
      .text
        flex 1
</style>