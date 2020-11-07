<template>
  <div>
    <a-button @click="abc">{{ message }}</a-button>
  </div>
</template>

<script>
export default {
    data () {
        return {
            message: 'Hello,word'
        }
    }
}
</script>
