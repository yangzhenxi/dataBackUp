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
    inject: ['theme', 'value'],
    mounted () {
        console.log(this.value)
    }
}
</script>
