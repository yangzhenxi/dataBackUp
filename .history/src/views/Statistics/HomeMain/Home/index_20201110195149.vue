<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="8"
            :sm="24">
            <a-form-item label="区县">
              <a-input v-model="queryParam.name" placeholder="请输入要查询的区县" />
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="24">
            <a-form-item label="推送时间">
              <a-date-picker
                v-model="queryParam.timestamp"
                format="YYYY-MM-DD"
                :disabled-date="disabledDate"
                :disabled-time="disabledDateTime"
                :default-value="moment(dateFormat, 'YYYY-MM-DD')"/>
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
      :columns="columns"
      :data="loadData">
      <template slot="Failure" slot-scope="text,record">
        <div class="flex">
          <span>{{ text }}</span>
          <a-button type="primary" size="small" @click="ErrorLog(record)">查看错误日志</a-button>
        </div>
      </template>
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import moment from 'moment'
import { MTable, STable } from '@/components'
import { Getres } from '@/api/Statistics'
import { convert } from '@/utils/util'

export default {
  name: 'TableList',
  components: {
    MTable,
    STable
  },
  data () {
       this.dateFormat = moment().subtract(1, 'days').format('YYYY-MM-DD')
    return {
      temp: {},
      itemList: [],
      Region: [],
      District: [],
      default: () => {
         return moment('2015-06-06', 'YYYY-MM-DD')
      },
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '区县',
          dataIndex: 'name',
          align: 'center',
          sorter: true,
          customRender: (val, row, index) => {
              const child = this.createElement('a', {
                  domProps: {
                    innerHTML: row.District
                },
                on: {
                    click: function () {
                        this..cityClick(row)
                    }
                }

              })
            return {
                children: <a-button type="primary" size="small" class="btn">{row.District}</a-button>,
                attrs: {
                   rowSpan: this.getRowSpanCount(this.District, index)
                }
            }
          }
        },
        {
          title: '表名',
          sorter: true,
          dataIndex: 'TableName',
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
          sorter: true
        },
        {
          title: '失败数',
          sorter: true,
          dataIndex: 'Failure',
            scopedSlots: { customRender: 'Failure' }
        }
      ],
      result: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: async (parameter) => {
            if (this.queryParam.timestamp === undefined) {
                this.queryParam.timestamp = parseInt(new Date().getTime() / 1000) - 24 * 60 * 60
            } else {
               this.queryParam.timestamp = (moment(this.queryParam.timestamp.format('YYYY-MM-DD')).valueOf()) / 1000
            }
            const result = await Getres(this.queryParam)
            this.result = []
            result.data.forEach(u => {
                u.res.forEach(_ => {
                    this.result.push({
                        Failure: _.Failure,
                        Id: _.Id,
                        Success: _.Success,
                        TableName: _.TableName,
                        Upload: _.Upload,
                        code: u.code,
                        District: u.name
                    })
                    this.District.push(u.name)
                })
            })
            return { data: this.result }
      }
    //   handlechange: (row, index) => ({
    //     on: {
    //       click: (event) => {
    //           event.stopPropagation()
    //         this.$router.push({ path: '/Statistics/HomeMain/District', query: { code: row.code } })
    //       }
    //     }
    //   })
    }
  },

  methods: {
    toDistrict (row) {
        console.log(row)
        this.$router.push({ path: '/Statistics/HomeMain/District', query: { code: row.code } })
    },
    ErrorLog (event) {
        console.log(1)
        this.$router.push('/Statistics/HomeMain/Errorlog')
        event.stopPropagation()
    },
    ExportExcel () {
      this.result.forEach((u, index) => {
          const obj = {
            区县: u.District,
            表名: convert(u.TableName, 'L_TABLENAME'),
            推送联众库数据量: u.Upload,
            成功数: u.Success,
            失败数: u.Failure
          }
          this.itemList.push(obj)
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
    disabledDate (current) {
      // Can not select days before today and today
      return current && current >= moment().endOf('day')
    },
    disabledDateTime () {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      }
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
    },
    moment
  }
}
</script>

<style lang="less" scoped>
.flex{
    display:flex;
    justify-content: space-around;
}
</style>
