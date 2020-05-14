<template>
  <transition name="slide" appear>
    <music-list :title="title" :bgImage="bgImage" :songs="songlist"></music-list>
  </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicList } from "api/rank.js";
import { ERR_OK } from "api/config.js";
import { createSong, processSongsUrl } from "common/js/song.js";
export default {
  data() {
    return {
      songlist: [],
      image: ""
    };
  },
  computed: {
    title() {
      return this.rankItem.topTitle;
    },
    bgImage() {
      return this.image;
    },
    ...mapGetters(["rankItem"])
  },
  created() {
    this._getMusicList(this.rankItem.id);
  },
  methods: {
    _getMusicList(id) {
      if (!this.rankItem.id) {
        this.$router.push("/rank");
      }
      getMusicList(id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalize(res.songlist)).then(songs => {
            this.songlist = songs;
            this.image = songs[0].image;
          });
        }
      });
    },
    _normalize(list) {
      let ret = [];
      list.forEach(musicData => {
        ret.push(createSong(musicData.data));
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