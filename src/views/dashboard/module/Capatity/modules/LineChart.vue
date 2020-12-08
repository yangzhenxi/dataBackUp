<template>
  <v-chart
    :forceFit="true"
    :height="height"
    :data="dataSource.data"
    padding="auto"
    :scale="scale">
    <v-tooltip />
    <v-legend marker="circle" />
    <v-axis dataKey="key" :label="xLabel" :tickLine="xTickLine"/>
    <v-axis dataKey="value" :label="yLabel" :grid="yGrid"/>
    <v-area position="key*value" :color="color" :opacity=".15" />
    <v-line position="key*value" :color="color" shape="smooth" />
  </v-chart>
</template>

<script>
import { convert } from '@/utils/util'

export default {
  name: 'LineChart',
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
      scale: [],
      xScale: {
        key: {
          dataKey: 'key',
          tickCount: 4,
          formatter: value => convert(value, 'unix')
        }
      },
      yScale: {
        default: {
          dataKey: 'value',
          min: 0,
          minLimit: 0,
          type: 'log',
          tickCount: 8
        },
        speed: {
          dataKey: 'value',
          min: 0,
          minLimit: 0,
          type: 'log',
          tickCount: 8,
          formatter: text => convert(text, 'unitSpeed')
        }
      },
      xLabel: null,
      xTickLine: {
        lineWidth: 0
      },
      yLabel: {
        position: 'middle',
        textStyle: {
          fill: '#71b1ea'
        }
      },
      yGrid: {
        lineStyle: {
          lineWidth: 0
        }
      },
      colors: {
        rw: ['type', ['#c8a6f9', '#72bbff']],
        iops: ['type', ['#fca055', '#72bbff']]
      },
      color: ['type', ['#fca055', '#72bbff']]
    }
  },
  watch: {
    'dataSource.type': {
      handler (type) {
        this.color = this.colors[this.dataSource.key]
        switch (type) {
          case 'speed':
            this.scale = [this.xScale.key, this.yScale.speed]
            break
          default:
            this.scale = [this.xScale.key, this.yScale.default]
            break
        }
      },
      immediate: true
    }
  }
}
</script>
