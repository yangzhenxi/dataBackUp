<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-stack-bar position="月份*月均降雨量" color="name" />
    </v-chart>
  </div>
</template>

<script>
  const DataSet = require('@antv/data-set')

  const sourceData = [
    { name: 'ssdd', '已用容量': 18.9, '可用容量': 28.8 },
    { name: 'Berlin', '已用容量': 12.4, '可用容量': 23.2 }
  ]

  const dv = new DataSet.View().source(sourceData)
  dv.transform({
    type: 'fold',
    fields: ['已用容量', '可用容量'],
    key: '月份',
    value: '月均降雨量'
  })
  const data = dv.rows
console.log(data)
  export default {
    data () {
      return {
        data,
        height: 400
      }
    }
  }
</script>
