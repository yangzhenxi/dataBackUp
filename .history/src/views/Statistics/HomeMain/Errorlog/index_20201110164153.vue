<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="表名">
              <a-input v-model="queryParam.TableName" placeholder="请输入要查询的表名" />
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
      <a-button type="primary" @click="Close">返回首页</a-button>
      <a-button type="primary" @click="ExportExcel">导出Excel</a-button>
    </div>
    <m-table
      ref="table"
      size="default"
      bordered
      rowKey="Id"
      :columns="columns"
      :data="loadData">
      <template slot="Error" slot-scope="text">
        <ellipsis :length="35" tooltip>{{ text }}</ellipsis>
      </template>
    </m-table>
  </a-card>
</template>

<script>
 import Papa from 'papaparse'
import { MTable, Ellipsis } from '@/components'
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
      visible: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '机构',
          dataIndex: 'OrgName',
          ellipsis: true
        },
        {
          title: '表名',
          dataIndex: 'TableName',
          ellipsis: true
        },
        {
          title: '错误信息',
          dataIndex: 'Error',
          ellipsis: true,
          sorter: true,
          scopedSlots: { customRender: 'Error' }
        }
        {
          title: '上传时间',
          dataIndex: 'Error',
          ellipsis: true,
          sorter: true,
          scopedSlots: { customRender: 'Error' }
        }
      ],
      result: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: async parameter => {
        const { data } = await Getlog()
            return {
                data,
                queryParam: this.queryParam
        }
      }
    }
  },

  methods: {
    Close () {
      this.$router.push('/Statistics/HomeMain/Home')
    },
    ExportExcel () {
        this.result.forEach((u, index) => {
            if (index !== 0) {
                const obj = {
                    '机构': u.OrgName,
                    '表名': u.TableName,
                    '错误信息': u.Error
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
        el.download = '导出推送日志.csv'
        // 必须点击否则不会下载
        el.click()
        // 移除链接释放资源
        urlObject.revokeObjectURL(url)
    }
  }
}
</script>
