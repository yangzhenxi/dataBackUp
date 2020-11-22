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
    inject: ['theme'],
    mounted () {
        console.log(this.value)
    }
}
</script>
