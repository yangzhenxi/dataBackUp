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
    { name: '已用容量', 'data1.': 18.9, 'data2.': 28.8, 'data3.': 39.3 },
    { name: '剩余容量', 'data1.': 12.4, 'data2.': 23.2, 'data3.': 34.5 }
  ]

  const dv = new DataSet.View().source(sourceData)
  dv.transform({
    type: 'fold',
    fields: ['data1.', 'data2.', 'data3.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.'],
    key: '月份',
    value: '月均降雨量'
  })
  const data = dv.rows

  export default {
    data () {
      return {
        data,
        height: 400
      }
    }
  }
</script>
