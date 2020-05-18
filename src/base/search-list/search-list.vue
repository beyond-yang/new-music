<template>
  <div class="search-list">
    <ul>
      <li class="item" @click="selectItem(item)" v-for="(item, index) in searchList" :key="index">
        <span class="text">{{item}}</span>
        <span class="icon" @click="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
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
    .text
      font-size $font-size-medium-x
      color $color-text-l
    .icon
      extend-click()
      color $color-text-d
      font-size $font-size-medium
</style>