<template>
  <div>
    <ul><li v-for="item in list1" :key="item">{{ item }}</li></ul>
    <ul><li v-for="item in list2" :key="item">{{ item }}</li></ul>
    <ol><li v-for="item in list3" :key="item">{{ item }}</li></ol>
    <ol><li v-for="item in list4" :key="item">{{ item }}</li></ol>
    <ol><li v-for="item in list5" :key="item">{{ item }}</li></ol>
  </div>
</template>

<script>
export default {
    data () {
        return {
            list1: [],
            list2: [],
            list3: [],
            list4: [],
            list5: []
        }
    },
    created () {

    },
    methods: {
        composeList12 () {
            const me = this
            const count = 10000
            for (let i = 0; i < count; i++) {
                Vue.$set(me.list1, i, 'I am a 测试消息 ' + i)
            }
            console.log('finished list1 ' + new Date().toString())
             for (let i = 0; i < count; i++) {
                Vue.$set(me.list2, i, 'I am a 测试信息～～啦啦啦' + i)
            }
            console.log('finished list2 ' + new Date().toString())
            this.$nextTick(function () {
                // DOM 更新了
                console.log('finished tick1&2 ' + new Date().toString())
                console.log(document.querySelectorAll('li').length)
            })
        }
    }
}
</script>
