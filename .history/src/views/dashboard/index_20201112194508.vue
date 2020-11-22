<template>
  <div>
    我是yeye
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
            theme: {
                color:''
            }
        }
    },
    provide () {
        return {
            yeye: this,
            value: this.yeye
        }
    }
}
</script>
