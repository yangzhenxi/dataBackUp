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
    { name: 'London', '':'剩余容量': 112, '已用容量': 333 },
    { name: 'Berlin', '剩余容量': 112, '已用容量': 333 }
  ]

  const dv = new DataSet.View().source(sourceData)
  dv.transform({
    type: 'fold',
    fields: ['剩余容量', '已用容量'],
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
