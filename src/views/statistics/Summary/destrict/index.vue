<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="数据集">
                <a-select placeholder="请选择数据集" v-model="queryParam.data_set">
                  <a-select-option v-for="(i,index) in dataList" :key="index" :value="i.value">{{ i.title }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="区县">
                <a-select placeholder="请选择数据集" v-model="queryParam.town">
                  <a-select-option v-for="(i,index) in districtList" :key="index" :value="i.code">{{ i.town }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="时间">
                <a-date-picker v-model="queryParam.start_time" :disabled-date="disabledDate" :allowClear="false" ></a-date-picker>
                <span>---</span>
                <a-date-picker v-model="queryParam.end_time" :disabled-date="disabledDate" :allowClear="false"></a-date-picker>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="数据筛选">
                <a-select placeholder="请选择要筛选的数据" :default-value="filterData[0].value" allowClear >
                  <a-select-option v-for="(i,index) in filterData" :key="index" :value="i.value">{{ i.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin: 0px 10px 20px" @click="() => (queryParam = {})">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <m-table
        ref="table"
        size="default"
        bordered
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
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { compare, getRowSpanCount, deepGet } from '@/utils/util'
import { MTable } from '@/components'
import { mixinTable } from '@/utils/mixin'
import { getAllList } from '@/api/Statistics'
let that = Object

export default {
	mixins: [mixinTable],
	name: 'DatacountSumup',
	components: {
		MTable
	},
	beforeCreate () {
		that = this
	},
	data () {
		return {
			that: this,
			result: [],
			District: [],
			queryParam: {
				start_time: this.$route.query.start_time || moment().subtract(30, 'days').format('YYYY-MM-DD'),
				end_time: this.$route.query.end_time || moment().subtract(30, 'days').format('YYYY-MM-DD'),
				town: this.$route.query.town || '',
				data_set: +(this.$route.query.data_set) || 0
			},
			// 表头
            columns: [
                {
                    title: '区县',
                    dataIndex: 'destrict',
                    align: 'center',
                    sorter: true,
                    customRender: (val, row, index) => {
					if (row.destrict !== '合计') {
							const child = that.$createElement('a', {
								domProps: {
									innerHTML: row.destrict
								},
								on: {
									click: function () {
										that.toDistrict(row)
									}
								}
							})
							const obj = {
								children: child,
								attrs: {
									rowSpan: that.getRowSpanCount(that.District, index)
								}
							}
							return obj
						} else {
							return {
								children: row.destrict
							}
						}
                    }
                },
                {
                    title: '表名',
                    align: 'center',
                    dataIndex: 'TableName',
                    scopedSlots: { customRender: 'TableName' },
                    ellipsis: true
				},
				{
                    title: '业务库',
                    align: 'center',
                    dataIndex: 'main_nums'
                },
                {
					title: '备库',
                    align: 'center',
                    dataIndex: 'backup_nums'
                },
                {
					title: '中间库',
                    align: 'center',
					dataIndex: 'pull_nums',
					scopedSlots: { customRender: 'pull_failure' }
                },
                {
                    title: '联众库',
                    align: 'center',
					scopedSlots: { customRender: 'upload_failure' },
                    dataIndex: 'upload_nums'
                }
			],
			loadData: async () => {
				this.result = []
				let uploadCount = 0
				let pullCount = 0
				let mianCount = 0
				let backupCount = 0
				if (this.$route.query.start_time) { this.queryParam = this.$route.query }
				this.queryParam.data_set = +this.queryParam.data_set
				this.queryParam.start_time = moment(this.queryParam.start_time).format('YYYY-MM-DD')
				this.queryParam.end_time = moment(this.queryParam.end_time).format('YYYY-MM-DD')
				const data = deepGet(await getAllList(this.queryParam), 'data', {})
				const main = deepGet(deepGet(data, 'main', {}), 'data', [])
				const backup = deepGet(deepGet(data, 'backup', {}), 'data', [])
				const pull = deepGet(deepGet(data, 'pull', {}), 'data', [])
				const upload = deepGet(deepGet(data, 'upload', {}), 'data', [])
				const mainRes = this.structure(main)
				const backupRes = this.structure(backup)
				const pullRes = this.structure(pull)
				const uploadRes = this.structure(upload)
				pullRes.forEach((item, index) => {
					uploadCount = uploadCount + uploadRes[index].upload
					pullCount = pullCount + pullRes[index].pull
					mianCount = mianCount + deepGet(mainRes, [index, 'nums'], pullRes[index].pull)
					backupCount = backupCount + deepGet(backupRes, [index, 'nums'], pullRes[index].pull)
					const obj = {
						TableName: pullRes[index].table_name,
						code: pullRes[index].code,
						destrict: pullRes[index].destrict,
						upload_nums: uploadRes[index].upload,
						pull_nums: pullRes[index].pull,
						main_nums: deepGet(mainRes, [index, 'nums'], pullRes[index].pull),
						// main_nums: mainRes[index].nums,
						// backup_nums: backupRes[index].nums,
						backup_nums: deepGet(backupRes, [index, 'nums'], pullRes[index].pull),
						pull_error: pullRes[index].error,
						upload_error: uploadRes[index].error
					}
					this.result.push(obj)
				})
				this.result.push({
					TableName: 'QianYueDXX',
					destrict: '合计',
					upload_nums: uploadCount,
					pull_nums: pullCount,
					main_nums: mianCount,
					pull_error: 0,
					upload_error: 0,
					backup_nums: backupCount
				})
				this.District.push('合计')
				return {
					data: this.result
				}
			}
		}
	},
	methods: {
		toDistrict (row) {
			this.$router.push({ path: `/Statistics/Summary/${row.code}`, query: this.queryParam })
		},
		ErrorLog (row, name) {
			this.queryParam.code = row.code
			this.queryParam.table_name = row.TableName
			this.queryParam.router = 'Statistics/Summary'
			this.queryParam.is_town = 'true'
            this.$router.push({ path: `/error/${name}`, query: this.queryParam })
		},
		structure (arr) {
			const arrs = []
			this.District = []
			arr.forEach(u => {
				const res = deepGet(u, 'res', [])
				res.forEach(item => {
					this.District.push(u.name)
					item.destrict = u.name
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
		getRowSpanCount
	}
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-around;
}
</style>
