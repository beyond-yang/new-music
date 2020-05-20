<template>
  <div class="song-list">
    <ul>
      <li class="song-item" v-for="(item, index) in songs" :key="item.id" @click="selectItem(songs, index)">
        <h2 class="song-name">{{item.name}}</h2>
        <p class="desc">{{item.singer}}-{{item.album}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectItem(songs, index) {
      this.$emit('selectItem', songs, index)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
@import './../../common/stylus/mixin.styl'
.song-list
  .song-item
    display flex
    flex-direction column
    justify-content center
    width 100%
    height 64px
    font-size $font-size-medium
    .song-name
      color $color-text
    .desc
      color $color-text-d
      margin-top 8px
      no-wrap()
</style>