<template>
  <page-header-wrapper :title="false">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="区县">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="筛选条件">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="更新日期">
                <a-range-picker @change="onChange" format="YYYY-MM-DD HH:mm:ss" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" @click="ExportExcel">导出Excel</a-button>
      </div>
      <m-table
        ref="table"
        size="default"
        bordered
        rowKey="description"
        :columns="columns"
        :data="loadData">
        <template slot="Error" slot-scope="text">
          <ellipsis :length="20" tooltip> {{ text }} </ellipsis>
        </template>
      </m-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
 import Papa from 'papaparse'
import { MTable, Ellipsis } from '@/components'
// import { getRowSpanCount } from '@/utils/util'
import { Getlog } from '@/api/Statistics'
export default {
  name: 'TableList',
  components: {
    MTable,
    Ellipsis
  },
  data () {
    return {
      itemList: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '表名',
          dataIndex: 'TableName',
          ellipsis: true,
          customRender: (val, row, index) => {
            const obj = {
              children: val,
              attrs: {}
            }
            return obj
          }
        },
        {
          title: '错误信息',
          dataIndex: 'Error',
          ellipsis: true,
          sorter: true,
          scopedSlots: { customRender: 'Error' }
        }
      ],
      result: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: async parameter => {
        const res = await Getlog()
            return {
                data: res
        }
      }
    }
  },

  methods: {
    onChange (date, dateString) {
      console.log(date, dateString)
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
        // 生成<a></a>DOM元素
        const el = document.createElement('a')
        // 链接赋值
        el.href = url
        el.download = '备份数据库.csv'
        // 必须点击否则不会下载
        el.click()
        // 移除链接释放资源
        urlObject.revokeObjectURL(url)
    }
  }
}
</script>
