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
        theme: 'greed'
    }
}
</script>
