<template>
  <div class="search-box">
    <i class="icon icon-search"></i>
    <input class="box" v-model="query" type="text" :placeholder="placeholder">
    <i class="icon icon-dismiss" v-show="query" @click="clearQuery"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    },
    searchkey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      query: ''
    }
  },
  watch: {
    searchkey(newKey) {
      this.query = newKey
    },
    query(newQuery) {
      this.$emit('query', newQuery)
    }
  },
  methods: {
    clearQuery() {
      this.query = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
.search-box
  display flex
  align-items center
  box-sizing border-box
  width 100%
  height 40px
  border-radius 6px
  padding 0 6px
  background-color $color-height-background
  .box
    flex 1
    margin 0 5px
    line-height 18px
    color: $color-text
    font-size: $font-size-medium
    outline: 0
    background-color $color-height-background
    border 0
    &::placeholder
      color: $color-text-d
  .icon
    color $color-background
    &.icon-search
      font-size 24px
    &.icon-dismiss
      font-size 16px
</style>