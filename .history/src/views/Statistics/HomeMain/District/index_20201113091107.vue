<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="6"
            :sm="24">
            <a-form-item label="机构">
              <a-input v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="24">
            <a-form-item label="筛选条件">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
                default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="24">
            <a-form-item label="推送时间">
              <a-date-picker
                v-model="queryParam.start_time"
                format="YYYY-MM-DD"
                :disabled-date="disabledDate"
                :disabled-time="disabledDateTime"
                :default-value="moment(dateFormat, 'YYYY-MM-DD')" />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
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
        @click="Close">返回首页</a-button>
      <a-button
        type="primary"
        @click="ExportExcel">导出Excel</a-button>
    </div>
    <m-table
      ref="table"
      size="default"
      bordered
      rowKey="code"
      :columns="columns"
      :data="loadData">
      <template
        slot="Failure"
        slot-scope="text,record">
        <div class="flex">
          <span>{{ text }}</span>
          <a-button
            v-show="text!==0"
            type="primary"
            size="small"
            @click="ErrorLog(record)">查看错误日志</a-button>
        </div>
      </template>
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import moment from 'moment'
import { STable, MTable } from '@/components'
import { GetresDetail } from '@/api/Statistics'
import { getRowSpanCount, convert } from '@/utils/util'
export default {
  name: 'TableList',
  components: {
    STable,
    MTable
  },
  data () {
    this.dateFormat = moment().subtract(1, 'days').format('YYYY-MM-DD')
    return {
      // 查询参数
      queryParam: {},
      itemList: [],
      District: [], // 区县
      name: [], // 机构名称
      default: () => {
        return moment('2015-06-06', 'YYYY-MM-DD')
      },
      // 表头
      columns: [
        {
          title: '区县',
          align: 'center',
          sorter: true,
          customRender: (val, row, index) => {
            const obj = {
              children: this.District[0],
              attrs: {}
            }
            const i = getRowSpanCount(this.District, index)
            obj.attrs.rowSpan = i
            return obj
          }
        },
        {
          title: '机构名称',
          dataIndex: 'name',
          ellipsis: true,
          sorter: true,
          customRender: (val, row, index) => {
            const obj = {
              children: this.name[index],
              attrs: {}
            }
            const i = getRowSpanCount(this.name, index)
            obj.attrs.rowSpan = i
            return obj
          }
        },
        {
          title: '表名',
          dataIndex: 'TableName',
          ellipsis: true,
          sorter: true
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
      // 加载数据方法 必须为 Promise 对象
      loadData: async (parameter) => {
        this.result = []
        this.queryParam.code = this.$route.query.code // 县或者机构都行
        this.queryParam.start_time = this.$route.query.start_time // 起始时间
        const result = await GetresDetail(this.queryParam)
        this.result = []
        result.data.organizations.forEach(u => {
            u.res.forEach((_, p) => {
                this.result.push({
                    Failure: _.Failure,
                    Id: _.Id,
                    Success: _.Success,
                    TableName: _.TableName,
                    Upload: _.Upload,
                    name: u.name,
                    code: u.code,
                    District: result.data.name
                })
                this.District.push(result.data.name)
                this.name.push(u.name)
            })
        })
        return {
            data: this.result
        }
      }
    }
  },

  methods: {
    Close () {
      this.$router.push('/Statistics/HomeMain/Home')
    },
    ErrorLog (row) {
        if (row) {
            row.is_town = false
            this.$router.push({ path: '/Statistics/HomeMain/Errorlog', query: { row: row, queryParam: this.queryParam } })
        } else {
            this.$router.push('/Statistics/HomeMain/Errorlog')
        }
    },
    ExportExcel () {
      this.result.forEach((u, index) => {
          const obj = {
            区县: u.District,
            机构: u.name,
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
      // 生成<a></a>DOM元素
      const el = document.createElement('a')
      // 链接赋值
      el.href = url
      el.download = '备份数据库.csv'
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
    moment
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-around;
}
</style>
