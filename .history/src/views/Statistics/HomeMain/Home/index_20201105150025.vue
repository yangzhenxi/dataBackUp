<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="6"
            :sm="24">
            <a-form-item label="区县">
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
        @click="ExportExcel">错误日志</a-button>
      <a-button
        type="primary"
        @click="ExportExcel">导出Excel</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      bordered
      rowKey="description"
      :columns="columns"
      :customRow="handlechange"
      :data="loadData">
    </s-table>
  </a-card>
</template>

<script>
 import Papa from 'papaparse'
import { STable } from '@/components'
import { getServiceList } from '@/api/manage'
import { mergeCellKey } from '@/utils/mergeCell'
export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
        itemList: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '区县',
          dataIndex: 'District',
          align: 'center',
          sorter: true,
          needTotal: true,
          customRender: (val, row, index) => {
            const obj = {
              children: val,
              attrs: {}
            }
            obj.attrs.rowSpan = mergeCellKey(row.District, this.result, 'District')
            return obj
          }
        },
        {
          title: '表名',
          dataIndex: 'description',
          ellipsis: true
        },
        {
          title: '生产库到备库数据量',
          dataIndex: 'callNo',
          sorter: true,
          needTotal: true,
          scopedSlots: { customRender: 'callNo' }

        },
        {
          title: '数据抽取量',
          dataIndex: 'status',
          needTotal: true
        },
        {
          title: '推送联众库数据量',
          dataIndex: 'updatedAt',
          sorter: true
        }
      ],
      result: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then((res) => {
          this.result = res.result.data
          return res.result
        })
      },
      handlechange: (row, index) => ({
          on: {
                click: () => {
                    this.$router.push('/Statistics/HomeMain/District')
                }
          }
      })
    }
  },

  methods: {
    onChange (date, dateString) {
      this.queryParam.date = dateString
    },
    ExportExcel () {
        this.result.forEach((u, index) => {
            if (index !== 0) {
                const obj = {
                    '区县': u.District,
                    '表名': u.description,
                    '生产库到备库数据量': u.callNo,
                    '数据抽取量': u.status,
                    '推送联众库数据量': u.updatedAt
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
