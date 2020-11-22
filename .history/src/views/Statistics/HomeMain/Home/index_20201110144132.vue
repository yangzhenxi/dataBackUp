<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="8"
            :sm="24">
            <a-form-item label="表名">
              <a-input v-model="queryParam.TableName" placeholder="请输入要查询的表名" />
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="24">
            <a-form-item label="推送时间">
              <a-range-picker
                @change="onChange"
                format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="24">
            <a-button
              type="primary"
              @click="$refs.table.refresh(true)">查询</a-button>
            <a-button
              style="margin-left: 8px"
              @click="() => (queryParam = {})">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button
        type="primary"
        @click="ErrorLog">错误日志</a-button>
      <a-button
        type="primary"
        @click="ExportExcel">导出Excel</a-button>
    </div>
    <m-table
      ref="table"
      size="default"
      bordered
      rowKey="Id"
      :columns="columns"
      :customRow="handlechange"
      :data="loadData">
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import moment from 'moment'
import { MTable } from '@/components'
import { Getres } from '@/api/Statistics'
import { convert } from '@/utils/util'

export default {
  name: 'TableList',
  components: {
    MTable
  },
  data () {
    return {
      temp: {},
      itemList: [],
      Region: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '区县',
          dataIndex: 'Region',
          align: 'center',
          sorter: true,
          needTotal: true,
          customRender: (val, row, index) => {
            const obj = {
              children: val,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.Region, index)
            return obj
          }
        },
        {
          title: '机构',
          dataIndex: 'Organization',
          sorter: true,
          ellipsis: true
        },
        {
          title: '表名',
          dataIndex: 'TableName',
          sorter: true,
          ellipsis: true
        },
        {
          title: '推送联众库数据量',
          dataIndex: 'Upload',
          sorter: true
        },
        {
          title: '成功数',
          dataIndex: 'Success',
          sorter: true,
          ellipsis: true
        },
        {
          title: '失败数',
          dataIndex: 'Failure',
          sorter: true,
          ellipsis: true
        },
        {
          title: '推送时间',
          dataIndex: 'CreateTime',
          sorter: true,
          scopedSlots: { customRender: 'time' }
        }
      ],
      result: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: async (parameter) => {
        var timestamp = (new Date()).getTime() - 24 * 60 * 60 * 1000
            this.result = await Getres({ start_time: parseInt(timestamp) })
            this.result.forEach((_, p) => {
                if (_.Region.length !== 0) {
                    this.Region.push(_.Region)
                } else {
                    _.Region = '无'
                    this.Region.push('无')
                }
            })
            return {
                data: this.result,
                queryParam: this.queryParam
            }
      },
      handlechange: (row, index) => ({
        on: {
          click: () => {
            // this.$router.push('/Statistics/HomeMain/District')
          }
        }
      })
    }
  },

  methods: {
    onChange (date, dateString) {
        const time0 = moment(dateString[0]).valueOf()
        const time1 = moment(dateString[1]).valueOf()
        this.queryParam.CreateTime = [time0.toString().substring(0, 10), time1.toString().substring(0, 10)]
    },
    ErrorLog () {
        this.$router.push('/Statistics/HomeMain/Errorlog')
    },
    ExportExcel () {
      this.result.forEach((u, index) => {
        if (index !== 0) {
          const obj = {
            表名: u.TableName,
            推送联众库数据量: u.Upload,
            成功数: u.Success,
            失败数: u.Failure,
            推送时间: convert(u.CreateTime, 'unix')

          }
          this.itemList.push(obj)
        }
      })
      var csv = Papa.unparse(this.itemList)
      // 定义文件内容，类型必须为Blob 否则createObjectURL会报错
      const content = new Blob([`\ufeff${csv}`])
      // 生成url对象
      const urlObject = window.URL || window.webkitURL || window
      const url = urlObject.createObjectURL(content)
      console.log(url)
      // 生成<a></a>DOM元素
      const el = document.createElement('a')
      // 链接赋值
      el.href = url
      el.download = '导出的推送结果.csv'
      // 必须点击否则不会下载
      el.click()
      // 移除链接释放资源
      urlObject.revokeObjectURL(url)
    },
    getRowSpanCount (data, index) {
      let preValue = data[0]
      const res = [[preValue]]
      let i = 0
      for (let j = 1; j < data.length; j++) {
        if (data[j] === preValue) {
          res[i].push(data[j])
        } else {
          i += 1
          res[i] = []
          res[i].push(data[j])
          preValue = data[j]
        }
      }
      const result = []
      res.map((u) => {
        u.map((_, p) => {
          result.push(p === 0 ? u.length : 0)
        })
      })
      return result[index]
    }
  }
}
</script>
