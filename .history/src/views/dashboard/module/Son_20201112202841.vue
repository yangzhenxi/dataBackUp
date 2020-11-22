<template>
  <div>
    Son
    {{ theme }}
  </div>
</template>

<script>
export default {
    name: 'Son',
    data () {
        return {

        }
    },
    inject: ['theme'],
    mounted () {
        console.log(this.theme)
    },
    created () {
        console.log(this.$app)
    }
}
</script>
