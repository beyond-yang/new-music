<template>
  <transition appear name="slide">
    <music-list ref="musicList" :songs="songList" :title="title" :bgImage="avatar"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer.js";
import { ERR_OK } from "api/config.js";
import { createSong } from "common/js/song.js";
import MusicList from "components/music-list/music-list";
import {processSongsUrl} from 'common/js/song.js'
export default {
  data() {
    return {
      songList: []
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    avatar() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    this._getSingerDetail(this.singer.id);
  },
  methods: {
    _getSingerDetail(singerId) {
      if (!singerId) {
        this.$router.push("/singer");
      }
      getSingerDetail(singerId).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSonglist(res.data.list)).then(songs => {
            this.songList = songs;
          });
        }
      });
    },
    _normalizeSonglist(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        ret.push(createSong(musicData));
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style lang="stylus" scoped></style>
