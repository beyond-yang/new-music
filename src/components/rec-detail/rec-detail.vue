<template>
  <transition name="slide" appear>
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { getDiscList } from "api/recommend.js";
import { ERR_OK } from "api/config.js";
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend.js";
import { createSong, processSongsUrl } from "common/js/song.js";
export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(["recSongInfo"]),
    title() {
      return this.recSongInfo.dissname;
    },
    bgImage() {
      return this.recSongInfo.imgurl;
    }
  },
  created() {
    this._getSongList(this.recSongInfo.dissid);
  },
  methods: {
    _getSongList(id) {
      if (!this.recSongInfo.dissid) {
        this.$router.push("/recommend");
      }
      getSongList(id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalize(res.cdlist[0].songlist)).then(
            songs => {
              this.songs = songs;
            }
          );
        }
      });
    },
    _normalize(list) {
      var ret = [];
      list.forEach(musicDta => {
        if (musicDta.songid && musicDta.albumid) {
          ret.push(createSong(musicDta));
        }
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