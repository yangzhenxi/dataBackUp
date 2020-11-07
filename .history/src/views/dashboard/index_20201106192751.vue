<template>
  <div>
    <h1>{{ table.title }}</h1>
    <h1>{{ table.age }}</h1>
    <h1>{{ table.height }}</h1>
    <a-button @click="abc">{{ message }}</a-button>
  </div>
</template>

<script>
export default {
    data () {
        return {
            message: 'Hello,word',
            table: {
                title: 'lsp',
                age: '18',
                height: '180'
            }
        }
    }
}
</script>
