<template>
  <div class="switches" @click.stop>
    <ul class="switch">
      <li
        @click="selectItem(index)"
        class="item"
        :class="{current: currentIndex===index}"
        v-for="(item, index) in switches"
        :key="item"
      >
        <span>{{item}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0
    }
  },
  props: {
    switches: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectItem(index) {
      this.currentIndex = index
      this.$emit('change', index)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.switches
  width 100%
  .switch
    display flex
    justify-content center
    .item
      width 120px
      height 30px
      line-height 30px
      text-align center
      font-size $font-size-medium
      color $color-text-d
      box-sizing border-box
      border 1px solid $color-height-background
      &.current
        background-color $color-height-background
        color $color-text
</style>