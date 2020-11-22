<template>
  <div>
    <h2>数据驱动</h2>
    <a-button type="primary" @click="handleChangeA">改变{{ A }}</a-button>
  </div>
</template>

<script>
let id = 0
export default {
  data () {
    return {
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const { keys, names } = values
          console.log('Received values of form: ', values)
          console.log(
            'Merged values:',
            keys.map(key => names[key])
          )
        }
      })
    }
  }
}
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
