<template>
  <div class="empty-wrapper" :style="{ minHeight: `${minHeight}px` }">
    <template v-if="isEmpty">
      <div class="empty">
        <a-empty v-if="!$slots.empty" :image="SimpleEmptyImg" />
        <slot name="empty"></slot>
      </div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script>
import SimpleEmptyImg from './simple'

export default {
  name: 'Empty',
  props: {
    isEmpty: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: Number,
      default: 400
    }
  },
  data () {
    return {
      SimpleEmptyImg
    }
  }
}

</script>
<style lang='less' scoped>
.empty-wrapper {
  position: relative;
  width: 100%;
  min-height: 400px;
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
  }
}
</style>
