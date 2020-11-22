<template>
  <div>
    我是yeye
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
            abc: '10'
        }
    }
}
</script>
