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
      <a-button type="primary" v-if="$route.query.code" @click="Close">返回</a-button>
      <a-button type="primary" @click="ExportExcel">导出Excel</a-button>
    </div>
    <m-table
      ref="table"
      size="default"
      bordered
      :columns="columns"
      :data="loadData">
      <template slot="Error" slot-scope="text">
        <ellipsis :length="35" tooltip>{{ text }}</ellipsis>
      </template>
      <template slot="TableName" slot-scope="text">
        {{ text | convert('L_TABLENAME') }}
      </template>
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import { convert, deepGet } from '@/utils/util'
import { MTable, Ellipsis } from '@/components'
import { GetPullLog, GetPullLogErr } from '@/api/Statistics'
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
			time: [],
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
                    ellipsis: true,
                    scopedSlots: { customRender: 'TableName' }
                },
                {
                    title: '错误信息',
                    dataIndex: 'Error',
                    ellipsis: true,
                    sorter: true,
                    scopedSlots: { customRender: 'Error' }
                },
                {
                    title: '抽取时间',
                    dataIndex: 'PullTime',
                    ellipsis: true,
                    sorter: true,
                    scopedSlots: { customRender: 'time' }
                }
            ],
            result: [],
            // 加载数据方法 必须为 Promise 对象
            loadData: async parameter => {
				this.result = []
                if (this.$route.query.code) {
                    const obj = {
                        'code': this.$route.query.code,
                        'table_name': this.$route.query.TableName,
                        'start_time': this.$route.query.start_time + ' ' + '00:00:00',
                        'end_time': this.$route.query.end_time + ' ' + '23:59:59'
					}
					this.$route.query.is_town === 'true' ? obj.is_town = true : obj.is_town = false
                    this.result = deepGet(await GetPullLogErr(obj), 'data', [])
                } else {
                    this.result = deepGet(await GetPullLog(), 'data', [])
                }
                return {
                    data: this.result,
                    queryParam: this.queryParam
                }
            }
        }
    },

    methods: {
        Close () {
			if (this.$route.query.code) {
				const obj = {
					'start_time': this.$route.query.start_time,
					'end_time': this.$route.query.end_time,
					'code': this.$route.query.countyCode,
					'town': this.$route.query.town || null
				}
				this.$router.push({ path: '/' + this.$route.query.router, query: obj })
			}
        },
        ExportExcel () {
            this.result.forEach((u, index) => {
                const obj = {
                    '机构': u.OrgName,
                    '表名': this.convert(u.TableName, 'L_TABLENAME'),
                    '错误信息': u.Error,
                    '抽取时间': convert(u.PullTime, 'unix')
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
            el.download = '导出错误日志.csv'
            // 必须点击否则不会下载
            el.click()
            // 移除链接释放资源
            urlObject.revokeObjectURL(url)
        },
        convert
    }
}
</script>
