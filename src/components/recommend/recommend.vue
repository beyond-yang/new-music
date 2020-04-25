<template>
  <div class="recommend">
    <div class="banner-wrapper">

    </div>
    <div class="songlist-wrapper">
      
    </div>
  </div>
</template>

<script>
import {getTopBanner} from 'api/recommend.js'
export default {
  data() {
    return {

    }
  },
  mounted() {
    this._getTopBanner()
  },
  methods: {
    _getTopBanner() {
      getTopBanner().then((res)=>{
        console.log(res)
      })
    }
  }
}
</script>