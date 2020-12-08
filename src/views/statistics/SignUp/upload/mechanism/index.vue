<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="8"
            :sm="24">
            <a-form-item label="机构">
              <a-input v-model="params.name" placeholder="请输入要查询的机构"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="时间">
              <a-date-picker v-model="queryParam.start_time" :disabled-date="disabledStartDate" :allowClear="false" placeholder="请选择开始时间" />
              <span> ---- </span>
              <a-date-picker v-model="queryParam.end_time" :disabled-date="disabledEndDate" :allowClear="false" placeholder="请选择结束时间" />
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
        @click="Close">返回</a-button>
      <a-button
        type="primary"
        @click="ExportExcel">导出Excel</a-button>
    </div>
    <m-table
      ref="table"
      size="default"
      bordered
      rowKey="keys"
      :columns="columns"
      :data="loadData">
      <template slot="TableName" slot-scope="text" >
        <a-tooltip>
          <template slot="title">根据更新时间统计新增的数据</template>
          {{ text | convert('L_TABLENAME') }}
        </a-tooltip>
      </template>
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
import moment from 'moment'
import Papa from 'papaparse'
import { MTable } from '@/components'
import { mixinTable } from '@/utils/mixin'
import { GetresDetail } from '@/api/Statistics'
import { getRowSpanCount, convert, deepGet } from '@/utils/util'
export default {
	name: 'TableList',
	mixins: [mixinTable],
    components: {
        MTable
    },
    data () {
        return {
            District: [], // 区县
            name: [], // 机构名称
			params: {},
			// queryParam: { 	// 查询数据库条件
			// 	start_time: this.$route.query.start_time,
			// 	end_time: this.$route.query.end_time
			// },
            // 表头
            columns: [
                {
                    title: '区县',
                    align: 'center',
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
					align: 'center',
					ellipsis: true,
                    sorter: true,
					customRender: (val, row, index) => {
                        const obj = {
                            children: val,
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
                    scopedSlots: { customRender: 'TableName' },
					ellipsis: true,
                    align: 'center'
                },
                {
                    title: '备库到中间库数据量',
                    dataIndex: 'Upload',
                    align: 'center'

                },
                {
                    title: '成功数',
                    dataIndex: 'Success',
                    align: 'center'
                },
                {
                    title: '失败数',
                    align: 'center',
                    dataIndex: 'Failure',
                    scopedSlots: { customRender: 'Failure' }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: async (parameter) => {
				this.result = []
				this.queryParam.code = this.code
				this.queryParam.start_time = moment(this.queryParam.start_time).format('YYYY-MM-DD')
				this.queryParam.end_time = moment(this.queryParam.end_time).format('YYYY-MM-DD')
				const data = deepGet(await GetresDetail(this.queryParam), 'data', {})
				const District = deepGet(data, 'name', '')
				const organizations = deepGet(data, 'organizations', [])
                organizations.forEach(u => {
					const arr = deepGet(u, 'res', [])
                    arr.forEach((_, p) => {
						console.log(u.code)
                        this.result.push({
                            Failure: _.failure,
                            Success: _.success,
                            TableName: _.table_name,
                            Upload: _.upload,
							name: u.name,
							code: u.code,
                            District: District
                        })
						this.District.push(District)
                        this.name.push(u.name)
                    })
                })
                return {
                    data: this.result,
                    queryParam: this.params
                }
            }
        }
	},
	computed: {
		code () {
			return this.$route.path.split('/')[4]
		}
	},
    methods: {
        Close () {
            this.$router.push({ path: '/Statistics/SignUp/upload', query: this.$route.query })
        },
        ErrorLog (row) {
			this.queryParam.code = row.code
			this.queryParam.table_name = row.TableName
			this.queryParam.router = `Statistics/SignUp/upload/${row.code}`
			this.queryParam.is_town = 'false'
            this.$router.push({ path: '/error/statisticslog', query: this.queryParam })
        },
        ExportExcel () {
			const itemList = []
            this.result.forEach((u, index) => {
                const obj = {
                    区县: u.District,
                    机构: u.name,
                    表名: convert(u.TableName, 'L_TABLENAME'),
                    推送联众库数据量: u.Upload,
                    成功数: u.Success,
                    失败数: u.Failure
                }
                itemList.push(obj)
            })
            var csv = Papa.unparse(itemList)
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

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-around;
}
</style>
