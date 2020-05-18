<template>
  <transition name="fade">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="top">{{text}}</div>
        <div class="bottom">
          <span class="item left" @click="confirm">{{confirmBtnText}}</span>
          <span class="item right" @click="cancel">{{cancelBtnText}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ""
    },
    confirmBtnText: {
      type: String,
      default: "确认"
    },
    cancelBtnText: {
      type: String,
      default: "取消"
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.hide();
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.confirm
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  display flex
  justify-content center
  align-items center
  &.fade-enter-active
    animation confirm-fadein 0.3s
    .confirm-wrapper
      animation confirm-zoom 0.3s
  .confirm-wrapper
    width 270px
    height 103px
    background-color $color-height-background
    border-radius 10px
    .top
      height 60px
      line-height 60px
      text-align center
      box-sizing border-box
      border-bottom 1px solid $color-background
      font-size $font-size-large
      color $color-text-l
    .bottom
      height 43px
      width 100%
      .item
        display inline-block
        width 50%
        height 100%
        text-align center
        line-height 43px
        font-size $font-size-large
        color $color-text-d
        &.left
          box-sizing border-box
          border-right 1px solid $color-background
@keyframes confirm-fadein
  0%
    opacity 0
  100%
    opacity 1
@keyframes confirm-zoom
  0%
    transform scale(0)
  0%
    transform scale(1.1)
  100%
    transform scale(1)
</style>