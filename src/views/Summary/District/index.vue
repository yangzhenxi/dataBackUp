<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="6"
            :sm="24">
            <a-form-item label="机构">
              <a-input v-model="params.name" placeholder="请输入要查询的机构"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="时间">
              <a-date-picker :default-value="$route.query.start_time" @change="(val) => this.queryParam.start_time = moment(val).format('YYYY-MM-DD')" placeholder="请选择开始时间" />
              <span> ---- </span>
              <a-date-picker :default-value="$route.query.end_time" @change="(val) => this.queryParam.end_time = moment(val).format('YYYY-MM-DD')" placeholder="请选择结束时间" />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="24">
            <a-button
              type="primary"
              @click="get_table_data">查询</a-button>
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
        slot="pullFailure"
        slot-scope="text,record">
        <div class="flex">
          <span>{{ text }}</span>
          <a-button
            v-show="record.pull_failure!==0"
            type="primary"
            size="small"
            @click="ErrorLog(record,'Extractlog')">查看错误日志({{ record.pull_failure }}个)</a-button>
        </div>
      </template>
      <template
        slot="uploadFailure"
        slot-scope="text,record">
        <div class="flex">
          <span>{{ text }}</span>
          <a-button
            v-show="record.Extract_failure!==0"
            type="primary"
            size="small"
            @click="ErrorLog(record,'statisticslog')">查看错误日志({{ record.Extract_failure }}个)</a-button>
        </div>
      </template>
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import moment from 'moment'
import { MTable } from '@/components'
import { getAllDetail } from '@/api/Statistics'
import { getRowSpanCount, convert, deepGet, compare } from '@/utils/util'
export default {
    name: 'TableList',
    components: {
        MTable
    },
    data () {
        return {
            // 查询参数
            queryParam: {},
			itemList: [],
			defaultDate: [this.$route.query.start_time, this.$route.query.end_time],
			time: {},
			Districts: [], // 区县
			district: '',
            name: [], // 机构名称
            params: {},
            // 表头
            columns: [
                {
                    title: '区县',
					align: 'center',
                    dataIndex: 'destrict',
                    sorter: true,
                    customRender: (val, row, index) => {
						console.log(val)
						console.log(row)
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
						// console.log(row)
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
            // 加载数据方法 必须为 Promise 对象
            loadData: async (parameter) => {
				this.result = []
				this.district = ''
				let uploadCount = 0
				let pullCount = 0
				let mianCount = 0
				let backupCount = 0
				this.$route.query.data_set = +this.$route.query.data_set
				const data = deepGet(await getAllDetail(this.$route.query), 'data', {})
				this.district = deepGet(deepGet(data, 'main', {}), 'name', '')
				const main = deepGet(deepGet(data, 'main', {}), 'organizations', [])
				const backup = deepGet(deepGet(data, 'backup', {}), 'organizations', [])
				const pull = deepGet(deepGet(data, 'pull', {}), 'organizations', [])
				const upload = deepGet(deepGet(data, 'upload', {}), 'organizations', [])
				const mainRes = this.structure(main)
				const backupRes = this.structure(backup)
				const pullRes = this.structure(pull)
				const uploadRes = this.structure(upload)
				mainRes.forEach((item, index) => {
					uploadCount = uploadCount + uploadRes[index].upload
					pullCount = pullCount + pullRes[index].pull
					mianCount = mianCount + item.nums
					backupCount = backupCount + backupRes[index].nums
					const obj = {
						TableName: item.table_name,
						code: item.code,
						destrict: this.district,
						name: item.name,
						upload_nums: uploadRes[index].upload,
						pull_nums: pullRes[index].pull,
						main_nums: item.nums,
						backup_nums: backupRes[index].nums,
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
			const obj = {
					'start_time': this.$route.query.start_time,
					'end_time': this.$route.query.end_time,
					'code': this.$route.query.code
				}
            this.$router.push({ path: '/Summary/Home', query: obj })
        },
        ErrorLog (row, router) {
				const obj = {
					code: row.code,
					countyCode: row.countyCode,
					TableName: row.TableName,
					start_time: this.queryParam.start_time,
					end_time: this.queryParam.end_time,
					is_town: 'false',
					router: 'Summary/District'
				}
				this.$router.push({ path: '/error/' + router, query: obj })
        },
        ExportExcel () {
            this.result.forEach((u, index) => {
                const obj = {
                    区县: u.District,
                    机构: u.name,
                    表名: convert(u.TableName, 'L_TABLENAME'),
                    抽取数据量: u.Pull,
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
        onChange (value) {
            this.queryParam.start_time = value
		},
		get_table_data () {
			if (this.queryParam.start_time === 'Invalid date' && this.queryParam.end_time === 'Invalid date') {
				this.$refs.table.refresh(true)
				return true
			}
			if (this.queryParam.start_time || this.queryParam.end_time) {
				if (this.queryParam.start_time && this.queryParam.end_time && this.queryParam.start_time !== 'Invalid date' && this.queryParam.end_time !== 'Invalid date') {
					this.$refs.table.refresh(true)
				} else {
					this.$message.info('请选择完时间在查询')
				}
			} else {
				this.$refs.table.refresh(true)
			}
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
					item.error = item.Failure || 0
				})
				if (res.length >= 2) {
				res.sort(compare('table_name'))
				}
				arrs.push(...res)
			})
			return arrs
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
