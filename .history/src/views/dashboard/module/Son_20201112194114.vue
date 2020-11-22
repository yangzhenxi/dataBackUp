<template>
  <div>
    Son
  </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    inject: ['yeye'],
    mounted () {
        console.log(this.yeye.yeye)
    }
}
</script>
