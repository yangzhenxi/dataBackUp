<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="机构">
              <a-input placeholder="请输入要查询的机构" v-model="params.name" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="时间">
              <a-date-picker v-model="queryParam.start_time" :disabled-date="disabledDate"></a-date-picker>
              <span>---</span>
              <a-date-picker v-model="queryParam.end_time" :disabled-date="disabledDate"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin: 0px 10px 20px" @click="() => (queryParam = {})">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
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
        <template slot="pull_error" slot-scope="text,row">
          <div class="flex">
            <span>{{ text }}</span>
            <span>{{ row.pull_error }}</span>
            <a-button
              v-show="row.pull_error!==0"
              type="primary"
              size="small"
              @click="ErrorLog(row,'Extractlog')">查看错误日志</a-button>
          </div>
        </template>
        <template slot="upload_failure" slot-scope="text,row">
          <div class="flex">
            <span>{{ text }}</span>
            <a-button
              v-show="row.upload_error!==0"
              type="primary"
              size="small"
              @click="ErrorLog(row,'statisticslog')">查看错误日志</a-button>
          </div>
        </template>
      </m-table>
    </div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { compare, getRowSpanCount, deepGet } from '@/utils/util'
import { getAllDetail } from '@/api/Statistics'
import { MTable } from '@/components'
import { mixinTable } from '@/utils/mixin'
export default {
	name: 'Datacountmechanism',
	mixins: [mixinTable],
	components: {
		MTable
	},
	computed: {
		code () {
			return this.$route.path.split('/')[3]
		}
	},
	data () {
		return {
			params: {}, // 搜索条件
			Districts: [], // 区县集合
			district: '', // 区县
			name: [], // 机构名称
			queryParam: { 	// 查询条件
				start_time: this.$route.query.start_time,
				end_time: this.$route.query.end_time
			},
			columns: [
                {
                    title: '区县',
					align: 'center',
                    dataIndex: 'destrict',
                    sorter: true,
                    customRender: (val, row, index) => {
                        const obj = {
                            children: val,
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
                    sorter: true
                },
                {
                    title: '业务库',
					sorter: true,
                    align: 'center',
                    dataIndex: 'main_nums'
                },
                {
					title: '备库',
                    align: 'center',
                    dataIndex: 'backup_nums',
                    sorter: true
                },
                {
					title: '中间库',
                    align: 'center',
					dataIndex: 'pull_nums',
					scopedSlots: { customRender: 'pull_failure' },
					sorter: true
                },
                {
                    title: '联众库',
					sorter: true,
                    align: 'center',
					scopedSlots: { customRender: 'upload_failure' },
                    dataIndex: 'upload_nums'
                }
            ],
			loadData: async () => {
				this.queryParam.code = this.code
				this.result = []
				this.district = ''
				let uploadCount = 0
				let pullCount = 0
				let mianCount = 0
				let backupCount = 0
				// this.$route.query.data_set = +this.$route.query.data_set
				this.queryParam.data_set = +this.$route.query.data_set
				this.queryParam.start_time = moment(this.queryParam.start_time).format('YYYY-MM-DD')
				this.queryParam.end_time = moment(this.queryParam.end_time).format('YYYY-MM-DD')
				const data = deepGet(await getAllDetail(this.queryParam), 'data', {})
				this.district = deepGet(deepGet(data, 'main', {}), 'name', '')
				const main = deepGet(deepGet(data, 'main', {}), 'organizations', [])
				const backup = deepGet(deepGet(data, 'backup', {}), 'organizations', [])
				const pull = deepGet(deepGet(data, 'pull', {}), 'organizations', [])
				const upload = deepGet(deepGet(data, 'upload', {}), 'organizations', [])
				const mainRes = this.structure(main)
				const backupRes = this.structure(backup)
				const pullRes = this.structure(pull)
				const uploadRes = this.structure(upload)
				console.log(mainRes)
				console.log(backupRes)
				console.log(pullRes)
				console.log(uploadRes)
				pullRes.forEach((item, index) => {
					uploadCount = uploadCount + uploadRes[index].upload
					pullCount = pullCount + pullRes[index].pull
					mianCount = mianCount + deepGet(mainRes, [index, 'nums'], pullRes[index].pull)
					backupCount = backupCount + deepGet(backupRes, [index, 'nums'], pullRes[index].pull)
					// mianCount = mianCount + item.nums
					// backupCount = backupCount + backupRes[index].nums
					const obj = {
						TableName: pullRes[index].table_name,
						code: pullRes[index].code,
						destrict: this.district,
						name: pullRes[index].name,
						upload_nums: uploadRes[index].upload,
						pull_nums: pullRes[index].pull,
						main_nums: deepGet(mainRes, [index, 'nums'], pullRes[index].pull),
						backup_nums: deepGet(backupRes, [index, 'nums'], pullRes[index].pull),
						// main_nums: mainRes[index].nums,
						// backup_nums: backupRes[index].nums,
						pull_error: pullRes[index].error,
						upload_error: uploadRes[index].error
					}
					this.result.push(obj)
				})
				return {
                    data: this.result,
                    queryParam: this.params
                }
			}
		}
	},
	methods: {
		Close () {
            this.$router.push({ path: '/Statistics/Summary', query: this.$route.query })
		},
		ErrorLog (row, name) {
			this.queryParam.code = row.code
			this.queryParam.table_name = row.TableName
			this.queryParam.router = `Statistics/Summary/${row.code}`
			this.queryParam.is_town = 'false'
            this.$router.push({ path: `/error/${name}`, query: this.queryParam })
		},
		structure (arr) {
			const arrs = []
			this.District = []
			this.name = []
			arr.forEach(u => {
				const res = deepGet(u, 'res', [])
				res.forEach(item => {
					this.name.push(u.name)
					this.District.push(this.destrict)
					item.destrict = u.name
					item.name = u.name
					item.code = u.code
					item.error = deepGet(item, 'failure', 0)
				})
				if (res.length >= 2) {
				res.sort(compare('table_name'))
				}
				arrs.push(...res)
			})
			return arrs
		},
		ExportExcel () {

		},
		getRowSpanCount,
		compare
	}
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-around;
}
</style>
