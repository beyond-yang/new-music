<template>
  <div class="search-list" v-show="searchList.length">
    <transition-group tag="ul" name="list">
      <li class="item" @click="selectItem(item)" v-for="(item) in searchList" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searchList: {
      type: Array,
      default: []
    }
  },
  methods: {
    deleteOne(item) {
      this.$emit("deleteOne", item);
    },
    selectItem(item) {
      this.$emit("select", item);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'
@import './../../common/stylus/mixin.styl'
.search-list
  .item
    display flex
    justify-content space-between
    align-items center
    height 40px
    overflow hidden
    &.list-enter-active, &.list-leave-active
      transition: all 0.1s
    &.list-enter, &.list-leave-to
      height: 0
    .text
      font-size $font-size-medium-x
      color $color-text-l
    .icon
      extend-click()
      color $color-text-d
      font-size $font-size-medium
</style>