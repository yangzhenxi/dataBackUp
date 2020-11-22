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
    inject: ['yeye', 'value'],
    mounted () {
        console.log(this.value)
    }
}
</script>
