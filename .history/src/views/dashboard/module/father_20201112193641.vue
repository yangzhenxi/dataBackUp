<template>
  <div>
    我是father
    <hr>
    <son/>
  </div>
</template>

<script>
import Son from './Son'
export default {
    components: {
        Son
    },
    inject: ['yeye'],
    data () {
        return {

        }
    }
}
</script>
