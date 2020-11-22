<template>
  <div>
    <h2>数据驱动</h2>
    <a-button type="primary" @click="handleChangeA">改变{{ A }}</a-button>
  </div>
</template>

<script>
export default {
  data () {
    this.A = 10
    return {

    }
  },
  methods: {
      handleChangeA () {
          this.a = 20
      }
  }
}
</script>
