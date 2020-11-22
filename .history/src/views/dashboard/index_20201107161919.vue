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
    { name: 'ssddtat', '已用容量.': 18.9, '剩余容量.': 28.8, 'Mar.': 39.3, 'Apr.': 81.4, 'May': 47, 'Jun.': 20.3, 'Jul.': 24, 'Aug.': 35.6 },
    { name: 'datastore1', '已用容量.': 12.4, '剩余容量.': 23.2, 'Mar.': 34.5, 'Apr.': 99.7, 'May': 52.6, 'Jun.': 35.5, 'Jul.': 37.4, 'Aug.': 42.4 }
  ]

  const dv = new DataSet.View().source(sourceData)
  dv.transform({
    type: 'fold',
    fields: ['已用容量.', '剩余容量.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.'],
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
