<template>
  <div>
    我是father
    <hr>
    <son/>
  </div>
</template>

<script>
import son from './Son'
export default {
    components: {
        son
    },
    data () {
        return {

        }
    },
    provide: {
        color: 'greed'
    }
}
</script>
