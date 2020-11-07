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

        }
    }
}
</script>
