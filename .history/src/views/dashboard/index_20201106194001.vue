<template>
  <div>
    <p ref="myWidth" v-if="showMe">{{ message }}</p>
    <button @click="getMyWidth">获取p元素宽度</button>
    <input type="text" id="keywords" v-show="showMe">
  </div>
</template>

<script>
export default {
    data () {
        return {
            showMe: false,
            message: 'Hello,word',
            table: {
                title: 'lsp',
                age: '18',
                height: '180'
            }
        }
    },
    methods: {
        getMyWidth () {
            this.showMe = true
            // console.log()
            document.querySelector('#keywords').focus()
            // this.message = this.$refs.myWidth.offsetWidth
            // // 报错 TypeError: this.$refs.myWidth is undefined
            // this.$nextTick(() => {
            // dom元素更新后执行，此时能拿到p元素的属性
                // this.message = this.$refs.myWidth.offsetWidth
            // })
        }
    }
}
</script>
