<template>
  <div>
    Son
    {{ theme }
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
        console.log(this.theme)
    }
}
</script>
