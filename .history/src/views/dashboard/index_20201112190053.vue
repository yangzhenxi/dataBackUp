<template>
  <div>
    <h2>数据驱动</h2>
    <a-button type="primary" @click="handleChangeA">更改A</a-button>
    改变{{ A }}
  </div>
</template>

<script>
export default {
  data () {
    return {
        A: 0
        
    }
  },
  methods: {
      handleChangeA () {
          this.A = 20
      }
  }
}
</script>
