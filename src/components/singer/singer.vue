<template>
  <div class="singer">
    <list-view :listArray="singerList" @select="select"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer.js";
import { ERR_OK } from "api/config.js";
import ListView from "base/listview/listview";
import { Singer } from "common/js/singer.js";
import { mapMutations } from "vuex";
const HOT_NAME = "热门";
const HOT_LEN = 10;
export default {
  data() {
    return {
      singerList: []
    };
  },
  mounted() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          // console.log(this._normalize(res.data.list));
          this.singerList = this._normalize(res.data.list);
          // this.singerList = res.data.list;
          // console.log(this.singerList)
        }
      });
    },
    _normalize(singerList) {
      let map = {
        hot: {
          title: HOT_NAME,
          item: []
        }
      };
      singerList.forEach((item, index) => {
        // 热门是取前十条的数据
        if (index < HOT_LEN) {
          map.hot.item.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            item: []
          };
        }
        map[key].item.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    select(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  components: {
    ListView
  }
};
</script>

<style lang="stylus" scoped></style>