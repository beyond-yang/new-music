<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="name">绿芽音乐</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/mixin.styl'
@import './../../common/stylus/variable.styl'

.m-header
  position relative
  display flex
  justify-content center
  align-items center
  color $color-theme
  height 44px 
  .icon
    width 30px
    height 32px
    bg-image('logo')
    background-size cover
  .name
    font-size $font-size-large
    margin-left 10px
</style>