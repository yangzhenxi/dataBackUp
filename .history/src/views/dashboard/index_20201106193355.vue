<template>
  <div>
    <p ref="myWidth" v-if="showMe">{{ message }}</p>
    <button @click="getMyWidth">获取p元素宽度</button>
  </div>
</template>

<script>
export default {
    data () {
        return {
            message: 'Hello,word',
            table: {
                title: 'lsp',
                age: '18',
                height: '180'
            }
        }
    },
    methods: {
        Getel () {
            this.message = 'word,Heloo'
            console.log(this.$el)
        }
    }
}
</script>
