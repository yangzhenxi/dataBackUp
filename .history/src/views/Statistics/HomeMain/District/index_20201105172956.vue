<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="6"
            :sm="24">
            <a-form-item label="机构">
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
            <a-form-item label="更新日期">
              <a-range-picker
                @change="onChange"
                format="YYYY-MM-DD HH:mm:ss" />
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
      rowKey="description"
      :columns="columns"
      :data="loadData"> </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import { MTable } from '@/components'
// import { getServiceList } from '@/api/manage'
import { mergeCellKey } from '@/utils/mergeCell'
export default {
  name: 'TableList',
  components: {
    MTable
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '区县',
          dataIndex: 'District',
          align: 'center',
          sorter: true,
          customRender: (val, row, index) => {
            const obj = {
              children: val,
              attrs: {}
            }
            // if (index === 0) {
            //     obj.attrs.rowSpan = 2
            // } else {
            //     obj.attrs.rowSpan = 0
            // }
            // console.log(mergeCellKey(row.District, this.result, 'District'))
            const i = mergeCellKey(row.District, this.result, 'District')
            console.log(this.result, i)
            obj.attrs.rowSpan = i
            return obj
          }
        },
        {
          title: '机构名称',
          dataIndex: 'no',
          ellipsis: true,
          sorter: true
        },
        {
          title: '表名',
          dataIndex: 'description',
          ellipsis: true,
          sorter: true,
          customRender: (val, row, index) => {
            const obj = {
              children: val,
              attrs: {}
            }
            return obj
          }
        },
        {
          title: '生产库到备库数据量',
          dataIndex: 'callNo',
          sorter: true,
          needTotal: true
        },
        {
          title: '数据抽取量',
          dataIndex: 'status',
          sorter: true,
          needTotal: true
        },
        {
          title: '推送联众库数据量',
          dataIndex: 'updatedAt',
          sorter: true
        }
      ],
      result: [
        {
          District: '市本级',
          no: '温医',
          description: '报告卡1',
          callNo: '210',
          status: '120',
          updatedAt: '225'
        },
        {
          District: '市本级',
          no: '温大',
          description: '报告卡2',
          callNo: '210',
          status: '120',
          updatedAt: '225'
        },
        {
                District: '省本级',
                no: '温大',
                description: '报告卡3',
                callNo: '210',
                status: '120',
                updatedAt: '225'
              }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return new Promise((resolve, reject) => {
          const obj = {
            data: [
              {
                District: '市本级',
                no: '温医',
                description: '报告卡1',
                callNo: '210',
                status: '120',
                updatedAt: '225'
              },
              {
                District: '市本级',
                no: '温大',
                description: '报告卡2',
                callNo: '210',
                status: '120',
                updatedAt: '225'
              },
              {
                District: '省本级',
                no: '温大',
                description: '报告卡3',
                callNo: '210',
                status: '120',
                updatedAt: '225'
              }
            ]
          }
          resolve(obj)
        })
        // return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
        //   this.result = res.result.data
        // })
      }
    }
  },

  methods: {
    Close () {
      console.log(1)
      this.$router.push('/Statistics/HomeMain/Home')
    },
    handleEdit (record) {
      //   this.$emit('onEdit', record)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onChange (date, dateString) {
      console.log(date, dateString)
    },
    ExportExcel () {
      this.result.forEach((u, index) => {
        if (index !== 0) {
          const obj = {
            区县: u.District,
            表名: u.description,
            生产库到备库数据量: u.callNo,
            数据抽取量: u.status,
            推送联众库数据量: u.updatedAt
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
      el.download = 'ABC.csv'
      // 必须点击否则不会下载
      el.click()
      // 移除链接释放资源
      urlObject.revokeObjectURL(url)
    }
  }
}
</script>
