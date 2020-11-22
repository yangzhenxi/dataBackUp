<template>
  <div>
    <h2>数据驱动</h2>
    <a-button type="primary" @click="handleChangeA">更改info.name</a-button>
    改变{{ info.name }}
  </div>
</template>

<script>
export default {
  data () {
    return {
        A: 0,
        info: {}
    }
  },
  methods: {
      handleChangeA () {
          this.A = 20
          this.info.name = 20
      }
  }
}
</script>
