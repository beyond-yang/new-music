<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="btn-wrapper"
        ref="barBtn"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <div class="bar-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const barBtnWidth = 15;
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    touchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    touchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const detlaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - barBtnWidth,
        Math.max(0, this.touch.left + detlaX)
      );
      this._offset(offsetWidth);
    },
    touchEnd(e) {
      this.$emit("percentChange", this.getPercent());
      this.touch.initiated = false;
    },
    progressClick(e) {
      const paddingLeft = this.$refs.progressBar.getBoundingClientRect().left;
      const offsetX = e.pageX - paddingLeft;
      this._offset(offsetX);
      this.$emit("percentChange", this.getPercent());
    },
    getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - barBtnWidth;
      const progressWidth = this.$refs.progress.clientWidth;
      return progressWidth / barWidth;
    },
    setProgressOffset(newPercent) {
      let width = this.$refs.progressBar.clientWidth - barBtnWidth;
      let progressWidth = newPercent * width;
      this._offset(progressWidth);
    },
    _offset(offsetX) {
      this.$refs.progress.style.width = `${offsetX}px`;
      this.$refs.barBtn.style.transform = `translate3d(${offsetX}px, 0, 0)`;
    }
  },
  watch: {
    percent(newPercent) {
      if (this.touch.initiated) {
        return;
      }
      this.setProgressOffset(newPercent);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl'

.progress-bar
  position relative
  height 30px
  .bar-inner
    width 100%
    position absolute
    top 50%
    transform translateY(-50%)
    background-color $color-background-d
    .progress
      height 4px
      background-color $color-theme
    .btn-wrapper
      position absolute
      left -8px
      top -13px
      width 30px
      height 30px
      .bar-btn
        position absolute
        top 7px
        left 7px
        width 16px
        height 16px
        border-radius 50%
        background-color $color-theme
        box-sizing border-box
        border 3px solid #fff
</style>