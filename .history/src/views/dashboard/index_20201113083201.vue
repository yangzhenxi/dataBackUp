<template>
  <div>
    <hr>
    <me/>
  </div>
</template>

<script>
import me from './module/father'
export default {
    components: {
        me
    },
    data () {
        return {
            yeye: '10'
        }
    },
    provide () {
        return {
            theme: {
                color: 'red'
            }
        }
    }
}
</script>
