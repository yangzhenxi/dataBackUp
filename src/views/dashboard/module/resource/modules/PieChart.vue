<template>
  <v-chart :forceFit="true" padding="auto" :height="height" :data="data">
    <v-guide
      :type="guide.type"
      :position="guide.position"
      :htmlContent="`${guide.htmlContent}`"
    />
    <v-pie position="value" :color="color" :vStyle="pieStyle" />
    <v-coord type="theta" :radius="1" :innerRadius="0.8" />
  </v-chart>
</template>

<script>
const DataSet = require('@antv/data-set')

export default {
  name: 'PieChart',
  props: {
    dataSource: {
      type: Object,
      default () {
        return {
          data: []
        }
      },
      required: true
    }
  },
  data () {
    return {
      data: [],
      height: 140,
      pieStyle: {
        lineWidth: 0,
        shadowColor: 'rgba(0, 0, 0, .1)',
        shadowBlur: 8,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        stroke: 'r(0.5, 0.5, 0.1) 0:#ffffff .5:#ededed  1:#ffffff'
      },
      colors: {
        main: ['key', ['#043fbd', '#c2e2ff']],
        pull: ['key', ['#611fb1', '#cfbeff']],
        backup: ['key', ['#097581', '#a9f7ff']]
      },
      color: [],
      guide: {
        type: 'html',
        position: ['50%', '50%'],
        htmlContent: '<div></div>'
      },
      count: 0,
      overflowCount: 999
    }
  },
  watch: {
    'dataSource.data': {
      handler (data) {
        this.loadData()
      },
      immediate: true
    }
  },
  created () {
    // 颜色必须在这里加载
    this.getColor()
  },
  methods: {
    getColor () {
      Object.keys(this.colors).some(u => {
        if (u === this.dataSource.type) {
          this.color = this.colors[u]
          return true
        } else {
          return false
        }
      })
    },
    loadData () {
      if (this.dataSource.data && this.dataSource.data.length > 0) {
        this.count = this.dataSource.data[0].count > this.overflowCount ? this.overflowCount : this.dataSource.data[0].count
        const dv = new DataSet.View().source(this.dataSource.data)
        dv.transform({
          type: 'percent',
          field: 'count',
          dimension: 'key',
          as: 'value'
        })
        this.guide.htmlContent =
          '<div>' +
            '<div style="text-align: center; color: rgba(255, 255, 255, .65); font-size: 12px">' + this.dataSource.data[0].key + '</div>' +
            '<div style="text-align: center; color: rgba(255, 255, 255, .65); font-size: 18px">' +
              '<span class=' + this.setTotalClass() + '>' +
                this.count +
              '</span>' +
            '</div>' +
        '</div>'
        this.data = dv.rows
      }
    },
    setTotalClass () {
      const count = this.dataSource.data[0].count
      if (count >= 0 && count < 100) {
        return ''
      } else if (count >= 100 && count <= this.overflowCount) {
        return 'hundred'
      } else if (count > this.overflowCount) {
        return 'overflow'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .hundred {
    font-size: 18px;
  }
  /deep/ .overflow {
    font-size: 16px;
    position: relative;
    &:after {
      content: '+';
      position: absolute;
      top: -6px;
      right: -12px;
      width: 16px;
      height: 16px;
      font-size: 16px;
      line-height: 1;
    }
  }
</style>
