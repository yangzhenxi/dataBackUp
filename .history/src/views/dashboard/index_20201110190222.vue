<template>
  <div>
    
  </div>
</template>

<script>
  const DataSet = require('@antv/data-set')

  const sourceData = [
    { name: '已用容量', 'data1.': 18.9, 'data2.': 28.8 },
    { name: '剩余容量', 'data1.': 12.4, 'data2.': 23.2 }
  ]

  const dv = new DataSet.View().source(sourceData)
  dv.transform({
    type: 'fold',
    fields: ['data1.', 'data2.'],
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
