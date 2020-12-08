<template>
  <v-chart
    :forceFit="true"
    :height="height"
    :data="data"
    padding="auto"
    :scale="scale"
    :onPlotClick="handleChange"
  >
    <v-tooltip />
    <v-axis dataKey="value" :show="false" />
    <v-interval position="key*value" :color="color" :vStyle="style"/>
  </v-chart>
</template>

<script>
import { convert } from '@/utils/util'

export default {
  name: 'StackBarChart',
  props: {
    dataSource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      data: [],
      height: 200,
      scale: [{
        dataKey: 'value',
        min: 0,
        minLimit: 0,
        formatter: text => convert(text, 'unitSize')
      }],
      color: ['type', ['#e2e2e2', '#72bbff']],
      style: ['key', {
        lineWidth: key => {
          if (this.dataSource.activeKey === key) {
            return 1
          }
          return 0
        },
        shadowColor: key => {
          if (this.dataSource.activeKey === key) {
            return this.shadow
          }
          return ''
        },
        shadow: 'rgba(0, 0, 0, .15)',
        shadowBlur: 12,
        shadowOffsetX: 2,
        shadowOffsetY: 8,
        stroke: 'r(0.5, 0.5, 0.1) 0:#ffffff44 .5:#ffffff66  1:#ffffff44'
      }]
    }
  },
  watch: {
    'dataSource.activeKey' () {
      this.$forceUpdate()
    },
    '$store.getters.theme': {
      handler (theme) {
        if (theme === 'dark') {
          // XXX: viser 数组监听不到
          this.color[1] = ['#72bbff22', '#72bbff']
          this.stroke = 'r(0.5, 0.5, 0.1) 0:#ffffffcc .5:#ffffff  1:#ffffffcc'
          this.shadow = 'rgba(0, 0, 0, .15)'
        } else {
          this.color[1] = ['#e2e2e2', '#72bbff']
          this.stroke = 'r(0.5, 0.5, 0.1) 0:#72bbff44 .5:#72bbff66  1:#72bbff44'
          this.shadow = 'rgba(0, 0, 0, .15)'
        }
        this.data = this.dataSource.data
        this.$forceUpdate()
      },
      immediate: true
    }
  },
  methods: {
    handleChange (ev, chart) {
      const records = chart.getSnapRecords({ x: ev.x, y: ev.y })
      const data = records[0]._origin
      if (data) {
        this.$emit('onPoolChange', data.key)
        this.$forceUpdate()
      }
    }
  }
}
</script>
