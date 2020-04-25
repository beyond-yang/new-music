<template>
  <div class="m-tab">
    <router-link to="/recommend" class="tab-item" tag="div">
      <span>推荐</span>
    </router-link>
    <router-link to="/singer" class="tab-item" tag="div">
      <span>歌手</span>
    </router-link>
    <router-link to="/rank" class="tab-item" tag="div">
      <span>排行</span>
    </router-link>
    <router-link to="/search" class="tab-item" tag="div">
      <span>搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
.m-tab
  display flex
  height 44px
  .tab-item
    width 25%
    text-align center
    font-size $font-size-medium
    line-height 44px
    color $color-text-l
  .active 
    span
      padding-bottom 5px
      border-bottom 2px solid $color-theme
      color $color-theme
</style>